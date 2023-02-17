/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "query cities($pagination: EntityPaginationInput!, $filters: EntCityFiltersInput) {\n  cities(pagination: $pagination, filters: $filters) {\n    nodes {\n      id\n      name\n      sanitizedName\n      state\n      country\n    }\n    pageInfo {\n      hasNextPage\n    }\n    statistics {\n      count\n    }\n  }\n}": types.CitiesDocument,
    "query forecast($forecastOptions: ForecastOptionsData!) {\n  forecast(forecastOptions: $forecastOptions) {\n    id\n    createdAt\n    updatedAt\n    name\n    latitude\n    longitude\n    country\n    population\n    timezone\n    sunrise\n    sunset\n    forecastDetails {\n      id\n      createdAt\n      updatedAt\n      dt\n      temperature\n      feelsLike\n      tempMin\n      tempMax\n      pressure\n      seaLevel\n      grndLevel\n      humidity\n      tempKf\n      title\n      description\n      icon\n      clouds\n      windSpeed\n      windDeg\n      windGust\n      visibility\n      pop\n      sysPod\n      dateTime\n    }\n  }\n}": types.ForecastDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query cities($pagination: EntityPaginationInput!, $filters: EntCityFiltersInput) {\n  cities(pagination: $pagination, filters: $filters) {\n    nodes {\n      id\n      name\n      sanitizedName\n      state\n      country\n    }\n    pageInfo {\n      hasNextPage\n    }\n    statistics {\n      count\n    }\n  }\n}"): (typeof documents)["query cities($pagination: EntityPaginationInput!, $filters: EntCityFiltersInput) {\n  cities(pagination: $pagination, filters: $filters) {\n    nodes {\n      id\n      name\n      sanitizedName\n      state\n      country\n    }\n    pageInfo {\n      hasNextPage\n    }\n    statistics {\n      count\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query forecast($forecastOptions: ForecastOptionsData!) {\n  forecast(forecastOptions: $forecastOptions) {\n    id\n    createdAt\n    updatedAt\n    name\n    latitude\n    longitude\n    country\n    population\n    timezone\n    sunrise\n    sunset\n    forecastDetails {\n      id\n      createdAt\n      updatedAt\n      dt\n      temperature\n      feelsLike\n      tempMin\n      tempMax\n      pressure\n      seaLevel\n      grndLevel\n      humidity\n      tempKf\n      title\n      description\n      icon\n      clouds\n      windSpeed\n      windDeg\n      windGust\n      visibility\n      pop\n      sysPod\n      dateTime\n    }\n  }\n}"): (typeof documents)["query forecast($forecastOptions: ForecastOptionsData!) {\n  forecast(forecastOptions: $forecastOptions) {\n    id\n    createdAt\n    updatedAt\n    name\n    latitude\n    longitude\n    country\n    population\n    timezone\n    sunrise\n    sunset\n    forecastDetails {\n      id\n      createdAt\n      updatedAt\n      dt\n      temperature\n      feelsLike\n      tempMin\n      tempMax\n      pressure\n      seaLevel\n      grndLevel\n      humidity\n      tempKf\n      title\n      description\n      icon\n      clouds\n      windSpeed\n      windDeg\n      windGust\n      visibility\n      pop\n      sysPod\n      dateTime\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;