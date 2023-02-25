import { OperationVariables } from '@apollo/client'
import { useQuery, UseQueryReturn } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, MockedFunction, vi } from 'vitest'
import { ref } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { CitiesQuery } from '@/apollo/graphql/types/graphql'
import { beforeAllTests } from '@/tests/beforeAllTests'
import { citiesQueryData } from '@/tests/datasets/citiesQueryData'

import CityForm from '../CityForm.vue'

describe('CityForm', () => {
  beforeAll(() => {
    beforeAllTests()
  })

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
    loading: ref(false),
    result: ref({
      cities: mockedCitiesQueryResult,
    }),
    refetch,
  } as unknown as UseQueryReturn<unknown, OperationVariables>)

  it('submits the selected city when the form is submitted', async () => {
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
    expect(wrapper.emitted('onSubmit')).toBeTruthy()
    expect(wrapper.emitted('onSubmit')?.[0]).toEqual([selectedValue.id])
  })
})
