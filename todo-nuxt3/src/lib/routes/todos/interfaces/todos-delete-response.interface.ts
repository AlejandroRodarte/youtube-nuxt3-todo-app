import { ValidationErrorItem } from '../../../types/joi/validation-error-item.type';

export interface TodosDeleteResponse {
  data: undefined;
  error: ValidationErrorItem[] | undefined;
}
