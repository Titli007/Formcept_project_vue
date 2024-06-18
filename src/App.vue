<template>
  <div>
    <Nav @search="handleFilter" @sort="handleSort" @group="handleGroup_by" />
    <Cards_list :data="data" :filter="filter" :sort="sort" :group_by="group_by"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Nav from './components/Nav.vue';
import Cards_list from './components/Cards_list.vue';
import type { Data, Filter, Sort, Group_by } from '../propTypes/Cards_list_props';

const data = ref<Data[]>([]); // Define data as an array of Data
const filter = ref<Filter>({ value: '' });
const sort = ref<Sort>({ sort: '', key: 'none' });
const group_by = ref<Group_by>({ key: 'none' });

onMounted(async () => {
  try {
    const res = await axios.get('/sample_data.json');
    data.value = res.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    console.log('Fetch attempt finished');
  }
});

const handleFilter = (query: string) => {
  console.log(query)
  filter.value.value = query;
};

const handleSort = ({ sortBy: newSortKey, sortOrder: newSortOrder }: { sortBy: string; sortOrder: string }) => {
  console.log(newSortOrder, newSortKey)
  sort.value.sort = newSortOrder;
  sort.value.key = newSortKey;
};

const handleGroup_by = (key: string) => {
  console.log(key)
  group_by.value.key = key;
};
</script>
