import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { warmUpApi } from '@/api/warmUp';
import { queryClient } from '@/config/queryClient';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { createNavigationTheme } from '@/navigation/navigationTheme';
import { RootNavigator } from '@/navigation/RootNavigator';
import { fontFiles } from '@/theme';

SplashScreen.preventAutoHideAsync();
warmUpApi();

function AppContent() {
  const appTheme = useAppTheme();
  const { status } = useAuth();
  const navigationTheme = useMemo(() => createNavigationTheme(appTheme), [appTheme]);
  const isRestoringSession = status === 'restoring';

  // A splash continua visível até a sessão salva ser verificada.
  useEffect(() => {
    if (!isRestoringSession) {
      SplashScreen.hideAsync();
    }
  }, [isRestoringSession]);

  if (isRestoringSession) {
    return null;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={appTheme.isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
