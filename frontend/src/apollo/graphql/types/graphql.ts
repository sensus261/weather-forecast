/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type EntCity = {
  __typename?: 'EntCity';
  country: Scalars['String'];
  createdAt: Scalars['DateTime'];
  forecast?: Maybe<EntForecast>;
  id: Scalars['ID'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  name: Scalars['String'];
  sanitizedName: Scalars['String'];
  state?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type EntCityFiltersInput = {
  name: StringFilterEntityColumnInput;
};

export type EntForecast = {
  __typename?: 'EntForecast';
  city: EntCity;
  country: Scalars['String'];
  createdAt: Scalars['DateTime'];
  forecastDetails: Array<EntForecastDetails>;
  id: Scalars['ID'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  population: Scalars['Float'];
  sunrise: Scalars['Float'];
  sunset: Scalars['Float'];
  timezone: Scalars['Float'];
  updatedAt: Scalars['DateTime'];
};

export type EntForecastDetails = {
  __typename?: 'EntForecastDetails';
  cityId: Scalars['Float'];
  clouds: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  dateTime: Scalars['String'];
  description: Scalars['String'];
  dt: Scalars['Float'];
  feelsLike: Scalars['Float'];
  forecast: EntForecast;
  grndLevel: Scalars['Float'];
  humidity: Scalars['Float'];
  icon: Scalars['String'];
  id: Scalars['ID'];
  pop: Scalars['Float'];
  pressure: Scalars['Float'];
  seaLevel: Scalars['Float'];
  sysPod: Scalars['String'];
  tempKf: Scalars['Float'];
  tempMax: Scalars['Float'];
  tempMin: Scalars['Float'];
  temperature: Scalars['Float'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  visibility: Scalars['Float'];
  windDeg: Scalars['Float'];
  windGust: Scalars['Float'];
  windSpeed: Scalars['Float'];
};

export type EntityPaginationInput = {
  after?: InputMaybe<Scalars['Float']>;
  first: Scalars['Float'];
};

export type ForecastOptionsData = {
  cityId: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
};

export type PaginatedCitiesResponse = {
  __typename?: 'PaginatedCitiesResponse';
  nodes: Array<EntCity>;
  pageInfo: PageInfo;
  statistics: Statistics;
};

export type Query = {
  __typename?: 'Query';
  cities: PaginatedCitiesResponse;
  forecast: EntForecast;
};


export type QueryCitiesArgs = {
  filters?: InputMaybe<EntCityFiltersInput>;
  pagination: EntityPaginationInput;
};


export type QueryForecastArgs = {
  forecastOptions: ForecastOptionsData;
};

export type Statistics = {
  __typename?: 'Statistics';
  count: Scalars['Int'];
};

export type StringFilterEntityColumnInput = {
  operation: StringFilterOperation;
  value: Scalars['String'];
};

/** The filter operation of a field */
export enum StringFilterOperation {
  Contains = 'CONTAINS',
  Equals = 'EQUALS',
  StartsWith = 'STARTS_WITH'
}

export type CitiesQueryVariables = Exact<{
  pagination: EntityPaginationInput;
  filters?: InputMaybe<EntCityFiltersInput>;
}>;


export type CitiesQuery = { __typename?: 'Query', cities: { __typename?: 'PaginatedCitiesResponse', nodes: Array<{ __typename?: 'EntCity', id: string, name: string, sanitizedName: string, state?: string | null, country: string }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean }, statistics: { __typename?: 'Statistics', count: number } } };

export type ForecastQueryVariables = Exact<{
  forecastOptions: ForecastOptionsData;
}>;


export type ForecastQuery = { __typename?: 'Query', forecast: { __typename?: 'EntForecast', id: string, createdAt: any, updatedAt: any, name: string, latitude: number, longitude: number, country: string, population: number, timezone: number, sunrise: number, sunset: number, forecastDetails: Array<{ __typename?: 'EntForecastDetails', id: string, createdAt: any, updatedAt: any, dt: number, temperature: number, feelsLike: number, tempMin: number, tempMax: number, pressure: number, seaLevel: number, grndLevel: number, humidity: number, tempKf: number, title: string, description: string, icon: string, clouds: number, windSpeed: number, windDeg: number, windGust: number, visibility: number, pop: number, sysPod: string, dateTime: string }> } };


export const CitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityPaginationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EntCityFiltersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sanitizedName"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statistics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<CitiesQuery, CitiesQueryVariables>;
export const ForecastDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"forecast"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"forecastOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ForecastOptionsData"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forecast"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"forecastOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"forecastOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"population"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"sunrise"}},{"kind":"Field","name":{"kind":"Name","value":"sunset"}},{"kind":"Field","name":{"kind":"Name","value":"forecastDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dt"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"feelsLike"}},{"kind":"Field","name":{"kind":"Name","value":"tempMin"}},{"kind":"Field","name":{"kind":"Name","value":"tempMax"}},{"kind":"Field","name":{"kind":"Name","value":"pressure"}},{"kind":"Field","name":{"kind":"Name","value":"seaLevel"}},{"kind":"Field","name":{"kind":"Name","value":"grndLevel"}},{"kind":"Field","name":{"kind":"Name","value":"humidity"}},{"kind":"Field","name":{"kind":"Name","value":"tempKf"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"clouds"}},{"kind":"Field","name":{"kind":"Name","value":"windSpeed"}},{"kind":"Field","name":{"kind":"Name","value":"windDeg"}},{"kind":"Field","name":{"kind":"Name","value":"windGust"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"pop"}},{"kind":"Field","name":{"kind":"Name","value":"sysPod"}},{"kind":"Field","name":{"kind":"Name","value":"dateTime"}}]}}]}}]}}]} as unknown as DocumentNode<ForecastQuery, ForecastQueryVariables>;