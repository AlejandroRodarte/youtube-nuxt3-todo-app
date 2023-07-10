import { hash, compare } from 'bcrypt';

import { HashOptions } from '../interfaces/hash-options.interface';
import { HasherAdapter } from '../interfaces/hasher-adapter.interface';
import { CompareOptions } from '../interfaces/compare-options.interface';
import { asyncWrapper } from '../../../../lib/helpers/wrappers/async.wrapper';
import { DataErrorTuple } from '../../../types/tuples/data-error.tuple.type';

export class BCryptAdapter implements HasherAdapter {
  async hash(options: HashOptions): Promise<DataErrorTuple<string, Error>> {
    const [hashedText, bCryptError] = await asyncWrapper(async () => {
      const hashedText = await hash(
        options.plainText,
        +process.env.HASHER_ROUNDS!
      );
      return hashedText;
    });
    if (bCryptError) return [undefined, bCryptError];
    return [hashedText, undefined];
  }

  async compare(
    options: CompareOptions
  ): Promise<DataErrorTuple<boolean, Error>> {
    const [areEqual, bCryptError] = await asyncWrapper(async () => {
      return compare(options.plainText, options.hashedText);
    });
    if (bCryptError) return [undefined, bCryptError];
    return [areEqual, undefined];
  }
}

export const bCryptAdapter = new BCryptAdapter();
