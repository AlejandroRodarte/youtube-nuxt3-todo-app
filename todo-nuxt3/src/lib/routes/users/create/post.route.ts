import { H3Event } from 'h3';

import { UsersCreatePostResponse } from './interfaces/users-create-post-response.interface';
import { AddNewUserOptions } from '../../../../lib/services/users/interfaces/add-new-user-options.interface';
import { usersService } from '../../../../lib/services/users/users.service';

const handler = async (event: H3Event): Promise<UsersCreatePostResponse> => {
  const body = (await readBody(event)) as AddNewUserOptions;
  const [newUser, error] = await usersService.addNewUser(body);

  if (error) {
    if (error instanceof Error) {
      return {
        data: undefined,
        error: [{ path: 'db', message: error.message, value: '' }],
      };
    } else return { data: undefined, error };
  }

  return { data: { user: newUser! }, error: undefined };
};

export default handler;
