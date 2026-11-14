import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { HelpRequestCard } from '@/components/help-requests/HelpRequestCard';
import {
  Chip,
  EmptyState,
  ErrorState,
  FloatingActionButton,
  LoadingState,
  Screen,
} from '@/components/ui';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useHelpRequests } from '@/hooks/useHelpRequests';
import type { AppTabScreenProps } from '@/navigation/types';
import type { HelpRequestStatus } from '@/types/models';
import { getErrorMessage } from '@/utils/appError';

type HelpRequestListScreenProps = AppTabScreenProps<'HelpRequests'>;

type StatusFilter = 'TODOS' | HelpRequestStatus;

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'ABERTA', label: 'Abertos' },
  { value: 'EM_ATENDIMENTO', label: 'Em atendimento' },
  { value: 'ATENDIDA', label: 'Atendidos' },
];

export function HelpRequestListScreen({ navigation }: HelpRequestListScreenProps) {
  const { spacing } = useAppTheme();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('TODOS');
  const { data, isLoading, isError, error, refetch, isRefetching } = useHelpRequests();

  const requests = useMemo(() => {
    const sorted = [...(data ?? [])].sort(
      (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt),
    );
    return statusFilter === 'TODOS'
      ? sorted
      : sorted.filter((request) => request.status === statusFilter);
  }, [data, statusFilter]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState message="Carregando seus pedidos..." />;
    }

    if (isError) {
      return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;
    }

    return (
      <FlatList
        data={requests}
        keyExtractor={(request) => request.id}
        contentContainerStyle={[styles.list, { padding: spacing.md, gap: spacing.sm }]}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        renderItem={({ item }) => (
          <HelpRequestCard
            request={item}
            onPress={() => navigation.navigate('HelpRequestDetails', { requestId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="hand-left-outline"
            title={statusFilter === 'TODOS' ? 'Nenhum pedido ainda' : 'Nada por aqui'}
            description={
              statusFilter === 'TODOS'
                ? 'Se você ou sua família estiver sem água potável, faça um pedido de ajuda.'
                : 'Nenhum pedido com este status.'
            }
            actionLabel={statusFilter === 'TODOS' ? 'Pedir ajuda' : undefined}
            onAction={() => navigation.navigate('HelpRequestForm')}
          />
        }
      />
    );
  };

  return (
    <View style={styles.flex}>
      <Screen padded={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
          contentContainerStyle={{
            gap: spacing.xs,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
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

      <FloatingActionButton
        label="Pedir ajuda"
        icon="add"
        onPress={() => navigation.navigate('HelpRequestForm')}
      />
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
