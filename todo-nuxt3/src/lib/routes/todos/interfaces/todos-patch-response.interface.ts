import { Todo } from '@prisma/client';

import { ValidationErrorItem } from '../../../types/joi/validation-error-item.type';

export interface TodosPatchResponse {
  data: { todo: Todo } | undefined;
  error: ValidationErrorItem[] | undefined;
}
