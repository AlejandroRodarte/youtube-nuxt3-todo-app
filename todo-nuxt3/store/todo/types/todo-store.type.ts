import { Store } from 'pinia';

import { TodoState } from '../interfaces/todo-state.interface';
import { TodoGetters } from '../interfaces/todo-getters.interface';
import { TodoActions } from '../interfaces/todo-actions.interface';

export type TodoStore = Store<'todo', TodoState, TodoGetters, TodoActions>;
