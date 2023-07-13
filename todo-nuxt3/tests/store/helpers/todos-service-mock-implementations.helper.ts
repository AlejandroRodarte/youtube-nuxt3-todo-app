import { TodosPostResponse } from '../../../src/lib/services/client/todos/interfaces/todos-post-response.interface';
import { ValidationErrorItem } from '../../../src/lib/types/joi/validation-error-item.type';

const todosServiceMockImplementations = {
  error: async (): Promise<[undefined, ValidationErrorItem[]]> => [
    undefined,
    [
      {
        path: 'email',
        message: 'email must be an email',
        value: 'foo',
      },
    ],
  ],
  success: {
    addTodo: async (): Promise<[TodosPostResponse['data'], undefined]> => [
      {
        todo: {
          id: '1',
          ownerId: '1',
          label: 'new todo item',
          done: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      undefined,
    ],
  },
};

export default todosServiceMockImplementations;
