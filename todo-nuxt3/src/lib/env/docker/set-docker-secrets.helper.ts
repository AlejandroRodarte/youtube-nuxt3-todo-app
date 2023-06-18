import { readFileSync } from 'fs';

const setDockerSecrets = () => {
  const mySqlURL = !process.env.MYSQL_URL_FILE_PATH
    ? undefined
    : readFileSync(process.env.MYSQL_URL_FILE_PATH, 'utf-8').trim();
  process.env.MYSQL_URL = mySqlURL;
};

export default setDockerSecrets;
