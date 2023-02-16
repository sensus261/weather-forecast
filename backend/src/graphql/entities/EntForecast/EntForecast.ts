import { ObjectType, Field, ID } from 'type-graphql';

import { BaseEntity } from '../BaseEntity';
import { EntCity } from '../EntCity';

@ObjectType()
export class EntForecast extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  dt: number;

  @Field()
  temperature: number;

  @Field()
  feelsLike: number;

  @Field()
  tempMin: number;

  @Field()
  tempMax: number;

  @Field()
  pressure: number;

  @Field()
  seaLevel: number;

  @Field()
  grndLevel: number;

  @Field()
  humidity: number;

  @Field()
  tempKf: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  icon: string;

  @Field()
  clouds: number;

  @Field()
  windSpeed: number;

  @Field()
  windDeg: number;

  @Field()
  windGust: number;

  @Field()
  visibility: number;

  @Field()
  pop: number;

  @Field()
  sysPod: string;

  @Field()
  dateTime: string;

  @Field(() => EntCity)
  city: EntCity;

  @Field()
  cityId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
