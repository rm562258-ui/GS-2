import { Alert, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  InlineMessage,
  type ButtonVariant,
  type IconName,
} from '@/components/ui';
import { helpRequestStatusInfo } from '@/constants/domain';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { useUpdateHelpRequestStatus } from '@/hooks/useHelpRequests';
import type { HelpRequest, HelpRequestStatus } from '@/types/models';
import { getErrorMessage } from '@/utils/appError';

type StatusAction = {
  status: HelpRequestStatus;
  label: string;
  icon: IconName;
  variant: ButtonVariant;
  confirmMessage: string;
};

// Próximos passos possíveis do atendimento, conforme a situação atual do pedido.
const nextActions: Partial<Record<HelpRequestStatus, StatusAction[]>> = {
  ABERTA: [
    {
      status: 'EM_ATENDIMENTO',
      label: 'Iniciar atendimento',
      icon: 'car-outline',
      variant: 'primary',
      confirmMessage: 'A equipe vai a caminho para levar água a este endereço?',
    },
    {
      status: 'CANCELADA',
      label: 'Cancelar pedido',
      icon: 'close-circle-outline',
      variant: 'ghost',
      confirmMessage: 'Cancelar este pedido (ex.: duplicado ou fora da área de atuação)?',
    },
  ],
  EM_ATENDIMENTO: [
    {
      status: 'ATENDIDA',
      label: 'Marcar como atendido',
      icon: 'checkmark-circle-outline',
      variant: 'primary',
      confirmMessage: 'A água já foi entregue às pessoas deste pedido?',
    },
  ],
};

type TeamStatusActionsProps = {
  request: HelpRequest;
};

export function TeamStatusActions({ request }: TeamStatusActionsProps) {
  const { spacing } = useAppTheme();
  const { showToast } = useToast();
  const updateStatus = useUpdateHelpRequestStatus();
  const actions = nextActions[request.status] ?? [];

  const confirmAction = (action: StatusAction) => {
    Alert.alert(action.label, action.confirmMessage, [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () =>
          updateStatus.mutate(
            { id: request.id, status: action.status },
            {
              onSuccess: () =>
                showToast(
                  `Pedido marcado como "${helpRequestStatusInfo[action.status].label}".`,
                  'success',
                ),
              onError: (error) => showToast(getErrorMessage(error), 'error'),
            },
          ),
      },
    ]);
  };

  return (
    <Card style={{ gap: spacing.sm }}>
      <AppText variant="overline" tone="primary">
        Atendimento da equipe
      </AppText>

      {actions.length === 0 ? (
        <InlineMessage tone="info" message="O atendimento deste pedido já foi encerrado." />
      ) : (
        <View style={{ gap: spacing.sm }}>
          {actions.map((action) => (
            <Button
              key={action.status}
              title={action.label}
              icon={action.icon}
              variant={action.variant}
              loading={updateStatus.isPending && updateStatus.variables?.status === action.status}
              disabled={updateStatus.isPending}
              onPress={() => confirmAction(action)}
            />
          ))}
        </View>
      )}
    </Card>
  );
}
