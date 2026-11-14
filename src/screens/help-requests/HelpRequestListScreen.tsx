import { View } from 'react-native';

import { Button, EmptyState, FloatingActionButton, Screen } from '@/components/ui';
import type { AppTabScreenProps } from '@/navigation/types';

type HelpRequestListScreenProps = AppTabScreenProps<'HelpRequests'>;

export function HelpRequestListScreen({ navigation }: HelpRequestListScreenProps) {
  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <EmptyState
          icon="hand-left-outline"
          title="Pedidos de ajuda"
          description="A lista de pedidos será exibida aqui."
        />
        <Button
          title="Abrir pedido de exemplo"
          variant="outline"
          onPress={() => navigation.navigate('HelpRequestDetails', { requestId: 'exemplo' })}
        />
      </Screen>
      <FloatingActionButton
        label="Novo pedido"
        onPress={() => navigation.navigate('HelpRequestForm')}
      />
    </View>
  );
}
