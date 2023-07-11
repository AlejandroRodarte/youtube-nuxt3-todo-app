import checkUserContext from '../../../lib/server/middleware/check-user-context.middleware';
import { H3WithUserContext } from '../../../lib/interfaces/h3/h3-with-user-context.inteface';
import { TodosPostResponse } from './interfaces/todos-post-response.interface';
import { todosService } from '../../../lib/services/todos/todos.service';

const handler = async (
  event: H3WithUserContext
): Promise<TodosPostResponse> => {
  await checkUserContext(event);

  const body = (await readBody(event)) as { label: string };
  const [newTodo, error] = await todosService.addTodo({
    ownerId: event.context.user!.id,
    label: body.label,
  });

  if (error) {
    if (error instanceof Error) {
      return {
        data: undefined,
        error: [{ path: 'db', message: error.message, value: '' }],
      };
    } else return { data: undefined, error };
  }

  return { data: { todo: newTodo! }, error: undefined };
};

export default handler;
