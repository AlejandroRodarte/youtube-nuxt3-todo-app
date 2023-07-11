import { describe, expect, test } from 'vitest';

import { UpdateTodoOptions } from '../../../../../../src/lib/services/todos/interfaces/update-todo-options.interface';
import updateTodoOptionsSchema from '../../../../../../src/lib/object-validation/joi/schemas/todos/update-todo-options.schema';
import { v4 as uuid } from 'uuid';

describe('UpdateTodoOptionsSchema', () => {
  test('Should return validation errors if id is not present', () => {
    const invalidTodoData: Omit<UpdateTodoOptions, 'id'> = {
      ownerId: uuid(),
      done: true,
    };
    const results = updateTodoOptionsSchema.validate(invalidTodoData);
    const { details } = results.error!;
    const [idError] = details;

    expect(idError.path).toStrictEqual(['id']);
  });

  test('Should return validation errors if ownerId is not present', () => {
    const invalidTodoData: Omit<UpdateTodoOptions, 'ownerId'> = {
      id: uuid(),
      done: true,
    };
    const results = updateTodoOptionsSchema.validate(invalidTodoData);
    const { details } = results.error!;
    const [ownerIdError] = details;

    expect(ownerIdError.path).toStrictEqual(['ownerId']);
  });

  test('Should return validation errors if label is too long (if present)', () => {
    const invalidTodoData: UpdateTodoOptions = {
      id: uuid(),
      ownerId: uuid(),
      label: Array(256)
        .map((_) => 'a')
        .join(''),
    };
    const results = updateTodoOptionsSchema.validate(invalidTodoData);
    const { details } = results.error!;
    const [labelError] = details;

    expect(labelError.path).toStrictEqual(['label']);
  });

  test('Should pass validation is object is fine', () => {
    const validTodoData: UpdateTodoOptions = {
      id: uuid(),
      ownerId: uuid(),
      label: 'bang your mom again',
      done: false,
    };
    const results = updateTodoOptionsSchema.validate(validTodoData);

    expect(results.error).toBeUndefined();
  });
});
