import 'reflect-metadata';
import { EntCity } from '@prisma/client';
import Chance from 'chance';

import { StringFilterOperation } from '@src/graphql/inputs/EntityFilter/FilterOperation.enum';
import { EntCityService } from '@src/services';
import prisma from '@src/utils/prisma';

import { EntCityWithAllForecastData } from '../types/EntCityWithForecast';

describe('EntCity entity service tests', () => {
  const chance = new Chance();
  const entCityService = new EntCityService();

  let cities: EntCity[] = [];

  beforeEach(async () => {
    const deleteEntCity = prisma.entCity.deleteMany();
    const deleteEntForecast = prisma.entForecast.deleteMany();
    const deleteEntForecastDetails = prisma.entForecastDetails.deleteMany();

    await prisma.$transaction([
      deleteEntCity,
      deleteEntForecast,
      deleteEntForecastDetails,
    ]);

    cities = await Promise.all(
      [...Array(10).keys()].map(() =>
        prisma.entCity.create({
          data: {
            name: chance.city(),
            sanitizedName: chance.city(),
            state: chance.state(),
            country: chance.country(),
            lon: chance.longitude(),
            lat: chance.latitude(),
          },
        })
      )
    );
  });

  it('should return the cities only with pagination', async () => {
    const paginatedCitiesResponse = await entCityService.getCities({
      first: 5,
      after: 0,
    });

    expect(paginatedCitiesResponse.nodes).toHaveLength(5);
    expect(paginatedCitiesResponse.statistics.count).toBe(10);
    expect(paginatedCitiesResponse.pageInfo.hasNextPage).toBeTruthy();
  });

  it('should return the cities with filters', async () => {
    const paginatedCitiesResponse = await entCityService.getCities(
      {
        first: 10,
        after: 0,
      },
      {
        name: {
          operation: StringFilterOperation.CONTAINS,
          value: cities[0].sanitizedName,
        },
      }
    );

    expect(paginatedCitiesResponse.nodes).toHaveLength(1);
    expect(paginatedCitiesResponse.statistics.count).toBe(1);
    expect(paginatedCitiesResponse.pageInfo.hasNextPage).toBeFalsy();
  });

  // Since you do a spyon on the prisma service, this test needs to be left last
  // No idea why, some dragons are at play here
  it('should return the city with the given id', async () => {
    const cityId = chance.guid();
    const city: EntCityWithAllForecastData = {
      id: cityId,
      sanitizedName: chance.city(),
      name: chance.city(),
      country: chance.country(),
      lon: chance.longitude(),
      lat: chance.latitude(),
      forecast: null,
      state: chance.state(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(prisma.entCity, 'findFirst').mockResolvedValue(city);

    const result = await entCityService.getCityById(cityId);

    expect(result).toEqual(city);
    expect(prisma.entCity.findFirst).toHaveBeenCalledWith({
      where: { id: cityId },
      include: { forecast: { include: { forecastDetails: true } } },
    });
  });
});
