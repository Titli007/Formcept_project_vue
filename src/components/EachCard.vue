<template>
  <li>
    <p v-html="highlightedName"></p>
    <p>ID: {{ item.fc_ns }}</p>
    <p>Date: {{ formattedDate }}</p>
    <p>Time: {{ formattedTime }}</p>
  </li>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import type { Data } from '../propTypes/Cards_list_props'; // Type-only import

const props = defineProps<{
  item: Data;
  searchQuery: string;
}>();

const highlightedName = computed(() => {
  const name = props.item.fc_name;
  const query = props.searchQuery.toLowerCase();
  if (!query) {
    return name;
  }
  const highlighted = name.replace(
    new RegExp(`(${query})`, 'gi'),
    '<span class="highlight">$1</span>'
  );
  return highlighted;
});

// Debugging: Watch the highlightedName and log it
// watchEffect(() => {
//   console.log(`Highlighted name for ${props.item.fc_name}:`, highlightedName.value);
// });

const formattedDate = computed(() => {
  const date = new Date(props.item.fc_ts);
  return date.toLocaleDateString();
});

const formattedTime = computed(() => {
  const date = new Date(props.item.fc_ts);
  return date.toLocaleTimeString();
});
</script>

<style scoped>
/* Ensure highlight is clearly visible */
.highlight {
  background-color: yellow !important;
  color: black !important;
  font-weight: bold !important;
}

li {
  background-color: #f4f4f4;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
}
</style>
