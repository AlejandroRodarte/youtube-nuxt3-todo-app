import { ValidationErrorItem } from '../../../../types/joi/validation-error-item.type';

export interface UsersLoginPostResponse {
  data: { token: string } | undefined;
  error: ValidationErrorItem[] | undefined;
}
