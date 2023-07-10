export type DecodedToken<T> = T & {
  iat: number;
  exp: number;
};
