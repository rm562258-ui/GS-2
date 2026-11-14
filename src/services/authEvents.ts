// Avisa o AuthContext quando a API recusa o token (HTTP 401), para encerrar a sessão.
type Listener = () => void;

const listeners = new Set<Listener>();

export const authEvents = {
  onUnauthorized(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  emitUnauthorized() {
    listeners.forEach((listener) => listener());
  },
};
