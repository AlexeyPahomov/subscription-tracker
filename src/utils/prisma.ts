import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { PoolConfig } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function poolConfigFromEnv(): PoolConfig {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error('DATABASE_URL is not set');
  }
  // В dev часто «self-signed certificate in chain» (прокси/антивирус/Windows). В prod по умолчанию — строгая проверка.
  const strictSsl =
    process.env.NODE_ENV === 'production'
      ? process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false'
      : process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true';

  if (strictSsl) {
    return { connectionString: raw };
  }

  // В pg ≥8 sslmode=require в строке трактуется как verify-full и перебивает ssl.rejectUnauthorized — убираем из URI.
  const url = new URL(raw);
  url.searchParams.delete('sslmode');
  let connectionString = url.toString();
  if (connectionString.endsWith('?')) {
    connectionString = connectionString.slice(0, -1);
  }

  return {
    connectionString,
    ssl: { rejectUnauthorized: false },
  };
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg(poolConfigFromEnv()),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
