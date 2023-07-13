<template>
  <div class="min-h-screen w-full bg-gray-100">
    <section id="navbar">
      <nav class="flex justify-center pt-5">
        <a
          class="cursor-pointer whitespace-nowrap rounded-md border border-blue-200 px-2 py-2 transition-colors duration-200 hover:bg-blue-200"
          @click="onLogout"
          >Logout</a
        >
      </nav>
    </section>
    <section id="heading" class="pt-7 text-center">
      <h1 class="text-4xl text-gray-800">What are we doing today?</h1>
      <h2 class="text-2xl text-red-300">{{ localError }}</h2>
    </section>
    <section id="form">
      <todo-form
        v-model:form="todoFormData"
        :error="todoFormError"
        @save="onTodoFormSave"
      />
    </section>
    <section id="todo-list" class="mt-6" v-if="orderedTodoList.length > 0">
      <todo-list
        :items="orderedTodoList"
        @delete="onTodoListDelete"
        @update="onTodoListUpdate"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import useTodoStore from '../store/todo/todo.store';
import { TodoForm as ITodoForm } from '../components/todo/interfaces/todo-form.interface';
import { TodoAdd } from '../store/todo/interfaces/todo-actions.interface';
import { UpdateEmitPayload } from '../components/todo/interfaces/update-emit-payload.interface';

// before anything else: fetch todos asynchronously; runs always on server
await useAsyncData('todos', async () => {
  const error = await todoStore.getTodos();
  if (error && error.path === 'auth') navigateTo(error.value);
});

const router = useRouter();

// non-template-related variables: store, error timeout instances, and initial form values
const todoStore = useTodoStore();
let localErrorTimeoutId: NodeJS.Timeout | undefined = undefined;
let todoFormErrorTimeoutId: NodeJS.Timeout | undefined = undefined;
const initialTodoFormState: ITodoForm = {
  title: '',
};

// template-related variables: local error, form data and error flag
const localError = useState('index.vue/local-error', () => '');
const todoFormData = useState('todo-form-data', () => initialTodoFormState);
const todoFormError = useState('todo-form-error', () => false);

// computed property 1: ordered todos from store
const orderedTodoList = computed(() => todoStore.getOrderedTodos);

// method 1: code to run when "save" event is emitted from <todo-form>
const onTodoFormSave = async (): Promise<void> => {
  // if title is empty, set error flag
  if (!todoFormData.value.title.length) {
    todoFormError.value = true;
    return;
  }

  // if title is fine, add todo item to list via pinia action
  const addTodoPayload: TodoAdd = {
    newTodo: todoFormData.value,
  };

  // try to save todo in database
  const error = await todoStore.addTodo(addTodoPayload);

  // if auth error, redirect to login page, or set error message
  if (error) {
    if (error.path === 'auth') router.replace(error.value);
    else localError.value = error.message;
  } else todoFormData.value = initialTodoFormState;
};

// method 2: code to run when user logs out: delete cookie and go to /auth page
const onLogout = () => {
  const cookie = useCookie('nuxt3-todo-token');
  if (cookie.value) {
    cookie.value = null;
    router.replace('/auth');
  }
};

// method 3: what to do when a todo item wants to be deleted
const onTodoListDelete = async (id: string): Promise<void> => {
  // try and delete the todo item
  const error = await todoStore.deleteTodo({ selectedTodo: { id } });

  // if auth error, redirect to login page, or set error message
  if (error) {
    if (error.path === 'auth') router.replace(error.value);
    else localError.value = error.message;
  }
};

// method 4: what to do when a todo item wants to be updated
const onTodoListUpdate = async (payload: UpdateEmitPayload): Promise<void> => {
  const { id: todoId, ...updates } = payload;

  // try and update the item
  const error = await todoStore.updateTodo({
    selectedTodo: { id: todoId },
    updates,
  });

  // if auth error, redirect to login page, or set error message
  if (error) {
    if (error.path === 'auth') router.replace(error.value);
    else localError.value = error.message;
  }
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

watch(localError, (value) => {
  if (localErrorTimeoutId) {
    clearTimeout(localErrorTimeoutId);
    localErrorTimeoutId = undefined;
    return;
  }

  if (value) {
    localErrorTimeoutId = setTimeout(() => {
      localError.value = '';
    }, 3000);
  }
});
</script>
