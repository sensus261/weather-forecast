import 'reflect-metadata';
import { EntForecast } from '@prisma/client';
import fetch, { Response } from 'node-fetch';

import { getMockedApiResponse } from '@src/tests/datasets/ApiResponse';
import { getMockedCityData } from '@src/tests/datasets/City';
import { getMockedForecastData } from '@src/tests/datasets/Forecast';
import prisma from '@src/utils/prisma';

import { EntCityWithAllForecastData } from '../../EntCity/types/EntCityWithForecast';
import EntForecastService from '../EntForecast.service';

jest.mock('node-fetch', () => jest.fn());

const response = Promise.resolve({
  ok: true,
  json: () => Promise.resolve(getMockedApiResponse()),
});
(fetch as jest.MockedFunction<typeof fetch>).mockImplementation(async () => {
  return response as unknown as Response;
});

describe('EntForecast entity service tests', () => {
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

    const mockedCityData = getMockedCityData();
    const mockedForecastData = getMockedForecastData();

    city = {
      ...mockedCityData,
      createdAt: new Date(),
      updatedAt: new Date(),
      forecast: {
        ...mockedForecastData,
        updatedAt: new Date(),
        createdAt: new Date(),
        forecastDetails: [],
        cityId: mockedCityData.id,
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
