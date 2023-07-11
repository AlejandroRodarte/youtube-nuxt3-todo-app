import { describe, expect, test } from 'vitest';

import { GetTodosByOwnerIdOptions } from '../../../../../../src/lib/services/todos/interfaces/get-todos-by-owner-id.interface';
import getTodosByOwnerIdOptionsSchema from '../../../../../../src/lib/object-validation/joi/schemas/todos/get-todos-by-owner-id-options.schema';
import { v4 as uuid } from 'uuid';

describe('getTodosByOwnerIdOptionsSchema', () => {
  test('Should return validation errors if ownerId is not present', () => {
    const invalidTodoData: Omit<GetTodosByOwnerIdOptions, 'ownerId'> = {};
    const results = getTodosByOwnerIdOptionsSchema.validate(invalidTodoData);
    const { details } = results.error!;
    const [ownerIdError] = details;

    expect(ownerIdError.path).toStrictEqual(['ownerId']);
  });

  test('Should pass validation is object is fine', () => {
    const validTodoData: GetTodosByOwnerIdOptions = {
      ownerId: uuid(),
    };
    const results = getTodosByOwnerIdOptionsSchema.validate(validTodoData);

    expect(results.error).toBeUndefined();
  });
});
