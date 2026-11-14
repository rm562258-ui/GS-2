import { StyleSheet, View } from 'react-native';

import { AppText, Badge, Card, Icon } from '@/components/ui';
import { riskLevelInfo } from '@/constants/domain';
import { useAppTheme } from '@/contexts/ThemeContext';
import type { AffectedRegion } from '@/types/models';
import { formatRelativeTime } from '@/utils/formatters';
import { formatAffectedPopulation } from '@/utils/regions';

type RegionCardProps = {
  region: AffectedRegion;
  compact?: boolean;
};

export function RegionCard({ region, compact = false }: RegionCardProps) {
  const { colors, spacing } = useAppTheme();
  const riskInfo = riskLevelInfo[region.riskLevel];

  const stripColor = {
    success: colors.success,
    info: colors.secondary,
    warning: colors.warning,
    danger: colors.danger,
    primary: colors.primary,
    neutral: colors.border,
  }[riskInfo.tone];

  return (
    <Card style={[styles.card, { borderLeftColor: stripColor, gap: spacing.xs }]}>
      <View style={[styles.header, { gap: spacing.sm }]}>
        <View style={styles.flex}>
          <AppText variant="subtitle">{region.name}</AppText>
          <AppText variant="caption" tone="muted">
            {region.city} · atualizado {formatRelativeTime(region.updatedAt)}
          </AppText>
        </View>
        <Badge label={riskInfo.label} tone={riskInfo.tone} />
      </View>

      <AppText variant="bodyStrong">{region.situation}</AppText>
      {!compact ? <AppText tone="muted">{region.description}</AppText> : null}

      {region.affectedPopulation && !compact ? (
        <View style={[styles.row, { gap: spacing.xxs }]}>
          <Icon name="people-outline" size={16} color={colors.textMuted} />
          <AppText variant="caption" tone="muted">
            {formatAffectedPopulation(region.affectedPopulation)}
          </AppText>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 5,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
