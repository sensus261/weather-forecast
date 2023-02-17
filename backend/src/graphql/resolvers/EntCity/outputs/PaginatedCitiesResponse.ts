import { EntCity } from '@prisma/client';
import { ObjectType } from 'type-graphql';

import { EntCity as CityEntity } from '@src/graphql/entities';
import { PaginatedEntityResponse } from '@src/graphql/outputs/Pagination/PaginatedEntityResponse';

@ObjectType()
export class PaginatedCitiesResponse extends PaginatedEntityResponse<EntCity>(
  CityEntity
) {}
