// API REST do Nexus Verde (Java / Spring Boot), publicada no Render.
const DEFAULT_API_URL = 'https://nexus-verde-java-gs2026-2-tprk.onrender.com/api';

// EXPO_PUBLIC_API_URL permite apontar para outra instância (ex.: a API rodando localmente).
const apiUrl = (process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL).replace(/\/+$/, '');

export const env = {
  apiUrl,
  /** Verificação de saúde da API (Spring Actuator), fora do prefixo /api. */
  healthUrl: `${apiUrl.replace(/\/api$/, '')}/actuator/health`,
  /** No plano gratuito do Render a API "dorme" e pode levar cerca de 1 minuto para acordar. */
  apiTimeoutMs: 60000,
};
