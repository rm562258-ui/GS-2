// Chaves do cache do TanStack Query, centralizadas para invalidar os dados após cada alteração.
export const queryKeys = {
  helpRequests: {
    all: ['help-requests'] as const,
    detail: (id: string) => ['help-requests', id] as const,
  },
  waterPoints: {
    all: ['water-points'] as const,
    detail: (id: string) => ['water-points', id] as const,
  },
  regions: {
    all: ['regions'] as const,
  },
};
