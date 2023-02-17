<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card
          class="elevation-12"
          :style="{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }"
        >
          <v-card-title class="headline">Weather Forecast</v-card-title>
          <v-card-text>
            <CitiesSelectInput
              @onSubmit="fetchForecastData"
            ></CitiesSelectInput>
            <v-divider></v-divider>
            <v-card v-if="forecastResult.result.value?.forecast">
              <v-card-title
                >Forecast for
                {{ forecastResult.result.value.forecast.name }}</v-card-title
              >
              <v-card-text>
                <v-row>
                  <v-col
                    v-for="(day, index) in forecastResult.result.value.forecast
                      .forecastDetails"
                    :key="index"
                    cols="12"
                    md="4"
                  >
                    <v-card class="elevation-2" color="#f5f5f5">
                      <v-card-text>
                        <div class="text-h6 font-weight-bold">
                          {{ day.dateTime }}
                        </div>
                        <div class="d-flex align-center justify-center mb-2">
                          <v-img :src="day.icon" height="60"></v-img>
                          <div class="text-h3 font-weight-bold ml-2">
                            {{ day.temperature }}°C
                          </div>
                        </div>
                        <div class="text-h5 font-weight-light mb-1">
                          {{ day.description }}
                        </div>
                        <div class="text-body font-weight-light mb-1">
                          <span>Feels like: {{ day.feelsLike }} </span>
                          <span>| Humidity: {{ day.humidity }}%</span>
                        </div>
                        <div class="text-body font-weight-light mb-1">
                          <span>Wind: {{ day.windSpeed }} km/h </span>
                          <span>| Pressure: {{ day.pressure }} hPa </span>
                        </div>
                        <div class="text-body font-weight-light">
                          <span>Clouds: {{ day.clouds }}%</span>
                          <span>| Visibility: {{ day.visibility }} m</span>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useQuery } from "@vue/apollo-composable";
import { ForecastDocument } from "@/apollo/graphql/types/graphql";
import CitiesSelectInput from "@/components/SelectInput/CitiesSelectInput.vue";
import { ref } from "vue";

// Data
const queryEnabled = ref(false);

// Queries
const forecastResult = useQuery(
  ForecastDocument,
  {
    forecastOptions: {
      cityId: "",
    },
  },
  {
    enabled: true,
  }
);

// Methods
const fetchForecastData = (cityId: string) => {
  queryEnabled.value = true;

  forecastResult.refetch({
    forecastOptions: {
      cityId,
    },
  });
};
</script>
