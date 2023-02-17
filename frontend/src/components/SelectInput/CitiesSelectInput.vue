<template>
  <v-form @submit.prevent="submit">
    <v-autocomplete
      v-model="cityId"
      label="Search for a city"
      item-title="label"
      item-value="value"
      :items="cityOptions"
      :loading="citiesResult.loading.value"
      @update:search="handleSearch"
    ></v-autocomplete>
    <v-btn color="primary" type="submit">Submit</v-btn>
  </v-form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import {
  CitiesDocument,
  StringFilterOperation,
} from "@/apollo/graphql/types/graphql";
import { computed } from "vue";

// Utils
const emit = defineEmits(["onSubmit"]);

// Data
const cityId = ref("");

let timeoutId: ReturnType<typeof setTimeout>;

// Queries
const citiesResult = useQuery(CitiesDocument, {
  pagination: {
    first: 10,
    after: 0,
  },
});

// Computed
const cityOptions =
  computed(() =>
    citiesResult.result.value?.cities?.nodes?.map((node) => {
      return {
        label: `${node.name}, (${node.country})`,
        value: node.id,
      };
    })
  ) || [];

// Methods
const debounce = (callback: () => void, delay: number) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    callback();
  }, delay);
};

const handleSearch = (search: string) => {
  if (!search || search === cityId.value) {
    return;
  }

  // Check if query cities result nodes contain the search string
  const nodes = citiesResult.result.value?.cities?.nodes;
  if (nodes) {
    const node = nodes.find((node) => node.name === search);
    if (node) {
      cityId.value = node.id;
      return;
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
    });
  }, 300);
};

const submit = () => {
  emit("onSubmit", cityId.value);
};
</script>
