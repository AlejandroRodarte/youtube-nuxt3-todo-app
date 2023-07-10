import { AuthForm } from '../../components/auth/interfaces/auth-form.interface';
import { UsersCreatePostResponse } from '../routes/users/create/interfaces/users-create-post-response.interface';
import { UsersLoginPostResponse } from '../routes/users/login/interfaces/users-login-post-response.interface';

const useUsersService = () => {
  // method 1: register user
  const register = async (form: AuthForm): Promise<string | undefined> => {
    const url = '/api/users/create';

    // try to create new user
    const { data: response } = await useFetch<UsersCreatePostResponse>(url, {
      method: 'POST',
      body: form,
    });

    // if there is an error array, return first error message
    if (response.value?.error) {
      const [firstError] = response.value.error;
      return firstError.message;
    }

    return undefined;
  };

  // method 2: login user
  const login = async (
    form: Omit<AuthForm, 'confirmPassword'>
  ): Promise<string | undefined> => {
    const url = '/api/users/login';

    // try to login user
    const { data: response } = await useFetch<UsersLoginPostResponse>(url, {
      method: 'POST',
      body: form,
    });

    // if there is an error array, return first error message
    if (response.value?.error) {
      const [firstError] = response.value.error;
      return firstError.message;
    }

    // user logged in
    return undefined;
  };

  return { register, login };
};

export default useUsersService;
