import { EmptyState, Screen } from '@/components/ui';
import type { RootStackScreenProps } from '@/navigation/types';

type HelpRequestFormScreenProps = RootStackScreenProps<'HelpRequestForm'>;

export function HelpRequestFormScreen({ route }: HelpRequestFormScreenProps) {
  const isEditing = Boolean(route.params?.requestId);

  return (
    <Screen>
      <EmptyState
        icon="create-outline"
        title={isEditing ? 'Editar pedido' : 'Novo pedido de ajuda'}
        description="O formulário do pedido será exibido aqui."
      />
    </Screen>
  );
}
