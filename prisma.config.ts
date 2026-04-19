import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/** Prisma CLI: prefer DIRECT_URL. Прямой db.* иногда только IPv6 → P1001; тогда Session pooler :5432 (IPv4). Transaction :6543 — не для db push. */
const prismaCliUrl =
  process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

if (!prismaCliUrl) {
  throw new Error('Задайте DATABASE_URL в .env (и при необходимости DIRECT_URL для Prisma CLI).');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: prismaCliUrl,
  },
});
