import 'reflect-metadata';
import { EntCity, EntForecast, EntForecastDetails } from '@prisma/client';
import fetch, { Response } from 'node-fetch';

import { getMockedApiResponse } from '@src/tests/datasets/ApiResponse';
import { getMockedCityData } from '@src/tests/datasets/City';
import { getMockedForecastData } from '@src/tests/datasets/Forecast';
import { getMockedForecastDetailsData } from '@src/tests/datasets/ForecastDetails';
import { gql, graphQLCall } from '@src/tests/graphql';
import prisma from '@src/utils/prisma';

jest.mock('node-fetch', () => jest.fn());

const apiResponse = getMockedApiResponse();
const response = Promise.resolve({
  ok: true,
  json: () => Promise.resolve(apiResponse),
});
(fetch as jest.MockedFunction<typeof fetch>).mockImplementation(async () => {
  return response as unknown as Response;
});

describe('EntForecast queries tests', () => {
  let city: EntCity;
  let forecast: EntForecast;
  let forecastDetails: EntForecastDetails;

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
      data: getMockedCityData(),
    });

    forecast = await prisma.entForecast.create({
      data: {
        city: {
          connect: {
            id: city.id,
          },
        },
        ...getMockedForecastData(),
      },
    });

    forecastDetails = await prisma.entForecastDetails.create({
      data: {
        ...getMockedForecastDetailsData(),
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
          name: apiResponse.city.name,
          country: apiResponse.city.country,
          latitude: apiResponse.city.coord.lat,
          longitude: apiResponse.city.coord.lon,
          sunrise: apiResponse.city.sunrise,
          sunset: apiResponse.city.sunset,
          population: apiResponse.city.population,
          timezone: apiResponse.city.timezone,
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
