import { describe, expect, test } from 'vitest';

import loginUserOptionsSchema from '../../../../../../src/lib/object-validation/joi/schemas/users/login-user-options.schema';
import { LoginUserOptions } from '../../../../../../src/lib/services/users/interfaces/login-user-options.interface';

describe('LoginUserOptionsSchema', () => {
  test('Should return validation errors if new user email is invalid', () => {
    const invalidUserData: LoginUserOptions = {
      email: 'not-an-email',
      password: 'cool-password',
    };
    const results = loginUserOptionsSchema.validate(invalidUserData);
    const { details } = results.error!;
    const [emailError] = details;

    expect(emailError.path).toStrictEqual(['email']);
  });

  test('Should return validation errors if password is too short', () => {
    const invalidUserData: LoginUserOptions = {
      email: 'foo@bar.com',
      password: 'short',
    };
    const results = loginUserOptionsSchema.validate(invalidUserData);
    const { details } = results.error!;
    const [passwordError] = details;

    expect(passwordError.path).toStrictEqual(['password']);
  });
});
