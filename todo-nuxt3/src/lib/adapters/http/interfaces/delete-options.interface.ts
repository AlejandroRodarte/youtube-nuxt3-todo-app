import { HttpDetails } from './http-details.interface';

export interface DeleteOptions<BodyType> {
  url: string;
  body: BodyType;
  details?: HttpDetails;
}
