<template>
  <!-- Main Todo Item Container -->
  <div
    class="mx-auto flex w-9/12 max-w-lg flex-col space-y-4 rounded-md bg-white px-10 py-6 shadow-md sm:flex-row sm:items-center sm:justify-between sm:space-x-6 sm:space-y-0"
  >
    <!-- Todo Title and Creation Date Container -->
    <div
      class="flex flex-col items-center overflow-hidden text-center sm:items-start sm:text-left"
    >
      <p class="text-2xl" :class="{ 'line-through': props.todo.done }">
        {{ props.todo.title }}
      </p>
      <span class="text-sm text-gray-400">{{ date }}</span>
    </div>
    <!-- Done-Undone/Delete Buttons Container -->
    <div class="mx-auto flex space-x-6 text-center sm:mx-0">
      <!-- Done-Undone Button Container -->
      <div
        class="flex cursor-pointer flex-col items-center text-green-300 transition-colors duration-200 hover:text-green-600"
        @click="onDoneToggle"
      >
        <check-circle-icon
          class="h-10 w-10"
          :class="{ 'text-green-600': props.todo.done }"
        />
        <span class="text-xs" :class="{ 'text-green-600': props.todo.done }">{{
          doneButtonLabel
        }}</span>
      </div>
      <!-- Delete Button Container -->
      <div
        class="flex cursor-pointer flex-col items-center text-red-300 transition-colors duration-200 hover:text-red-600"
        @click="onDelete"
      >
        <x-circle-icon class="h-10 w-10" />
        <span class="text-xs">Delete todo</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { XCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

import Todo from '../../store/todo/interfaces/todo.interface';
import useTodoStore from '../../store/todo/todo.store';
import {
  TodoDelete,
  TodoUpdate,
} from '../../store/todo/interfaces/todo-actions.interface';

const props = defineProps<{
  todo: Todo;
}>();

const todoStore = useTodoStore();

const date = computed(() =>
  new Intl.DateTimeFormat('en-US').format(new Date(props.todo.createdAt))
);

const doneButtonLabel = computed(() =>
  props.todo.done ? 'Mark as undone' : 'Mark as done'
);

const onDelete = () => {
  const todoId = props.todo.id;
  const deleteTodoPayload: TodoDelete = {
    selectedTodo: {
      id: todoId,
    },
  };
  todoStore.deleteTodo(deleteTodoPayload);
};

const onDoneToggle = () => {
  const todoId = props.todo.id;
  const updateTodoPayload: TodoUpdate = {
    selectedTodo: {
      id: todoId,
    },
    updates: {
      done: !props.todo.done,
    },
  };
  todoStore.updateTodo(updateTodoPayload);
};
</script>
