interface TodoAdd {
  newTodo: {
    title: string;
  }
}

interface TodoDelete {
  selectedTodo: {
    id: string;
  }
}

interface TodoUpdate {
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
