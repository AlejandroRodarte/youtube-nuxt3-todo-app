import { nitroFetchAdapter } from '../../../../lib/adapters/http/nitro-fetch/nitro-fetch-adapter.interface';
import { HttpAdapter } from '../../../../lib/adapters/http/interfaces/http-adapter.interface';
import { AddTodoOptions } from './interfaces/add-todo-options.interface';
import { UpdateTodoOptions } from './interfaces/update-todo-options.interface';
import { DeleteTodoOptions } from './interfaces/delete-todo-options.interface';
import { DataErrorTuple } from '../../../../lib/types/tuples/data-error.tuple.type';
import { ValidationErrorItem } from '../../../../lib/types/joi/validation-error-item.type';
import { TodosGetResponse } from './interfaces/todos-get-response.interface';
import { TodosPostResponse } from './interfaces/todos-post-response.interface';
import { TodosPatchResponse } from './interfaces/todos-patch-response.interface';
import { TodosDeleteResponse } from './interfaces/todos-delete-response.interface';

export class TodosService {
  constructor(private http: HttpAdapter) {}

  async getTodos(): Promise<
    DataErrorTuple<TodosGetResponse['data'], ValidationErrorItem[]>
  > {
    const [response, error] = await this.http.get<TodosGetResponse>({
      url: '/api/todos',
      details: { headers: useRequestHeaders(['cookie']) },
    });

    if (error)
      return [
        undefined,
        [{ path: 'network', message: error.message, value: '' }],
      ];
    if (response!.error) return [undefined, response!.error];
    return [response!.data!, undefined];
  }

  async addTodo(
    options: AddTodoOptions
  ): Promise<DataErrorTuple<TodosPostResponse['data'], ValidationErrorItem[]>> {
    const [response, error] = await this.http.post<
      AddTodoOptions,
      TodosPostResponse
    >({
      url: '/api/todos',
      body: options,
    });

    if (error)
      return [
        undefined,
        [{ path: 'network', message: error.message, value: '' }],
      ];
    if (response!.error) return [undefined, response!.error];
    return [response!.data!, undefined];
  }

  async updateTodo(
    options: UpdateTodoOptions
  ): Promise<
    DataErrorTuple<TodosPatchResponse['data'], ValidationErrorItem[]>
  > {
    const [response, error] = await this.http.patch<
      UpdateTodoOptions,
      TodosPatchResponse
    >({
      url: '/api/todos',
      body: options,
    });

    if (error)
      return [
        undefined,
        [{ path: 'network', message: error.message, value: '' }],
      ];
    if (response!.error) return [undefined, response!.error];
    return [response!.data!, undefined];
  }

  async deleteTodo(
    options: DeleteTodoOptions
  ): Promise<
    DataErrorTuple<TodosDeleteResponse['data'], ValidationErrorItem[]>
  > {
    const [response, error] = await this.http.delete<
      DeleteTodoOptions,
      TodosDeleteResponse
    >({
      url: '/api/todos',
      body: options,
    });

    if (error)
      return [
        undefined,
        [{ path: 'network', message: error.message, value: '' }],
      ];
    if (response!.error) return [undefined, response!.error];
    return [response!.data!, undefined];
  }
}

export const todosService = new TodosService(nitroFetchAdapter);
