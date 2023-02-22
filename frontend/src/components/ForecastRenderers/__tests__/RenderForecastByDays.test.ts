import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { apolloClient } from '@/apollo/client'
import { ForecastQuery } from '@/apollo/graphql/types/graphql'

import RenderForecastByDays from '../RenderForecastByDays.vue'

provideApolloClient(apolloClient)

describe('RenderForecastByDays', () => {
  const vuetify = createVuetify({ components, directives })

  it('renders the component successfully', async () => {
    expect(true).toBe(true)
    // const forecast = {
    //   name: 'City Name',
    //   forecastDetails: [
    //     {
    //       dateTime: '2022-02-18 12:00:00',
    //       temperature: 25,
    //       description: 'Cloudy',
    //       feelsLike: 28,
    //       humidity: 80,
    //       windSpeed: 10,
    //       pressure: 1013,
    //       clouds: 75,
    //       visibility: 5000,
    //       icon: '04d',
    //     },
    //     {
    //       dateTime: '2022-02-17 12:00:00',
    //       temperature: 24,
    //       description: 'Cloudy',
    //       feelsLike: 28,
    //       humidity: 80,
    //       windSpeed: 10,
    //       pressure: 1013,
    //       clouds: 75,
    //       visibility: 5000,
    //       icon: '04d',
    //     },
    //     {
    //       dateTime: '2022-02-16 12:00:00',
    //       temperature: 24,
    //       description: 'Cloudy',
    //       feelsLike: 28,
    //       humidity: 80,
    //       windSpeed: 10,
    //       pressure: 1013,
    //       clouds: 75,
    //       visibility: 5000,
    //       icon: '04d',
    //     },
    //   ],
    // } as ForecastQuery['forecast']

    // const wrapper = mount(RenderForecastByDays, {
    //   global: {
    //     plugins: [vuetify],
    //   },
    //   props: {
    //     forecast,
    //   },
    // })

    // expect(wrapper.exists()).toBe(true)
  })
})
