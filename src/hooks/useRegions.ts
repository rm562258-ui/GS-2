import { useQuery } from '@tanstack/react-query';

import { regionService } from '@/services/regionService';

import { queryKeys } from './queryKeys';

export function useRegions() {
  return useQuery({
    queryKey: queryKeys.regions.all,
    queryFn: regionService.list,
  });
}
