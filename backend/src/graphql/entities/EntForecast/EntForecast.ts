import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '../BaseEntity';
import { EntCity } from '../EntCity';
import { EntForecastDetails } from '../EntForecastDetails';

@ObjectType()
export class EntForecast extends BaseEntity {
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

  @Field(() => [EntForecastDetails])
  forecastDetails: EntForecastDetails[];

  @Field(() => EntCity)
  city: EntCity;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
