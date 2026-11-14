// Variáveis públicas lidas no momento do build (prefixo EXPO_PUBLIC_).
const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '') ?? '';

export const env = {
  /** Endereço base da API REST (ex.: https://nexus-verde-api.azurewebsites.net/api). */
  apiUrl,
  /** Tempo máximo de espera por resposta. APIs em planos gratuitos podem demorar ao "acordar". */
  apiTimeoutMs: 30000,
};
