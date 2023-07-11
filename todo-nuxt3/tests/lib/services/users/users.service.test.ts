import { describe, expect, test, afterEach, beforeEach } from 'vitest';

import { UsersService } from '../../../../src/lib/services/users/users.service';
import { joiAdapter } from '../../../../src/lib/adapters/validator/joi/joi.adapter';
import prismaClient from '../../../../src/lib/db/prisma/prisma-client.singleton';
import { bCryptAdapter } from '../../../../src/lib/adapters/hasher/bcrypt/bcrypt.adapter';
import { jsonWebTokenAdapter } from '../../../../src/lib/adapters/jwt-token-broker/jsonwebtoken/jsonwebtoken.adapter';
import { AddNewUserOptions } from '../../../../src/lib/services/users/interfaces/add-new-user-options.interface';
import teardownDatabase from '../../../../tests/teardown-database.helper';
import { LoginUserOptions } from '../../../../src/lib/services/users/interfaces/login-user-options.interface';

const usersService = new UsersService(
  prismaClient.client,
  joiAdapter,
  bCryptAdapter,
  jsonWebTokenAdapter
);

describe('UsersService: general', () => {
  test('Should be a valid instance', () => {
    expect(usersService).toBeInstanceOf(UsersService);
  });
});

describe('UsersService: methods', () => {
  describe('addNewUser()', () => {
    describe('Un-persistent branches', () => {
      test('Should return validation errors if validation fails', async () => {
        const invalidUser: AddNewUserOptions = {
          email: 'foo@bar.com',
          password: 'nya',
          confirmPassword: 'nya',
        };

        const [, error] = await usersService.addNewUser(invalidUser);

        expect(error).toBeDefined();
        expect(Array.isArray(error)).toBe(true);
      });
    });

    describe('Persistent branches', () => {
      afterEach(async () => {
        await teardownDatabase();
      });
      test('Should persist a new user into the database upon passing all validation', async () => {
        const validUserData: AddNewUserOptions = {
          email: 'foo@bar.com',
          password: 'cool-password',
          confirmPassword: 'cool-password',
        };

        const [newUser] = await usersService.addNewUser(validUserData);

        expect(newUser).toBeDefined();
        expect(newUser?.id).toBeDefined();
        expect(newUser?.email).toBe(validUserData.email);
        expect(newUser?.password).not.toBe(validUserData.password);
      });
    });
  });

  describe('loginUser()', () => {
    describe('Un-persistent branches', () => {
      test('Should return validation errors if validation fails', async () => {
        const invalidUser: LoginUserOptions = {
          email: 'foo@bar.com',
          password: 'nya',
        };

        const [, error] = await usersService.loginUser(invalidUser);

        expect(error).toBeDefined();
        expect(Array.isArray(error)).toBe(true);
      });

      test('Should return an error if user is not present in the database', async () => {
        const unknownUser: LoginUserOptions = {
          email: 'unknown@mystery.com',
          password: 'intriguing-man',
        };

        const [, error] = await usersService.loginUser(unknownUser);

        expect(error).toBeDefined();
        expect((error! as Error).message).toBe(
          `User with email ${unknownUser.email} was not found`
        );
      });
    });

    describe('Persistent branches', () => {
      beforeEach(async () => {
        const user: AddNewUserOptions = {
          email: 'foo@bar.com',
          password: 'correct-password',
          confirmPassword: 'correct-password',
        };
        await usersService.addNewUser(user);
      });

      afterEach(async () => {
        await teardownDatabase();
      });

      test('Should return an error if user entered the wrong password', async () => {
        const wrongPasswordUser: LoginUserOptions = {
          email: 'foo@bar.com',
          password: 'wrong-password',
        };

        const [, error] = await usersService.loginUser(wrongPasswordUser);

        expect(error).toBeDefined();
        expect((error! as Error).message).toBe('Wrong credentials');
      });

      test('Should return a fresh token upon credential verification', async () => {
        const correctUser: LoginUserOptions = {
          email: 'foo@bar.com',
          password: 'correct-password',
        };

        const [token] = await usersService.loginUser(correctUser);

        expect(typeof token).toBe('string');
      });
    });
  });

  describe('getUserPayloadFromToken()', () => {
    describe('Un-persistent branches', () => {
      test('Should return undefined if token is faulty or expired', () => {
        const expiredToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2ODFjN2RjLTFlM2EtNGFhZi1iYTI0LWExNWRlMzk3ZTMyMyIsImVtYWlsIjoiZm9vQGJhci5jb20iLCJpYXQiOjE2ODg2Njg0MzgsImV4cCI6MTY4ODY2ODQ0MH0.mZUaGhHlfN05B8crswqIvi2SV2UCLf_QIu-Cue3iXxg';

        const user = usersService.getUserPayloadFromToken(expiredToken);
        expect(user).toBeUndefined();
      });
    });

    describe('Persistent branches', () => {
      beforeEach(async () => {
        const user: AddNewUserOptions = {
          email: 'foo@bar.com',
          password: 'correct-password',
          confirmPassword: 'correct-password',
        };
        await usersService.addNewUser(user);
      });

      afterEach(async () => {
        await teardownDatabase();
      });

      test('Should return user payload if token is verified', async () => {
        const credentials = {
          email: 'foo@bar.com',
          password: 'correct-password',
        };

        const [token] = await usersService.loginUser(credentials);
        const user = usersService.getUserPayloadFromToken(token!);

        expect(user?.email).toBe(credentials.email);
      });
    });
  });
});
