'use client';

import { parseSubscriptionDeepLinkHashFragment } from '@/constants/subscriptionDeepLink';
import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';

const HIGHLIGHT_RING = ['ring-2', 'ring-indigo-500/60', 'transition-shadow'] as const;
const HIGHLIGHT_MS = 2200;

const RETRY = {
  max: 45,
  /** Нет фрагмента `subscription-…` — выходим (страница без deep link). */
  bailIfNoDeepLinkAfter: 20,
  intervalMs: 55,
} as const;

/**
 * Скролл и кольцо по `#subscription-{id}` (Next.js иногда отдаёт hash после layout).
 */
export function useScrollToSubscriptionFromHash(
  subscriptions: ReadonlyArray<{ id: string }>,
) {
  const pathname = usePathname();
  const listKey = subscriptions.map((s) => s.id).join(',');

  useLayoutEffect(() => {
    let cancelled = false;
    let highlightTimer: number | undefined;
    const retryTimers: number[] = [];

    const clearHighlight = () => {
      if (highlightTimer !== undefined) {
        clearTimeout(highlightTimer);
        highlightTimer = undefined;
      }
    };

    const clearRetries = () => {
      for (const id of retryTimers) clearTimeout(id);
      retryTimers.length = 0;
    };

    const apply = (): boolean => {
      const domId = parseSubscriptionDeepLinkHashFragment(window.location.hash);
      if (!domId) return false;

      const el = document.getElementById(domId);
      if (!el) return false;

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add(...HIGHLIGHT_RING);
      clearHighlight();
      highlightTimer = window.setTimeout(() => {
        el.classList.remove(...HIGHLIGHT_RING);
      }, HIGHLIGHT_MS);
      return true;
    };

    const schedule = () => {
      clearRetries();
      let n = 0;

      const step = () => {
        if (cancelled) return;
        if (apply()) return;
        n += 1;
        if (n >= RETRY.max) return;
        if (
          n >= RETRY.bailIfNoDeepLinkAfter &&
          parseSubscriptionDeepLinkHashFragment(window.location.hash) === null
        ) {
          return;
        }
        retryTimers.push(window.setTimeout(step, RETRY.intervalMs));
      };

      requestAnimationFrame(step);
    };

    schedule();
    window.addEventListener('hashchange', schedule);
    window.addEventListener('popstate', schedule);

    return () => {
      cancelled = true;
      clearHighlight();
      clearRetries();
      window.removeEventListener('hashchange', schedule);
      window.removeEventListener('popstate', schedule);
    };
  }, [listKey, pathname]);
}
