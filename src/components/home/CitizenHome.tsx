import { ImageBackground, StyleSheet, View } from 'react-native';

import { RegionCard } from '@/components/regions/RegionCard';
import { AppText, Button, SectionHeader, StatTile } from '@/components/ui';
import { WaterPointCard } from '@/components/water-points/WaterPointCard';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useHelpRequests } from '@/hooks/useHelpRequests';
import { useRegions } from '@/hooks/useRegions';
import { useWaterPoints } from '@/hooks/useWaterPoints';
import type { HelpRequestStatus } from '@/types/models';
import { normalizeSearchText } from '@/utils/formatters';
import { sortRegionsByRisk } from '@/utils/regions';

import { SectionStatus } from './SectionStatus';

type CitizenHomeProps = {
  onRequestHelp: () => void;
  onOpenRequests: () => void;
  onOpenPoints: () => void;
  onOpenPoint: (pointId: string) => void;
  onOpenRegions: () => void;
};

export function CitizenHome({
  onRequestHelp,
  onOpenRequests,
  onOpenPoints,
  onOpenPoint,
  onOpenRegions,
}: CitizenHomeProps) {
  const { spacing, radius } = useAppTheme();
  const { user } = useAuth();
  const requests = useHelpRequests();
  const waterPoints = useWaterPoints();
  const regions = useRegions();

  const countByStatus = (status: HelpRequestStatus) =>
    (requests.data ?? []).filter((request) => request.status === status).length;

  // Alertas graves, com os da cidade do usuário primeiro.
  const userCity = normalizeSearchText(user?.city ?? '');
  const importantAlerts = sortRegionsByRisk(regions.data ?? [])
    .filter((region) => region.riskLevel === 'CRITICO' || region.riskLevel === 'ALTO')
    .sort(
      (first, second) =>
        Number(normalizeSearchText(second.city) === userCity) -
        Number(normalizeSearchText(first.city) === userCity),
    )
    .slice(0, 2);

  const availablePoints = (waterPoints.data?.points ?? [])
    .filter((point) => point.status === 'DISPONIVEL')
    .sort((first, second) => second.availableLiters - first.availableLiters)
    .slice(0, 2);

  return (
    <View style={{ gap: spacing.md }}>
      <ImageBackground
        source={require('../../../assets/images/banner-home.png')}
        resizeMode="cover"
        style={[styles.hero, { borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm }]}
        imageStyle={{ borderRadius: radius.xl }}
      >
        <AppText variant="title" style={styles.heroText}>
          Precisa de água potável?
        </AppText>
        <AppText style={styles.heroText}>
          Peça ajuda e a equipe de apoio mais próxima será avisada.
        </AppText>
        <Button title="Pedir ajuda" icon="hand-left" variant="light" onPress={onRequestHelp} />
      </ImageBackground>

      <SectionHeader title="Seus pedidos" actionLabel="Ver todos" onAction={onOpenRequests} />
      <SectionStatus isLoading={requests.isLoading} error={requests.error} />
      {requests.data ? (
        <View style={[styles.row, { gap: spacing.sm }]}>
          <StatTile
            value={countByStatus('ABERTA')}
            label="Abertos"
            icon="time-outline"
            tone="warning"
          />
          <StatTile
            value={countByStatus('EM_ATENDIMENTO')}
            label="Em atendimento"
            icon="car-outline"
            tone="info"
          />
          <StatTile
            value={countByStatus('ATENDIDA')}
            label="Atendidos"
            icon="checkmark-circle-outline"
            tone="success"
          />
        </View>
      ) : null}

      <SectionHeader
        title="Alertas importantes"
        actionLabel="Ver alertas"
        onAction={onOpenRegions}
      />
      <SectionStatus isLoading={regions.isLoading} error={regions.error} />
      {regions.data && importantAlerts.length === 0 ? (
        <AppText tone="muted">Nenhum alerta grave no momento.</AppText>
      ) : null}
      {importantAlerts.map((region) => (
        <RegionCard key={region.id} region={region} compact />
      ))}

      <SectionHeader
        title="Água disponível agora"
        actionLabel="Ver pontos"
        onAction={onOpenPoints}
      />
      <SectionStatus isLoading={waterPoints.isLoading} error={waterPoints.error} />
      {availablePoints.map((point) => (
        <WaterPointCard key={point.id} point={point} onPress={() => onOpenPoint(point.id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'flex-end',
  },
  heroText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
  },
});
