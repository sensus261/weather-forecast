<template>
  <v-container class="fill-height" fluid>
    <div class="bg-image"></div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12" :style="{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }">
          <v-card-title
            class="headline text-center ma-3"
            style="font-weight: bold; color: #333333; text-shadow: 1px 1px #dddddd"
          >
            Weather forecast
          </v-card-title>
          <v-alert v-if="forecastResult.error.value?.message" class="mt-2" type="error">
            {{ forecastResult.error.value.message }}
          </v-alert>

          <v-card-text>
            <CityForm @on-submit="fetchForecastData" />

            <v-progress-linear
              v-if="forecastResult.loading.value"
              class="mt-2"
              color="primary"
              indeterminate
            ></v-progress-linear>

            <template v-if="forecastResult.result.value?.forecast">
              <v-card
                class="mt-4 text-center px-4 py-6 my-6"
                elevation="2"
                style="background-color: #f7f7f7"
              >
                <v-card-title
                  class="mb-2 text-uppercase"
                  color="primary"
                  style="font-size: 28px; font-weight: bold"
                >
                  {{ forecastResult.result.value.forecast.name }}
                </v-card-title>
                <v-card-text>
                  <ul class="list-disc text-body">
                    <li style="font-weight: bold; color: #333333">
                      Population:
                      {{ forecastResult.result.value.forecast.population }}
                    </li>
                    <li style="font-weight: bold; color: #333333">
                      Country:
                      {{ forecastResult.result.value.forecast.country }}
                    </li>
                  </ul>
                </v-card-text>
              </v-card>

              <DailyForecast :forecast="forecastResult.result.value.forecast"></DailyForecast>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'

import { ForecastDocument } from '@/apollo/graphql/types/graphql'
import DailyForecast from '@/components/ForecastRenderers/DailyForecast/DailyForecast.vue'
import CityForm from '@/components/Forms/CityForm/CityForm.vue'

// Queries
const forecastResult = useQuery(
  ForecastDocument,
  {
    forecastOptions: {
      cityId: '',
    },
  },
  {
    // Workaround because skip is not working as expected...
    // So we use `cache-only` as a first policy (to avoid network request)
    // Then `cache-first` on the next fetch policies
    fetchPolicy: 'cache-only',
    nextFetchPolicy: 'cache-first',
  }
)

// Methods
const fetchForecastData = (cityId: string | null) => {
  if (!cityId) return

  forecastResult.refetch({
    forecastOptions: {
      cityId,
    },
  })
}
</script>

<style>
.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(@/assets/background-image.jpg);
  background-size: cover;
  background-attachment: fixed;
  opacity: 0.6;
  z-index: -1;
}
</style>
