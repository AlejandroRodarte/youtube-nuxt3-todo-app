import { H3Event } from 'h3';

import { usersService } from '../../../../lib/services/users/users.service';
import { UsersLoginPostResponse } from './interfaces/users-login-post-response.interface';
import { LoginUserOptions } from '../../../../lib/services/users/interfaces/login-user-options.interface';
import { MILLIS_EXPIRES_IN } from '../../../constants/jwt-token-broker/millis-expires-in.constant';

const handler = async (event: H3Event): Promise<UsersLoginPostResponse> => {
  const body = (await readBody(event)) as LoginUserOptions;
  const [token, error] = await usersService.loginUser(body);

  if (error) {
    if (error instanceof Error) {
      return {
        data: undefined,
        error: [{ path: 'db', message: error.message, value: '' }],
      };
    } else return { data: undefined, error };
  }

  setCookie(event, 'nuxt3-todo-token', token!, {
    expires: new Date(Date.now() + MILLIS_EXPIRES_IN),
  });

  return { data: { token: token! }, error: undefined };
};

export default handler;
