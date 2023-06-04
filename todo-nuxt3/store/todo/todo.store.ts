import { defineStore } from 'pinia';

import state from './todo.state';
import getters from './todo.getters';
import actions from './todo.actions';

const useTodoStore = defineStore('todo', {
  state,
  getters,
  actions,
});

export default useTodoStore;
