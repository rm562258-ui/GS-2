import { Text, type TextProps, type TextStyle } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import type { ThemeColors, TypographyVariant } from '@/theme';

export type TextTone =
  'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'onPrimary';

const toneToColor: Record<TextTone, keyof ThemeColors> = {
  default: 'text',
  muted: 'textMuted',
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  onPrimary: 'onPrimary',
};

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  tone?: TextTone;
  align?: TextStyle['textAlign'];
};

export function AppText({
  variant = 'body',
  tone = 'default',
  align,
  style,
  ...rest
}: AppTextProps) {
  const { colors, typography } = useAppTheme();

  return (
    <Text
      style={[typography[variant], { color: colors[toneToColor[tone]], textAlign: align }, style]}
      {...rest}
    />
  );
}
