<template>
  <!-- Main Auth Form Container -->
  <div class="mx-auto max-w-lg p-10">
    <!-- Auth Form -->
    <form @submit.prevent class="rounded-md bg-white p-5 shadow-md">
      <!-- Header -->
      <h1 class="mb-4 text-center text-2xl font-bold text-gray-700 md:text-3xl">
        Login to your account
      </h1>
      <!-- Inputs Container -->
      <div class="mb-4 flex flex-col items-center space-y-4">
        <input
          type="text"
          :name="inputNames.email"
          id="email"
          placeholder="Email Address"
          size="1"
          class="w-full rounded-md border border-blue-200 px-4 py-2 focus:border-blue-400 focus:outline-none"
          @input="onInputChange"
        />
        <input
          type="password"
          :name="inputNames.password"
          id="password"
          placeholder="Password"
          size="1"
          class="w-full rounded-md border border-blue-200 px-4 py-2 focus:border-blue-400 focus:outline-none"
          @input="onInputChange"
        />
        <input
          v-if="canConfirmPasswordInputBeDisplayed"
          type="password"
          :name="inputNames.confirmPassword"
          id="confirm-password"
          placeholder="Confirm Password"
          size="1"
          class="w-full rounded-md border border-blue-200 px-4 py-2 focus:border-blue-400 focus:outline-none"
          @input="onInputChange"
        />
      </div>
      <!-- Submit Button, Error Text, and Sign-In/Sign-Up Toggle Container -->
      <div class="flex flex-col items-center space-y-4">
        <button
          type="submit"
          class="transition-color w-full rounded-sm bg-blue-400 py-4 text-white duration-200 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-gray-400"
          :disabled="loading"
          @click="onSubmit"
        >
          Authorize
        </button>
        <a
          class="transition-color cursor-pointer text-sm underline duration-200 hover:text-gray-600"
          @click="onToggleClick"
          >{{ toggleText }}</a
        >
        <p class="text-sm text-red-400" v-if="error">{{ error }}</p>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { AuthForm } from './interfaces/auth-form.interface';
import { AuthSignModes } from './types/auth-sign-modes.type';

const props = defineProps<{
  form: AuthForm;
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  submit: [mode: AuthSignModes];
  'update:form': [form: AuthForm];
}>();

// names for the HTML inputs of the auth form
const inputNames = {
  email: 'email',
  password: 'password',
  confirmPassword: 'confirm-password',
};

// object that maps HTML input names to the related property key
// in the "AuthForm" interface
const inputNameToAuthFormKeyMapper: {
  [inputName: string]: keyof AuthForm;
} = {
  [inputNames.email]: 'email',
  [inputNames.password]: 'password',
  [inputNames.confirmPassword]: 'confirmPassword',
};

// local state 1: current sign mode (sign-in or sign-up)
const authSignMode = useState<AuthSignModes>('auth-sign-mode', () => 'sign-in');

// computed property 1: flag that decides if the "Confirm Password" input
// can be rendered or not
const canConfirmPasswordInputBeDisplayed = computed(
  () => authSignMode.value === 'sign-up'
);

// computer property 2: toggle dynamic text
const toggleText = computed(() =>
  authSignMode.value === 'sign-in'
    ? "Don't have an account? Register here!"
    : 'Already have an account? Login instead!'
);

// method 1: what to do if toggle link gets clicked?
const onToggleClick = () => {
  if (authSignMode.value === 'sign-in') authSignMode.value = 'sign-up';
  else authSignMode.value = 'sign-in';
};

// method 2: what to do if an input in the form changes?
const onInputChange = (e: Event) => {
  const target = <HTMLInputElement>e.target;
  const inputName = target.name;
  const newValue = target.value;
  emit('update:form', {
    ...props.form,
    [inputNameToAuthFormKeyMapper[inputName]]: newValue,
  });
};

// method 3: what to do if the "Authorize" button gets pressed
const onSubmit = () => {
  emit('submit', authSignMode.value);
};
</script>