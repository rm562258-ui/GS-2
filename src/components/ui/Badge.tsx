import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

export type BadgeTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  icon?: IconName;
};

export function Badge({ label, tone = 'neutral', icon }: BadgeProps) {
  const { colors, radius, spacing } = useAppTheme();

  const toneColors = {
    neutral: { background: colors.surfaceMuted, content: colors.textMuted },
    primary: { background: colors.primarySoft, content: colors.primary },
    info: { background: colors.secondarySoft, content: colors.secondary },
    success: { background: colors.successSoft, content: colors.success },
    warning: { background: colors.warningSoft, content: colors.warning },
    danger: { background: colors.dangerSoft, content: colors.danger },
  }[tone];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: toneColors.background,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.xs + 2,
          gap: spacing.xxs,
        },
      ]}
    >
      {icon ? <Icon name={icon} size={14} color={toneColors.content} /> : null}
      <AppText variant="overline" style={{ color: toneColors.content }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
});
