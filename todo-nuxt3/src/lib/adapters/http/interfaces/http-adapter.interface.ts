import { DataErrorTuple } from '~/lib/types/tuples/data-error.tuple.type';
import { ValidHttpResponses } from '../types/valid-http-responses.type';
import { DeleteOptions } from './delete-options.interface';
import { GetOptions } from './get-options.interface';
import { PatchOptions } from './patch-options.interface';
import { PostOptions } from './post-options.interface';

export interface HttpAdapter {
  get<ResponseType extends ValidHttpResponses>(
    options: GetOptions
  ): Promise<DataErrorTuple<ResponseType, Error>>;

  post<
    BodyType extends Record<string, any>,
    ResponseType extends ValidHttpResponses
  >(
    options: PostOptions<BodyType>
  ): Promise<DataErrorTuple<ResponseType, Error>>;

  patch<
    BodyType extends Record<string, any>,
    ResponseType extends ValidHttpResponses
  >(
    options: PatchOptions<BodyType>
  ): Promise<DataErrorTuple<ResponseType, Error>>;

  delete<
    BodyType extends Record<string, any>,
    ResponseType extends ValidHttpResponses
  >(
    options: DeleteOptions<BodyType>
  ): Promise<DataErrorTuple<ResponseType, Error>>;
}
