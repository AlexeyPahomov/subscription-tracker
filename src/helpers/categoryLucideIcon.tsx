import {
  Briefcase,
  Film,
  LayoutGrid,
  MoreHorizontal,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/** Ключи из поля `Category.icon` в БД → Lucide */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  film: Film,
  briefcase: Briefcase,
  zap: Zap,
  wallet: Wallet,
  finance: Wallet,
  work: Briefcase,
  utility: Zap,
  utilities: Zap,
  entertainment: Film,
  other: MoreHorizontal,
};

/** Если в БД нет `icon`, подбираем иконку по названию дефолтных категорий */
const CATEGORY_NAME_TO_ICON: Record<string, LucideIcon> = {
  entertainment: Film,
  work: Briefcase,
  utilities: Zap,
  finance: Wallet,
  other: MoreHorizontal,
};

function normalizeKey(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * @param icon — значение из `Category.icon` (например `film`)
 * @param categoryName — подсказка, если `icon` пустой (старые записи в БД)
 */
export function getCategoryLucideIcon(
  icon: string | null | undefined,
  categoryName?: string | null,
): LucideIcon {
  if (icon?.trim()) {
    const key = normalizeKey(icon);
    const mapped = CATEGORY_ICON_MAP[key];
    if (mapped) return mapped;
  }
  if (categoryName?.trim()) {
    const nameKey = normalizeKey(categoryName);
    const byName = CATEGORY_NAME_TO_ICON[nameKey];
    if (byName) return byName;
  }
  return LayoutGrid;
}
