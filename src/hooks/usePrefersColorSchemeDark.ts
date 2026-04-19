'use client';

import { useThemePreference } from '@/components/theme/theme-preference-provider';

/** Текущая разрешённая тема (учитывает ручной выбор и «как в системе»). */
export function usePrefersColorSchemeDark(): boolean {
  return useThemePreference().resolvedTheme === 'dark';
}
