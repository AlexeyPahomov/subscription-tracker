import type { UserCategoryOption } from '@/helpers/getCategoriesByUserId';

/** Дефолт для новой подписки — только категория «Other» (если есть в списке). */
export function getDefaultSubscriptionCategoryId(
  categories: UserCategoryOption[],
): string {
  const other = categories.find(
    (c) => c.name.trim().toLowerCase() === 'other',
  );
  return other?.id ?? '';
}
