/** Раньше тема писалась в cookie — оставлено для одноразовой миграции в localStorage */
export const THEME_COOKIE_NAME = 'theme-preference';

/** Ключ localStorage (не использовать cookie в Server Components — иначе RSC перезапрашивается по кругу) */
export const THEME_STORAGE_KEY = THEME_COOKIE_NAME;

export type ThemePreference = 'light' | 'dark' | 'system';

/** Порядок и подписи для UI (переключатель темы, подсказки). */
export const THEME_PREFERENCE_OPTIONS = [
  { value: 'light', label: 'Light', description: 'Light background' },
  { value: 'dark', label: 'Dark', description: 'Dark background' },
  {
    value: 'system',
    label: 'System',
    description: 'Match device settings',
  },
] as const satisfies ReadonlyArray<{
  value: ThemePreference;
  label: string;
  description: string;
}>;

export function resolveTheme(
  pref: ThemePreference,
  systemIsDark: boolean,
): 'light' | 'dark' {
  if (pref === 'light') return 'light';
  if (pref === 'dark') return 'dark';
  return systemIsDark ? 'dark' : 'light';
}

