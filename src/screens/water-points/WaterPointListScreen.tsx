import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  Chip,
  EmptyState,
  ErrorState,
  FloatingActionButton,
  InlineMessage,
  LoadingState,
  Screen,
  TextField,
} from '@/components/ui';
import { WaterPointCard } from '@/components/water-points/WaterPointCard';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useWaterPoints } from '@/hooks/useWaterPoints';
import type { AppTabScreenProps } from '@/navigation/types';
import type { WaterPointStatus } from '@/types/models';
import { getErrorMessage } from '@/utils/appError';
import { distanceInKm } from '@/utils/distance';
import { formatDateTime, normalizeSearchText } from '@/utils/formatters';

type WaterPointListScreenProps = AppTabScreenProps<'WaterPoints'>;

type StatusFilter = 'TODOS' | WaterPointStatus;

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'DISPONIVEL', label: 'Disponíveis' },
  { value: 'ESTOQUE_BAIXO', label: 'Estoque baixo' },
  { value: 'ESGOTADO', label: 'Esgotados' },
];

// Sem localização, os pontos com água disponível aparecem primeiro.
const statusOrder: Record<WaterPointStatus, number> = {
  DISPONIVEL: 0,
  ESTOQUE_BAIXO: 1,
  ESGOTADO: 2,
  FECHADO: 3,
};

export function WaterPointListScreen({ navigation }: WaterPointListScreenProps) {
  const { spacing } = useAppTheme();
  const { isTeamMember } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('TODOS');
  const { data, isLoading, isError, error, refetch, isRefetching } = useWaterPoints();
  const location = useCurrentLocation({ loadOnMount: true });

  const items = useMemo(() => {
    const term = normalizeSearchText(search);
    const coordinates = location.coordinates;

    return (data?.points ?? [])
      .filter((point) => statusFilter === 'TODOS' || point.status === statusFilter)
      .filter(
        (point) =>
          !term ||
          normalizeSearchText(`${point.name} ${point.address} ${point.city}`).includes(term),
      )
      .map((point) => ({
        point,
        distanceKm: coordinates ? distanceInKm(coordinates, point) : undefined,
      }))
      .sort((first, second) => {
        if (first.distanceKm !== undefined && second.distanceKm !== undefined) {
          return first.distanceKm - second.distanceKm;
        }
        return (
          statusOrder[first.point.status] - statusOrder[second.point.status] ||
          first.point.name.localeCompare(second.point.name)
        );
      });
  }, [data, search, statusFilter, location.coordinates]);

  const renderHeader = () => (
    <View style={{ gap: spacing.sm }}>
      {data?.fromCache ? (
        <InlineMessage
          tone="warning"
          message={`Sem conexão. Mostrando os pontos salvos em ${formatDateTime(data.savedAt ?? '')}.`}
        />
      ) : null}
      {location.permission !== 'granted' ? (
        <Card style={{ gap: spacing.xs }}>
          <AppText variant="bodyStrong">Veja os pontos mais perto de você</AppText>
          <AppText variant="caption" tone="muted">
            Permita o acesso à localização para ordenar os pontos pela distância.
          </AppText>
          <Button
            title="Usar minha localização"
            variant="outline"
            icon="locate-outline"
            loading={location.isLoading}
            onPress={location.requestLocation}
          />
        </Card>
      ) : null}
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState message="Buscando pontos de água..." />;
    }

    if (isError) {
      return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;
    }

    return (
      <FlatList
        data={items}
        keyExtractor={(item) => item.point.id}
        contentContainerStyle={[styles.list, { padding: spacing.md, gap: spacing.sm }]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }) => (
          <WaterPointCard
            point={item.point}
            distanceKm={item.distanceKm}
            onPress={() => navigation.navigate('WaterPointDetails', { pointId: item.point.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="water-outline"
            title="Nenhum ponto encontrado"
            description="Tente outro filtro ou termo de busca."
          />
        }
      />
    );
  };

  return (
    <View style={styles.flex}>
      <Screen padded={false}>
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
          <TextField
            label="Buscar ponto"
            icon="search-outline"
            placeholder="Nome, bairro ou cidade"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
          contentContainerStyle={{
            gap: spacing.xs,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xxs,
          }}
        >
          {filters.map((filter) => (
            <Chip
              key={filter.value}
              label={filter.label}
              selected={statusFilter === filter.value}
              onPress={() => setStatusFilter(filter.value)}
            />
          ))}
        </ScrollView>
        {renderContent()}
      </Screen>

      {isTeamMember ? (
        <FloatingActionButton
          label="Novo ponto"
          onPress={() => navigation.navigate('WaterPointForm')}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  filters: {
    flexGrow: 0,
    flexShrink: 0,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 96,
  },
});
