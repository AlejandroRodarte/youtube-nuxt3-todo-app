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

<script lang="ts">
import { AuthForm } from '../../components/auth/interfaces/auth-form.interface';
import { UsersLoginPostResponse } from '../../lib/routes/users/login/interfaces/users-login-post-response.interface';
import { UsersCreatePostResponse } from '../../lib/routes/users/create/interfaces/users-create-post-response.interface';
import { AuthSignModes } from '../../components/auth/types/auth-sign-modes.type';
import { AuthFormAction } from '../../components/auth/types/auth-form-action.type';

export default {
  setup() {
    const router = useRouter();

    // internal state (not exposed to template)
    let authFormErrorTimeoutId: NodeJS.Timeout | undefined = undefined;

    const initialAuthFormState: AuthForm = {
      email: '',
      password: '',
      confirmPassword: '',
    };

    // external state (exposed to template)
    const authFormData = useState('auth-form-data', () => initialAuthFormState);
    const authFormLoading = useState('auth-form-loading', () => false);
    const authFormError = useState('auth-form-error', () => '');
    const authFormAction = useState<AuthFormAction | undefined>(
      () => undefined
    );

    // method 1: what to do when auth form gets submitted
    const onAuthFormSubmit = async (mode: AuthSignModes) => {
      switch (mode) {
        // users signs up: if no error, move to sign-in template within <auth-form>
        case 'sign-up': {
          const hadError = await register();
          if (!hadError) authFormAction.value = 'toggle-sign-in';
          break;
        }
        // users signs in: if no error, move user to to-do list page
        case 'sign-in': {
          const hadError = await login();
          if (!hadError) router.replace('/');
          break;
        }
        default:
          break;
      }
    };

    // method 2: what to do when <auth-form> concludes its action
    const onAuthFormActionDone = () => (authFormAction.value = undefined);

    // private method 1: register user
    const register = async (): Promise<boolean> => {
      const url = '/api/users/create';

      // try to create new user
      const { data: response } = await useFetch<UsersCreatePostResponse>(url, {
        method: 'POST',
        body: authFormData.value,
      });

      // if there is an error array, render first error message
      if (response.value?.error) {
        const [firstError] = response.value.error;
        authFormError.value = firstError.message;
        return true;
      }

      // user succesfully created: reset form
      authFormData.value = initialAuthFormState;
      return false;
    };

    // private method 2: register user
    const login = async (): Promise<boolean> => {
      const url = '/api/users/login';

      // try to login user
      const { data: response } = await useFetch<UsersLoginPostResponse>(url, {
        method: 'POST',
        body: {
          email: authFormData.value.email,
          password: authFormData.value.password,
        },
      });

      // if there is an error array, render first error message
      if (response.value?.error) {
        const [firstError] = response.value.error;
        authFormError.value = firstError.message;
        return true;
      }

      // user logged in: reset form
      authFormData.value = initialAuthFormState;
      return false;
    };

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

    return {
      authFormData,
      authFormLoading,
      authFormError,
      authFormAction,
      onAuthFormSubmit,
      onAuthFormActionDone,
    };
  },
};
</script>
