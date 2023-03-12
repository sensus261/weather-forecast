import 'reflect-metadata';
import { EntCity } from '@prisma/client';

import { StringFilterOperation } from '@src/graphql/inputs/EntityFilter/FilterOperation.enum';
import { EntCityService } from '@src/services';
import { getMockedCityData } from '@src/tests/datasets/City';
import prisma from '@src/utils/prisma';

describe('EntCity entity service tests', () => {
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
          data: getMockedCityData(),
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
    jest.spyOn(prisma.entCity, 'findFirst').mockResolvedValue(cities[0]);

    const result = await entCityService.getCityById(cities[0].id);

    expect(result).toEqual(cities[0]);
    expect(prisma.entCity.findFirst).toHaveBeenCalledWith({
      where: { id: cities[0].id },
      include: { forecast: { include: { forecastDetails: true } } },
    });
  });
});
