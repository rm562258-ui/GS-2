import { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { RegionCard } from '@/components/regions/RegionCard';
import { EmptyState, ErrorState, InlineMessage, LoadingState, Screen } from '@/components/ui';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRegions } from '@/hooks/useRegions';
import { getErrorMessage } from '@/utils/appError';
import { sortRegionsByRisk } from '@/utils/regions';

export function RegionListScreen() {
  const { spacing } = useAppTheme();
  const { data, isLoading, isError, error, refetch, isRefetching } = useRegions();
  const regions = useMemo(() => sortRegionsByRisk(data ?? []), [data]);

  if (isLoading) {
    return <LoadingState message="Carregando alertas..." />;
  }

  if (isError) {
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={regions}
        keyExtractor={(region) => region.id}
        contentContainerStyle={[styles.list, { padding: spacing.md, gap: spacing.sm }]}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.xs }}>
            <InlineMessage
              tone="info"
              message="Na dúvida sobre a qualidade da água, ferva por pelo menos 1 minuto ou use água dos pontos oficiais."
            />
          </View>
        }
        renderItem={({ item }) => <RegionCard region={item} />}
        ListEmptyComponent={
          <EmptyState
            icon="shield-checkmark-outline"
            title="Nenhum alerta ativo"
            description="No momento não há regiões com problemas de abastecimento registrados."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
});
