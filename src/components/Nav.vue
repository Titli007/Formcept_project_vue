<template>
  <div class="nav">
    <input
      type="text"
      v-model="query"
      placeholder="Search"
      @input="onSearch"
    />
    <div class="sort-by">
      <label for="sort">Sort By</label>
      <select v-model="sortBy" @change="onSort">
        <option value="none">None</option>
        <option value="fc_name">Name</option>
        <option value="fc_ts">Date</option>
      </select>
      <select v-model="sortOrder" @change="onSort">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
    <div class="group-by">
      <label for="group">Group By</label>
      <select v-model="groupBy" @change="onGroup">
        <option value="none">None</option>
        <option value="fc_name">Text</option>
        <option value="fc_ts">Date</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const query = ref('');
const sortBy = ref('none');
const sortOrder = ref('asc');
const groupBy = ref('none');

const emit = defineEmits(['search', 'sort', 'group']);

const onSearch = () => {
  emit('search', query.value);
};

const onSort = () => {
  emit('sort', { sortBy: sortBy.value, sortOrder: sortOrder.value });
};

const onGroup = () => {
  emit('group', groupBy.value);
};

// Watchers to emit events immediately when the user changes the values
watch(query, onSearch);
watch(sortBy, onSort);
watch(sortOrder, onSort);
watch(groupBy, onGroup);
</script>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav input[type="text"] {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
}

.sort-by,
.group-by {
  display: flex;
  align-items: center;
  gap: 5px;
}

.sort-by select,
.group-by select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.sort-by label,
.group-by label {
  margin-right: 5px;
}
</style>
