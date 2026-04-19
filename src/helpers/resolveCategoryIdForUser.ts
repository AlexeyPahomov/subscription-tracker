import { prisma } from '@/utils/prisma';
import { withDbRetry } from '@/utils/dbConnection';

/** Проверяет, что categoryId принадлежит пользователю. Пустое значение → null. */
export async function resolveCategoryIdForUser(
  userId: string,
  raw: string | null | undefined,
): Promise<{ ok: true; categoryId: string | null } | { ok: false }> {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return { ok: true, categoryId: null };
  }
  const found = await withDbRetry(() =>
    prisma.category.findFirst({
      where: { id: trimmed, userId },
      select: { id: true },
    }),
  );
  if (!found) {
    return { ok: false };
  }
  return { ok: true, categoryId: trimmed };
}
