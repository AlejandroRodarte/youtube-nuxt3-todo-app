import prismaClient from '../src/lib/db/prisma/prisma-client.singleton';

const teardownDatabase = async () => {
  await prismaClient.client.user.deleteMany({});
};

export default teardownDatabase;
