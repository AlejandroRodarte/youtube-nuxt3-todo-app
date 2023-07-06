import { describe, test, expect } from 'vitest';

import { BCryptAdapter } from '../../../../../src/lib/adapters/hasher/bcrypt/bcrypt.adapter';

const bCryptAdapter = new BCryptAdapter();

describe('BCryptAdapter: methods', () => {
  describe('hash()', () => {
    test('Should hash plain text properly and conform to bcrypt standards', async () => {
      const plainText = 'super-secret-password';
      const [hashedText] = await bCryptAdapter.hash({ plainText });

      expect(hashedText).toBeDefined();
      expect(hashedText?.length).toBe(60);
      expect(hashedText?.startsWith('$2b$10$')).toBe(true);
    });
  });

  describe('compare()', () => {
    test('Should return true if plain text matches the hashed text', async () => {
      const plainText = 'super-secret-password';
      const [hashedText] = await bCryptAdapter.hash({ plainText });
      const [areEqual] = await bCryptAdapter.compare({
        plainText,
        hashedText: hashedText!,
      });

      expect(areEqual).toBe(true);
    });

    test('Should return false if plain text does not match hashed text', async () => {
      const [hashedPassword] = await bCryptAdapter.hash({
        plainText: 'original-password',
      });
      const wrongPassword = 'wrong-password';

      const [areEqual] = await bCryptAdapter.compare({
        plainText: wrongPassword,
        hashedText: hashedPassword!,
      });

      expect(areEqual).toBe(false);
    });
  });
});
