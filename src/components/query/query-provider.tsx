'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

type AppQueryProviderProps = {
  children: ReactNode;
};

export function AppQueryProvider({ children }: AppQueryProviderProps) {
  const isDev = process.env.NODE_ENV !== 'production';
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: isDev ? 5 * 60_000 : 60_000,
            gcTime: 10 * 60_000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: isDev ? 0 : 2,
            retryOnMount: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
