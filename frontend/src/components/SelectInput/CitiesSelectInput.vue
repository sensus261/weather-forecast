<template>
  <v-form @submit.prevent="submit">
    <v-autocomplete
      label="Search for a city"
      item-title="label"
      item-value="value"
      :items="cityOptions"
      :loading="citiesResult.loading.value"
      @update:search="handleSearch"
    ></v-autocomplete>
    <div class="text-center">
      <v-btn color="primary" type="submit">Submit</v-btn>
    </div>
  </v-form>
</template>

<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'
import { computed } from 'vue'

import { CitiesDocument, CitiesQuery, StringFilterOperation } from '@/apollo/graphql/types/graphql'

// Utils
const emit = defineEmits<{
  (e: 'onSubmit', val: string | null): void
}>()

// Data
const selectedOption = ref<CitiesQuery['cities']['nodes'][0] | null>(null)
let timeoutId: ReturnType<typeof setTimeout>

// Queries
const citiesResult = useQuery(CitiesDocument, {
  pagination: {
    first: 10,
    after: 0,
  },
})

// Computed
const cityOptions =
  computed(() => {
    const result =
      citiesResult.result.value?.cities?.nodes?.map((node) => {
        return {
          label: getNodeLabel(node),
          value: node.id,
        }
      }) || []

    if (selectedOption.value !== null) {
      result.push({
        label: getNodeLabel(selectedOption.value),
        value: selectedOption.value.id,
      })
    }

    return result
  }) || []

// Methods
const debounce = (callback: () => void, delay: number) => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    callback()
  }, delay)
}

const getNodeLabel = (node: CitiesQuery['cities']['nodes'][0]) => {
  return `${node.name}, (${node.country})`
}

const handleSearch = (search: string) => {
  if (!search || search === selectedOption.value?.id) {
    return
  }

  // Check if query cities result nodes contain the search string
  const nodes = citiesResult.result.value?.cities?.nodes
  if (nodes) {
    const node = nodes.find((node) => {
      return getNodeLabel(node) === search
    })
    if (node) {
      selectedOption.value = node
      return
    }
  }

  debounce(() => {
    citiesResult.refetch({
      pagination: {
        first: 10,
        after: 0,
      },
      filters: {
        name: {
          value: search,
          operation: StringFilterOperation.StartsWith,
        },
      },
    })
  }, 300)
}

const submit = () => {
  emit('onSubmit', selectedOption.value?.id || null)
}
</script>
