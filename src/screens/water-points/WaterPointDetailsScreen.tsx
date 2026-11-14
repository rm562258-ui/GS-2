import { Alert, Linking, StyleSheet, View } from 'react-native';

import {
  AppText,
  Badge,
  Button,
  Card,
  ErrorState,
  Icon,
  InfoRow,
  LoadingState,
  Screen,
} from '@/components/ui';
import { StockBar } from '@/components/water-points/StockBar';
import { waterPointStatusInfo, waterPointTypeInfo } from '@/constants/domain';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useDeleteWaterPoint, useWaterPoint } from '@/hooks/useWaterPoints';
import type { RootStackScreenProps } from '@/navigation/types';
import { getErrorMessage } from '@/utils/appError';
import { distanceInKm, formatDistance } from '@/utils/distance';
import { formatDateTime, formatLiters } from '@/utils/formatters';
import { openInMaps } from '@/utils/maps';

type WaterPointDetailsScreenProps = RootStackScreenProps<'WaterPointDetails'>;

export function WaterPointDetailsScreen({ navigation, route }: WaterPointDetailsScreenProps) {
  const { pointId } = route.params;
  const { colors, spacing, radius } = useAppTheme();
  const { isTeamMember } = useAuth();
  const { showToast } = useToast();
  const { data: point, isLoading, isError, error, refetch } = useWaterPoint(pointId);
  const deletePoint = useDeleteWaterPoint();
  const { coordinates } = useCurrentLocation({ loadOnMount: true });

  if (isLoading) {
    return <LoadingState message="Carregando o ponto de água..." />;
  }

  if (isError || !point) {
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;
  }

  const typeInfo = waterPointTypeInfo[point.type];
  const statusInfo = waterPointStatusInfo[point.status];
  const distance = coordinates ? formatDistance(distanceInKm(coordinates, point)) : null;

  const openDirections = () => {
    openInMaps({ latitude: point.latitude, longitude: point.longitude }).catch(() =>
      showToast('Não foi possível abrir o mapa.', 'error'),
    );
  };

  const callPoint = () => {
    const digits = point.contactPhone?.replace(/\D/g, '');
    Linking.openURL(`tel:${digits}`).catch(() =>
      showToast('Não foi possível iniciar a ligação.', 'error'),
    );
  };

  const confirmDelete = () => {
    Alert.alert('Excluir ponto de água', `Remover "${point.name}" da lista de pontos?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          deletePoint.mutate(point.id, {
            onSuccess: () => {
              showToast('Ponto de água excluído.', 'success');
              navigation.goBack();
            },
            onError: (deleteError) => showToast(getErrorMessage(deleteError), 'error'),
          }),
      },
    ]);
  };

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <View style={{ gap: spacing.md }}>
        <Card style={{ gap: spacing.sm }}>
          <View style={[styles.header, { gap: spacing.sm }]}>
            <View
              style={[
                styles.typeIcon,
                { backgroundColor: colors.primarySoft, borderRadius: radius.md },
              ]}
            >
              <Icon name={typeInfo.icon} size={26} color={colors.primary} />
            </View>
            <View style={styles.flex}>
              <AppText variant="title">{point.name}</AppText>
              <AppText variant="caption" tone="muted">
                {typeInfo.label}
              </AppText>
            </View>
          </View>
          <Badge label={statusInfo.label} tone={statusInfo.tone} icon={statusInfo.icon} />
          {point.status !== 'FECHADO' ? (
            <StockBar
              availableLiters={point.availableLiters}
              capacityLiters={point.capacityLiters}
            />
          ) : null}
        </Card>

        <Card style={{ gap: spacing.md }}>
          <InfoRow
            icon="location-outline"
            label="Endereço"
            value={`${point.address} · ${point.city}`}
          />
          {distance ? (
            <InfoRow icon="navigate-outline" label="Distância de você" value={distance} />
          ) : null}
          <InfoRow
            icon="time-outline"
            label="Horário de funcionamento"
            value={point.openingHours}
          />
          {point.contactPhone ? (
            <InfoRow icon="call-outline" label="Telefone" value={point.contactPhone} />
          ) : null}
          <InfoRow
            icon="water-outline"
            label="Capacidade total"
            value={formatLiters(point.capacityLiters)}
          />
          <InfoRow
            icon="refresh-outline"
            label="Atualizado em"
            value={formatDateTime(point.updatedAt)}
          />
        </Card>

        <View style={{ gap: spacing.sm }}>
          <Button title="Como chegar" icon="navigate" onPress={openDirections} />
          {point.contactPhone ? (
            <Button title="Ligar para o ponto" variant="outline" icon="call" onPress={callPoint} />
          ) : null}
        </View>

        {isTeamMember ? (
          <Card style={{ gap: spacing.sm }}>
            <AppText variant="overline" tone="primary">
              Gestão da equipe
            </AppText>
            <Button
              title="Editar ponto"
              variant="outline"
              icon="create-outline"
              onPress={() => navigation.navigate('WaterPointForm', { pointId: point.id })}
            />
            <Button
              title="Excluir ponto"
              variant="danger"
              icon="trash-outline"
              loading={deletePoint.isPending}
              onPress={confirmDelete}
            />
          </Card>
        ) : null}
      </View>
    </Screen>
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
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
