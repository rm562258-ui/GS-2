import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { fontFiles } from '@/theme';

SplashScreen.preventAutoHideAsync();

function BrandPreview() {
  const { colors, typography, spacing, isDark } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.xl }]}>
      <Image
        source={require('./assets/images/logo.png')}
        style={styles.logo}
        accessibilityIgnoresInvertColors
      />
      <Text style={[typography.display, { color: colors.text }]}>Nexus Verde</Text>
      <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
        Conectando pessoas, tecnologia e água para salvar vidas.
      </Text>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <BrandPreview />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
});
