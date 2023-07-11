import { Todo } from '@prisma/client';

import { ValidationErrorItem } from '../../../types/joi/validation-error-item.type';

export interface TodosPostResponse {
  data: { todo: Todo } | undefined;
  error: ValidationErrorItem[] | undefined;
}
