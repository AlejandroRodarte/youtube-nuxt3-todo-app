import Joi from 'joi';

import { AddNewUserOptions } from '../../../../../lib/services/users/interfaces/add-new-user-options.interface';

const addNewUserOptionsSchema = Joi.object<AddNewUserOptions>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
}).required();

export default addNewUserOptionsSchema;
