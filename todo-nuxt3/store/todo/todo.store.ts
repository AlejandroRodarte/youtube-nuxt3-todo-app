import { defineStore } from 'pinia';

import state from './todo.state';
import getters from './todo.getters';
import actions from './todo.actions';

const useTodoStore = defineStore('todo', {
  state,
  // avoid "index signature for type 'string' is missing" error
  // hacky solution; maybe there's a better way?
  getters: { ...getters },
  actions,
});

export default useTodoStore;
