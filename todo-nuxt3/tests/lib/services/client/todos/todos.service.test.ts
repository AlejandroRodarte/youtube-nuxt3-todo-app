import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import { nitroFetchAdapter } from '../../../../../src/lib/adapters/http/nitro-fetch/nitro-fetch-adapter.interface';
import { todosService } from '../../../../../src/lib/services/client/todos/todos.service';
import { AddTodoOptions } from '../../../../../src/lib/services/client/todos/interfaces/add-todo-options.interface';
import { DeleteTodoOptions } from '../../../../../src/lib/services/client/todos/interfaces/delete-todo-options.interface';
import { UpdateTodoOptions } from '../../../../../src/lib/services/client/todos/interfaces/update-todo-options.interface';
import { TodosGetResponse } from '../../../../../src/lib/services/client/todos/interfaces/todos-get-response.interface';
import { TodosPostResponse } from '../../../../../src/lib/services/client/todos/interfaces/todos-post-response.interface';
import { TodosPatchResponse } from '../../../../../src/lib/services/client/todos/interfaces/todos-patch-response.interface';
import { TodosDeleteResponse } from '../../../../../src/lib/services/client/todos/interfaces/todos-delete-response.interface';

describe('TodosService: methods', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getTodos()', () => {
    beforeAll(() => {
      // @ts-ignore(2339)
      global.useRequestHeaders = () => 'super-awesome-cookie';
    });

    afterAll(() => {
      // @ts-ignore(2339)
      global.useRequestHeaders = useRequestHeaders;
    });

    test('Should return network error if http client fails to make the request', async () => {
      const spy = vi
        .spyOn(nitroFetchAdapter, 'get')
        .mockImplementation(
          async (): Promise<[undefined, Error]> => [
            undefined,
            new Error('super-error'),
          ]
        );

      const [, error] = await todosService.getTodos();

      expect(spy).toHaveBeenCalled();
      expect(error).toBeDefined();

      const [firstError] = error!;

      expect(firstError.path).toBe('network');
    });

    test('Should return error items if http client responds with an error', async () => {
      const spy = vi.spyOn(nitroFetchAdapter, 'get').mockImplementation(
        async (): Promise<[TodosGetResponse, undefined]> => [
          {
            data: undefined,
            error: [
              {
                path: 'email',
                message: 'present a valid email',
                value: 'blah',
              },
            ],
          },
          undefined,
        ]
      );

      const [, error] = await todosService.getTodos();

      expect(error).toBeDefined();
      const [firstError] = error!;

      expect(firstError.path).toBe('email');
    });

    test('Should respond with todo items if http client is succesful with request', async () => {
      const spy = vi.spyOn(nitroFetchAdapter, 'get').mockImplementation(
        async (): Promise<[TodosGetResponse, undefined]> => [
          {
            data: {
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
            error: undefined,
          },
          undefined,
        ]
      );

      const [response] = await todosService.getTodos();

      expect(response).toBeDefined();

      const [todo1, todo2] = response!.todos;

      expect(todo1.label).toBe('bang stacy');
      expect(todo2.label).toBe('bang brittany');
    });
  });

  describe('addTodo()', () => {
    const addTodoOptions: AddTodoOptions = {
      label: 'bang stacy',
    };

    test('Should return network error if http client fails to make request', async () => {
      const spy = vi
        .spyOn(nitroFetchAdapter, 'post')
        .mockImplementation(
          async (): Promise<[undefined, Error]> => [
            undefined,
            new Error('super-error'),
          ]
        );

      const [, error] = await todosService.addTodo(addTodoOptions);

      expect(spy).toHaveBeenCalled();
      expect(error).toBeDefined();

      const [firstError] = error!;

      expect(firstError.path).toBe('network');
    });

    test('Should return error items if API responds with errors', async () => {
      const spy = vi.spyOn(nitroFetchAdapter, 'post').mockImplementation(
        async (): Promise<[TodosPostResponse, undefined]> => [
          {
            data: undefined,
            error: [
              {
                path: 'password',
                message: 'password is too short',
                value: 'my-dick',
              },
            ],
          },
          undefined,
        ]
      );

      const [, error] = await todosService.addTodo(addTodoOptions);

      expect(error).toBeDefined();
      const [firstError] = error!;

      expect(firstError.path).toBe('password');
    });

    test('Should return added todo item if API responds succesfully', async () => {
      const spy = vi.spyOn(nitroFetchAdapter, 'post').mockImplementation(
        async (): Promise<[TodosPostResponse, undefined]> => [
          {
            data: {
              todo: {
                id: '1',
                ownerId: '1',
                label: addTodoOptions.label,
                done: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
            error: undefined,
          },
          undefined,
        ]
      );

      const [response] = await todosService.addTodo(addTodoOptions);

      expect(response).toBeDefined();
      expect(response!.todo.label).toBe(addTodoOptions.label);
    });
  });

  describe('updateTodo()', () => {
    const updateTodoOptions: UpdateTodoOptions = {
      id: '1',
      done: true,
    };

    test('Should return network error if http client fails to make the request', async () => {
      const spy = vi
        .spyOn(nitroFetchAdapter, 'patch')
        .mockImplementation(
          async (): Promise<[undefined, Error]> => [
            undefined,
            new Error('super-error'),
          ]
        );

      const [, error] = await todosService.updateTodo(updateTodoOptions);

      expect(spy).toHaveBeenCalled();
      expect(error).toBeDefined();

      const [firstError] = error!;

      expect(firstError.path).toBe('network');
    });

    test('Should return error items if API responds with an error', async () => {
      const spy = vi.spyOn(nitroFetchAdapter, 'patch').mockImplementation(
        async (): Promise<[TodosPatchResponse, undefined]> => [
          {
            data: undefined,
            error: [
              {
                path: 'db',
                message: 'Todo item was not found, whore',
                value: '',
              },
            ],
          },
          undefined,
        ]
      );

      const [, error] = await todosService.updateTodo(updateTodoOptions);

      expect(error).toBeDefined();
      const [firstError] = error!;

      expect(firstError.path).toBe('db');
    });

    test('Should return updated todo item if API responds succesfully', async () => {
      const spy = vi.spyOn(nitroFetchAdapter, 'patch').mockImplementation(
        async (): Promise<[TodosPatchResponse, undefined]> => [
          {
            data: {
              todo: {
                id: updateTodoOptions.id,
                ownerId: '1',
                label: 'bang brittany',
                done: !!updateTodoOptions.done,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
            error: undefined,
          },
          undefined,
        ]
      );

      const [response] = await todosService.updateTodo(updateTodoOptions);

      expect(response).toBeDefined();
      expect(response!.todo.done).toBe(updateTodoOptions.done);
    });
  });

  describe('deleteTodo()', () => {
    const deleteTodoOptions: DeleteTodoOptions = {
      id: '1',
    };

    test('Should return network error if http fails to make request', async () => {
      const spy = vi
        .spyOn(nitroFetchAdapter, 'delete')
        .mockImplementation(
          async (): Promise<[undefined, Error]> => [
            undefined,
            new Error('super-error'),
          ]
        );

      const [, error] = await todosService.deleteTodo(deleteTodoOptions);

      expect(spy).toHaveBeenCalled();
      expect(error).toBeDefined();

      const [firstError] = error!;

      expect(firstError.path).toBe('network');
    });

    test('Shoud return error items if API responds with an error', async () => {
      const spy = vi.spyOn(nitroFetchAdapter, 'delete').mockImplementation(
        async (): Promise<[TodosPatchResponse, undefined]> => [
          {
            data: undefined,
            error: [
              {
                path: 'db',
                message: 'Todo item was not found, whore',
                value: '',
              },
            ],
          },
          undefined,
        ]
      );

      const [, error] = await todosService.deleteTodo(deleteTodoOptions);

      expect(error).toBeDefined();
      const [firstError] = error!;

      expect(firstError.path).toBe('db');
    });

    test('Should return nothing if API responds succesfully', async () => {
      const spy = vi.spyOn(nitroFetchAdapter, 'delete').mockImplementation(
        async (): Promise<[TodosDeleteResponse, undefined]> => [
          {
            data: undefined,
            error: undefined,
          },
          undefined,
        ]
      );

      const [response, error] = await todosService.deleteTodo(
        deleteTodoOptions
      );

      expect(response).toBeUndefined();
      expect(error).toBeUndefined();
    });
  });
});
