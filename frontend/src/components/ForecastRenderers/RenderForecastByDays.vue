<template>
  <v-card class="mt-2 text-center">
    <template v-if="groupedForecast.length > 0">
      <v-card-title class="mt-2">Daily forecast for {{ props.forecast.name }}</v-card-title>
      <v-card-text>
        <v-tabs v-model="selectedDay" class="mb-5">
          <v-tab v-for="(group, index) in groupedForecast" :key="index" :value="group.date">
            {{ group.date }}
          </v-tab>
        </v-tabs>

        <v-row v-for="(group, index) in groupedForecast" :key="index">
          <template v-if="selectedDay === group.date">
            <v-col
              v-for="(day, index) in group.forecastDetails"
              :key="index"
              cols="12"
              md="4"
              full-height
            >
              <v-card class="elevation-2" color="#f5f5f5">
                <v-card-text>
                  <div class="text-h6 font-weight-bold">
                    {{ new Date(day.dateTime).toLocaleString() }}
                  </div>
                  <div class="d-flex align-center justify-center mb-2">
                    <v-img
                      :src="`https://openweathermap.org/img/w/${day.icon}.png`"
                      height="60"
                    ></v-img>
                    <div class="text-h3 font-weight-bold ml-2">
                      {{ Math.round(day.temperature) }}°C
                    </div>
                  </div>
                  <div class="text-h5 font-weight-light mb-1">
                    {{ day.description }}
                  </div>
                  <div class="text-body font-weight-light mb-1">
                    <span>Feels like: {{ Math.round(day.feelsLike) }}°C</span>
                  </div>
                  <div class="text-body font-weight-light mb-1">
                    <span>Humidity: {{ day.humidity }}%</span>
                  </div>
                  <div class="text-body font-weight-light mb-1">
                    <span>Wind: {{ day.windSpeed }} km/h</span>
                  </div>
                  <div class="text-body font-weight-light mb-1">
                    <span>Pressure: {{ day.pressure }} hPa</span>
                  </div>
                  <div class="text-body font-weight-light">
                    <span>Clouds: {{ day.clouds }}%</span>
                  </div>
                  <div class="text-body font-weight-light">
                    <span>Visibility: {{ day.visibility }} m</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { ForecastQuery } from '@/apollo/graphql/types/graphql'

// Props
const props = defineProps<{
  forecast: ForecastQuery['forecast']
}>()

// Data
const selectedDay = ref('')

// Computed
const groupedForecast = computed(() => {
  const groups = []
  let currentGroup: {
    date: string
    forecastDetails: ForecastQuery['forecast']['forecastDetails']
  } | null = null

  for (const day of props.forecast.forecastDetails) {
    const date = new Date(day.dateTime).toLocaleDateString()

    if (!currentGroup || currentGroup.date !== date) {
      currentGroup = {
        date,
        forecastDetails: [],
      }
      groups.push(currentGroup)
    }

    currentGroup.forecastDetails.push(day)
  }

  return groups
})
</script>

<style scoped></style>
