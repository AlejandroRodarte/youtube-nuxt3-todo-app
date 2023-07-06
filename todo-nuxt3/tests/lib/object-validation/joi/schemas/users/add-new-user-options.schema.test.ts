import { describe, expect, test } from 'vitest';

import addNewUserOptionsSchema from '../../../../../../src/lib/object-validation/joi/schemas/users/add-new-user-options.schema';
import { AddNewUserOptions } from '../../../../../../src/lib/services/users/interfaces/add-new-user-options.interface';

describe('AddNewUserOptionsSchema', () => {
  test('Should return validation errors if new user email is invalid', () => {
    const invalidUserData: AddNewUserOptions = {
      email: 'not-an-email',
      password: 'cool-password',
      confirmPassword: 'cool-password',
    };
    const results = addNewUserOptionsSchema.validate(invalidUserData);
    const { details } = results.error!;
    const [emailError] = details;

    expect(emailError.path).toStrictEqual(['email']);
  });

  test('Should return validation errors if password is too short', () => {
    const invalidUserData: AddNewUserOptions = {
      email: 'foo@bar.com',
      password: 'short',
      confirmPassword: 'short',
    };
    const results = addNewUserOptionsSchema.validate(invalidUserData);
    const { details } = results.error!;
    const [passwordError] = details;

    expect(passwordError.path).toStrictEqual(['password']);
  });

  test('Should return validation errors if confirmed password does not match password', () => {
    const invalidUserData: AddNewUserOptions = {
      email: 'foo@bar.com',
      password: 'cool-password',
      confirmPassword: 'coolpassword',
    };
    const results = addNewUserOptionsSchema.validate(invalidUserData);
    const { details } = results.error!;
    const [confirmPasswordError] = details;

    expect(confirmPasswordError.path).toStrictEqual(['confirmPassword']);
  });
});
