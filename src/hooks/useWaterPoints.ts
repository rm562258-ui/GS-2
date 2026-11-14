import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { waterPointService } from '@/services/waterPointService';
import type { WaterPointInput } from '@/types/models';

import { queryKeys } from './queryKeys';

export function useWaterPoints() {
  return useQuery({
    queryKey: queryKeys.waterPoints.all,
    queryFn: waterPointService.listWithOfflineFallback,
  });
}

export function useWaterPoint(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.waterPoints.detail(id ?? ''),
    queryFn: () => waterPointService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateWaterPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: WaterPointInput) => waterPointService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.waterPoints.all }),
  });
}

export function useUpdateWaterPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: WaterPointInput }) =>
      waterPointService.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.waterPoints.all }),
  });
}

export function useDeleteWaterPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => waterPointService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.waterPoints.detail(id) });
      return queryClient.invalidateQueries({ queryKey: queryKeys.waterPoints.all });
    },
  });
}
