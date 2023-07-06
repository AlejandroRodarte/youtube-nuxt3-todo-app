import Joi from 'joi';

import { LoginUserOptions } from '../../../../../lib/services/users/interfaces/login-user-options.interface';

const loginUserOptionsSchema = Joi.object<LoginUserOptions>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
}).required();

export default loginUserOptionsSchema;
