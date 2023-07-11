import Joi from 'joi';

import { DeleteTodoOptions } from '../../../../../lib/services/todos/interfaces/delete-todo-options.interface';

const deleteTodoOptionsSchema = Joi.object<DeleteTodoOptions>({
  id: Joi.string().required(),
  ownerId: Joi.string().required(),
}).required();

export default deleteTodoOptionsSchema;
