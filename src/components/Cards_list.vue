<template>
  <div class="message-display">
    <template v-if="props.group_by.key !== 'none'">
      <div v-for="group in sortedGroupKeys" :key="group" class="group">
        <h3 @click="toggleGroupVisibility(group)" class="group-heading">
          {{ group }} ({{ groupedData[group]?.length ?? 0 }}) 
          <span v-html="isGroupVisible(group) ? '&#11165;' : '&#11167;'"></span>
        </h3>
        <ul v-if="isGroupVisible(group)">
          <EachCard v-for="item in groupedData[group]" :key="item.fc_ns" :item="item" :searchQuery="filter.value" />
        </ul>
      </div>
    </template>
    <template v-else>
      <ul>
        <EachCard v-for="item in sortedAndFilteredData" :key="item.fc_ns" :item="item" :searchQuery="filter.value" />
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import EachCard from './EachCard.vue';
import type { Data, Filter, Sort, Group_by } from '../propTypes/Cards_list_props'; // Type-only import
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{
  data: Data[];
  filter: Filter;
  sort: Sort;
  group_by: Group_by;
}>();

const visibleGroups = ref<string[]>([]);

const toggleGroupVisibility = (group: string) => {
  if (visibleGroups.value.includes(group)) {
    visibleGroups.value = visibleGroups.value.filter(g => g !== group);
  } else {
    visibleGroups.value.push(group);
  }
};

const isGroupVisible = (group: string) => {
  return visibleGroups.value.includes(group);
};

const sortedAndFilteredData = computed(() => {
  let result = props.data;

  // Filter data based on search query
  if (props.filter.value) {
    result = result.filter(item =>
      item.fc_name.toLowerCase().includes(props.filter.value.toLowerCase())
    );
  }

  // Sort data based on sort criteria
  if (props.sort.key !== 'none' && props.sort.sort !== 'none') {
    result = result.slice().sort((a, b) => {
      if (props.sort.key === 'fc_name') {
        const nameA = a.fc_name.toLowerCase();
        const nameB = b.fc_name.toLowerCase();
        if (props.sort.sort === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      } else if (props.sort.key === 'fc_ts') {
        if (props.sort.sort === 'asc') {
          return a.fc_ts - b.fc_ts;
        } else {
          return b.fc_ts - a.fc_ts;
        }
      }
      return 0;
    });
  }

  return result;
});

const groupedData = computed(() => {
  if (props.group_by.key === 'none') {
    return {};
  }

  const result: { [key: string]: Data[] } = {};

  if (props.group_by.key === 'fc_name') {
    // Initialize keys
    result['0-9'] = [];
    result['A-H'] = [];
    result['I-P'] = [];
    result['Q-Z'] = [];

    sortedAndFilteredData.value.forEach(item => {
      const firstChar = item.fc_name.charAt(0).toUpperCase();
      let groupKey = '';
      if (/^[0-9]/.test(firstChar)) groupKey = '0-9';
      else if (/^[A-H]/.test(firstChar)) groupKey = 'A-H';
      else if (/^[I-P]/.test(firstChar)) groupKey = 'I-P';
      else if (/^[Q-Z]/.test(firstChar)) groupKey = 'Q-Z';

      result[groupKey].push(item);
    });
  } else if (props.group_by.key === 'fc_ts') {
    // Initialize keys
    result['Yesterday'] = [];
    result['Earlier this week'] = [];
    result['Last week'] = [];
    result['Last month'] = [];
    result['Earlier this year'] = [];
    result['Previous year'] = [];
    result['Earlier'] = [];

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const lastWeek = new Date(startOfWeek);
    lastWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const lastYear = new Date(now.getFullYear() - 1, 0, 1);

    sortedAndFilteredData.value.forEach(item => {
      const itemDate = new Date(item.fc_ts);
      let groupKey = '';

      if (itemDate > yesterday) {
        groupKey = 'Yesterday';
      } else if (itemDate > startOfWeek) {
        groupKey = 'Earlier this week';
      } else if (itemDate > lastWeek) {
        groupKey = 'Last week';
      } else if (itemDate > startOfMonth) {
        groupKey = 'Last month';
      } else if (itemDate > startOfYear) {
        groupKey = 'Earlier this year';
      } else if (itemDate > lastYear) {
        groupKey = 'Previous year';
      } else {
        groupKey = 'Earlier';
      }

      result[groupKey].push(item);
    });
  }

  return result;
});

const sortedGroupKeys = computed(() => {
  if (props.group_by.key === 'fc_name') {
    return ['0-9', 'A-H', 'I-P', 'Q-Z'];
  } else if (props.group_by.key === 'fc_ts') {
    return ['Yesterday', 'Earlier this week', 'Last week', 'Last month', 'Earlier this year', 'Previous year', 'Earlier'];
  }
  return [];
});

watchEffect(() => {
  Object.keys(groupedData.value).forEach(group => {
    console.log(`${group}: ${groupedData.value[group].length}`);
  });
});
</script>

<style scoped>
.message-display {
  font-size: 1.5em;
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

.group {
  margin-bottom: 20px;
}

.group-heading {
  cursor: pointer;
  user-select: none;
}

.group h3 {
  margin-bottom: 10px;
}
</style>
