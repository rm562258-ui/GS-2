// Rotas da API centralizadas em um único lugar.
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  helpRequests: {
    list: '/solicitacoes',
    detail: (id: string) => `/solicitacoes/${id}`,
    status: (id: string) => `/solicitacoes/${id}/status`,
  },
  waterPoints: {
    list: '/pontos-agua',
    detail: (id: string) => `/pontos-agua/${id}`,
  },
  regions: {
    list: '/regioes',
  },
} as const;
