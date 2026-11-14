import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { authEvents } from '@/services/authEvents';
import { authService } from '@/services/authService';
import { sessionStorage } from '@/services/sessionStorage';
import { tokenStore } from '@/services/tokenStore';
import type { AuthSession, SignInInput, SignUpInput, User } from '@/types/models';
import { isTokenExpired } from '@/utils/jwt';

import { useToast } from './ToastContext';

type AuthStatus = 'restoring' | 'signedOut' | 'signedIn';

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  isTeamMember: boolean;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('restoring');

  const startSession = useCallback(async (session: AuthSession) => {
    tokenStore.set(session.token);
    await sessionStorage.save(session);
    setUser(session.user);
    setStatus('signedIn');
  }, []);

  const signOut = useCallback(async () => {
    tokenStore.set(null);
    await sessionStorage.clear();
    // Remove do cache os dados da conta anterior, para não aparecerem em outro login.
    queryClient.clear();
    setUser(null);
    setStatus('signedOut');
  }, [queryClient]);

  // Restaura a sessão salva ao abrir o app.
  useEffect(() => {
    async function restoreSession() {
      const session = await sessionStorage.load();

      if (session && !isTokenExpired(session.token)) {
        tokenStore.set(session.token);
        setUser(session.user);
        setStatus('signedIn');
        return;
      }

      await sessionStorage.clear();
      setStatus('signedOut');
    }

    restoreSession();
  }, []);

  useEffect(() => {
    return authEvents.onUnauthorized(() => {
      if (tokenStore.get()) {
        signOut();
        showToast('Sua sessão expirou. Entre novamente.', 'info');
      }
    });
  }, [showToast, signOut]);

  const signIn = useCallback(
    async (input: SignInInput) => {
      const session = await authService.signIn(input);
      await startSession(session);
    },
    [startSession],
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      const session = await authService.signUp(input);
      await startSession(session);
    },
    [startSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isTeamMember: user?.role === 'EQUIPE',
      signIn,
      signUp,
      signOut,
    }),
    [user, status, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
