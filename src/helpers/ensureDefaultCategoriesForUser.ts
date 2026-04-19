import { DEFAULT_SUBSCRIPTION_CATEGORIES } from '@/constants/defaultSubscriptionCategories';
import { prisma } from '@/utils/prisma';
import { withDbRetry } from '@/utils/dbConnection';

/** Создаёт дефолтные категории, если у пользователя ещё ни одной нет (новые и существующие аккаунты). */
export async function ensureDefaultCategoriesForUser(userId: string): Promise<void> {
  const count = await withDbRetry(() =>
    prisma.category.count({ where: { userId } }),
  );
  if (count > 0) return;

  await prisma.category.createMany({
    data: DEFAULT_SUBSCRIPTION_CATEGORIES.map((c) => ({
      userId,
      name: c.name,
      color: c.color,
      icon: c.icon,
    })),
  });
}
