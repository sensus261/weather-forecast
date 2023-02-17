import { Resolver, Query, Arg } from 'type-graphql';
import { Service } from 'typedi';

import { EntityPaginationInput } from '@src/graphql/inputs/Pagination/EntityPaginationInput';
import EntCityService from '@src/services/EntCity/EntCity.service';

import EntCityFiltersInput from './inputs/EntCityFiltersInput';
import { PaginatedCitiesResponse } from './outputs/PaginatedCitiesResponse';

@Service()
@Resolver()
class EntCityResolver {
  constructor(private readonly cityService: EntCityService) {}

  @Query(() => PaginatedCitiesResponse)
  async cities(
    @Arg('pagination') pagination: EntityPaginationInput,
    @Arg('filters', { nullable: true }) filters?: EntCityFiltersInput
  ): Promise<PaginatedCitiesResponse> {
    try {
      const paginatedCitiesResponse = this.cityService.getCities(
        pagination,
        filters
      );

      return paginatedCitiesResponse;
    } catch (error) {
      throw new Error(`Something went wrong: ${error}`);
    }
  }
}

export default EntCityResolver;
