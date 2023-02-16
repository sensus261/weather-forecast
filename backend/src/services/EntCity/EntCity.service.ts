import { EntCity } from '@prisma/client';
import { Service } from 'typedi';

import prisma from '@src/utils/prisma';

import { WeatherApiResponse } from './types/ApiResponse';

@Service()
class EntCityService {
  public async getCity(name: string): Promise<EntCity | null> {
    const city = await prisma.entCity.findFirst({
      where: { name },
      include: { forecasts: true },
    });

    return city;
  }

  public async getDataForCity(name: string): Promise<WeatherApiResponse> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=metric&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`;

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
    data: WeatherApiResponse
  ): Promise<EntCity> {
    const city = await prisma.entCity.create({
      data: {
        name: data.city.name,
        country: data.city.country,
        latitude: data.city.coord.lat,
        longitude: data.city.coord.lon,
        sunrise: data.city.sunrise,
        sunset: data.city.sunset,
        population: data.city.population,
        timezone: data.city.timezone,
        forecasts: {
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

    console.log(city);

    return city;
  }
}

export default EntCityService;
