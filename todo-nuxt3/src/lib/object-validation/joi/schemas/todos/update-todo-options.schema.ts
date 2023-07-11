import Joi from 'joi';

import { UpdateTodoOptions } from '../../../../../lib/services/todos/interfaces/update-todo-options.interface';

const updateTodoOptionsSchema = Joi.object<UpdateTodoOptions>({
  id: Joi.string().required(),
  ownerId: Joi.string().required(),
  label: Joi.string().max(255).optional(),
  done: Joi.boolean().optional(),
}).required();

export default updateTodoOptionsSchema;
