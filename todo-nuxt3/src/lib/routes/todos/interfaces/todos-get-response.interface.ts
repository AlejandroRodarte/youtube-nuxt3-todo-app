import { Todo } from '@prisma/client';

import { ValidationErrorItem } from '../../../types/joi/validation-error-item.type';

export interface TodosGetResponse {
  data: { todos: Todo[] } | undefined;
  error: ValidationErrorItem[] | undefined;
}
