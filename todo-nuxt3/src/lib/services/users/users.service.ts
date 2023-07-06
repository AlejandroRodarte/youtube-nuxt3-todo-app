import { PrismaClient, User } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { joiAdapter } from '../../../lib/adapters/validator/joi/joi.adapter';
import { bCryptAdapter } from '../../../lib/adapters/hasher/bcrypt/bcrypt.adapter';
import { HasherAdapter } from '../../../lib/adapters/hasher/interfaces/hasher-adapter.interface';
import { ValidatorAdapter } from '../../adapters/validator/interfaces/validator-adapter.interface';
import addNewUserOptionsSchema from '../../../lib/object-validation/joi/schemas/users/add-new-user-options.schema';
import prismaClient from '../../db/prisma/prisma-client.singleton';
import { AddNewUserOptions } from './interfaces/add-new-user-options.interface';
import { LoginUserOptions } from './interfaces/login-user-options.interface';
import { DataErrorTuple } from '../../../types/tuples/data-error.tuple.type';
import { asyncWrapper } from '../../../lib/helpers/wrappers/async.wrapper';
import loginUserOptionsSchema from '../../../lib/object-validation/joi/schemas/users/login-user-options.schema';
import { JwtTokenBrokerAdapter } from '../../../lib/adapters/jwt-token-broker/interfaces/jwt-token-broker-adapter.interface';
import { jsonWebTokenAdapter } from '../../../lib/adapters/jwt-token-broker/jsonwebtoken/jsonwebtoken.adapter';
import { UserTokenPayload } from './interfaces/user-token-payload.interface';
import { ValidationErrorItem } from '../../../types/joi/validation-error-item.type';

export class UsersService {
  constructor(
    private db: PrismaClient,
    private validator: ValidatorAdapter,
    private hasher: HasherAdapter,
    private jwtTokenBroker: JwtTokenBrokerAdapter
  ) {}

  async addNewUser(
    options: AddNewUserOptions
  ): Promise<DataErrorTuple<User, Error | ValidationErrorItem[]>> {
    const [validationErrors, joiError] = this.validator.validate({
      object: options,
      strategy: { joi: { schema: addNewUserOptionsSchema } },
    });
    if (joiError) return [undefined, joiError];
    if (validationErrors) return [undefined, validationErrors];

    const [hashedPassword, bCryptError] = await this.hasher.hash({
      plainText: options.password,
    });
    if (!hashedPassword || bCryptError) return [undefined, bCryptError];

    const [newUser, dbError] = await asyncWrapper(async () => {
      return this.db.user.create({
        data: {
          id: uuid(),
          email: options.email,
          password: hashedPassword,
        },
      });
    });
    if (dbError) return [undefined, dbError];

    return [newUser, undefined];
  }

  async loginUser(
    options: LoginUserOptions
  ): Promise<DataErrorTuple<string, Error | ValidationErrorItem[]>> {
    const [validationErrors, joiError] = this.validator.validate({
      object: options,
      strategy: { joi: { schema: loginUserOptionsSchema } },
    });
    if (joiError) return [undefined, joiError];
    if (validationErrors) return [undefined, validationErrors];

    const [foundUser, dbFindError] = await asyncWrapper(async () => {
      return this.db.user.findUnique({ where: { email: options.email } });
    });
    if (dbFindError) return [undefined, dbFindError];
    if (!foundUser)
      return [
        undefined,
        new Error(`User with email ${options.email} was not found`),
      ];

    const [arePasswordsEqual, bCryptError] = await this.hasher.compare({
      plainText: options.password,
      hashedText: foundUser.password,
    });

    if (bCryptError) return [undefined, bCryptError];
    if (!arePasswordsEqual) return [undefined, new Error('Wrong credentials')];

    const token = this.jwtTokenBroker.create<UserTokenPayload>({
      payload: {
        id: foundUser.id,
        email: foundUser.email,
      },
    });

    return [token, undefined];
  }
}

export const usersService = new UsersService(
  prismaClient.client,
  joiAdapter,
  bCryptAdapter,
  jsonWebTokenAdapter
);
