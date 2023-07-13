import { HttpDetails } from './http-details.interface';

export interface PostOptions<BodyType> {
  url: string;
  body: BodyType;
  details?: HttpDetails;
}
