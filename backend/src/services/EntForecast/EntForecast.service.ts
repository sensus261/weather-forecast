import { EntCity, EntForecast } from '@prisma/client';
import { Service } from 'typedi';

import prisma from '@src/utils/prisma';

import { WeatherApiResponse } from './types/ApiResponse';
import { EntCityWithForecast } from './types/EntCityWithForecast';

@Service()
class EntForecastService {
  public async getCityById(id: string): Promise<EntCityWithForecast | null> {
    const city = await prisma.entCity.findFirst({
      where: { id },
      include: {
        forecast: {
          include: { forecastDetails: true },
        },
      },
    });

    return city;
  }

  public shouldRefreshForecast(city: EntCityWithForecast): boolean {
    if (city.forecast === null || this.isForecastOutdated(city.forecast)) {
      return true;
    }

    return false;
  }

  public isForecastOutdated(forecast: EntForecast): boolean {
    const now = new Date();
    const forecastDate = new Date(forecast.updatedAt);

    const diff = now.getTime() - forecastDate.getTime();
    const diffInHours = diff / (1000 * 3600);

    if (diffInHours > 3) {
      return true;
    }

    return false;
  }

  public async getDataForCity(city: EntCity): Promise<WeatherApiResponse> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&units=metric&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`;
    const result = await fetch(url);
    if (result.ok) {
      const jsonResult: WeatherApiResponse = await result.json();

      return jsonResult;
    } else {
      const text = await result.text();
      throw new Error(
        `${result.status} - ${result.statusText} - ${text} -  \n URL: ${url}`
      );
    }
  }

  public async insertWeatherApiData(
    data: WeatherApiResponse,
    city: EntCityWithForecast
  ): Promise<EntForecast> {
    const forecast = await prisma.entForecast.update({
      where: {
        id: city?.forecast?.id,
      },
      data: {
        name: data.city.name,
        country: data.city.country,
        latitude: data.city.coord.lat,
        longitude: data.city.coord.lon,
        sunrise: data.city.sunrise,
        sunset: data.city.sunset,
        population: data.city.population,
        timezone: data.city.timezone,
        forecastDetails: {
          createMany: {
            data: data.list.map((item) => ({
              dt: item.dt,
              temperature: item.main.temp,
              feelsLike: item.main.feels_like,
              tempMin: item.main.temp_min,
              tempMax: item.main.temp_max,
              pressure: item.main.pressure,
              seaLevel: item.main.sea_level,
              grndLevel: item.main.grnd_level,
              humidity: item.main.humidity,
              tempKf: item.main.temp_kf,
              title: item.weather[0].main,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              clouds: item.clouds.all,
              windSpeed: item.wind.speed,
              windDeg: item.wind.deg,
              windGust: item.wind.gust,
              visibility: item.visibility,
              pop: item.pop,
              sysPod: item.sys.pod,
              dateTime: item.dt_txt,
            })),
          },
        },
      },
    });

    const updatedForecast = await prisma.entForecast.findFirstOrThrow({
      where: { id: forecast.id },
      include: { forecastDetails: true, city: true },
    });

    return updatedForecast;
  }
}

export default EntForecastService;
