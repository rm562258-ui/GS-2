import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { AppText } from './AppText';
import { Icon } from './Icon';

type InlineMessageProps = {
  message: string;
  tone?: 'danger' | 'info' | 'warning';
};

export function InlineMessage({ message, tone = 'danger' }: InlineMessageProps) {
  const { colors, radius, spacing } = useAppTheme();

  const toneColors = {
    danger: { background: colors.dangerSoft, content: colors.danger, icon: 'alert-circle' },
    info: {
      background: colors.secondarySoft,
      content: colors.secondary,
      icon: 'information-circle',
    },
    warning: { background: colors.warningSoft, content: colors.warning, icon: 'warning' },
  } as const;
  const current = toneColors[tone];

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        {
          backgroundColor: current.background,
          borderRadius: radius.md,
          padding: spacing.sm,
          gap: spacing.xs,
        },
      ]}
    >
      <Icon name={current.icon} size={20} color={current.content} />
      <AppText variant="label" style={[styles.text, { color: current.content }]}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
});
