import checkUserContext from '../../../lib/server/middleware/check-user-context.middleware';
import { H3WithUserContext } from '../../../lib/interfaces/h3/h3-with-user-context.inteface';
import { TodosPatchResponse } from './interfaces/todos-patch-response.interface';
import { UpdateTodoOptions } from '../../../lib/services/todos/interfaces/update-todo-options.interface';
import { todosService } from '../../../lib/services/todos/todos.service';

const handler = async (
  event: H3WithUserContext
): Promise<TodosPatchResponse> => {
  await checkUserContext(event);

  const body = (await readBody(event)) as Omit<UpdateTodoOptions, 'ownerId'>;
  const [updatedTodo, error] = await todosService.updateTodo({
    ...body,
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

  return { data: { todo: updatedTodo! }, error: undefined };
};

export default handler;
