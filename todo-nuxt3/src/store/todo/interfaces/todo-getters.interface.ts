import { Todo } from './todo.interface';
import { TodoState } from './todo-state.interface';
import { PiniaGetterAdaptor } from '../../../lib/types/pinia/pinia-getter-adaptor.type';

interface TodoBasicGetters {
  getById: (id: string) => Todo | undefined;
  getOrderedTodos: Todo[];
}

export type TodoGetters = PiniaGetterAdaptor<TodoState, TodoBasicGetters>;
