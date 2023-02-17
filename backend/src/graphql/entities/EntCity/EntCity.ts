import { ObjectType, Field, Float } from 'type-graphql';

import { BaseEntity } from '../BaseEntity';
import { EntForecast } from '../EntForecast';

@ObjectType()
export class EntCity extends BaseEntity {
  @Field()
  name: string;

  @Field({ nullable: true })
  state?: string;

  @Field()
  country: string;

  @Field(() => Float)
  lon: number;

  @Field(() => Float)
  lat: number;

  @Field(() => EntForecast, { nullable: true })
  forecast?: EntForecast;
}
