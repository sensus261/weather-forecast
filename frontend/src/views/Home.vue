<template>
  <v-container fluid>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12" :style="{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }">
            <v-card-title class="headline">Weather Forecast</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="submit">
                <v-text-field label="City" v-model="city" required></v-text-field>
                <v-btn color="primary" type="submit">Submit</v-btn>
              </v-form>
              <v-divider></v-divider>
              <v-card v-if="forecast">
                <v-card-title>Forecast for {{ city }}</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col v-for="(day, index) in forecast" :key="index" cols="12" md="4">
                      <v-card class="elevation-2">
                        <v-card-text>
                          <div>{{ day.date }}</div>
                          <v-img :src="day.icon"></v-img>
                          <div>{{ day.temperature }}°C</div>
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
import axios from 'axios';
import { ref } from 'vue';


const city = ref('');
const forecast = ref<any>(null);

const apiKey = "API_KEY_HERE";

const submit = () => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&units=metric&appid=${apiKey}`)
        .then(response => {
          const data = response.data;
          forecast.value = data.list.filter(item => item.dt_txt.includes('12:00:00')).map(item => {
            return {
              date: new Date(item.dt * 1000).toLocaleDateString(),
              temperature: Math.round(item.main.temp),
              icon: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`
            };
          });
        });
}

</script>
