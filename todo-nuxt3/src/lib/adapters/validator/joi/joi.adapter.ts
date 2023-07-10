import { ValidateOptions } from '../interfaces/validate-options.interface';
import { ValidatorAdapter } from '../interfaces/validator-adapter.interface';
import { ValidationErrorItem } from '../../../types/joi/validation-error-item.type';
import { DataErrorTuple } from '../../../types/tuples/data-error.tuple.type';

export class JoiAdapter implements ValidatorAdapter {
  validate<T>(
    options: ValidateOptions<T>
  ): DataErrorTuple<ValidationErrorItem[] | undefined, Error> {
    if (!options.strategy.joi) {
      const joiError = new Error(
        'Please add a Joi schema for the strategy to work'
      );
      return [undefined, joiError];
    }
    const results = options.strategy.joi!.schema.validate(options.object);
    if (!results.error) return [undefined, undefined];
    const validationErrorItems: ValidationErrorItem[] =
      results.error.details.map((joiItem) => ({
        path: joiItem.path.join('.'),
        message: joiItem.message,
        value: joiItem.context?.value,
      }));
    return [validationErrorItems, undefined];
  }
}

export const joiAdapter = new JoiAdapter();
