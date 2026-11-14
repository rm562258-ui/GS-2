// Guarda em memória o token da sessão atual, lido em cada requisição autenticada.
let currentToken: string | null = null;

export const tokenStore = {
  get: () => currentToken,
  set: (token: string | null) => {
    currentToken = token;
  },
};
