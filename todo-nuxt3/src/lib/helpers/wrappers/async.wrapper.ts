import { DataErrorTuple } from '../../types/tuples/data-error.tuple.type';

export const asyncWrapper = async <Returns>(
  tryFn: () => Promise<Returns>,
  catchFn?: () => Promise<void>,
  finallyFn?: () => Promise<void>
): Promise<DataErrorTuple<Returns, Error>> => {
  try {
    const data = await tryFn();
    return [data, undefined];
  } catch (e) {
    if (catchFn) await catchFn();
    if (e instanceof Error) return [undefined, e];
    return [
      undefined,
      new Error('An error occured during the asynchronous operation'),
    ];
  } finally {
    if (finallyFn) await finallyFn();
  }
};

