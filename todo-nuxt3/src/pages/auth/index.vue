<template>
  <div class="min-h-screen w-full bg-gray-100">
    <section id="auth-form">
      <auth-form
        v-model:form="authFormData"
        :loading="authFormLoading"
        :error="authFormError"
        @submit="onAuthFormSubmit"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { AuthForm } from '../../components/auth/interfaces/auth-form.interface';
import { AuthSignModes } from '../../components/auth/types/auth-sign-modes.type';

export default {
  setup() {
    // internal state (not exposed to template)
    let authFormErrorTimeoutId: NodeJS.Timeout | undefined = undefined;

    const initialAuthFormState: AuthForm = {
      email: '',
      password: '',
      confirmPassword: '',
    };

    // external state (exposed to template)##
    const authFormData = useState('auth-form-data', () => initialAuthFormState);
    const authFormLoading = useState('auth-form-loading', () => false);
    const authFormError = useState('auth-form-error', () => '');

    // method 1: what to do when auth form gets submitted
    const onAuthFormSubmit = (mode: AuthSignModes) => {
      console.log('form submitted!');
      console.log('mode: ', mode);
      console.log('form data: ', authFormData.value);
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
      onAuthFormSubmit,
    };
  },
};
</script>
