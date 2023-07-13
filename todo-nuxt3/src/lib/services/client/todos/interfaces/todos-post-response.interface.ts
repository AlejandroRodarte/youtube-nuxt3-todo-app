import { SerializedTodo } from './serialized-todo.interface';
import { ValidationErrorItem } from '../../../../types/joi/validation-error-item.type';

export interface TodosPostResponse {
  data: { todo: SerializedTodo } | undefined;
  error: ValidationErrorItem[] | undefined;
}
