import Joi from 'joi';

import { GetTodosByOwnerIdOptions } from '../../../../../lib/services/todos/interfaces/get-todos-by-owner-id.interface';

const getTodosByOwnerIdOptionsSchema = Joi.object<GetTodosByOwnerIdOptions>({
  ownerId: Joi.string().required(),
}).required();

export default getTodosByOwnerIdOptionsSchema;
