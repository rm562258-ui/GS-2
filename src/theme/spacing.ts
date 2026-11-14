import type { ViewStyle } from 'react-native';

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

// Área mínima de toque recomendada pelas guidelines do Material Design (48dp).
export const MIN_TOUCH_SIZE = 48;

export const shadows = {
  card: {
    shadowColor: '#0E1F19',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  floating: {
    shadowColor: '#0E1F19',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
} satisfies Record<string, ViewStyle>;
