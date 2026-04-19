'use client';

import { useThemePreference } from '@/components/theme/theme-preference-provider';
import { ThemeProvider, configure } from '@gravity-ui/uikit';
import { settings } from '@gravity-ui/date-utils';
import { useEffect, type ReactNode } from 'react';

configure({ lang: 'ru' });

export function GravityThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useThemePreference();

  useEffect(() => {
    void settings.loadLocale('ru');
  }, []);

  return <ThemeProvider theme={resolvedTheme}>{children}</ThemeProvider>;
}
