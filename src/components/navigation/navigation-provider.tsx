'use client';

import { layoutConfig } from '@/config/layout.config';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from 'react';

type NavigationContextValue = {
  beginNavigation: () => void;
  navigate: (href: string) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const beginNavigation = useCallback(() => {
    setLoading(true);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const pathOnly = href.split('#')[0]?.split('?')[0] ?? href;
      if (pathOnly === pathname) return;
      setLoading(true);
      router.push(href);
    },
    [pathname, router],
  );

  return (
    <NavigationContext.Provider value={{ beginNavigation, navigate }}>
      {children}
      {loading ? (
        <div
          className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-center bg-(--background)/88 backdrop-blur-sm motion-safe:animate-[nav-overlay-in_0.2s_ease-out]"
          style={{ top: layoutConfig.headerHeight }}
          role="status"
          aria-live="polite"
          aria-label="Загрузка страницы"
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-[color-mix(in_oklab,var(--foreground)_35%,transparent)] border-t-foreground"
            aria-hidden
          />
        </div>
      ) : null}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return ctx;
}

type AppLinkProps = ComponentProps<typeof Link>;

function pathOnlyFromHref(href: AppLinkProps['href'], fallbackPathname: string): string {
  if (typeof href === 'string') {
    return href.split('#')[0]?.split('?')[0] ?? fallbackPathname;
  }
  if (
    typeof href === 'object' &&
    href !== null &&
    'pathname' in href &&
    typeof href.pathname === 'string'
  ) {
    return href.pathname;
  }
  return fallbackPathname;
}

export function AppLink({ href, onClick, children, ...rest }: AppLinkProps) {
  const pathname = usePathname();
  const { beginNavigation } = useNavigation();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.button !== 0) return;
    const t = (e.currentTarget as HTMLAnchorElement).getAttribute('target');
    if (t && t !== '_self') return;
    if (pathOnlyFromHref(href, pathname) === pathname) return;
    beginNavigation();
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
