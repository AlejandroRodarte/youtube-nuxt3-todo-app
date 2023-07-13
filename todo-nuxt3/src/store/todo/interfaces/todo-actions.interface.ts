import { ValidationErrorItem } from '../../../lib/types/joi/validation-error-item.type';

export interface TodoAdd {
  newTodo: {
    title: string;
  };
}

export interface TodoDelete {
  selectedTodo: {
    id: string;
  };
}

export interface TodoUpdate {
  selectedTodo: {
    id: string;
  };
  updates: {
    title?: string;
    done?: boolean;
  };
}

export interface TodoActions {
  getTodos(): Promise<ValidationErrorItem | undefined>;
  addTodo(payload: TodoAdd): Promise<ValidationErrorItem | undefined>;
  deleteTodo(payload: TodoDelete): Promise<ValidationErrorItem | undefined>;
  updateTodo(payload: TodoUpdate): Promise<ValidationErrorItem | undefined>;
}
