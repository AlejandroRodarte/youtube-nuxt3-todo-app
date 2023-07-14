import { readFileSync } from 'fs';

const setDockerSecrets = () => {
  console.log('setDockerSecrets running');

  const mySqlURL = !process.env.MYSQL_URL_FILE_PATH
    ? undefined
    : readFileSync(process.env.MYSQL_URL_FILE_PATH, 'utf-8').trim();

  const hasherRounds = !process.env.HASHER_ROUNDS_FILE_PATH
    ? undefined
    : readFileSync(process.env.HASHER_ROUNDS_FILE_PATH, 'utf-8').trim();

  const jwtKey = !process.env.JWT_KEY_FILE_PATH
    ? undefined
    : readFileSync(process.env.JWT_KEY_FILE_PATH, 'utf-8').trim();

  process.env.MYSQL_URL = mySqlURL;
  process.env.HASHER_ROUNDS = hasherRounds;
  process.env.JWT_KEY = jwtKey;
  
  console.log(process.env.MYSQL_URL);
};

export default setDockerSecrets;
