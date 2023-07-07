import jwt from 'jsonwebtoken';

import { JwtTokenBrokerAdapter } from '../interfaces/jwt-token-broker-adapter.interface';
import { CreateOptions } from '../interfaces/create-options.interface';
import { CheckOptions } from '../interfaces/check-options.interface';

export class JsonWebTokenAdapter implements JwtTokenBrokerAdapter {
  private _key = process.env.JWT_KEY!;
  private _expiresNumber = +process.env.JWT_EXPIRATION_NUMBER!;
  private _expiresPeriod = process.env.JWT_EXPIRATION_PERIOD!;
  private _expiresIn = this.computeExpiresIn();

  create<T extends string | object | Buffer>(
    options: CreateOptions<T>
  ): string {
    const token = jwt.sign(options.payload, this._key, {
      expiresIn: this._expiresIn,
    });
    return token;
  }

  private computeExpiresIn(): string {
    const periodMapper: { [key: string]: string } = {
      seconds: 's',
      minutes: 'm',
      hours: 'h',
      days: 'd',
      weeks: 'w',
      years: 'y',
    };

    const mappedTerm = periodMapper[this._expiresPeriod] || 'h';
    return `${this._expiresNumber}${mappedTerm}`;
  }

  check<T>(options: CheckOptions): T | undefined {
    try {
      const decodedToken = jwt.verify(options.token, this._key);
      return decodedToken as T;
    } catch (e) {
      return undefined;
    }
  }
}

export const jsonWebTokenAdapter = new JsonWebTokenAdapter();
