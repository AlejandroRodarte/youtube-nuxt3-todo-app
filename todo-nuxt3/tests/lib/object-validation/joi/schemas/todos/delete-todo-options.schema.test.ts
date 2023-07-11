import { describe, expect, test } from 'vitest';

import { DeleteTodoOptions } from '../../../../../../src/lib/services/todos/interfaces/delete-todo-options.interface';
import deleteTodoOptionsSchema from '../../../../../../src/lib/object-validation/joi/schemas/todos/delete-todo-options.schema';
import { v4 as uuid } from 'uuid';

describe('DeleteTodoOptionsSchema', () => {
  test('Should return validation errors if id is not present', () => {
    const invalidTodoData: Omit<DeleteTodoOptions, 'id'> = { ownerId: uuid() };
    const results = deleteTodoOptionsSchema.validate(invalidTodoData);
    const { details } = results.error!;
    const [idError] = details;

    expect(idError.path).toStrictEqual(['id']);
  });

  test('Should return validation errors if ownerId is not present', () => {
    const invalidTodoData: Omit<DeleteTodoOptions, 'ownerId'> = { id: uuid() };
    const results = deleteTodoOptionsSchema.validate(invalidTodoData);
    const { details } = results.error!;
    const [ownerIdError] = details;

    expect(ownerIdError.path).toStrictEqual(['ownerId']);
  });

  test('Should pass validation is object is fine', () => {
    const validTodoData: DeleteTodoOptions = {
      id: uuid(),
      ownerId: uuid(),
    };
    const results = deleteTodoOptionsSchema.validate(validTodoData);

    expect(results.error).toBeUndefined();
  });
});
