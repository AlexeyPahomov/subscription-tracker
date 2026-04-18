import { ensureDefaultCategoriesForUser } from '@/helpers/ensureDefaultCategoriesForUser';
import { prisma } from '@/utils/prisma';

export type UserCategoryOption = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
};

function sortCategoriesForUi(
  rows: UserCategoryOption[],
): UserCategoryOption[] {
  return [...rows].sort((a, b) => {
    const aOther = a.name.trim().toLowerCase() === 'other';
    const bOther = b.name.trim().toLowerCase() === 'other';
    if (aOther !== bOther) {
      return aOther ? 1 : -1;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });
}

export async function getCategoriesByUserId(
  userId: string,
): Promise<UserCategoryOption[]> {
  await ensureDefaultCategoriesForUser(userId);
  const rows = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, color: true, icon: true },
  });
  return sortCategoriesForUi(rows);
}
