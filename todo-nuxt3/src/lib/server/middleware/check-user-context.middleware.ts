import { H3WithUserContext } from '../../../lib/interfaces/h3/h3-with-user-context.inteface';
import { ValidationErrorItem } from '../../../lib/types/joi/validation-error-item.type';

const checkUserContext = (
  event: H3WithUserContext
): ValidationErrorItem[] | undefined => {
  if (!event.context.user)
    return [{ path: 'auth', message: 'No auth token found', value: '/auth' }];
  return undefined;
};

export default checkUserContext;
