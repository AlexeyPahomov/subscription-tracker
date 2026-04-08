'use client';

import { ThemeProvider, configure } from '@gravity-ui/uikit';
import type { ReactNode } from 'react';

configure({ lang: 'ru' });

export function GravityThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider theme="system">{children}</ThemeProvider>;
}
