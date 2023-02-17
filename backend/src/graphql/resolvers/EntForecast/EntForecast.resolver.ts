import { Resolver, Query, Arg } from 'type-graphql';
import { Service } from 'typedi';

import { EntForecast } from '@src/graphql/entities';
import { EntForecastService } from '@src/services';
import prisma from '@src/utils/prisma';

import ForecastOptionsData from './inputs/ForecastOptionsData';

@Service()
@Resolver()
class EntForecastResolver {
  constructor(private readonly forecastService: EntForecastService) {}

  @Query(() => EntForecast)
  async forecast(@Arg('forecastOptions') forecastOptions: ForecastOptionsData) {
    try {
      const { cityId } = forecastOptions;

      const city = await this.forecastService.getCityById(cityId);
      if (city === null) {
        throw new Error('City does not exist\n');
      }

      if (!this.forecastService.shouldRefreshForecast(city)) {
        return prisma.entForecast.findFirst({
          where: { cityId },
          include: { forecastDetails: true, city: true },
        });
      }

      const weatherApiResponse = await this.forecastService.getDataForCity(
        city
      );
      const refreshedForecast = await this.forecastService.insertWeatherApiData(
        weatherApiResponse,
        city
      );

      return refreshedForecast;
    } catch (error) {
      throw new Error(`Something went wrong: ${error}`);
    }
  }
}

export default EntForecastResolver;
