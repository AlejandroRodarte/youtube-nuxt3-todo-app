import { User } from '@prisma/client';
import { ValidationErrorItem } from '../../../../../types/joi/validation-error-item.type';

export interface UsersCreatePostResponse {
  data: { user: User } | undefined;
  error: ValidationErrorItem[] | undefined;
}
