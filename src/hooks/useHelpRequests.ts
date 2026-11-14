import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { helpRequestService } from '@/services/helpRequestService';
import type { HelpRequestInput } from '@/types/models';

import { queryKeys } from './queryKeys';

export function useHelpRequests() {
  return useQuery({
    queryKey: queryKeys.helpRequests.all,
    queryFn: helpRequestService.list,
  });
}

export function useHelpRequest(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.helpRequests.detail(id ?? ''),
    queryFn: () => helpRequestService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateHelpRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: HelpRequestInput) => helpRequestService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.helpRequests.all }),
  });
}

export function useUpdateHelpRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: HelpRequestInput }) =>
      helpRequestService.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.helpRequests.all }),
  });
}

export function useDeleteHelpRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => helpRequestService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.helpRequests.detail(id) });
      return queryClient.invalidateQueries({ queryKey: queryKeys.helpRequests.all });
    },
  });
}
