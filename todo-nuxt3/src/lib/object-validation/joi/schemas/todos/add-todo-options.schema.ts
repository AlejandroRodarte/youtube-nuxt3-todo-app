import Joi from 'joi';

import { AddTodoOptions } from '../../../../../lib/services/todos/interfaces/add-todo-options.interface';

const addTodoOptionsSchema = Joi.object<AddTodoOptions>({
  ownerId: Joi.string().required(),
  label: Joi.string().max(255).required(),
}).required();

export default addTodoOptionsSchema;
