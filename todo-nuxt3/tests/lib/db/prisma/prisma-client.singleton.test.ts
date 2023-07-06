import { describe, expect, test } from 'vitest';
import { PrismaClient } from '@prisma/client';

import prismaClient from '../../../../src/lib/db/prisma/prisma-client.singleton';

describe('PrismClient: methods', () => {
  describe('connect()', () => {
    test('Should define client instance upon calling', () => {
      prismaClient.connect();
      expect(prismaClient.client).toBeInstanceOf(PrismaClient)
    });
  });

  describe('disconnect()', () => {
    test('Should disconnect without error', async () => {
      const dbError = await prismaClient.disconnect();
      expect(dbError).toBeUndefined();
    });
  });
});
