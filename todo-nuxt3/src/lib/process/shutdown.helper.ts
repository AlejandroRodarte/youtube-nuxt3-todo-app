import prismaClient from '../db/prisma/prisma-client.singleton';

const shutdown = async () => {
  const disconnectError = await prismaClient.disconnect();
  if (disconnectError) console.log(disconnectError.message);
};

export default shutdown;
