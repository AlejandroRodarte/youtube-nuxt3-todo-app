import checkUserContext from '../../../lib/server/middleware/check-user-context.middleware';
import { H3WithUserContext } from '../../../lib/interfaces/h3/h3-with-user-context.inteface';
import { TodosDeleteResponse } from './interfaces/todos-delete-response.interface';
import { todosService } from '../../../lib/services/todos/todos.service';

const handler = async (
  event: H3WithUserContext
): Promise<TodosDeleteResponse> => {
  await checkUserContext(event);

  const body = (await readBody(event)) as { id: string };
  const error = await todosService.deleteTodo({
    id: body.id,
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

  return { data: undefined, error: undefined };
};

export default handler;
