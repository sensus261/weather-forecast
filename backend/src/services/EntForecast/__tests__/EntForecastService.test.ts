import 'reflect-metadata';
import { EntForecast } from '@prisma/client';
import Chance from 'chance';
import fetch, { Response } from 'node-fetch';

import { ApiResponseExample } from '@src/tests/datasets/ApiResponseExample';
import prisma from '@src/utils/prisma';

import { EntCityWithAllForecastData } from '../../EntCity/types/EntCityWithForecast';
import EntForecastService from '../EntForecast.service';

jest.mock('node-fetch', () => jest.fn());

const response = Promise.resolve({
  ok: true,
  // TODO: Actually seed fake values with same shape as ApiResponseExample for better coverage..
  json: () => Promise.resolve(ApiResponseExample),
});
(fetch as jest.MockedFunction<typeof fetch>).mockImplementation(async () => {
  return response as unknown as Response;
});

describe('EntForecast entity service tests', () => {
  const chance = new Chance();
  const entForecastService = new EntForecastService();

  let city: EntCityWithAllForecastData;

  beforeEach(async () => {
    const deleteEntCity = prisma.entCity.deleteMany();
    const deleteEntForecast = prisma.entForecast.deleteMany();
    const deleteEntForecastDetails = prisma.entForecastDetails.deleteMany();

    await prisma.$transaction([
      deleteEntCity,
      deleteEntForecast,
      deleteEntForecastDetails,
    ]);

    const cityId = chance.guid();
    const forecastId = chance.guid();

    city = {
      id: cityId,
      name: chance.city(),
      sanitizedName: chance.city(),
      country: chance.country(),
      lon: chance.longitude(),
      lat: chance.latitude(),
      state: chance.state(),
      createdAt: new Date(),
      updatedAt: new Date(),
      forecast: {
        id: forecastId,
        name: chance.animal(),
        country: chance.country(),
        latitude: chance.latitude(),
        longitude: chance.longitude(),
        sunrise: 0,
        sunset: 0,
        population: 0,
        timezone: 0,
        forecastDetails: [],
        updatedAt: new Date(),
        createdAt: new Date(),
        cityId: cityId,
      },
    };
  });

  it('should return true if the city has no forecast', () => {
    // Set the updated at at yesterday date (to mark the forecast as outdated)
    (city.forecast as EntForecast).updatedAt = new Date(
      new Date().setDate(new Date().getDate() - 1)
    );
    const result = entForecastService.shouldRefreshForecast(city);

    expect(result).toBe(true);
  });

  it('should return true if the forecast is outdated', () => {
    jest.spyOn(entForecastService, 'isForecastOutdated').mockReturnValue(true);

    const result = entForecastService.shouldRefreshForecast(city);

    expect(result).toBe(true);
    expect(entForecastService.isForecastOutdated).toHaveBeenCalledWith(
      city.forecast
    );
  });

  it('should return false if the forecast is up-to-date', () => {
    jest.spyOn(entForecastService, 'isForecastOutdated').mockReturnValue(false);

    const result = entForecastService.shouldRefreshForecast(city);

    expect(result).toBe(false);
    expect(entForecastService.isForecastOutdated).toHaveBeenCalledWith(
      city.forecast
    );
  });
});
