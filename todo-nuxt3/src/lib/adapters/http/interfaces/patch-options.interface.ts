import { HttpDetails } from './http-details.interface';

export interface PatchOptions<BodyType> {
  url: string;
  body: BodyType;
  details?: HttpDetails;
}
