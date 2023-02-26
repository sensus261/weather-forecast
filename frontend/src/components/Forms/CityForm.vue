<template>
  <v-form @submit.prevent="handleFormSubmit">
    <CitySelectInput
      :cities="citiesResult.result.value?.cities.nodes || []"
      :loading="citiesResult.loading.value"
      @on-select="handleCitySelect"
      @on-search="handleCitySearch"
    />
    <div class="text-center">
      <v-btn color="primary" type="submit">Submit</v-btn>
    </div>
  </v-form>
</template>

<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'

import { CitiesDocument, StringFilterOperation } from '@/apollo/graphql/types/graphql'

import CitySelectInput from '../Inputs/CitySelectInput/CitySelectInput.vue'

// Utils
const emit = defineEmits<{
  (e: 'onSubmit', val: string | null): void
}>()

// Data
const selectedCityId = ref<string | null>(null)

// Queries
const citiesResult = useQuery(CitiesDocument, {
  pagination: {
    first: 10,
    after: 0,
  },
})

// Methods
const handleCitySelect = (cityId: string | null) => {
  selectedCityId.value = cityId

  if (!cityId) return
}

const handleCitySearch = (searchBy: string) => {
  citiesResult.refetch({
    pagination: {
      first: 10,
      after: 0,
    },
    filters: {
      name: {
        value: searchBy,
        operation: StringFilterOperation.StartsWith,
      },
    },
  })
}

const handleFormSubmit = () => {
  emit('onSubmit', selectedCityId.value)
}
</script>
