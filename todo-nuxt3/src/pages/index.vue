<template>
  <div class="min-h-screen w-full bg-gray-100">
    <section id="heading" class="pt-7 text-center">
      <h1 class="text-4xl text-gray-800">What are we doing today?</h1>
    </section>
    <section id="form">
      <todo-form
        v-model:form="todoFormData"
        :error="todoFormError"
        @save="onTodoFormSave"
      />
    </section>
    <section id="todo-list" class="mt-6" v-if="todoList.length > 0">
      <todo-list :items="todoList" />
    </section>
  </div>
</template>

<script lang="ts">
import useTodoStore from '../store/todo/todo.store';
import { TodoForm } from '../components/todo/interfaces/todo-form.interface';
import { TodoAdd } from '../store/todo/interfaces/todo-actions.interface';

export default {
  setup() {
    // hidden variables from template: (1) store, (2) error timeout instance,
    // and (3) initial todo form state
    const todoStore = useTodoStore();
    let todoFormErrorTimeoutId: NodeJS.Timeout | undefined = undefined;
    const initialTodoFormState: TodoForm = {
      title: '',
    };

    // local state: form data and error flag
    const todoFormData = useState('todo-form-data', () => initialTodoFormState);
    const todoFormError = useState('todo-form-error', () => false);

    // computed property 1: ordered todos from store
    const todoList = computed(() => todoStore.getOrderedTodos);

    // method 1: code to run when "save" event is emitted from <todo-form>
    const onTodoFormSave = (): void => {
      // if title is empty, set error flag
      if (!todoFormData.value.title.length) {
        todoFormError.value = true;
        return;
      }

      // if title is fine, add todo item to list via pinia action
      const addTodoPayload: TodoAdd = {
        newTodo: todoFormData.value,
      };
      todoStore.addTodo(addTodoPayload);

      // reset form to its initial state
      todoFormData.value = initialTodoFormState;
    };

    // watch error flag
    watch(todoFormError, (value) => {
      // if there is an error timeout currently active, clear it
      if (todoFormErrorTimeoutId) {
        clearTimeout(todoFormErrorTimeoutId);
        todoFormErrorTimeoutId = undefined;
        return;
      }

      // if there is NOT an active error timeout, and the error flag is set,
      // set timeout to clear the flag after three seconds
      if (value) {
        todoFormErrorTimeoutId = setTimeout(() => {
          todoFormError.value = false;
        }, 3000);
      }
    });

    return {
      onTodoFormSave,
      todoFormData,
      todoFormError,
      todoList,
    };
  },
};
</script>
