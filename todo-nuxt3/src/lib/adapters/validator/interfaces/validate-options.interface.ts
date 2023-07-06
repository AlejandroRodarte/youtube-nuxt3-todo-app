import Joi from 'joi';

export interface ValidateOptions<T> {
  object: T;
  strategy: {
    joi?: {
      schema: Joi.ObjectSchema<T>;
    };
  };
}
