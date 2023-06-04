import Todo from './todo.interface';

export interface TodoGetters {
  getById: (id: string) => Todo | undefined;
  getOrderedTodos: Todo[];
}
