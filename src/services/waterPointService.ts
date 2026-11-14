import { endpoints } from '@/api/endpoints';
import type { ListResponseDto, PontoAguaDto } from '@/types/api';
import type { WaterPoint, WaterPointInput } from '@/types/models';

import { apiClient } from './apiClient';
import { toWaterPoint, toWaterPointDto, unwrapList } from './mappers';

export const waterPointService = {
  async list(): Promise<WaterPoint[]> {
    const { data } = await apiClient.get<ListResponseDto<PontoAguaDto>>(endpoints.waterPoints.list);
    return unwrapList(data).map(toWaterPoint);
  },

  async getById(id: string): Promise<WaterPoint> {
    const { data } = await apiClient.get<PontoAguaDto>(endpoints.waterPoints.detail(id));
    return toWaterPoint(data);
  },

  async create(input: WaterPointInput): Promise<WaterPoint> {
    const { data } = await apiClient.post<PontoAguaDto>(
      endpoints.waterPoints.list,
      toWaterPointDto(input),
    );
    return toWaterPoint(data);
  },

  async update(id: string, input: WaterPointInput): Promise<WaterPoint> {
    const { data } = await apiClient.put<PontoAguaDto>(
      endpoints.waterPoints.detail(id),
      toWaterPointDto(input),
    );
    return toWaterPoint(data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(endpoints.waterPoints.detail(id));
  },
};
