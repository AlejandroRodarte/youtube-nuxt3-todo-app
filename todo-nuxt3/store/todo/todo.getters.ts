import { TodoGetters } from './interfaces/todo-getters.interface';
import { TodoStore } from './types/todo-store.type';

type Getters = TodoGetters & ThisType<TodoStore>;

const getters: Getters = {
  getById(state) {
    return (id) => state.items.find((todo) => todo.id === id);
  },

  getOrderedTodos(state) {
    return [...state.items].sort(
      (todoA, todoB) => todoA.createdAt.getTime() - todoB.createdAt.getTime()
    );
  },
};

export default getters;
