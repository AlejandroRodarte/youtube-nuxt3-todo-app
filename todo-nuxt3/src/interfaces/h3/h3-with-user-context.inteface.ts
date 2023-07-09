import { H3Event } from 'h3';

import { UserTokenPayload } from '../../lib/services/users/interfaces/user-token-payload.interface';

export interface H3WithUserContext extends H3Event {
  context: {
    [key: string]: any;
    user?: UserTokenPayload;
  }
}
