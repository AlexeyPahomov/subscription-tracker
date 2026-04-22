'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export type HttpStatusError = Error & { status?: number };

export function useRedirectOnUnauthorized(
  error: unknown,
  redirectTo = '/',
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = (error as HttpStatusError | null)?.status;
    if (status === 401) {
      const search = searchParams.toString();
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const returnTo = `${pathname}${search ? `?${search}` : ''}${hash}`;
      const encodedReturnTo = encodeURIComponent(returnTo);
      const hasQuery = redirectTo.includes('?');
      const separator = hasQuery ? '&' : '?';

      router.replace(`${redirectTo}${separator}returnTo=${encodedReturnTo}`);
    }
  }, [error, pathname, redirectTo, router, searchParams]);
}
