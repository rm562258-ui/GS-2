import { create } from 'axios';

import { env } from '@/config/env';
import { tokenStore } from '@/services/tokenStore';
import { createIdempotencyKey } from '@/utils/idempotency';

import { toApiError } from './apiError';

// Cliente HTTP da API REST (Axios).
export const httpClient = create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  // Token JWT da sessão atual em todas as requisições autenticadas.
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Criações levam uma chave única para a API evitar registros duplicados.
  if (config.method?.toLowerCase() === 'post' && !config.headers['Idempotency-Key']) {
    config.headers['Idempotency-Key'] = createIdempotencyKey();
  }

  return config;
});

// Toda falha vira um AppError com mensagem pronta para a tela. O HTTP 401 é tratado
// globalmente pelo TanStack Query, que encerra a sessão (ver src/config/queryClient.ts).
httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);
