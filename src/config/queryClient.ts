import { QueryClient } from '@tanstack/react-query';

import { AppError } from '@/utils/appError';

// Erros de cliente (4xx) não melhoram tentando de novo; falhas de rede e 5xx sim.
const shouldRetry = (failureCount: number, error: unknown) => {
  const isClientError =
    error instanceof AppError && error.status !== undefined && error.status < 500;
  return !isClientError && failureCount < 2;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      staleTime: 30 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
});
