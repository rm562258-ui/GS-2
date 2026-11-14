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
  StatTile,
} from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useHelpRequests } from '@/hooks/useHelpRequests';
import type { AppTabScreenProps } from '@/navigation/types';
import type { HelpRequest, HelpRequestStatus } from '@/types/models';
import { getErrorMessage } from '@/utils/appError';

type HelpRequestListScreenProps = AppTabScreenProps<'HelpRequests'>;

type StatusFilter = 'TODOS' | HelpRequestStatus;

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'ABERTA', label: 'Abertos' },
  { value: 'EM_ATENDIMENTO', label: 'Em atendimento' },
  { value: 'ATENDIDA', label: 'Atendidos' },
];

const newestFirst = (first: HelpRequest, second: HelpRequest) =>
  Date.parse(second.createdAt) - Date.parse(first.createdAt);

// Fila da equipe: maior prioridade primeiro; empate, quem espera há mais tempo.
const byPriority = (first: HelpRequest, second: HelpRequest) =>
  (second.priority ?? -1) - (first.priority ?? -1) ||
  Date.parse(first.createdAt) - Date.parse(second.createdAt);

export function HelpRequestListScreen({ navigation }: HelpRequestListScreenProps) {
  const { spacing } = useAppTheme();
  const { isTeamMember } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('TODOS');
  const { data, isLoading, isError, error, refetch, isRefetching } = useHelpRequests();

  const requests = useMemo(() => {
    const sorted = [...(data ?? [])].sort(isTeamMember ? byPriority : newestFirst);
    return statusFilter === 'TODOS'
      ? sorted
      : sorted.filter((request) => request.status === statusFilter);
  }, [data, statusFilter, isTeamMember]);

  const countByStatus = (status: HelpRequestStatus) =>
    (data ?? []).filter((request) => request.status === status).length;

  const renderTeamSummary = () => (
    <View style={[styles.summary, { gap: spacing.sm }]}>
      <StatTile
        value={countByStatus('ABERTA')}
        label="Aguardando"
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
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingState
          message={isTeamMember ? 'Carregando a fila de pedidos...' : 'Carregando seus pedidos...'}
        />
      );
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
        ListHeaderComponent={isTeamMember ? renderTeamSummary() : undefined}
        renderItem={({ item }) => (
          <HelpRequestCard
            request={item}
            showRequester={isTeamMember}
            onPress={() => navigation.navigate('HelpRequestDetails', { requestId: item.id })}
          />
        )}
        ListEmptyComponent={
          isTeamMember ? (
            <EmptyState
              icon="checkmark-done-outline"
              title="Nenhum pedido aqui"
              description="Não há pedidos com este status no momento."
            />
          ) : (
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
          )
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

      {/* Só o cidadão abre pedidos; a equipe atende a fila. */}
      {!isTeamMember ? (
        <FloatingActionButton
          label="Pedir ajuda"
          icon="add"
          onPress={() => navigation.navigate('HelpRequestForm')}
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
  summary: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 96,
  },
});
