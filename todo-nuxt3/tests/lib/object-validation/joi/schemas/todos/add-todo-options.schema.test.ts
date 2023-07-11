import { describe, expect, test } from 'vitest';

import { AddTodoOptions } from '../../../../../../src/lib/services/todos/interfaces/add-todo-options.interface';
import addTodoOptionsSchema from '../../../../../../src/lib/object-validation/joi/schemas/todos/add-todo-options.schema';
import { v4 as uuid } from 'uuid';

describe('AddTodoOptionsSchema', () => {
  test('Should return validation errors if ownerId is not present', () => {
    const invalidTodoData: Omit<AddTodoOptions, 'ownerId'> = {
      label: 'bang stacy',
    };
    const results = addTodoOptionsSchema.validate(invalidTodoData);
    const { details } = results.error!;
    const [ownerIdError] = details;

    expect(ownerIdError.path).toStrictEqual(['ownerId']);
  });

  test('Should return validation errors if label is not present', () => {
    const invalidTodoData: Omit<AddTodoOptions, 'label'> = {
      ownerId: uuid(),
    };
    const results = addTodoOptionsSchema.validate(invalidTodoData);
    const { details } = results.error!;
    const [labelError] = details;

    expect(labelError.path).toStrictEqual(['label']);
  });

  test('Should return validation errors if label is too long', () => {
    const invalidTodoData: AddTodoOptions = {
      ownerId: uuid(),
      label: Array(256)
        .map((_) => 'a')
        .join(''),
    };
    const results = addTodoOptionsSchema.validate(invalidTodoData);
    const { details } = results.error!;
    const [labelError] = details;

    expect(labelError.path).toStrictEqual(['label']);
  });

  test('Should pass validation is object is fine', () => {
    const validTodoData: AddTodoOptions = {
      ownerId: uuid(),
      label: 'bang your mom',
    };
    const results = addTodoOptionsSchema.validate(validTodoData);

    expect(results.error).toBeUndefined();
  });
});
