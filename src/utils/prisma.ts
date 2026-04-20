import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import type { PoolConfig } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: pg.Pool;
};

function relaxedUrlAndSsl(raw: string): Pick<PoolConfig, 'connectionString' | 'ssl'> {
  const url = new URL(raw);
  url.searchParams.delete('sslmode');
  let connectionString = url.toString();
  if (connectionString.endsWith('?')) connectionString = connectionString.slice(0, -1);
  return {
    connectionString,
    ssl: { rejectUnauthorized: false },
  };
}

function poolConfigFromEnv(): PoolConfig {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error('DATABASE_URL is not set');

  const strictSsl = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true';
  const base: Pick<PoolConfig, 'connectionString' | 'ssl'> = strictSsl
    ? { connectionString: raw }
    : relaxedUrlAndSsl(raw);

  const supabasePooler = raw.includes('pooler.supabase.com');
  const envMax = Number(process.env.PG_POOL_MAX);
  const poolMax =
    Number.isFinite(envMax) && envMax > 0
      ? Math.floor(envMax)
      : supabasePooler
        ? 1
        : 10;

  return {
    ...base,
    max: poolMax,
    ...(supabasePooler ? { maxUses: 50 } : {}),
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: Number(process.env.PG_CONNECTION_TIMEOUT_MS) || 12_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
    maxLifetimeSeconds: 300,
    allowExitOnIdle: process.env.NODE_ENV === 'production',
  };
}

function getPool() {
  if (!globalForPrisma.prismaPool) {
    globalForPrisma.prismaPool = new pg.Pool(poolConfigFromEnv());
    globalForPrisma.prismaPool.on('error', (err) =>
      console.error('[pg Pool]', err),
    );
  }
  return globalForPrisma.prismaPool;
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ adapter: new PrismaPg(getPool()) });
  }
  return globalForPrisma.prisma;
}

export async function ensureDatabaseConnection(): Promise<void> {
  await getClient().$connect();
}

export async function recyclePrismaClient(): Promise<void> {
  const { prisma } = globalForPrisma;
  if (prisma) await prisma.$disconnect().catch(() => {});
  delete globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    if (prop === 'then') return undefined;
    const client = getClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
}) as PrismaClient;
