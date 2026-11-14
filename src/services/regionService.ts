import { endpoints } from '@/api/endpoints';
import type { ListResponseDto, RegiaoDto } from '@/types/api';
import type { AffectedRegion } from '@/types/models';

import { apiClient } from './apiClient';
import { toAffectedRegion, unwrapList } from './mappers';

export const regionService = {
  async list(): Promise<AffectedRegion[]> {
    const { data } = await apiClient.get<ListResponseDto<RegiaoDto>>(endpoints.regions.list);
    return unwrapList(data).map(toAffectedRegion);
  },
};
