'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export type HttpStatusError = Error & { status?: number };

export function useRedirectOnUnauthorized(
  error: unknown,
  redirectTo = '/',
) {
  const router = useRouter();

  useEffect(() => {
    const status = (error as HttpStatusError | null)?.status;
    if (status === 401) {
      router.replace(redirectTo);
    }
  }, [error, redirectTo, router]);
}
