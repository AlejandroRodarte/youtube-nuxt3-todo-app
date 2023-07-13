import { TodoActions } from './interfaces/todo-actions.interface';
import { TodoStore } from './types/todo-store.type';
import { todosService } from '../../lib/services/client/todos/todos.service';

type Actions = TodoActions & ThisType<TodoStore>;

const actions: Actions = {
  async getTodos() {
    const [response, error] = await todosService.getTodos();

    if (!error) {
      this.items = response!.todos.map((todo) => {
        const { label: title, updatedAt, createdAt, ...rest } = todo;
        return {
          ...rest,
          title,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
        };
      });
      return undefined;
    } else {
      const [firstError] = error;
      return firstError;
    }
  },

  async addTodo(payload) {
    const [response, error] = await todosService.addTodo({
      label: payload.newTodo.title,
    });
    if (!error) {
      const { label, createdAt, updatedAt, ...rest } = response!.todo;
      this.items.push({
        ...rest,
        title: label,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      });
      return undefined;
    } else {
      const [firstError] = error;
      return firstError;
    }
  },

  async deleteTodo(payload) {
    const [, error] = await todosService.deleteTodo({
      id: payload.selectedTodo.id,
    });

    if (!error) {
      this.items = this.items.filter(
        (todo) => todo.id !== payload.selectedTodo.id
      );
      return undefined;
    } else {
      const [firstError] = error;
      return firstError;
    }
  },

  async updateTodo(payload) {
    const [response, error] = await todosService.updateTodo({
      id: payload.selectedTodo.id,
      label: payload.updates.title,
      done: payload.updates.done,
    });

    if (!error) {
      const { label, createdAt, updatedAt, ...rest } = response!.todo;
      const todoIndex = this.items.findIndex(
        (todo) => todo.id === payload.selectedTodo.id
      );
      if (todoIndex === -1)
        return {
          path: 'store',
          message: 'Todo item not found in store',
          value: '',
        };
      this.items[todoIndex] = {
        ...rest,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        title: label,
      };
      return undefined;
    } else {
      const [firstError] = error;
      return firstError;
    }
  },
};

export default actions;
