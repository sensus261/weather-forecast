import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { beforeAllTests } from '@/tests/beforeAllTests'
import { citiesQueryData } from '@/tests/datasets/citiesQueryData'

import CitySelectInput from '../CitySelectInput.vue'

describe('CitySelectInput', () => {
  beforeAll(() => {
    beforeAllTests()
  })

  // Create a Vuetify plugin
  const vuetify = createVuetify({ components, directives })

  it('computes the city options correctly', async () => {
    const onSelect = vi.fn()
    const onSearch = vi.fn()

    const wrapper = mount(CitySelectInput, {
      global: {
        plugins: [vuetify],
      },
      props: {
        cities: citiesQueryData,
        onSelect,
        onSearch,
      },
    })

    const autocompleteWrapper = wrapper.getComponent({ name: 'v-autocomplete' })

    expect(autocompleteWrapper.props('items')).toEqual(
      citiesQueryData.map((city) => ({
        label: `${city.name}, (${city.country})`,
        value: city.id,
      }))
    )
  })

  it('renders with the correct label', async () => {
    const wrapper = mount(CitySelectInput, {
      global: {
        plugins: [vuetify],
      },
      props: {
        cities: citiesQueryData,
      },
    })

    const label = wrapper.find('label')
    expect(label.text()).toBe('Search for a city')
  })

  it('displays the loading spinner when props.loading is true', async () => {
    const wrapper = mount(CitySelectInput, {
      global: {
        plugins: [vuetify],
      },
      props: {
        cities: citiesQueryData,
        loading: true,
      },
    })

    const spinner = wrapper.find('.v-progress-linear')
    expect(spinner.exists()).toBe(true)
  })

  it('emits the onSelect event correctly', async () => {
    const onSelect = vi.fn()

    const wrapper = mount(CitySelectInput, {
      global: {
        plugins: [vuetify],
      },
      props: {
        cities: citiesQueryData,
        onSelect,
      },
    })

    const selectedValue = citiesQueryData[0]

    const autocompleteWrapper = wrapper.getComponent({ name: 'v-autocomplete' })
    await autocompleteWrapper.vm.$emit(
      'update:search',
      `${selectedValue.name}, (${selectedValue.country})`
    )

    expect(wrapper.emitted().onSelect).toBeTruthy()
    expect(wrapper.emitted().onSelect?.[0]).toEqual([selectedValue.id])
  })

  it('emits the onSearch event correctly', async () => {
    const onSearch = vi.fn()

    const wrapper = mount(CitySelectInput, {
      global: {
        plugins: [vuetify],
      },
      props: {
        cities: citiesQueryData,
        onSearch,
      },
    })

    const autocompleteWrapper = wrapper.getComponent({ name: 'v-autocomplete' })
    await autocompleteWrapper.vm.$emit('update:search', 'random-test-value')

    // Wait for 300 milliseconds (debounce function)
    await new Promise((resolve) => setTimeout(resolve, 300))

    expect(wrapper.emitted().onSearch).toBeTruthy()
    expect(wrapper.emitted().onSearch?.[0]).toEqual(['random-test-value'])
  })

  it('does not emit onSearch event when searching for already selected option', async () => {
    const onSearch = vi.fn()

    const wrapper = mount(CitySelectInput, {
      global: {
        plugins: [vuetify],
      },
      props: {
        cities: citiesQueryData,
        onSearch,
      },
    })

    const autocompleteWrapper = wrapper.getComponent({ name: 'v-autocomplete' })
    await autocompleteWrapper.vm.$emit('update:search', 'some random text')

    // Wait for 300 milliseconds (debounce function)
    await new Promise((resolve) => setTimeout(resolve, 300))

    await autocompleteWrapper.vm.$emit('update:search', 'some random text')
    // Wait for 300 milliseconds (debounce function)
    await new Promise((resolve) => setTimeout(resolve, 300))

    expect(wrapper.emitted().onSearch).toBeTruthy()
    expect(wrapper.emitted().onSearch?.length).toBe(1)
  })
})
