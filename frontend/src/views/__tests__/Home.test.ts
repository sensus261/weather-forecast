import { OperationVariables } from '@apollo/client'
import { provideApolloClient, useQuery, UseQueryReturn } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, MockedFunction, vi } from 'vitest'
import { ref } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { apolloClient } from '@/apollo/client'
import { beforeAllTests } from '@/tests/beforeAllTests'
import { forecastQueryData } from '@/tests/datasets/forecastQueryData'

import Home from '../Home.vue'

provideApolloClient(apolloClient)

describe('Home', () => {
  beforeAll(() => {
    beforeAllTests()
  })

  const vuetify = createVuetify({ components, directives })

  vi.mock('@vue/apollo-composable', async () => {
    const actual = await vi.importActual('@vue/apollo-composable')
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...actual,
      useQuery: vi.fn(),
    }
  })

  const refetch = vi.fn()

  const mockUseQuery = useQuery as unknown as MockedFunction<typeof useQuery>
  mockUseQuery.mockReturnValue({
    error: ref(null),
    loading: ref(false),
    result: ref({
      forecast: forecastQueryData,
    }),
    refetch,
  } as unknown as UseQueryReturn<unknown, OperationVariables>)

  it('renders properly', async () => {
    const wrapper = mount(Home, { global: { plugins: [vuetify] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
  })

  it('refetches forecast data when <CitySelectInput /> emits "onSubmit"', async () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          DailyForecast: true,
          CitySelectInput: true,
        },
        plugins: [vuetify],
      },
    })

    await wrapper.findComponent({ name: 'CitySelectInput' }).vm.$emit('onSubmit', 'London')

    expect(refetch).toHaveBeenCalledWith({
      forecastOptions: {
        cityId: 'London',
      },
    })
  })
})
