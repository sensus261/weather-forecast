import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { beforeAllTests } from '@/tests/beforeAllTests'
import { forecastQueryData } from '@/tests/datasets/forecastQueryData'
import { formatToGraphQLDate } from '@/tests/utils/formatToGraphQLDate'

import DailyForecast from '../DailyForecast.vue'

describe('DailyForecast', () => {
  beforeAllTests()

  const vuetify = createVuetify({ components, directives })

  it('renders the component successfully', async () => {
    const wrapper = mount(DailyForecast, {
      global: {
        plugins: [vuetify],
      },
      props: {
        forecast: forecastQueryData,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders the correct title', () => {
    const wrapper = mount(DailyForecast, {
      global: {
        plugins: [vuetify],
      },
      props: {
        forecast: forecastQueryData,
      },
    })

    expect(wrapper.find('.v-card-title').text()).toBe(
      `Daily forecast for ${forecastQueryData.name}`
    )
  })

  it('renders the correct number of tabs', () => {
    const wrapper = mount(DailyForecast, {
      global: {
        plugins: [vuetify],
      },
      props: {
        forecast: forecastQueryData,
      },
    })

    expect(wrapper.findAll('.v-tab').length).toBe(
      parseInt((forecastQueryData.forecastDetails.length / 8).toFixed())
    )
  })

  it('displays the correct data for each card', async () => {
    const wrapper = mount(DailyForecast, {
      global: {
        plugins: [vuetify],
      },
      props: {
        forecast: forecastQueryData,
      },
    })

    await wrapper.vm.$nextTick()

    const cards = wrapper.findAll('.v-card')

    cards.forEach((card) => {
      const title = card.find('.text-h6')
      expect(title.exists()).toBe(true)

      const day = forecastQueryData.forecastDetails.find((forecastDetail) => {
        return forecastDetail.dateTime === formatToGraphQLDate(title.text())
      })

      expect(day).not.toBeUndefined()
      if (!day) {
        throw new Error('Day not found')
      }

      expect(card.find('.text-h6').text()).toBe(new Date(day.dateTime).toLocaleString())
      expect(card.find('.text-h3').text()).toBe(`${Math.round(day.temperature)}°C`)
      expect(card.find('.text-h5').text()).toBe(day.description)
      expect(card.find('.feels-like').text()).toBe(`Feels like: ${Math.round(day.feelsLike)}°C`)
      expect(card.find('.humidity').text()).toBe(`Humidity: ${day.humidity}%`)
      expect(card.find('.wind').text()).toBe(`Wind: ${day.windSpeed} km/h`)
      expect(card.find('.pressure').text()).toBe(`Pressure: ${day.pressure} hPa`)
      expect(card.find('.clouds').text()).toBe(`Clouds: ${day.clouds}%`)
      expect(card.find('.visibility').text()).toBe(`Visibility: ${day.visibility} m`)
    })
  })
})
