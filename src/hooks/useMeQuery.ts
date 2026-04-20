'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';

export type MeQueryData = {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

export type MeHttpError = Error & { status?: number };

async function fetchMe(): Promise<MeQueryData> {
  const response = await fetch('/api/me', {
    method: 'GET',
    cache: 'no-store',
    credentials: 'same-origin',
  });

  if (!response.ok) {
    const err = new Error('Failed to load current user') as MeHttpError;
    err.status = response.status;
    throw err;
  }

  return response.json() as Promise<MeQueryData>;
}

export function useMeQuery() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    staleTime: 5 * 60_000,
  });
}
