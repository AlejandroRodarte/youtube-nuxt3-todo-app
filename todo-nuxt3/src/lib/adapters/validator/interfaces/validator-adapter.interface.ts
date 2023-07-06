import { ValidateOptions } from './validate-options.interface';
import { ValidationErrorItem } from '../../../../types/joi/validation-error-item.type';
import { DataErrorTuple } from '../../../../types/tuples/data-error.tuple.type';

export interface ValidatorAdapter {
  validate<T>(options: ValidateOptions<T>): DataErrorTuple<ValidationErrorItem[] | undefined, Error>;
}
