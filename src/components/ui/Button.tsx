import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { MIN_TOUCH_SIZE } from '@/theme';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  accessibilityHint,
  style,
  testID,
}: ButtonProps) {
  const { colors, radius, spacing } = useAppTheme();
  const isDisabled = disabled || loading;

  const palette = {
    primary: {
      background: colors.primary,
      pressed: colors.primaryPressed,
      content: colors.onPrimary,
    },
    secondary: {
      background: colors.secondary,
      pressed: colors.secondary,
      content: colors.onSecondary,
    },
    outline: { background: 'transparent', pressed: colors.primarySoft, content: colors.primary },
    ghost: { background: 'transparent', pressed: colors.surfaceMuted, content: colors.primary },
    danger: { background: colors.danger, pressed: colors.danger, content: colors.onPrimary },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: pressed ? palette.pressed : palette.background,
          borderRadius: radius.md,
          paddingHorizontal: spacing.lg,
          borderColor: variant === 'outline' ? colors.primary : 'transparent',
          opacity: isDisabled ? 0.55 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.content} />
      ) : (
        <View style={[styles.content, { gap: spacing.xs }]}>
          {icon ? <Icon name={icon} size={20} color={palette.content} /> : null}
          <AppText variant="button" style={{ color: palette.content }}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_SIZE + 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
