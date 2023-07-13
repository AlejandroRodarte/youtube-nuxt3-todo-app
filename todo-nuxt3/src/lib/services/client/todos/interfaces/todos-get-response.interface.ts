import { SerializedTodo } from './serialized-todo.interface';
import { ValidationErrorItem } from '../../../../types/joi/validation-error-item.type';

export interface TodosGetResponse {
  data: { todos: SerializedTodo[] } | undefined;
  error: ValidationErrorItem[] | undefined;
}
