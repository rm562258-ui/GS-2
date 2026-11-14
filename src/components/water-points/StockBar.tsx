import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useAppTheme } from '@/contexts/ThemeContext';
import { formatLiters } from '@/utils/formatters';

type StockBarProps = {
  availableLiters: number;
  capacityLiters: number;
};

export function StockBar({ availableLiters, capacityLiters }: StockBarProps) {
  const { colors, radius, spacing } = useAppTheme();
  const ratio = capacityLiters > 0 ? Math.min(availableLiters / capacityLiters, 1) : 0;
  const percent = Math.round(ratio * 100);
  const barColor = ratio > 0.4 ? colors.success : ratio > 0.15 ? colors.warning : colors.danger;

  return (
    <View
      style={{ gap: spacing.xxs }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Estoque: ${formatLiters(availableLiters)} de ${formatLiters(capacityLiters)}`}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
    >
      <View style={styles.labels}>
        <AppText variant="caption" tone="muted">
          Estoque disponível
        </AppText>
        <AppText variant="caption" tone="muted">
          {formatLiters(availableLiters)} de {formatLiters(capacityLiters)}
        </AppText>
      </View>
      <View
        style={[styles.track, { backgroundColor: colors.surfaceMuted, borderRadius: radius.pill }]}
      >
        <View
          style={[
            styles.fill,
            { width: `${percent}%`, backgroundColor: barColor, borderRadius: radius.pill },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  track: {
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
