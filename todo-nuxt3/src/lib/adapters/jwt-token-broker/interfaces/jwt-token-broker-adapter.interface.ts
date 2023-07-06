import { CheckOptions } from './check-options.interface';
import { CreateOptions } from './create-options.interface';

export interface JwtTokenBrokerAdapter {
  create<T extends string | Buffer | object>(options: CreateOptions<T>): string;
  check<T>(options: CheckOptions): T | undefined;
}
