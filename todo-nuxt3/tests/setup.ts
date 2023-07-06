import path from 'path';
import dotenv from 'dotenv';

import prismaClient from '../src/lib/db/prisma/prisma-client.singleton';
import teardownDatabase from './teardown-database.helper';

export const setup = async () => {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
  prismaClient.connect();
  await teardownDatabase();
};

export const teardown = async () => {
  await teardownDatabase();
  await prismaClient.disconnect();
}
