import { Todo, User } from '@prisma/client';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { v4 as uuid } from 'uuid';

import { AddTodoOptions } from '../../../../src/lib/services/todos/interfaces/add-todo-options.interface';
import { todosService } from '../../../../src/lib/services/todos/todos.service';
import { AddNewUserOptions } from '../../../../src/lib/services/users/interfaces/add-new-user-options.interface';
import { usersService } from '../../../../src/lib/services/users/users.service';
import { UpdateTodoOptions } from '../../../../src/lib/services/todos/interfaces/update-todo-options.interface';
import teardownDatabase from '../../../teardown-database.helper';
import { DeleteTodoOptions } from '../../../../src/lib/services/todos/interfaces/delete-todo-options.interface';
import { GetTodosByOwnerIdOptions } from '../../../../src/lib/services/todos/interfaces/get-todos-by-owner-id.interface';

describe('TodosService: methods', () => {
  describe('getTodosByOwnerId()', () => {
    describe('Un-persistent branches', () => {
      test('Should throw an error if options fail validation', async () => {
        const options: Omit<GetTodosByOwnerIdOptions, 'ownerId'> = {};
        const [, validationErrors] = await todosService.getTodosByOwnerId(
          // @ts-ignore(2345)
          options
        );

        expect(validationErrors).toBeDefined();
        expect(Array.isArray(validationErrors)).toBe(true);
      });

      test('Should throw an error if the owner of the todo items is not found', async () => {
        const options: GetTodosByOwnerIdOptions = {
          ownerId: uuid(),
        };
        const [, error] = await todosService.getTodosByOwnerId(options);

        expect(error).toBeDefined();
        expect((error as Error).message).toBe(
          `User ${options.ownerId} not found in database`
        );
      });
    });

    describe('Persistent branches', () => {
      let users: User[] = [];
      let todos: Todo[] = [];

      beforeEach(async () => {
        users = [];
        todos = [];

        const usersOptions: AddNewUserOptions[] = [
          {
            email: 'foo@bar.com',
            password: 'cool-password',
            confirmPassword: 'cool-password',
          },
          {
            email: 'foo2@bar.com',
            password: 'cool-password',
            confirmPassword: 'cool-password',
          },
        ];

        for (const options of usersOptions) {
          const [savedUser] = await usersService.addNewUser(options);
          users.push(savedUser!);
        }

        const [firstUser, secondUser] = users;

        const todosOptions: AddTodoOptions[] = [
          {
            ownerId: firstUser.id,
            label: 'get cucked',
          },
          {
            ownerId: secondUser.id,
            label: 'get pregnant',
          },
          {
            ownerId: firstUser.id,
            label: 'claim alimony',
          },
          {
            ownerId: secondUser.id,
            label: 'hit wife',
          },
        ];

        for (const options of todosOptions) {
          const [savedTodo] = await todosService.addTodo(options);
          todos.push(savedTodo!);
        }
      });

      afterEach(async () => {
        await teardownDatabase();
      });

      test('Should fetch todo items for each user independently', async () => {
        const [firstUser, secondUser] = users;
        const [todo1, todo2, todo3, todo4] = todos;

        const [firstQuery] = await todosService.getTodosByOwnerId({
          ownerId: firstUser.id,
        });
        const [secondQuery] = await todosService.getTodosByOwnerId({
          ownerId: secondUser.id,
        });

        expect(firstQuery!.length).toBe(2);
        expect(secondQuery!.length).toBe(2);

        const firstQueryLabels = firstQuery!.map((todo) => todo.label);
        const secondQueryLabels = secondQuery!.map((todo) => todo.label);

        expect(firstQueryLabels.includes(todo1.label)).toBe(true);
        expect(firstQueryLabels.includes(todo3.label)).toBe(true);
        expect(secondQueryLabels.includes(todo2.label)).toBe(true);
        expect(secondQueryLabels.includes(todo4.label)).toBe(true);
      });
    });
  });

  describe('addTodo()', () => {
    describe('Un-persistent branches', () => {
      test('Should throw an error if options fail validation', async () => {
        const invalidTodo: AddTodoOptions = {
          ownerId: uuid(),
          label: Array(256)
            .map((_) => 'a')
            .join(''),
        };
        const [, validationErrors] = await todosService.addTodo(invalidTodo);

        expect(validationErrors).toBeDefined();
        expect(Array.isArray(validationErrors)).toBe(true);
      });

      test('Should throw an error if new todo is from a non-existent user', async () => {
        const invalidTodo: AddTodoOptions = {
          ownerId: uuid(),
          label: 'bang your mom',
        };
        const [todo, dbError] = await todosService.addTodo(invalidTodo);

        expect(dbError).toBeDefined();
        expect((dbError as Error).message).toBe(
          `User ${invalidTodo.ownerId} does not exist`
        );
      });
    });

    describe('Persistent branches', () => {
      let users: User[] = [];

      beforeEach(async () => {
        users = [];

        const userOptions: AddNewUserOptions = {
          email: 'foo@bar.com',
          password: 'cool-password',
          confirmPassword: 'cool-password',
        };
        const [user] = await usersService.addNewUser(userOptions);
        users.push(user!);
      });

      afterEach(async () => {
        await teardownDatabase();
      });

      test('Should return new todo item if everything is fine', async () => {
        const [user] = users;
        const validTodo: AddTodoOptions = {
          ownerId: user.id,
          label: 'bang your mom',
        };

        const [todo, dbError] = await todosService.addTodo(validTodo);

        expect(dbError).toBeUndefined();
        expect(typeof todo!.id).toBe('string');
        expect(todo!.ownerId).toBe(user.id);
        expect(todo!.label).toBe(validTodo.label);
        expect(todo!.done).toBe(false);
      });
    });
  });

  describe('updateTodo()', () => {
    describe('Un-persistent branches', () => {
      test('Should throw an error if options fail validation', async () => {
        const invalidTodo: UpdateTodoOptions = {
          id: uuid(),
          ownerId: uuid(),
          label: Array(256)
            .map((_) => 'a')
            .join(''),
        };
        const [, validationErrors] = await todosService.updateTodo(invalidTodo);

        expect(validationErrors).toBeDefined();
        expect(Array.isArray(validationErrors)).toBe(true);
      });
    });

    describe('Persistent branches', () => {
      let users: User[] = [];
      let todos: Todo[] = [];

      beforeEach(async () => {
        users = [];
        todos = [];

        const usersOptions: AddNewUserOptions[] = [
          {
            email: 'foo@bar.com',
            password: 'cool-password',
            confirmPassword: 'cool-password',
          },
          {
            email: 'foo2@bar.com',
            password: 'cool-password',
            confirmPassword: 'cool-password',
          },
        ];

        for (const options of usersOptions) {
          const [savedUser] = await usersService.addNewUser(options);
          users.push(savedUser!);
        }

        const [firstUser] = users;
        const todoOptions: AddTodoOptions = {
          ownerId: firstUser.id,
          label: 'get cucked',
        };

        const [savedTodo] = await todosService.addTodo(todoOptions);
        todos.push(savedTodo!);
      });

      afterEach(async () => {
        await teardownDatabase();
      });

      test('Should throw an error if user does not own the todo item', async () => {
        const [, secondUser] = users;
        const [firstTodo] = todos;
        const todoUpdates: UpdateTodoOptions = {
          id: firstTodo.id,
          ownerId: secondUser.id,
          done: true,
        };

        const [, error] = await todosService.updateTodo(todoUpdates);

        expect(error).toBeDefined();
        expect((error as Error).message).toBe('Todo item was not found');
      });

      test('Should return the updated todo if everything goes fine', async () => {
        const [firstUser] = users;
        const [firstTodo] = todos;
        const todoUpdates: UpdateTodoOptions = {
          id: firstTodo.id,
          ownerId: firstUser.id,
          label: 'fuck my cuckman',
          done: true,
        };

        const [updatedTodo, error] = await todosService.updateTodo(todoUpdates);

        expect(error).toBeUndefined();
        expect(updatedTodo!.label).toBe(todoUpdates.label);
        expect(updatedTodo!.done).toBe(todoUpdates.done);
      });
    });
  });

  describe('deleteTodo()', () => {
    describe('Un-persistent branches', () => {
      test('Should throw an error if options fail validation', async () => {
        const options: Omit<DeleteTodoOptions, 'id'> = {
          ownerId: uuid(),
        };

        // @ts-ignore(2345)
        const validationErrors = await todosService.deleteTodo(options);

        expect(validationErrors).toBeDefined();
        expect(Array.isArray(validationErrors)).toBe(true);
      });
    });

    describe('Persistent branches', () => {
      let users: User[] = [];
      let todos: Todo[] = [];

      beforeEach(async () => {
        users = [];
        todos = [];

        const usersOptions: AddNewUserOptions[] = [
          {
            email: 'foo@bar.com',
            password: 'cool-password',
            confirmPassword: 'cool-password',
          },
          {
            email: 'foo2@bar.com',
            password: 'cool-password',
            confirmPassword: 'cool-password',
          },
        ];

        for (const options of usersOptions) {
          const [savedUser] = await usersService.addNewUser(options);
          users.push(savedUser!);
        }

        const [firstUser] = users;
        const todoOptions: AddTodoOptions = {
          ownerId: firstUser.id,
          label: 'get cucked',
        };

        const [savedTodo] = await todosService.addTodo(todoOptions);
        todos.push(savedTodo!);
      });

      afterEach(async () => {
        await teardownDatabase();
      });

      test('Should throw an error if todo item does not belong to user', async () => {
        const [, secondUser] = users;
        const [firstTodo] = todos;

        const options: DeleteTodoOptions = {
          id: firstTodo.id,
          ownerId: secondUser.id,
        };

        const error = await todosService.deleteTodo(options);

        expect(error).toBeDefined();
        expect((error as Error).message).toBe('Todo item was not found');
      });

      test('Should return nothing if everything goes fine', async () => {
        const [firstUser] = users;
        const [firstTodo] = todos;

        const options: DeleteTodoOptions = {
          id: firstTodo.id,
          ownerId: firstUser.id,
        };

        const error = await todosService.deleteTodo(options);

        expect(error).toBeUndefined();
      });
    });
  });
});
