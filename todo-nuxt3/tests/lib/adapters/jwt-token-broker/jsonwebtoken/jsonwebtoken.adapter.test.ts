import { describe, test, expect } from 'vitest';
import { v4 as uuid } from 'uuid';

import { JsonWebTokenAdapter } from '../../../../../src/lib/adapters/jwt-token-broker/jsonwebtoken/jsonwebtoken.adapter';
import { UserTokenPayload } from '../../../../../src/lib/services/users/interfaces/user-token-payload.interface';
import { DecodedToken } from '../../../../../src/lib/types/jsonwebtoken/decoded-token.type';

const jsonWebTokenAdapter = new JsonWebTokenAdapter();

const userData: UserTokenPayload = {
  id: uuid(),
  email: 'foo@bar.com',
};

describe('JsonWebTokenAdapter: methods', () => {
  describe('create()', () => {
    test('Should create a correctly-formatted token', () => {
      const token = jsonWebTokenAdapter.create({ payload: userData });
      const parts = token.split('.');
      expect(parts.length).toBe(3);
    });
  });

  describe('check()', () => {
    test('Should verify a correct, un-expired token, returning the payload', () => {
      const token = jsonWebTokenAdapter.create({ payload: userData });
      const payload = jsonWebTokenAdapter.check<DecodedToken<UserTokenPayload>>(
        { token }
      );

      expect(payload?.id).toBe(userData.id);
      expect(payload?.email).toBe(userData.email);
    });

    test('Should reject an expired token, returning nothing', () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2ODFjN2RjLTFlM2EtNGFhZi1iYTI0LWExNWRlMzk3ZTMyMyIsImVtYWlsIjoiZm9vQGJhci5jb20iLCJpYXQiOjE2ODg2Njg0MzgsImV4cCI6MTY4ODY2ODQ0MH0.mZUaGhHlfN05B8crswqIvi2SV2UCLf_QIu-Cue3iXxg';
      const payload = jsonWebTokenAdapter.check<DecodedToken<UserTokenPayload>>(
        { token: expiredToken }
      );

      expect(payload).toBeUndefined();
    });
  });
});
