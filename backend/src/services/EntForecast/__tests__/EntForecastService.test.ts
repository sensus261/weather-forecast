import 'reflect-metadata';

import { ApiResponseExample } from '@src/tests/datasets/ApiResponseExample';
import prisma from '@src/utils/prisma';

import EntForecastService from '../EntForecast.service';
import { EntCityWithForecast } from '../types/EntCityWithForecast';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(ApiResponseExample),
    ok: true,
  } as Response)
);

let service: EntForecastService;

describe('EntForecast entity service tests', () => {
  beforeEach(async () => {
    const deleteEntCity = prisma.entCity.deleteMany();
    const deleteEntForecast = prisma.entForecast.deleteMany();
    const deleteEntForecastDetails = prisma.entForecastDetails.deleteMany();

    await prisma.$transaction([
      deleteEntCity,
      deleteEntForecast,
      deleteEntForecastDetails,
    ]);

    service = new EntForecastService();
  });

  it('should return the city with the given id', async () => {
    const cityId = '1';
    const city: EntCityWithForecast = {
      id: '1',
      name: 'Test City',
      country: 'Test Country',
      lon: 0,
      lat: 0,
      forecast: null,
      state: 'Test State',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(prisma.entCity, 'findFirst').mockResolvedValue(city);

    const result = await service.getCityById(cityId);

    expect(result).toEqual(city);
    expect(prisma.entCity.findFirst).toHaveBeenCalledWith({
      where: { id: cityId },
      include: { forecast: { include: { forecastDetails: true } } },
    });
  });

  it('should return true if the city has no forecast', () => {
    const city: EntCityWithForecast = {
      id: '1',
      name: 'Test City',
      country: 'Test Country',
      lat: 0,
      lon: 0,
      forecast: null,
      state: 'Test State',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = service.shouldRefreshForecast(city);

    expect(result).toBe(true);
  });

  it('should return true if the forecast is outdated', () => {
    const city: EntCityWithForecast = {
      id: '1',
      name: 'Test City',
      country: 'Test Country',
      lat: 0,
      lon: 0,
      state: 'Test State',
      createdAt: new Date(),
      updatedAt: new Date(),
      forecast: {
        id: '1',
        name: 'Test Forecast',
        country: 'Test Country',
        latitude: 0,
        longitude: 0,
        sunrise: 0,
        sunset: 0,
        population: 0,
        timezone: 0,
        updatedAt: new Date('2020-02-01T00:00:00.000Z'),
        createdAt: new Date('2020-02-01T00:00:00.000Z'),
        cityId: '1',
      },
    };

    jest.spyOn(service, 'isForecastOutdated').mockReturnValue(true);

    const result = service.shouldRefreshForecast(city);

    expect(result).toBe(true);
    expect(service.isForecastOutdated).toHaveBeenCalledWith(city.forecast);
  });

  it('should return false if the forecast is up-to-date', () => {
    const city: EntCityWithForecast = {
      id: '1',
      name: 'Test City',
      country: 'Test Country',
      lat: 0,
      lon: 0,
      state: 'Test State',
      createdAt: new Date(),
      updatedAt: new Date(),
      forecast: {
        id: '1',
        name: 'Test Forecast',
        country: 'Test Country',
        latitude: 0,
        longitude: 0,
        sunrise: 0,
        sunset: 0,
        population: 0,
        timezone: 0,
        updatedAt: new Date(),
        createdAt: new Date(),
        cityId: '1',
      },
    };

    jest.spyOn(service, 'isForecastOutdated').mockReturnValue(false);

    const result = service.shouldRefreshForecast(city);

    expect(result).toBe(false);
    expect(service.isForecastOutdated).toHaveBeenCalledWith(city.forecast);
  });
});
