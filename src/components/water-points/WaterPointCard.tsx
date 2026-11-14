import { StyleSheet, View } from 'react-native';

import { AppText, Badge, Card, Icon } from '@/components/ui';
import { waterPointStatusInfo, waterPointTypeInfo } from '@/constants/domain';
import { useAppTheme } from '@/contexts/ThemeContext';
import type { WaterPoint } from '@/types/models';
import { formatDistance } from '@/utils/distance';

import { StockBar } from './StockBar';

type WaterPointCardProps = {
  point: WaterPoint;
  distanceKm?: number;
  onPress: () => void;
};

export function WaterPointCard({ point, distanceKm, onPress }: WaterPointCardProps) {
  const { colors, spacing, radius } = useAppTheme();
  const typeInfo = waterPointTypeInfo[point.type];
  const statusInfo = waterPointStatusInfo[point.status];
  const distanceLabel = distanceKm !== undefined ? formatDistance(distanceKm) : null;

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${point.name}, ${statusInfo.label}${distanceLabel ? `, a ${distanceLabel}` : ''}`}
      style={{ gap: spacing.sm }}
    >
      <View style={[styles.header, { gap: spacing.sm }]}>
        <View
          style={[
            styles.typeIcon,
            { backgroundColor: colors.primarySoft, borderRadius: radius.md },
          ]}
        >
          <Icon name={typeInfo.icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <AppText variant="subtitle" numberOfLines={1}>
            {point.name}
          </AppText>
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {typeInfo.label} · {point.city}
          </AppText>
        </View>
        {distanceLabel ? (
          <AppText variant="bodyStrong" tone="secondary">
            {distanceLabel}
          </AppText>
        ) : null}
      </View>

      <View style={[styles.row, { gap: spacing.xs }]}>
        <Badge label={statusInfo.label} tone={statusInfo.tone} icon={statusInfo.icon} />
        <View style={[styles.row, { gap: spacing.xxs }]}>
          <Icon name="time-outline" size={16} color={colors.textMuted} />
          <AppText variant="caption" tone="muted">
            {point.openingHours}
          </AppText>
        </View>
      </View>

      {point.status !== 'FECHADO' ? (
        <StockBar availableLiters={point.availableLiters} capacityLiters={point.capacityLiters} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
