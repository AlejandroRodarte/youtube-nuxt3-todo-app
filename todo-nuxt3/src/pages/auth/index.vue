<template>
  <div class="min-h-screen w-full bg-gray-100">
    <section id="auth-form">
      <auth-form
        v-model:form="authFormData"
        :loading="authFormLoading"
        :error="authFormError"
        :action="authFormAction"
        @submit="onAuthFormSubmit"
        @action-done="onAuthFormActionDone"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { AuthForm as IAuthForm } from '../../components/auth/interfaces/auth-form.interface';
import { AuthSignModes } from '../../components/auth/types/auth-sign-modes.type';
import { AuthFormAction } from '../../components/auth/types/auth-form-action.type';
import useUsersService from '../../lib/composables/use-users-service.composable';

const router = useRouter();

// internal state (not exposed to template)
let authFormErrorTimeoutId: NodeJS.Timeout | undefined = undefined;

const initialAuthFormState: IAuthForm = {
  email: '',
  password: '',
  confirmPassword: '',
};

// external state (exposed to template)
const authFormData = useState('auth-form-data', () => initialAuthFormState);
const authFormLoading = useState('auth-form-loading', () => false);
const authFormError = useState('auth-form-error', () => '');
const authFormAction = useState<AuthFormAction | undefined>(() => undefined);

// custom composable: users service
const usersService = useUsersService();

// method 1: what to do when auth form gets submitted
const onAuthFormSubmit = async (mode: AuthSignModes) => {
  switch (mode) {
    // users signs up: if no error, move to sign-in template within <auth-form>
    case 'sign-up': {
      const error = await usersService.register(authFormData.value);
      if (!error) {
        authFormAction.value = 'toggle-sign-in';
        authFormData.value = initialAuthFormState;
      } else authFormError.value = error;
      break;
    }
    // users signs in: if no error, move user to to-do list page
    case 'sign-in': {
      const error = await usersService.login({
        email: authFormData.value.email,
        password: authFormData.value.password,
      });
      if (!error) {
        authFormData.value = initialAuthFormState;
        router.replace('/');
      } else authFormError.value = error;
      break;
    }
    default:
      break;
  }
};

// method 2: what to do when <auth-form> concludes its action
const onAuthFormActionDone = () => (authFormAction.value = undefined);

// watch error string: if set, clear after 3 seconds
watch(authFormError, (value) => {
  if (authFormErrorTimeoutId) {
    clearTimeout(authFormErrorTimeoutId);
    authFormErrorTimeoutId = undefined;
    return;
  }
  if (value) {
    authFormErrorTimeoutId = setTimeout(() => {
      authFormError.value = '';
    }, 3000);
  }
});
</script>
