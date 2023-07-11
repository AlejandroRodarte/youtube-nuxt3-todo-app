import { PrismaClient, Todo } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import prismaClient from '../../db/prisma/prisma-client.singleton';
import { ValidatorAdapter } from '../../../lib/adapters/validator/interfaces/validator-adapter.interface';
import { joiAdapter } from '../../../lib/adapters/validator/joi/joi.adapter';
import addTodoOptionsSchema from '../../../lib/object-validation/joi/schemas/todos/add-todo-options.schema';
import { AddTodoOptions } from './interfaces/add-todo-options.interface';
import { DataErrorTuple } from '../../../lib/types/tuples/data-error.tuple.type';
import { ValidationErrorItem } from '../../../lib/types/joi/validation-error-item.type';
import { asyncWrapper } from '../../../lib/helpers/wrappers/async.wrapper';
import { UpdateTodoOptions } from './interfaces/update-todo-options.interface';
import updateTodoOptionsSchema from '../../../lib/object-validation/joi/schemas/todos/update-todo-options.schema';
import { DeleteTodoOptions } from './interfaces/delete-todo-options.interface';
import deleteTodoOptionsSchema from '../../../lib/object-validation/joi/schemas/todos/delete-todo-options.schema';
import { GetTodosByOwnerIdOptions } from './interfaces/get-todos-by-owner-id.interface';
import getTodosByOwnerIdOptionsSchema from '../../../lib/object-validation/joi/schemas/todos/get-todos-by-owner-id-options.schema';

export class TodosService {
  constructor(private db: PrismaClient, private validator: ValidatorAdapter) {}

  async getTodosByOwnerId(
    options: GetTodosByOwnerIdOptions
  ): Promise<DataErrorTuple<Todo[], Error | ValidationErrorItem[]>> {
    const [validationErrors, joiError] = this.validator.validate({
      object: options,
      strategy: { joi: { schema: getTodosByOwnerIdOptionsSchema } },
    });
    if (joiError) return [undefined, joiError];
    if (validationErrors) return [undefined, validationErrors];

    const [todos, dbError] = await asyncWrapper(async () => {
      return this.db.user.findFirst({ where: { id: options.ownerId } }).todos();
    });

    if (dbError) return [undefined, dbError];
    if (todos === null)
      return [
        undefined,
        new Error(`User ${options.ownerId} not found in database`),
      ];
    return [todos!, undefined];
  }

  async addTodo(
    options: AddTodoOptions
  ): Promise<DataErrorTuple<Todo, Error | ValidationErrorItem[]>> {
    const [validationErrors, joiError] = this.validator.validate({
      object: options,
      strategy: { joi: { schema: addTodoOptionsSchema } },
    });
    if (joiError) return [undefined, joiError];
    if (validationErrors) return [undefined, validationErrors];

    const [todo, dbError] = await asyncWrapper(async () => {
      const userExists = !!(await this.db.user.findFirst({
        where: { id: options.ownerId },
      }));
      if (!userExists)
        throw new Error(`User ${options.ownerId} does not exist`);

      return this.db.todo.create({
        data: {
          id: uuid(),
          label: options.label,
          ownerId: options.ownerId,
        },
      });
    });

    if (dbError) return [undefined, dbError];
    return [todo!, undefined];
  }

  async updateTodo(
    options: UpdateTodoOptions
  ): Promise<DataErrorTuple<Todo, Error | ValidationErrorItem[]>> {
    const [validationErrors, joiError] = this.validator.validate({
      object: options,
      strategy: { joi: { schema: updateTodoOptionsSchema } },
    });
    if (joiError) return [undefined, joiError];
    if (validationErrors) return [undefined, validationErrors];

    const { id: todoId, ownerId, ...updates } = options;

    const [todo, dbError] = await asyncWrapper(async () => {
      const batchPayload = await this.db.todo.updateMany({
        where: {
          AND: {
            id: todoId,
            ownerId,
          },
        },
        data: updates,
      });

      if (batchPayload!.count === 0) throw new Error('Todo item was not found');

      return this.db.todo.findFirst({ where: { id: todoId } });
    });

    if (dbError) return [undefined, dbError];
    return [todo!, undefined];
  }

  async deleteTodo(
    options: DeleteTodoOptions
  ): Promise<Error | ValidationErrorItem[] | undefined> {
    const [validationErrors, joiError] = this.validator.validate({
      object: options,
      strategy: { joi: { schema: deleteTodoOptionsSchema } },
    });
    if (joiError) return joiError;
    if (validationErrors) return validationErrors;

    const [, dbError] = await asyncWrapper(async () => {
      const batchPayload = await this.db.todo.deleteMany({
        where: {
          AND: options,
        },
      });

      if (batchPayload.count === 0) throw new Error('Todo item was not found');
    });
    if (dbError) return dbError;
  }
}

export const todosService = new TodosService(prismaClient.client, joiAdapter);
