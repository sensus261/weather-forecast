import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { CitiesQuery, StringFilterOperation } from '@/apollo/graphql/types/graphql'
import { beforeAllTests } from '@/tests/beforeAllTests'
import { citiesQueryData } from '@/tests/datasets/citiesQueryData'
import { mockUseQuery } from '@/tests/utils/mockUseQuery'

import CityForm from '../CityForm.vue'

describe('CityForm', () => {
  beforeAllTests()

  // Create a Vuetify plugin
  const vuetify = createVuetify({ components, directives })

  // Create a mock for the useQuery hook
  const mockedCitiesQueryResult: CitiesQuery['cities'] = {
    nodes: citiesQueryData,
    pageInfo: {
      hasNextPage: false,
    },
    statistics: {
      count: 2,
    },
  }

  // Mock use query
  const refetch = vi.fn()
  mockUseQuery({
    loading: false,
    result: {
      cities: mockedCitiesQueryResult,
    },
    refetch,
  })

  it('submits the selected city when the form is submitted using onSubmit event', async () => {
    const onSubmitMock = vi.fn()

    const wrapper = mount(CityForm, {
      global: {
        plugins: [vuetify],
      },
      props: {
        onSubmit: onSubmitMock,
      },
    })

    const selectedValue = citiesQueryData[0]

    const citySelectInputWrapper = wrapper.getComponent({ name: 'CitySelectInput' })
    await citySelectInputWrapper.vm.$emit('on-select', selectedValue.id)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted()).toBeTruthy()
    expect(wrapper.emitted('on-submit')).toBeTruthy()
    expect(wrapper.emitted('on-submit')?.[0]).toEqual([selectedValue.id])
  })

  it('fetches cities when a search is performed', async () => {
    const wrapper = mount(CityForm, {
      global: {
        plugins: [vuetify],
      },
    })

    const citySelectInputWrapper = wrapper.getComponent({ name: 'CitySelectInput' })
    await citySelectInputWrapper.vm.$emit('on-search', 'New York')

    expect(refetch).toHaveBeenCalledTimes(1)
    expect(refetch).toHaveBeenLastCalledWith({
      pagination: {
        first: 10,
        after: 0,
      },
      filters: {
        name: {
          value: 'New York',
          operation: StringFilterOperation.StartsWith,
        },
      },
    })
  })
})
