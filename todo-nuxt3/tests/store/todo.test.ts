import { setActivePinia, createPinia } from 'pinia';
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  vi,
} from 'vitest';
import { v4 as uuid } from 'uuid';

import useTodoStore from '../../src/store/todo/todo.store';
import { TodoStore } from '../../src/store/todo/types/todo-store.type';
import {
  TodoAdd,
  TodoDelete,
  TodoUpdate,
} from '../../src/store/todo/interfaces/todo-actions.interface';
import { Todo } from '../../src/store/todo/interfaces/todo.interface';
import { todosService } from '../../src/lib/services/client/todos/todos.service';
import todosServiceMockImplementations from './helpers/todos-service-mock-implementations.helper';
import { TodosGetResponse } from '~/lib/services/client/todos/interfaces/todos-get-response.interface';
import { TodosPatchResponse } from '~/lib/services/client/todos/interfaces/todos-patch-response.interface';

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

const addTodoPayload: TodoAdd = {
  newTodo: {
    title: 'new todo item',
  },
};

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
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getTodos()', async () => {
    test('Should not do anything if todosService fails', async () => {
      const spy = vi
        .spyOn(todosService, 'getTodos')
        .mockImplementation(todosServiceMockImplementations.error);

      const error = await todoStore.getTodos();

      expect(spy).toHaveBeenCalled();
      expect(error!.message).toBe('email must be an email');

      expect(todoStore.items.length).toBe(0);
    });

    test('Should populate store if todosService succeds', async () => {
      const spy = vi.spyOn(todosService, 'getTodos').mockImplementation(
        async (): Promise<[TodosGetResponse['data'], undefined]> => [
          {
            todos: [
              {
                id: '1',
                ownerId: '1',
                label: 'bang stacy',
                done: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: '2',
                ownerId: '1',
                label: 'bang brittany',
                done: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
          undefined,
        ]
      );

      const error = await todoStore.getTodos();

      expect(error).toBeUndefined();
      expect(todoStore.items.length).toBe(2);

      const [todo1, todo2] = todoStore.items;

      expect(todo1.title).toBe('bang stacy');
      expect(todo2.title).toBe('bang brittany');
    });
  });

  describe('addTodo()', async () => {
    test('Should not add anything to the store and return error message if todosService fails', async () => {
      const spy = vi
        .spyOn(todosService, 'addTodo')
        .mockImplementation(todosServiceMockImplementations.error);

      const error = await todoStore.addTodo(addTodoPayload);

      expect(spy).toHaveBeenCalledWith({
        label: addTodoPayload.newTodo.title,
      });
      expect(error!.message).toBe('email must be an email');
      expect(todoStore.items.length).toBe(0);
    });

    test('Should add a todo item to the list upon when todosService succeeds', async () => {
      const spy = vi
        .spyOn(todosService, 'addTodo')
        .mockImplementation(todosServiceMockImplementations.success.addTodo);

      const error = await todoStore.addTodo(addTodoPayload);

      expect(error).toBeUndefined();
      expect(todoStore.items.length).toBe(1);

      const [savedTodo] = todoStore.items;

      expect(savedTodo.id).toEqual('1');
      expect(savedTodo.title).toBe(addTodoPayload.newTodo.title);
    });
  });

  describe('deleteTodo()', () => {
    test('Should not delete anything from the store, and return error message if todosService fails', async () => {
      const addTodoSpy = vi
        .spyOn(todosService, 'addTodo')
        .mockImplementation(todosServiceMockImplementations.success.addTodo);
      const deleteTodoSpy = vi
        .spyOn(todosService, 'deleteTodo')
        .mockImplementation(todosServiceMockImplementations.error);

      await todoStore.addTodo(addTodoPayload);

      const [{ id: todoId }] = todoStore.items;
      const deleteTodoPayload: TodoDelete = {
        selectedTodo: {
          id: todoId,
        },
      };
      const error = await todoStore.deleteTodo(deleteTodoPayload);

      expect(deleteTodoSpy).toHaveBeenCalledWith({
        id: deleteTodoPayload.selectedTodo.id,
      });
      expect(error!.message).toBe('email must be an email');
      expect(todoStore.items.length).toBe(1);

      const [todo1] = todoStore.items;

      expect(todo1.id).toBe('1');
    });

    test('Should remove a todo item by its id when todosService succeeds', async () => {
      const addTodoSpy = vi
        .spyOn(todosService, 'addTodo')
        .mockImplementation(todosServiceMockImplementations.success.addTodo);
      const deleteTodoSpy = vi
        .spyOn(todosService, 'deleteTodo')
        .mockImplementation(
          async (): Promise<[undefined, undefined]> => [undefined, undefined]
        );

      await todoStore.addTodo(addTodoPayload);

      const [{ id: todoId }] = todoStore.items;
      const deleteTodoPayload: TodoDelete = {
        selectedTodo: {
          id: todoId,
        },
      };
      const error = await todoStore.deleteTodo(deleteTodoPayload);

      expect(error).toBeUndefined();
      expect(todoStore.items.length).toBe(0);
      const nonexistentTodo = todoStore.getById(todoId);
      expect(nonexistentTodo).toBeUndefined();
    });
  });

  describe('updateTodo()', async () => {
    test('Should not update todo item in store and return error if todosService fails', async () => {
      const addTodoSpy = vi
        .spyOn(todosService, 'addTodo')
        .mockImplementation(todosServiceMockImplementations.success.addTodo);
      const updateTodoSpy = vi
        .spyOn(todosService, 'updateTodo')
        .mockImplementation(todosServiceMockImplementations.error);

      await todoStore.addTodo(addTodoPayload);

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
      const error = await todoStore.updateTodo(updateTodoPayload);

      expect(updateTodoSpy).toHaveBeenCalledWith({
        id: updateTodoPayload.selectedTodo.id,
        done: updateTodoPayload.updates.done,
        label: updateTodoPayload.updates.title,
      });
      expect(error!.message).toBe('email must be an email');

      const [nonUpdatedTodo] = todoStore.items;

      expect(nonUpdatedTodo.done).not.toBe(updateTodoPayload.updates.done);
      expect(nonUpdatedTodo.title).not.toBe(updateTodoPayload.updates.title);
    });

    test('Should update all possible properties in an existing todo item by its id when todosService succeeds', async () => {
      const addTodoSpy = vi
        .spyOn(todosService, 'addTodo')
        .mockImplementation(todosServiceMockImplementations.success.addTodo);
      const updateTodoSpy = vi
        .spyOn(todosService, 'updateTodo')
        .mockImplementation(
          async (): Promise<[TodosPatchResponse['data'], undefined]> => [
            {
              todo: {
                id: '1',
                ownerId: '1',
                label: 'New name for my todo',
                done: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
            undefined,
          ]
        );

      await todoStore.addTodo(addTodoPayload);

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
      const error = await todoStore.updateTodo(updateTodoPayload);

      expect(error).toBeUndefined();

      const updatedTodo = todoStore.getById(savedTodo.id);

      expect(updatedTodo!.title).toBe(updateTodoPayload.updates.title);
      expect(updatedTodo!.done).toBe(updateTodoPayload.updates.done);
    });
  });
});

describe('useTodoStore: getters', () => {
  test('Should retrieve a todo item by its id upon calling getById()', async () => {
    const addTodoSpy = vi
      .spyOn(todosService, 'addTodo')
      .mockImplementation(todosServiceMockImplementations.success.addTodo);

    await todoStore.addTodo(addTodoPayload);

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
