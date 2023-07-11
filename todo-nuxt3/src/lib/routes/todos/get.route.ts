import checkUserContext from '../../../lib/server/middleware/check-user-context.middleware';
import { H3WithUserContext } from '../../../lib/interfaces/h3/h3-with-user-context.inteface';
import { TodosGetResponse } from './interfaces/todos-get-response.interface';
import { todosService } from '../../../lib/services/todos/todos.service';

const handler = async (event: H3WithUserContext): Promise<TodosGetResponse> => {
  await checkUserContext(event);

  const [todos, error] = await todosService.getTodosByOwnerId({
    ownerId: event.context.user!.id,
  });

  if (error) {
    if (error instanceof Error) {
      return {
        data: undefined,
        error: [{ path: 'db', message: error.message, value: '' }],
      };
    } else return { data: undefined, error };
  }

  return { data: { todos: todos! }, error: undefined };
};

export default handler;
