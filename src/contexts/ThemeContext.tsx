import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type AppTheme } from '@/theme';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeContextValue = AppTheme & {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const THEME_PREFERENCE_KEY = 'nexusverde.themePreference';

const ThemeContext = createContext<ThemeContextValue>({
  ...lightTheme,
  preference: 'system',
  setPreference: () => undefined,
});

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  // Recupera a escolha salva no aparelho.
  useEffect(() => {
    AsyncStorage.getItem(THEME_PREFERENCE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
        }
      })
      .catch(() => undefined);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(THEME_PREFERENCE_KEY, next).catch(() => undefined);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const scheme = preference === 'system' ? systemScheme : preference;
    const theme = scheme === 'dark' ? darkTheme : lightTheme;
    return { ...theme, preference, setPreference };
  }, [preference, systemScheme, setPreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
