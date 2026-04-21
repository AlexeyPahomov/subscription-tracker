'use client';

import { queryKeys } from '@/constants/query-keys';
import type { UserSettingsQueryData } from '@/types/user-settings';
import { useQuery } from '@tanstack/react-query';

export type UserSettingsHttpError = Error & { status?: number };

async function fetchUserSettings(): Promise<UserSettingsQueryData> {
  const response = await fetch('/api/settings', {
    method: 'GET',
    cache: 'no-store',
    credentials: 'same-origin',
  });

  if (!response.ok) {
    const err = new Error('Failed to load user settings') as UserSettingsHttpError;
    err.status = response.status;
    throw err;
  }

  return response.json() as Promise<UserSettingsQueryData>;
}

export function useUserSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: fetchUserSettings,
    staleTime: 5 * 60_000,
  });
}
