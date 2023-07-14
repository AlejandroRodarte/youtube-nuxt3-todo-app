import { readFileSync } from 'fs';

const isDocker = ['production-docker', 'development-docker'].includes(
  process.env.STAGE!
);

const entrypointVariables = {
  mySqlUrl: isDocker
    ? readFileSync(process.env.MYSQL_URL_FILE_PATH!, 'utf-8').trim()
    : process.env.MYSQL_URL,
  hasherRounds: isDocker
    ? readFileSync(process.env.HASHER_ROUNDS_FILE_PATH!, 'utf-8').trim()
    : process.env.HASHER_ROUNDS,
  jwtKey: isDocker
    ? readFileSync(process.env.JWT_KEY_FILE_PATH!, 'utf-8').trim()
    : process.env.JWT_KEY,
};

export default entrypointVariables;
