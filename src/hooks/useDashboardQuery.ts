'use client';

import { queryKeys } from '@/constants/query-keys';
import type { DashboardViewModel } from '@/helpers/buildDashboardViewModel';
import { type HttpStatusError } from '@/hooks/useRedirectOnUnauthorized';
import { useQuery } from '@tanstack/react-query';

export type DashboardQueryData = {
  needsSubscriptionsSetup: boolean;
  viewModel?: DashboardViewModel;
};

async function fetchDashboard(): Promise<DashboardQueryData> {
  const response = await fetch('/api/dashboard', {
    method: 'GET',
    cache: 'no-store',
    credentials: 'same-origin',
  });

  if (!response.ok) {
    const err = new Error('Failed to load dashboard') as HttpStatusError;
    err.status = response.status;
    throw err;
  }

  return response.json() as Promise<DashboardQueryData>;
}

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboard,
    staleTime: 60_000,
  });
}
