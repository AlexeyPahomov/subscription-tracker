import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/** Prisma CLI: prefer DIRECT_URL. Прямой db.* иногда только IPv6 → P1001; тогда Session pooler :5432 (IPv4). Transaction :6543 — не для db push. */
const prismaCliUrl =
  process.env.DIRECT_URL?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  // `prisma generate` не подключается к БД; на Vercel postinstall часто без env — нужен валидный URL для загрузки конфига
  'postgresql://prisma:prisma@127.0.0.1:5432/postgres';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: prismaCliUrl,
  },
});
