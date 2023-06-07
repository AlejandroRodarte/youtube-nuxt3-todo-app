import { v4 as uuid } from 'uuid';

import Todo from './interfaces/todo.interface';
import { TodoActions } from './interfaces/todo-actions.interface';
import { TodoStore } from './types/todo-store.type';

type Actions = TodoActions & ThisType<TodoStore>;

const actions: Actions = {
  addTodo(payload) {
    const newTodo: Todo = {
      id: uuid(),
      title: payload.newTodo.title,
      done: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(newTodo);
  },

  deleteTodo(payload) {
    this.items = this.items.filter(
      (todo) => todo.id !== payload.selectedTodo.id
    );
  },

  updateTodo(payload) {
    const todoIndex = this.items.findIndex(
      (todo) => todo.id === payload.selectedTodo.id
    );
    if (todoIndex === -1) return;
    this.items[todoIndex] = {
      ...this.items[todoIndex],
      ...payload.updates,
      updatedAt: new Date(),
    };
  },
};

export default actions;
