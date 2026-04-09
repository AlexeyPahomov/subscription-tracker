'use client';

import { ThemeProvider, configure } from '@gravity-ui/uikit';
import { settings } from '@gravity-ui/date-utils';
import { useEffect, useState, type ReactNode } from 'react';

configure({ lang: 'ru' });

export function GravityThemeProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    settings.loadLocale('ru').then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return null;
  }

  return <ThemeProvider theme="system">{children}</ThemeProvider>;
}
