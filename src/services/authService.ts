import { endpoints } from '@/api/endpoints';
import type { AuthResponseDto, LoginRequestDto, RegisterRequestDto } from '@/types/api';
import type { AuthSession, SignInInput, SignUpInput } from '@/types/models';

import { apiClient } from './apiClient';
import { toAuthSession } from './mappers';

export const authService = {
  async signIn({ email, password }: SignInInput): Promise<AuthSession> {
    const body: LoginRequestDto = { email: email.trim(), senha: password };
    const { data } = await apiClient.post<AuthResponseDto>(endpoints.auth.login, body);
    return toAuthSession(data);
  },

  async signUp({ name, email, password, phone, city }: SignUpInput): Promise<AuthSession> {
    const body: RegisterRequestDto = {
      nome: name.trim(),
      email: email.trim(),
      senha: password,
      telefone: phone?.trim() || undefined,
      cidade: city?.trim() || undefined,
    };
    const { data } = await apiClient.post<AuthResponseDto>(endpoints.auth.register, body);
    return toAuthSession(data);
  },
};
