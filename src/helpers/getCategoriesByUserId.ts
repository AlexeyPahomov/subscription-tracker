import { ensureDefaultCategoriesForUser } from '@/helpers/ensureDefaultCategoriesForUser';
import { prisma } from '@/utils/prisma';

export type UserCategoryOption = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
};

export async function getCategoriesByUserId(
  userId: string,
): Promise<UserCategoryOption[]> {
  await ensureDefaultCategoriesForUser(userId);
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, color: true, icon: true },
  });
}
