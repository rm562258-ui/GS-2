import { endpoints } from '@/api/endpoints';
import type { ListResponseDto, PontoAguaDto } from '@/types/api';
import type { WaterPoint, WaterPointInput } from '@/types/models';

import { isNetworkError } from '@/utils/appError';

import { apiClient } from './apiClient';
import { toWaterPoint, toWaterPointDto, unwrapList } from './mappers';
import { waterPointCache } from './waterPointCache';

export type WaterPointListResult = {
  points: WaterPoint[];
  /** true quando a lista veio do aparelho porque a API não respondeu. */
  fromCache: boolean;
  savedAt?: string;
};

export const waterPointService = {
  async list(): Promise<WaterPoint[]> {
    const { data } = await apiClient.get<ListResponseDto<PontoAguaDto>>(endpoints.waterPoints.list);
    return unwrapList(data).map(toWaterPoint);
  },

  // Em desastres a conexão cai com frequência: sem resposta da API, usa a última lista salva.
  async listWithOfflineFallback(): Promise<WaterPointListResult> {
    try {
      const points = await waterPointService.list();
      await waterPointCache.save(points);
      return { points, fromCache: false };
    } catch (error) {
      const cached = isNetworkError(error) ? await waterPointCache.load() : null;
      if (!cached) {
        throw error;
      }
      return { points: cached.points, fromCache: true, savedAt: cached.savedAt };
    }
  },

  async getById(id: string): Promise<WaterPoint> {
    const { data } = await apiClient.get<PontoAguaDto>(endpoints.waterPoints.detail(id));
    return toWaterPoint(data);
  },

  async create(input: WaterPointInput): Promise<WaterPoint> {
    const { data } = await apiClient.post<PontoAguaDto>(
      endpoints.waterPoints.create,
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
