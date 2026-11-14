import { StyleSheet, View } from 'react-native';

import { HelpRequestCard } from '@/components/help-requests/HelpRequestCard';
import { AppText, SectionHeader, StatTile } from '@/components/ui';
import { WaterPointCard } from '@/components/water-points/WaterPointCard';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useHelpRequests } from '@/hooks/useHelpRequests';
import { useRegions } from '@/hooks/useRegions';
import { useWaterPoints } from '@/hooks/useWaterPoints';

import { SectionStatus } from './SectionStatus';

type TeamHomeProps = {
  onOpenRequests: () => void;
  onOpenRequest: (requestId: string) => void;
  onOpenPoints: () => void;
  onOpenPoint: (pointId: string) => void;
};

export function TeamHome({
  onOpenRequests,
  onOpenRequest,
  onOpenPoints,
  onOpenPoint,
}: TeamHomeProps) {
  const { spacing } = useAppTheme();
  const requests = useHelpRequests();
  const waterPoints = useWaterPoints();
  const regions = useRegions();

  const allRequests = requests.data ?? [];
  const openRequests = allRequests.filter((request) => request.status === 'ABERTA');
  const inProgressCount = allRequests.filter(
    (request) => request.status === 'EM_ATENDIMENTO',
  ).length;
  const criticalRegionsCount = (regions.data ?? []).filter(
    (region) => region.riskLevel === 'CRITICO',
  ).length;

  const mostUrgent = [...openRequests]
    .sort((first, second) => (second.priority ?? -1) - (first.priority ?? -1))
    .slice(0, 3);

  const pointsToRefill = (waterPoints.data?.points ?? []).filter(
    (point) => point.status === 'ESTOQUE_BAIXO' || point.status === 'ESGOTADO',
  );

  return (
    <View style={{ gap: spacing.md }}>
      <View style={[styles.row, { gap: spacing.sm }]}>
        <StatTile
          value={openRequests.length}
          label="Aguardando"
          icon="time-outline"
          tone="warning"
        />
        <StatTile value={inProgressCount} label="Em atendimento" icon="car-outline" tone="info" />
        <StatTile
          value={criticalRegionsCount}
          label="Regiões críticas"
          icon="warning-outline"
          tone="danger"
        />
      </View>

      <SectionHeader
        title="Pedidos mais urgentes"
        actionLabel="Ver fila"
        onAction={onOpenRequests}
      />
      <SectionStatus isLoading={requests.isLoading} error={requests.error} />
      {requests.data && mostUrgent.length === 0 ? (
        <AppText tone="muted">Nenhum pedido aguardando atendimento no momento.</AppText>
      ) : null}
      {mostUrgent.map((request) => (
        <HelpRequestCard
          key={request.id}
          request={request}
          showRequester
          onPress={() => onOpenRequest(request.id)}
        />
      ))}

      <SectionHeader
        title="Pontos para reabastecer"
        actionLabel="Ver pontos"
        onAction={onOpenPoints}
      />
      <SectionStatus isLoading={waterPoints.isLoading} error={waterPoints.error} />
      {waterPoints.data && pointsToRefill.length === 0 ? (
        <AppText tone="muted">Todos os pontos estão com estoque adequado.</AppText>
      ) : null}
      {pointsToRefill.map((point) => (
        <WaterPointCard key={point.id} point={point} onPress={() => onOpenPoint(point.id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
