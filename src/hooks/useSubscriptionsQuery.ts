'use client';

import { queryKeys } from '@/constants/query-keys';
import type { UserCategoryOption } from '@/helpers/getCategoriesByUserId';
import type { Subscription } from '@/types/subscription';
import { useQuery } from '@tanstack/react-query';

export type SubscriptionsQueryData = {
  subscriptions: Subscription[];
  categories: UserCategoryOption[];
};

export type SubscriptionsHttpError = Error & { status?: number };

async function fetchSubscriptionsData(): Promise<SubscriptionsQueryData> {
  const response = await fetch('/api/subscriptions', {
    method: 'GET',
    cache: 'no-store',
    credentials: 'same-origin',
  });

  if (!response.ok) {
    const err = new Error('Failed to load subscriptions') as SubscriptionsHttpError;
    err.status = response.status;
    throw err;
  }

  return response.json() as Promise<SubscriptionsQueryData>;
}

export function useSubscriptionsQuery() {
  return useQuery({
    queryKey: queryKeys.subscriptions,
    queryFn: fetchSubscriptionsData,
    retry: (failureCount, error) => {
      const status = (error as SubscriptionsHttpError | null)?.status;
      if (status === 401) return false;
      return failureCount < 3;
    },
  });
}
