import Chance from 'chance'

import { ForecastQuery } from '@/apollo/graphql/types/graphql'

import { formatToGraphQLDate } from '../utils/formatToGraphQLDate'

const chance = new Chance()

const dateTime = new Date(chance.date({ string: true, year: 2023, month: 1, day: 1 }))

export const forecastQueryData: ForecastQuery['forecast'] = {
  id: chance.guid(),
  createdAt: chance.date().toISOString(),
  updatedAt: chance.date().toISOString(),
  name: chance.city(),
  latitude: chance.latitude(),
  longitude: chance.longitude(),
  country: chance.country(),
  population: chance.natural({ min: 10000, max: 1000000 }),
  timezone: chance.integer({ min: -43200, max: 50400 }),
  sunrise: chance.integer({ min: 1483228800, max: 1937836800 }),
  sunset: chance.integer({ min: 1483267200, max: 1937865600 }),
  forecastDetails: Array.from({ length: 55 }, () => {
    dateTime.setHours(dateTime.getHours() + 3)

    return {
      id: chance.guid(),
      createdAt: chance.date().toISOString(),
      updatedAt: chance.date().toISOString(),
      dt: chance.integer({ min: 1677358800, max: 1677391200 }),
      temperature: chance.floating({ min: -10, max: 40, fixed: 2 }),
      feelsLike: chance.floating({ min: -15, max: 45, fixed: 2 }),
      tempMin: chance.floating({ min: -10, max: 40, fixed: 2 }),
      tempMax: chance.floating({ min: -10, max: 40, fixed: 2 }),
      pressure: chance.natural({ min: 900, max: 1100 }),
      seaLevel: chance.natural({ min: 900, max: 1100 }),
      grndLevel: chance.natural({ min: 900, max: 1100 }),
      humidity: chance.natural({ min: 0, max: 100 }),
      tempKf: chance.floating({ min: -10, max: 10, fixed: 2 }),
      title: chance.word(),
      description: chance.sentence({ words: 3 }),
      icon: chance.word(),
      clouds: chance.natural({ min: 0, max: 100 }),
      windSpeed: chance.floating({ min: 0, max: 30, fixed: 2 }),
      windDeg: chance.natural({ min: 0, max: 360 }),
      windGust: chance.floating({ min: 0, max: 30, fixed: 2 }),
      visibility: chance.natural({ min: 0, max: 10000 }),
      pop: chance.floating({ min: 0, max: 1, fixed: 2 }),
      sysPod: chance.character({ pool: 'dn' }),
      dateTime: formatToGraphQLDate(dateTime),
      __typename: 'EntForecastDetails',
    }
  }),
}
