import { Button, EmptyState, Screen } from '@/components/ui';
import type { RootStackScreenProps } from '@/navigation/types';

type HelpRequestDetailsScreenProps = RootStackScreenProps<'HelpRequestDetails'>;

export function HelpRequestDetailsScreen({ navigation, route }: HelpRequestDetailsScreenProps) {
  const { requestId } = route.params;

  return (
    <Screen>
      <EmptyState
        icon="document-text-outline"
        title={`Pedido ${requestId}`}
        description="Os detalhes do pedido serão exibidos aqui."
      />
      <Button
        title="Editar pedido"
        icon="create-outline"
        onPress={() => navigation.navigate('HelpRequestForm', { requestId })}
      />
    </Screen>
  );
}
