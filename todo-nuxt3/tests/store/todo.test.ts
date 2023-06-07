import { setActivePinia, createPinia } from 'pinia';
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
} from 'vitest';
import { v4 as uuid } from 'uuid';

import useTodoStore from '../../store/todo/todo.store';
import { TodoStore } from '../../store/todo/types/todo-store.type';
import {
  TodoAdd,
  TodoDelete,
  TodoUpdate,
} from '../../store/todo/interfaces/todo-actions.interface';
import Todo from '../../store/todo/interfaces/todo.interface';

let todoStore: TodoStore;

beforeAll(() => {
  // create fresh pinia and make it active so it is picked up
  // by any useStore() call
  setActivePinia(createPinia());
});

beforeEach(() => {
  todoStore = useTodoStore();
});

afterEach(() => {
  todoStore.$reset();
});

describe('useTodoStore: general', () => {
  test('Should create a todo store upon calling useTodoStore()', () => {
    const todoStore = useTodoStore();
    expect(todoStore).toBeDefined();
  });
});

describe('useTodoStore: state', () => {
  test('Should be initialized with an empty items array', () => {
    expect(todoStore.items).toStrictEqual([]);
  });
});

describe('useTodoStore: actions', () => {
  test('Should add a todo item to the list upon calling addTodo()', () => {
    const addTodoPayload: TodoAdd = {
      newTodo: {
        title: 'New todo item',
      },
    };
    todoStore.addTodo(addTodoPayload);

    expect(todoStore.items.length).toBe(1);

    const [savedTodo] = todoStore.items;

    expect(savedTodo.id).toBeDefined();
    expect(savedTodo.title).toBe(addTodoPayload.newTodo.title);
  });

  test('Should remove a todo item by its id upon calling deleteTodo()', () => {
    const addTodoPayload: TodoAdd = {
      newTodo: {
        title: 'New todo item',
      },
    };
    todoStore.addTodo(addTodoPayload);

    const [{ id: todoId }] = todoStore.items;
    const deleteTodoPayload: TodoDelete = {
      selectedTodo: {
        id: todoId,
      },
    };
    todoStore.deleteTodo(deleteTodoPayload);

    expect(todoStore.items.length).toBe(0);
    const nonexistentTodo = todoStore.getById(todoId);
    expect(nonexistentTodo).toBeUndefined();
  });

  test('Should update all possible properties in an existing todo item by its id upon calling updateTodo()', () => {
    const addTodoPayload: TodoAdd = {
      newTodo: {
        title: 'Todo item 1',
      },
    };
    todoStore.addTodo(addTodoPayload);

    const [savedTodo] = todoStore.items;
    expect(savedTodo.done).toBe(false);

    const updateTodoPayload: TodoUpdate = {
      selectedTodo: {
        id: savedTodo.id,
      },
      updates: {
        title: 'New name for my todo',
        done: true,
      },
    };
    todoStore.updateTodo(updateTodoPayload);

    const updatedTodo = todoStore.getById(savedTodo.id);
    expect(updatedTodo!.title).toBe(updateTodoPayload.updates.title);
    expect(updatedTodo!.done).toBe(updateTodoPayload.updates.done);
  });

  test('Should not update any todo item if id is not found on the list upon calling updateTodo()', () => {
    const addTodoPayload: TodoAdd = {
      newTodo: {
        title: 'Todo item 1',
      },
    };
    todoStore.addTodo(addTodoPayload);

    const updateTodoPayload: TodoUpdate = {
      selectedTodo: {
        id: 'non-existent-todo-item-id',
      },
      updates: {
        done: true,
      },
    };
    todoStore.updateTodo(updateTodoPayload);

    const [nonUpdatedTodo] = todoStore.items;
    expect(nonUpdatedTodo.done).not.toBe(true);
  });
});

describe('useTodoStore: getters', () => {
  test('Should retrieve a todo item by its id upon calling getById()', () => {
    const addTodoPayload: TodoAdd = {
      newTodo: {
        title: 'New todo item',
      },
    };
    todoStore.addTodo(addTodoPayload);

    const [savedTodo] = todoStore.items;
    const retrievedTodo = todoStore.getById(savedTodo.id);

    expect(retrievedTodo).toBeDefined();
    expect(savedTodo).toStrictEqual(retrievedTodo);
  });

  test('Should order the todo items by the "createdAt" field upon accessing getOrderedTodos without mutating the original state array', () => {
    const todoItems: Todo[] = [
      {
        id: uuid(),
        title: 'Todo 1',
        done: true,
        createdAt: new Date(2021, 2, 14),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        title: 'Todo 2',
        done: false,
        createdAt: new Date(2019, 2, 14),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        title: 'Todo 3',
        done: false,
        createdAt: new Date(2020, 2, 14),
        updatedAt: new Date(),
      },
    ];
    todoStore.items = todoItems;

    const orderedTodos = todoStore.getOrderedTodos;
    const [todo1, todo2, todo3] = orderedTodos;

    expect(todo1.createdAt.getFullYear()).toBe(2019);
    expect(todo2.createdAt.getFullYear()).toBe(2020);
    expect(todo3.createdAt.getFullYear()).toBe(2021);

    expect(todoStore.items).not.toStrictEqual(orderedTodos);
  });
});
