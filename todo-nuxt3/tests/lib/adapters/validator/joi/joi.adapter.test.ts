import { describe, test, expect } from 'vitest';

import { JoiAdapter } from '../../../../../src/lib/adapters/validator/joi/joi.adapter';
import { AddNewUserOptions } from '../../../../../src/lib/services/users/interfaces/add-new-user-options.interface';
import addNewUserOptionsSchema from '../../../../../src/lib/object-validation/joi/schemas/users/add-new-user-options.schema';

const joiAdapter = new JoiAdapter();

describe('JoiAdapter: methods', () => {
  describe('validate()', () => {
    test('Should throw an error if joi-specific data is not provided', () => {
      const userData: AddNewUserOptions = {
        email: 'foo@bar.com',
        password: 'cool-password',
        confirmPassword: 'cool-password',
      };

      const [validationErrors, joiError] = joiAdapter.validate({
        object: userData,
        strategy: {},
      });

      expect(joiError).toBeInstanceOf(Error);
    });

    test('Should return nothing if tested object passes schema validation', () => {
      const validUserData: AddNewUserOptions = {
        email: 'foo@bar.com',
        password: 'cool-password',
        confirmPassword: 'cool-password',
      };

      const [validationErrors] = joiAdapter.validate({
        object: validUserData,
        strategy: { joi: { schema: addNewUserOptionsSchema } },
      });

      expect(validationErrors).toBeUndefined();
    });

    test('Should return a normalized array of validation errors if tested object fails schema validation', () => {
      const invalidUserData: AddNewUserOptions = {
        email: 'foo@bar.com',
        password: 'super-cool-password',
        confirmPassword: 'not-the-same',
      };

      const [validationErrors] = joiAdapter.validate({
        object: invalidUserData,
        strategy: { joi: { schema: addNewUserOptionsSchema } },
      });

      expect(validationErrors).toBeDefined();
      expect(validationErrors?.length).toBe(1);

      const [validationError] = validationErrors!;

      expect(typeof validationError.message).toBe('string');
      expect(typeof validationError.path).toBe('string');
      expect(validationError.value).toBeDefined();
    });
  });
});
