import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { AppText } from './AppText';
import type { BadgeTone } from './Badge';
import { Icon, type IconName } from './Icon';

type StatTileProps = {
  value: number | string;
  label: string;
  icon: IconName;
  tone?: Exclude<BadgeTone, 'neutral'>;
};

// Indicador numérico compacto, usado nos resumos do Início e da fila da equipe.
export function StatTile({ value, label, icon, tone = 'primary' }: StatTileProps) {
  const { colors, radius, spacing } = useAppTheme();

  const toneColors = {
    primary: { background: colors.primarySoft, content: colors.primary },
    info: { background: colors.secondarySoft, content: colors.secondary },
    success: { background: colors.successSoft, content: colors.success },
    warning: { background: colors.warningSoft, content: colors.warning },
    danger: { background: colors.dangerSoft, content: colors.danger },
  }[tone];

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={[
        styles.tile,
        {
          backgroundColor: toneColors.background,
          borderRadius: radius.lg,
          padding: spacing.sm,
          gap: spacing.xxs,
        },
      ]}
    >
      <Icon name={icon} size={20} color={toneColors.content} />
      <AppText variant="title" style={{ color: toneColors.content }}>
        {value}
      </AppText>
      <AppText variant="caption" tone="muted" numberOfLines={2}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 96,
  },
});
