import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client/http';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  // Jika env variable Turso diset (misal di Vercel/Production), gunakan driver LibSQL adapter Turso
  if (tursoUrl) {
    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoAuthToken,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({
      adapter,
      log: ['query', 'error', 'warn'],
    });
  }

  // Fallback: Jika TURSO_DATABASE_URL tidak diset, gunakan SQLite lokal (prisma/dev.db) untuk development
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
