export interface TodoAdd {
  newTodo: {
    title: string;
  }
}

export interface TodoDelete {
  selectedTodo: {
    id: string;
  }
}

export interface TodoUpdate {
  selectedTodo: {
    id: string;
  },
  updates: {
    title?: string;
    done?: boolean;
  }
}

export interface TodoActions {
  addTodo(payload: TodoAdd): void;
  deleteTodo(payload: TodoDelete): void;
  updateTodo(payload: TodoUpdate): void;
}
