import { PiniaGetterAdaptor } from '../../types/pinia/pinia-getter-adaptor.type';
import { TodoGetters } from './interfaces/todo-getters.interface';
import { TodoStore } from './types/todo-store.type';

type Getters = PiniaGetterAdaptor<TodoGetters, TodoStore>;

const getters: Getters = {
  getById(state) {
    return (id) => state.items.find((todo) => todo.id === id);
  },

  getOrderedTodos(state) {
    return state.items.sort(
      (todoA, todoB) =>
        todoA.createdAt.getMilliseconds() - todoB.createdAt.getMilliseconds()
    );
  },
};

export default getters;
