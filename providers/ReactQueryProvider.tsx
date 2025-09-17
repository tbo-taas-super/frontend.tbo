'use client';

import { QueryClient, QueryClientProvider as QueryProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000
          }
        }
      })
  );
  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
}