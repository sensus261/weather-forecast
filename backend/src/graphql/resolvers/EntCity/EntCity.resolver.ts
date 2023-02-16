import { Resolver, Query, Arg } from 'type-graphql';
import { Service } from 'typedi';

import { EntCity } from '@src/graphql/entities';
import EntCityService from '@src/services/EntCity/EntCity.service';

@Service()
@Resolver()
class EntCityResolver {
  constructor(private readonly cityService: EntCityService) {}

  @Query(() => EntCity)
  async city(@Arg('name') name: string) {
    try {
      const city = await this.cityService.getCity(name);

      if (city !== null) {
        // TODO: Check if the city is outdated
        return city;
      }

      const weatherApiResponse = await this.cityService.getDataForCity(name);
      const refreshedCity = await this.cityService.insertWeatherApiData(
        weatherApiResponse
      );

      return refreshedCity;
    } catch (error) {
      throw new Error(`Something went wrong: ${error}`);
    }
  }
}

export default EntCityResolver;
