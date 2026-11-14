import { endpoints } from '@/api/endpoints';
import type { ListResponseDto, SolicitacaoDto, StatusRequestDto } from '@/types/api';
import type { HelpRequest, HelpRequestInput, HelpRequestStatus } from '@/types/models';

import { apiClient } from './apiClient';
import { toHelpRequest, toHelpRequestDto, unwrapList } from './mappers';

export const helpRequestService = {
  async list(): Promise<HelpRequest[]> {
    const { data } = await apiClient.get<ListResponseDto<SolicitacaoDto>>(
      endpoints.helpRequests.list,
    );
    return unwrapList(data).map(toHelpRequest);
  },

  async getById(id: string): Promise<HelpRequest> {
    const { data } = await apiClient.get<SolicitacaoDto>(endpoints.helpRequests.detail(id));
    return toHelpRequest(data);
  },

  async create(input: HelpRequestInput): Promise<HelpRequest> {
    const { data } = await apiClient.post<SolicitacaoDto>(
      endpoints.helpRequests.list,
      toHelpRequestDto(input),
    );
    return toHelpRequest(data);
  },

  async update(id: string, input: HelpRequestInput): Promise<HelpRequest> {
    const { data } = await apiClient.put<SolicitacaoDto>(
      endpoints.helpRequests.detail(id),
      toHelpRequestDto(input),
    );
    return toHelpRequest(data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(endpoints.helpRequests.detail(id));
  },

  async updateStatus(id: string, status: HelpRequestStatus): Promise<HelpRequest> {
    const body: StatusRequestDto = { status };
    const { data } = await apiClient.patch<SolicitacaoDto>(endpoints.helpRequests.status(id), body);
    return toHelpRequest(data);
  },
};
