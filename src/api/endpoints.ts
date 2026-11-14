// Rotas da API centralizadas em um único lugar (relativas a env.apiUrl, que já inclui /api).

// As listagens da API são paginadas (Spring Data). O app busca uma página grande e
// faz filtros e ordenação na própria tela.
const LIST_PAGE_QUERY = '?page=0&size=200';

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  helpRequests: {
    create: '/solicitacoes',
    list: `/solicitacoes${LIST_PAGE_QUERY}`,
    detail: (id: string) => `/solicitacoes/${id}`,
    status: (id: string) => `/solicitacoes/${id}/status`,
  },
  waterPoints: {
    create: '/pontos-agua',
    list: `/pontos-agua${LIST_PAGE_QUERY}`,
    detail: (id: string) => `/pontos-agua/${id}`,
  },
  regions: {
    list: `/regioes${LIST_PAGE_QUERY}`,
  },
} as const;
