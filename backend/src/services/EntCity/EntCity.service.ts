import { Prisma } from '@prisma/client';
import { Service } from 'typedi';

import { EntityPaginationInput } from '@src/graphql/inputs/Pagination/EntityPaginationInput';
import EntCityFiltersInput from '@src/graphql/resolvers/EntCity/inputs/EntCityFiltersInput';
import { PaginatedCitiesResponse } from '@src/graphql/resolvers/EntCity/outputs/PaginatedCitiesResponse';
import prisma from '@src/utils/prisma';

import { EntCityWithAllForecastData } from './types/EntCityWithForecast';

@Service()
class EntCityService {
  public async getCityById(
    id: string
  ): Promise<EntCityWithAllForecastData | null> {
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

  public async getCities(
    pagination: EntityPaginationInput,
    filters?: EntCityFiltersInput
  ): Promise<PaginatedCitiesResponse> {
    try {
      const { first, after } = pagination;

      const where: Prisma.EntCityWhereInput | undefined = filters
        ? {
            name: {
              [filters.name.operation]: filters.name.value,
              mode: 'insensitive',
            },
          }
        : undefined;

      const cities = await prisma.entCity.findMany({
        skip: after,
        take: first,
        where,
        include: {
          forecast: {
            include: {
              forecastDetails: true,
            },
          },
        },
      });

      const count = await prisma.entCity.count({
        where,
      });

      if (cities.length === 0) {
        return {
          nodes: [],
          pageInfo: {
            hasNextPage: false,
          },
          statistics: {
            count,
          },
        };
      }

      const nextRecord = await prisma.entCity.findFirst({
        skip: first + (after || 0),
        where,
      });

      const hasNextPage = !!nextRecord;

      return {
        nodes: cities,
        pageInfo: {
          hasNextPage,
        },
        statistics: {
          count,
        },
      };
    } catch (error) {
      throw new Error(`Something went wrong: ${error}`);
    }
  }
}

export default EntCityService;
