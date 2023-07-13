<template>
  <div class="space-y-6">
    <todo-item
      v-for="item in props.items"
      :key="item.id"
      :todo="item"
      @delete="onTodoItemDelete"
      @update="onTodoItemUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
import { Todo } from '../../store/todo/interfaces/todo.interface';
import { UpdateEmitPayload } from './interfaces/update-emit-payload.interface';

const props = defineProps<{
  items: Todo[];
}>();

const emit = defineEmits<{
  update: [payload: UpdateEmitPayload];
  delete: [id: string];
}>();

const onTodoItemDelete = (id: string) => emit('delete', id);
const onTodoItemUpdate = (payload: UpdateEmitPayload) =>
  emit('update', payload);
</script>
