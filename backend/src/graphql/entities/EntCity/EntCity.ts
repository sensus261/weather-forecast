import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '../BaseEntity';
import { EntForecast } from '../EntForecast';

@ObjectType()
export class EntCity extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field()
  country: string;

  @Field()
  population: number;

  @Field()
  timezone: number;

  @Field()
  sunrise: number;

  @Field()
  sunset: number;

  @Field(() => [EntForecast])
  forecasts: EntForecast[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
