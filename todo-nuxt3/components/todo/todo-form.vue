<template>
  <form
    @submit.prevent="onSubmit"
    class="mx-auto mt-6 w-9/12 max-w-lg rounded-md bg-white px-12 py-5"
  >
    <div
      class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0"
    >
      <input
        type="text"
        class="flex-1 rounded-md border border-blue-200 px-4 py-2 focus:border-blue-400 focus:outline-none"
        :class="{ 'border-red-400': props.error }"
        placeholder="Add a todo"
        :value="props.form.title"
        @input="onTitleChange"
        size="1"
      />
      <button
        type="submit"
        class="whitespace-nowrap rounded-md border border-blue-200 px-2 py-2 transition-colors duration-200 hover:bg-blue-200"
      >
        Add Todo
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { TodoForm } from './interfaces/todo-form.interface';

// props type declarations with <script setup>
const props = defineProps<{
  error: boolean;
  form: TodoForm;
}>();

// emits type declarations with <script setup>
const emit = defineEmits<{
  save: [];
  'update:form': [form: TodoForm];
}>();

// method 1: code to run when title text input changes
const onTitleChange = (e: Event) => {
  const target = <HTMLInputElement>e.target;
  const newTitle = target.value;

  // update the form data at the parent with the new title
  emit('update:form', { ...props.form, title: newTitle });
};

// method 1: code to run when form is submitted
const onSubmit = () => {
  // trigger "save" event
  emit('save');
};
</script>
