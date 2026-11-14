import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { authEvents } from '@/services/authEvents';
import { AppError, isUnauthorizedError } from '@/utils/appError';

// Erros de cliente (4xx) não melhoram tentando de novo; falhas de rede e 5xx sim.
const shouldRetry = (failureCount: number, error: unknown) => {
  const isClientError =
    error instanceof AppError && error.status !== undefined && error.status < 500;
  return !isClientError && failureCount < 2;
};

// Token recusado pela API em qualquer consulta ou alteração: encerra a sessão.
const handleGlobalError = (error: unknown) => {
  if (isUnauthorizedError(error)) {
    authEvents.emitUnauthorized();
  }
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleGlobalError }),
  mutationCache: new MutationCache({ onError: handleGlobalError }),
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
