import Chance from 'chance'

import { CitiesQuery } from '@/apollo/graphql/types/graphql'
const chance = new Chance()

export const citiesQueryData: CitiesQuery['cities']['nodes'] = [
  {
    id: chance.guid(),
    name: chance.city(),
    country: chance.country(),
    state: chance.state(),
    sanitizedName: chance.city().toLowerCase().replace(/ /g, '-'),
  },
  {
    id: chance.guid(),
    name: chance.city(),
    country: chance.country(),
    state: chance.state(),
    sanitizedName: chance.city().toLowerCase().replace(/ /g, '-'),
  },
]
