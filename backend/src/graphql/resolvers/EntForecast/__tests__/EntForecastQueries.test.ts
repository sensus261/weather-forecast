import 'reflect-metadata';

import { EntCity, EntForecast, EntForecastDetails } from '@prisma/client';

import { ApiResponseExample } from '@src/services/EntForecast/__tests__/dataset/ApiResponseExample';
import { gql, graphQLCall } from '@src/tests/graphql';
import prisma from '@src/utils/prisma';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(ApiResponseExample),
    ok: true,
  } as Response)
);

let city: EntCity;
let forecast: EntForecast;
let forecastDetails: EntForecastDetails;

describe('EntForecast queries tests', () => {
  beforeEach(async () => {
    const deleteEntCity = prisma.entCity.deleteMany();
    const deleteEntForecast = prisma.entForecast.deleteMany();
    const deleteEntForecastDetails = prisma.entForecastDetails.deleteMany();

    await prisma.$transaction([
      deleteEntCity,
      deleteEntForecast,
      deleteEntForecastDetails,
    ]);
  });

  beforeEach(async () => {
    city = await prisma.entCity.create({
      data: {
        name: 'city',
        state: 'state',
        country: 'country',
        lon: 1,
        lat: 1,
      },
    });

    forecast = await prisma.entForecast.create({
      data: {
        city: {
          connect: {
            id: city.id,
          },
        },
        name: 'name',
        country: 'country',
        latitude: 1,
        longitude: 1,
        sunrise: 1,
        sunset: 1,
        population: 1,
        timezone: 1,
      },
    });

    forecastDetails = await prisma.entForecastDetails.create({
      data: {
        dt: 1,
        temperature: 1,
        feelsLike: 1,
        tempMin: 1,
        tempMax: 1,
        pressure: 1,
        seaLevel: 1,
        grndLevel: 1,
        humidity: 1,
        tempKf: 1,
        title: 'title',
        description: 'description',
        icon: 'icon',
        clouds: 1,
        windSpeed: 1,
        windDeg: 1,
        windGust: 1,
        visibility: 1,
        pop: 1,
        sysPod: 'sysPod',
        dateTime: 'dateTime',
        forecast: {
          connect: {
            id: forecast.id,
          },
        },
      },
    });
  });

  test('should be able to query a fresh forecast using city name', async () => {
    const source = gql`
      query forecast($forecastOptions: ForecastOptionsData!) {
        forecast(forecastOptions: $forecastOptions) {
          id
          name
          country
          latitude
          longitude
          sunrise
          sunset
          population
          timezone
          city {
            id
            name
            state
            country
            lon
            lat
          }
          forecastDetails {
            id
            dt
            temperature
            feelsLike
            tempMin
            tempMax
            pressure
            seaLevel
            grndLevel
            humidity
            tempKf
            title
            description
            icon
            clouds
            windSpeed
            windDeg
            windGust
            visibility
            pop
            sysPod
            dateTime
          }
        }
      }
    `;
    const variableValues = {
      forecastOptions: {
        cityId: city.id,
      },
    };

    const response = await graphQLCall({
      source,
      variableValues,
    });

    expect(response.errors).toBeUndefined();
    expect(response).toMatchObject({
      data: {
        forecast: {
          id: forecast.id,
          name: forecast.name,
          country: forecast.country,
          latitude: forecast.latitude,
          longitude: forecast.longitude,
          sunrise: forecast.sunrise,
          sunset: forecast.sunset,
          population: forecast.population,
          timezone: forecast.timezone,
          city: {
            id: city.id,
            name: city.name,
            state: city.state,
            country: city.country,
            lon: city.lon,
            lat: city.lat,
          },
          forecastDetails: [
            {
              id: forecastDetails.id,
              dt: forecastDetails.dt,
              temperature: forecastDetails.temperature,
              feelsLike: forecastDetails.feelsLike,
              tempMin: forecastDetails.tempMin,
              tempMax: forecastDetails.tempMax,
              pressure: forecastDetails.pressure,
              seaLevel: forecastDetails.seaLevel,
              grndLevel: forecastDetails.grndLevel,
              humidity: forecastDetails.humidity,
              tempKf: forecastDetails.tempKf,
              title: forecastDetails.title,
              description: forecastDetails.description,
              icon: forecastDetails.icon,
              clouds: forecastDetails.clouds,
              windSpeed: forecastDetails.windSpeed,
              windDeg: forecastDetails.windDeg,
              windGust: forecastDetails.windGust,
              visibility: forecastDetails.visibility,
              pop: forecastDetails.pop,
              sysPod: forecastDetails.sysPod,
              dateTime: forecastDetails.dateTime,
            },
          ],
        },
      },
    });
  });

  test('should be able to query an outdated forecast using city name', async () => {
    // Mark forecast as outdated
    await prisma.entForecast.update({
      where: {
        id: forecast.id,
      },
      data: {
        updatedAt: new Date('2020-01-01'),
      },
    });

    const source = gql`
      query forecast($forecastOptions: ForecastOptionsData!) {
        forecast(forecastOptions: $forecastOptions) {
          id
          name
          country
          latitude
          longitude
          sunrise
          sunset
          population
          timezone
          city {
            id
            name
            state
            country
            lon
            lat
          }
          forecastDetails {
            id
            dt
            temperature
            feelsLike
            tempMin
            tempMax
            pressure
            seaLevel
            grndLevel
            humidity
            tempKf
            title
            description
            icon
            clouds
            windSpeed
            windDeg
            windGust
            visibility
            pop
            sysPod
            dateTime
          }
        }
      }
    `;
    const variableValues = {
      forecastOptions: {
        cityId: city.id,
      },
    };

    const response = await graphQLCall({
      source,
      variableValues,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.forecast.forecastDetails.length).toBeGreaterThan(1);

    expect(response).toMatchObject({
      data: {
        forecast: {
          id: expect.any(String),
          name: ApiResponseExample.city.name,
          country: ApiResponseExample.city.country,
          latitude: ApiResponseExample.city.coord.lat,
          longitude: ApiResponseExample.city.coord.lon,
          sunrise: ApiResponseExample.city.sunrise,
          sunset: ApiResponseExample.city.sunset,
          population: ApiResponseExample.city.population,
          timezone: ApiResponseExample.city.timezone,
          city: {
            id: city.id,
            name: city.name,
            state: city.state,
            country: city.country,
            lon: city.lon,
            lat: city.lat,
          },
          forecastDetails: expect.any(Array),
        },
      },
    });
  });
});
