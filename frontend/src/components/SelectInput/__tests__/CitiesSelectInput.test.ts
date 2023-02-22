import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { apolloClient } from '@/apollo/client'

import CitiesSelectInput from '../CitiesSelectInput.vue'

provideApolloClient(apolloClient)

describe('CitiesSelectInput', () => {
  const vuetify = createVuetify({ components, directives })
  const apolloMock = {
    queries: {
      cities: {
        result: {
          value: {
            cities: {
              nodes: [
                {
                  id: '1',
                  name: 'San Francisco',
                  country: 'USA',
                },
                {
                  id: '2',
                  name: 'New York',
                  country: 'USA',
                },
              ],
            },
          },
        },
      },
    },
  }

  it('submits the selected city when the form is submitted', async () => {
    const onSubmitMock = vi.fn()
    const wrapper = mount(CitiesSelectInput, {
      global: {
        plugins: [vuetify],
        mocks: {
          $apollo: apolloMock,
        },
      },
      props: {
        onSubmit: onSubmitMock,
      },
    })

    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('San Francisco')
    await wrapper.find('form').trigger('submit')

    expect(onSubmitMock).toHaveBeenCalled()
  })
})
