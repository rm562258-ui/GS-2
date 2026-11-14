import * as SecureStore from 'expo-secure-store';

import type { AuthSession } from '@/types/models';

// O token fica no armazenamento seguro do aparelho (Keystore no Android, Keychain no iOS).
const SESSION_KEY = 'nexusverde.session';

export const sessionStorage = {
  async save(session: AuthSession): Promise<void> {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  },

  async load(): Promise<AuthSession | null> {
    try {
      const stored = await SecureStore.getItemAsync(SESSION_KEY);
      return stored ? (JSON.parse(stored) as AuthSession) : null;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },
};
