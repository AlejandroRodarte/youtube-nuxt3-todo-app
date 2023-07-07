<template>
  <div class="space-y-6">
    <todo-item v-for="item in props.items" :key="item.id" :todo="item" />
  </div>
</template>

<script lang="ts" setup>
import { Todo } from '../../store/todo/interfaces/todo.interface';

const props = defineProps<{
  items: Todo[];
}>();
</script>
