export const palette = {
  green50: '#E6F5EE',
  green100: '#CBEBDC',
  green400: '#34C38A',
  green600: '#0B7A55',
  green700: '#08603F',
  green900: '#04231A',
  blue50: '#E3F0FA',
  blue400: '#4FB3F2',
  blue600: '#0A6FB8',
  blue700: '#08578F',
  amber50: '#FEF3C7',
  amber400: '#FBBF24',
  amber700: '#B45309',
  red50: '#FDECEC',
  red400: '#F87171',
  red700: '#C62828',
  gray50: '#F4F8F6',
  gray100: '#EAF1EE',
  gray200: '#D5E2DC',
  gray500: '#7A8C84',
  gray700: '#4B5F57',
  gray900: '#0E1F19',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  placeholder: string;
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  onPrimary: string;
  secondary: string;
  secondarySoft: string;
  onSecondary: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  heroStart: string;
  heroEnd: string;
  overlay: string;
};

export const lightColors: ThemeColors = {
  background: palette.gray50,
  surface: palette.white,
  surfaceMuted: palette.gray100,
  border: palette.gray200,
  text: palette.gray900,
  textMuted: palette.gray700,
  placeholder: palette.gray500,
  primary: palette.green600,
  primaryPressed: palette.green700,
  primarySoft: palette.green50,
  onPrimary: palette.white,
  secondary: palette.blue600,
  secondarySoft: palette.blue50,
  onSecondary: palette.white,
  success: '#15803D',
  successSoft: palette.green50,
  warning: palette.amber700,
  warningSoft: palette.amber50,
  danger: palette.red700,
  dangerSoft: palette.red50,
  heroStart: palette.green600,
  heroEnd: palette.blue600,
  overlay: 'rgba(14, 31, 25, 0.5)',
};

export const darkColors: ThemeColors = {
  background: '#0B1411',
  surface: '#13201B',
  surfaceMuted: '#1B2B25',
  border: '#2A3D35',
  text: '#E8F2EE',
  textMuted: '#A3B5AD',
  placeholder: '#7F938A',
  primary: palette.green400,
  primaryPressed: '#2AA877',
  primarySoft: '#15382B',
  onPrimary: palette.green900,
  secondary: palette.blue400,
  secondarySoft: '#13304A',
  onSecondary: '#06223A',
  success: '#4ADE80',
  successSoft: '#15382B',
  warning: palette.amber400,
  warningSoft: '#3A2E0E',
  danger: palette.red400,
  dangerSoft: '#3D1A1A',
  heroStart: '#0A5E43',
  heroEnd: '#0A4F84',
  overlay: 'rgba(0, 0, 0, 0.6)',
};
