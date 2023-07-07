import { DataErrorTuple } from '../../../../types/tuples/data-error.tuple.type';
import { HashOptions } from './hash-options.interface';
import { CompareOptions } from './compare-options.interface';

export interface HasherAdapter {
  hash(options: HashOptions): Promise<DataErrorTuple<string, Error>>;
  compare(options: CompareOptions): Promise<DataErrorTuple<boolean, Error>>;
}
