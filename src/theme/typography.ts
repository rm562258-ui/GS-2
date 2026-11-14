import type { TextStyle } from 'react-native';

export const fontFiles = {
  'PlusJakartaSans-Regular': require('../../assets/fonts/PlusJakartaSans-Regular.ttf'),
  'PlusJakartaSans-Medium': require('../../assets/fonts/PlusJakartaSans-Medium.ttf'),
  'PlusJakartaSans-SemiBold': require('../../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
  'PlusJakartaSans-Bold': require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),
  'PlusJakartaSans-ExtraBold': require('../../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
};

export const fontFamily = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extraBold: 'PlusJakartaSans-ExtraBold',
} as const;

export const typography = {
  display: { fontFamily: fontFamily.extraBold, fontSize: 30, lineHeight: 38 },
  title: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 30 },
  subtitle: { fontFamily: fontFamily.semiBold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fontFamily.semiBold, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  button: { fontFamily: fontFamily.bold, fontSize: 16, lineHeight: 22 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
