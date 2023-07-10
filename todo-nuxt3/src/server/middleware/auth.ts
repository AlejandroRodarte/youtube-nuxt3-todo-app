import { getCookie } from 'h3';

import { usersService } from '../../lib/services/users/users.service';
import { H3WithUserContext } from '../../interfaces/h3/h3-with-user-context.inteface';

export default defineEventHandler((event: H3WithUserContext) => {
  const cookie = getCookie(event, 'nuxt3-todo-token');
  if (!cookie) return;

  const user = usersService.getUserPayloadFromToken(cookie);
  if (!user) return;
  event.context.user = user;
});
