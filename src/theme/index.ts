import { darkColors, lightColors, type ThemeColors } from './colors';
import { radius, shadows, spacing } from './spacing';
import { fontFamily, typography } from './typography';

export type AppTheme = {
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
};

const baseTheme = { spacing, radius, shadows, typography, fontFamily };

export const lightTheme: AppTheme = { ...baseTheme, isDark: false, colors: lightColors };
export const darkTheme: AppTheme = { ...baseTheme, isDark: true, colors: darkColors };

export { darkColors, lightColors, palette } from './colors';
export type { ThemeColors } from './colors';
export { MIN_TOUCH_SIZE, radius, shadows, spacing } from './spacing';
export { fontFamily, fontFiles, typography } from './typography';
export type { TypographyVariant } from './typography';
