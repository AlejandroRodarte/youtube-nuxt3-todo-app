import { DataErrorTuple } from '../../../../lib/types/tuples/data-error.tuple.type';
import { asyncWrapper } from '../../../../lib/helpers/wrappers/async.wrapper';
import { DeleteOptions } from '../interfaces/delete-options.interface';
import { GetOptions } from '../interfaces/get-options.interface';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { PatchOptions } from '../interfaces/patch-options.interface';
import { PostOptions } from '../interfaces/post-options.interface';
import { ValidHttpResponses } from '../types/valid-http-responses.type';

export class NitroFetchAdapter implements HttpAdapter {
  async get<ResponseType extends ValidHttpResponses>(
    options: GetOptions
  ): Promise<DataErrorTuple<ResponseType, Error>> {
    const [response, error] = await asyncWrapper(async () => {
      return $fetch<ResponseType>(options.url, {
        method: 'GET',
        headers: options.details?.headers,
      });
    });
    // @ts-ignore(2322)
    return [response, error];
  }

  async post<
    BodyType extends Record<string, any>,
    ResponseType extends ValidHttpResponses
  >(
    options: PostOptions<BodyType>
  ): Promise<DataErrorTuple<ResponseType, Error>> {
    const [response, error] = await asyncWrapper(async () => {
      return $fetch<ResponseType>(options.url, {
        method: 'POST',
        body: options.body,
        headers: options.details?.headers,
      });
    });
    // @ts-ignore(2322)
    return [response, error];
  }

  async patch<
    BodyType extends Record<string, any>,
    ResponseType extends ValidHttpResponses
  >(
    options: PatchOptions<BodyType>
  ): Promise<DataErrorTuple<ResponseType, Error>> {
    const [response, error] = await asyncWrapper(async () => {
      return $fetch<ResponseType>(options.url, {
        method: 'PATCH',
        body: options.body,
        headers: options.details?.headers,
      });
    });
    // @ts-ignore(2322)
    return [response, error];
  }

  async delete<
    BodyType extends Record<string, any>,
    ResponseType extends ValidHttpResponses
  >(
    options: DeleteOptions<BodyType>
  ): Promise<DataErrorTuple<ResponseType, Error>> {
    const [response, error] = await asyncWrapper(async () => {
      return $fetch<ResponseType>(options.url, {
        method: 'DELETE',
        body: options.body,
        headers: options.details?.headers,
      });
    });
    // @ts-ignore(2322)
    return [response, error];
  }
}

export const nitroFetchAdapter = new NitroFetchAdapter();
