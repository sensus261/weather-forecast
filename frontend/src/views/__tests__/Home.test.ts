import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { apolloClient } from '@/apollo/client'

import Home from '../Home.vue'

provideApolloClient(apolloClient)

describe('Home', () => {
  const vuetify = createVuetify({ components, directives })

  it('renders properly', async () => {
    const wrapper = mount(Home, { global: { plugins: [vuetify] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
  })

  it('fetches forecast data when a city is selected', async () => {
    const mockRefetch = vi.fn()
    const mockUseQuery = vi.fn(() => {
      return {
        forecastResult: {
          refetch: mockRefetch,
        },
      }
    })

    const wrapper = mount(Home, {
      global: {
        stubs: {
          RenderForecastByDays: true,
          CitiesSelectInput: true,
        },
        mocks: {
          $apollo: {
            useQuery: mockUseQuery,
          },
        },
        plugins: [vuetify],
      },
    })

    await wrapper.findComponent({ name: 'CitiesSelectInput' }).vm.$emit('onSubmit', 'London')

    expect(mockRefetch).toHaveBeenCalledWith({
      forecastOptions: {
        cityId: 'London',
      },
    })
  })
})
