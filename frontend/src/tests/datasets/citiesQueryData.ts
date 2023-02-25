import { CitiesQuery } from '@/apollo/graphql/types/graphql'

export const citiesQueryData: CitiesQuery['cities']['nodes'] = [
  {
    id: '1',
    name: 'San Francisco',
    country: 'USA',
    state: 'California',
    sanitizedName: 'san-francisco',
  },
  {
    id: '2',
    name: 'New York',
    country: 'USA',
    state: 'New York',
    sanitizedName: 'new-york',
  },
]
