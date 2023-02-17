import 'reflect-metadata';

import { EntCity } from '@prisma/client';
import Chance from 'chance';

import { gql, graphQLCall } from '@src/tests/graphql';
import prisma from '@src/utils/prisma';

let cities: EntCity[] = [];

describe('EntCity queries tests', () => {
  const chance = new Chance();
  const TOTAL_NUMBER_OF_MOCKED_CITIES = 10;

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
    cities = await Promise.all(
      [...Array(TOTAL_NUMBER_OF_MOCKED_CITIES).keys()].map(() =>
        prisma.entCity.create({
          data: {
            name: chance.city(),
            state: chance.state(),
            country: chance.country(),
            lon: chance.longitude(),
            lat: chance.latitude(),
          },
        })
      )
    );
  });

  test('should be able to query cities only using pagination', async () => {
    const source = gql`
      query cities($pagination: EntityPaginationInput!) {
        cities(pagination: $pagination) {
          nodes {
            id
            name
            state
            country
            lon
            lat
          }
          pageInfo {
            hasNextPage
          }
          statistics {
            count
          }
        }
      }
    `;
    const variableValues = {
      pagination: {
        first: 5,
        after: 0,
      },
    };

    const response = await graphQLCall({
      source,
      variableValues,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.cities.nodes).toHaveLength(5);
    expect(response.data?.cities.statistics.count).toBe(
      TOTAL_NUMBER_OF_MOCKED_CITIES
    );
    expect(response.data?.cities.pageInfo.hasNextPage).toBe(true);
  });

  test('should be able to query cities using filters', async () => {
    const source = gql`
      query cities(
        $pagination: EntityPaginationInput!
        $filters: EntCityFiltersInput
      ) {
        cities(pagination: $pagination, filters: $filters) {
          nodes {
            id
            name
            state
            country
            lon
            lat
          }
          pageInfo {
            hasNextPage
          }
          statistics {
            count
          }
        }
      }
    `;

    const variableValues = {
      pagination: {
        first: 5,
        after: 0,
      },
      filters: {
        name: {
          operation: 'CONTAINS',
          value: cities[0].name,
        },
      },
    };

    const response = await graphQLCall({
      source,
      variableValues,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.cities.nodes).toHaveLength(1);
    expect(response.data?.cities.statistics.count).toBe(1);
    expect(response.data?.cities.pageInfo.hasNextPage).toBe(false);
  });
});
