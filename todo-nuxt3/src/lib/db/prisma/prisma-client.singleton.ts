import Prisma from '@prisma/client';

import { asyncWrapper } from '../../../lib/helpers/wrappers/async.wrapper';

class PrismaClient {
  private _client?: Prisma.PrismaClient;

  connect(): void {
    if (!this._client)
      this._client = new Prisma.PrismaClient({
        datasources: {
          db: {
            url: process.env.MYSQL_URL!,
          },
        },
      });
  }

  async disconnect(): Promise<Error | undefined> {
    if (this._client) {
      const [, disconnectError] = await asyncWrapper(async () => {
        await this._client!.$disconnect();
      });
      if (disconnectError) return disconnectError;
      this._client = undefined;
    }
  }

  get client(): Prisma.PrismaClient {
    if (!this._client) this.connect();
    return this._client!;
  }
}

const prismaClient = new PrismaClient();

export default prismaClient;
