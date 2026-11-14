import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import type { AppTheme } from '@/theme';

// Converte o tema do app para o formato esperado pelo React Navigation.
export function createNavigationTheme(appTheme: AppTheme): Theme {
  const baseTheme = appTheme.isDark ? DarkTheme : DefaultTheme;
  const { colors, fontFamily } = appTheme;

  return {
    ...baseTheme,
    dark: appTheme.isDark,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.danger,
    },
    fonts: {
      regular: { fontFamily: fontFamily.regular, fontWeight: '400' },
      medium: { fontFamily: fontFamily.medium, fontWeight: '500' },
      bold: { fontFamily: fontFamily.bold, fontWeight: '700' },
      heavy: { fontFamily: fontFamily.extraBold, fontWeight: '800' },
    },
  };
}
