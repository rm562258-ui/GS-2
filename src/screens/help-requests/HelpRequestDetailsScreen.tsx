import { Alert, StyleSheet, View } from 'react-native';

import { TeamStatusActions } from '@/components/help-requests/TeamStatusActions';
import {
  AppText,
  Badge,
  Button,
  Card,
  ErrorState,
  Icon,
  InfoRow,
  InlineMessage,
  LoadingState,
  Screen,
} from '@/components/ui';
import { helpRequestStatusInfo, helpRequestTypeInfo, urgencyInfo } from '@/constants/domain';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { useDeleteHelpRequest, useHelpRequest } from '@/hooks/useHelpRequests';
import type { RootStackScreenProps } from '@/navigation/types';
import { getErrorMessage } from '@/utils/appError';
import { formatDateTime, pluralize } from '@/utils/formatters';
import { openInMaps } from '@/utils/maps';

type HelpRequestDetailsScreenProps = RootStackScreenProps<'HelpRequestDetails'>;

export function HelpRequestDetailsScreen({ navigation, route }: HelpRequestDetailsScreenProps) {
  const { requestId } = route.params;
  const { colors, spacing, radius } = useAppTheme();
  const { user, isTeamMember } = useAuth();
  const { showToast } = useToast();
  const { data: request, isLoading, isError, error, refetch } = useHelpRequest(requestId);
  const deleteRequest = useDeleteHelpRequest();

  if (isLoading) {
    return <LoadingState message="Carregando o pedido..." />;
  }

  if (isError || !request) {
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;
  }

  const typeInfo = helpRequestTypeInfo[request.type];
  const statusInfo = helpRequestStatusInfo[request.status];
  const isOwner = request.requester.id === user?.id;
  const canChange = isOwner && request.status === 'ABERTA';

  const confirmDelete = () => {
    Alert.alert('Excluir pedido', 'Tem certeza? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          deleteRequest.mutate(request.id, {
            onSuccess: () => {
              showToast('Pedido excluído.', 'success');
              navigation.goBack();
            },
            onError: (deleteError) => showToast(getErrorMessage(deleteError), 'error'),
          }),
      },
    ]);
  };

  const openMap = () => {
    openInMaps({
      latitude: request.latitude,
      longitude: request.longitude,
      address: `${request.address}, ${request.city}`,
    }).catch(() => showToast('Não foi possível abrir o mapa.', 'error'));
  };

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <View style={{ gap: spacing.md }}>
        <Card style={{ gap: spacing.sm }}>
          <View style={[styles.header, { gap: spacing.sm }]}>
            <View
              style={[
                styles.typeIcon,
                { backgroundColor: colors.secondarySoft, borderRadius: radius.md },
              ]}
            >
              <Icon name={typeInfo.icon} size={26} color={colors.secondary} />
            </View>
            <View style={styles.flex}>
              <AppText variant="title">{typeInfo.label}</AppText>
              <AppText variant="caption" tone="muted">
                Aberto em {formatDateTime(request.createdAt)}
              </AppText>
            </View>
          </View>
          <View style={[styles.badges, { gap: spacing.xs }]}>
            <Badge label={statusInfo.label} tone={statusInfo.tone} icon={statusInfo.icon} />
            <Badge
              label={`Urgência ${urgencyInfo[request.urgency].label.toLowerCase()}`}
              tone={urgencyInfo[request.urgency].tone}
            />
          </View>
          <AppText>{request.description}</AppText>
        </Card>

        {request.priority !== undefined || request.aiAnalysis ? (
          <Card style={{ gap: spacing.xs }}>
            <AppText variant="overline" tone="primary">
              Priorização do atendimento
            </AppText>
            {request.priority !== undefined ? (
              <AppText variant="subtitle">Prioridade {request.priority} de 100</AppText>
            ) : null}
            {request.aiAnalysis ? <AppText tone="muted">{request.aiAnalysis}</AppText> : null}
          </Card>
        ) : null}

        <Card style={{ gap: spacing.md }}>
          <InfoRow
            icon="people-outline"
            label="Pessoas sem água"
            value={pluralize(request.peopleCount, 'pessoa', 'pessoas')}
          />
          <InfoRow
            icon="accessibility-outline"
            label="Crianças, idosos, gestantes ou PcD"
            value={request.hasVulnerablePeople ? 'Sim' : 'Não'}
          />
          <InfoRow
            icon="location-outline"
            label="Endereço"
            value={`${request.address} · ${request.city}`}
          />
          {!isOwner ? (
            <InfoRow icon="person-outline" label="Solicitante" value={request.requester.name} />
          ) : null}
          <InfoRow
            icon="time-outline"
            label="Última atualização"
            value={formatDateTime(request.updatedAt)}
          />
        </Card>

        <Button title="Ver no mapa" variant="outline" icon="map-outline" onPress={openMap} />

        {isTeamMember ? <TeamStatusActions request={request} /> : null}

        {isOwner && !canChange ? (
          <InlineMessage
            tone="info"
            message="Este pedido já está sendo tratado pela equipe e não pode mais ser alterado."
          />
        ) : null}

        {canChange ? (
          <View style={{ gap: spacing.sm }}>
            <Button
              title="Editar pedido"
              icon="create-outline"
              onPress={() => navigation.navigate('HelpRequestForm', { requestId: request.id })}
            />
            <Button
              title="Excluir pedido"
              variant="danger"
              icon="trash-outline"
              loading={deleteRequest.isPending}
              onPress={confirmDelete}
            />
          </View>
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
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
