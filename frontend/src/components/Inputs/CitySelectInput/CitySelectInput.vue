<template>
  <v-autocomplete
    label="Search for a city"
    item-title="label"
    item-value="value"
    :items="cityOptions"
    :loading="!!props.loading"
    @update:search="handleSearch"
  ></v-autocomplete>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { computed } from 'vue'

import { CitiesQuery } from '@/apollo/graphql/types/graphql'

// Utils
let timeoutId: ReturnType<typeof setTimeout>
const emit = defineEmits<{
  (e: 'on-select', val: string | null): void
  (e: 'on-search', val: string): void
}>()

// Props
const props = defineProps<{
  cities: CitiesQuery['cities']['nodes']
  loading?: boolean
}>()

// Data
const selectedOption = ref<CitiesQuery['cities']['nodes'][0] | null>(null)
const searchBy = ref<string>('')

// Watchers
watch(selectedOption, (newValue) => {
  emit('on-select', newValue?.id || null)
})

// Computed
const cityOptions =
  computed(() => {
    const { cities } = props

    const result =
      cities.map((node) => {
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
  if (!search || searchBy.value === search) {
    return
  }

  searchBy.value = search

  const { cities } = props

  const node = cities.find((node) => {
    return getNodeLabel(node) === search
  })

  if (node) {
    selectedOption.value = node
    return
  }

  debounce(() => {
    emit('on-search', search)
  }, 300)
}
</script>
