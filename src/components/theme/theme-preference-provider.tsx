'use client';

import {
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
  type ThemePreference,
  resolveTheme,
} from '@/config/theme-preference';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  setPreference: (next: ThemePreference) => void;
  resolvedTheme: 'light' | 'dark';
};

const ThemePreferenceContext =
  createContext<ThemePreferenceContextValue | null>(null);

function readSystemDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Только localStorage (+ одноразовая миграция со старого cookie). Без cookie — иначе Next.js перезапрашивает layout с `cookies()` по кругу. */
function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    const ls = localStorage.getItem(THEME_STORAGE_KEY);
    if (ls === 'light' || ls === 'dark' || ls === 'system') {
      return ls;
    }
  } catch {
    /* ignore */
  }
  try {
    const m = document.cookie.match(
      new RegExp(`(?:^|; )${THEME_COOKIE_NAME}=([^;]*)`),
    );
    if (m?.[1]) {
      const v = decodeURIComponent(m[1]);
      if (v === 'light' || v === 'dark' || v === 'system') {
        localStorage.setItem(THEME_STORAGE_KEY, v);
        document.cookie = `${THEME_COOKIE_NAME}=;path=/;max-age=0`;
        return v;
      }
    }
  } catch {
    /* ignore */
  }
  return 'system';
}

function writeStoredPreference(pref: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* ignore */
  }
}

function applyDom(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.classList.toggle('dark', resolved === 'dark');

  const body = document.body;
  if (!body.classList.contains('g-root')) {
    body.classList.add('g-root');
  }
  body.classList.remove('g-root_theme_light', 'g-root_theme_dark');
  body.classList.add(`g-root_theme_${resolved}`);
}

type ThemePreferenceProviderProps = {
  children: ReactNode;
  /** Только из Sec-CH на сервере (без cookie), чтобы SSR-оболочка совпала с «system» */
  initialResolved: 'light' | 'dark';
};

export function ThemePreferenceProvider({
  children,
  initialResolved,
}: ThemePreferenceProviderProps) {
  const [preference, setPreferenceState] =
    useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(
    initialResolved,
  );

  useLayoutEffect(() => {
    const p = readStoredPreference();
    setPreferenceState(p);
    setResolvedTheme(resolveTheme(p, readSystemDark()));
  }, []);

  useLayoutEffect(() => {
    applyDom(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (preference !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      setResolvedTheme(resolveTheme('system', mq.matches));
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    writeStoredPreference(next);
    setResolvedTheme(resolveTheme(next, readSystemDark()));
  }, []);

  const value = useMemo(
    () => ({
      preference,
      setPreference,
      resolvedTheme,
    }),
    [preference, setPreference, resolvedTheme],
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceContextValue {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error(
      'useThemePreference must be used within ThemePreferenceProvider',
    );
  }
  return ctx;
}
