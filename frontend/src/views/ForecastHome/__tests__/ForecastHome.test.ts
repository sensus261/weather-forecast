import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { beforeAllTests } from '@/tests/beforeAllTests'
import { forecastQueryData } from '@/tests/datasets/forecastQueryData'
import { mockUseQuery } from '@/tests/utils/mockUseQuery'

import ForecastHome from '../ForecastHome.vue'

describe('ForecastHome', () => {
  beforeAllTests()

  const vuetify = createVuetify({ components, directives })

  // Mock use query
  const refetch = vi.fn()
  mockUseQuery({
    loading: false,
    result: {
      forecast: forecastQueryData,
    },
    refetch,
    error: null,
  })

  it('renders properly', async () => {
    const wrapper = mount(ForecastHome, {
      global: {
        plugins: [vuetify],
        stubs: {
          DailyForecast: true,
          CityForm: true,
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
  })

  it('refetches forecast data when <CityForm /> emits "on-submit"', async () => {
    const wrapper = mount(ForecastHome, {
      global: {
        stubs: {
          DailyForecast: true,
          CityForm: true,
        },
        plugins: [vuetify],
      },
    })

    await wrapper.findComponent({ name: 'CityForm' }).vm.$emit('on-submit', 'London')

    expect(refetch).toHaveBeenCalledWith({
      forecastOptions: {
        cityId: 'London',
      },
    })
  })
})
