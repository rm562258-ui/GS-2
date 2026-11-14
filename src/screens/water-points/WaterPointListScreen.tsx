import { Button, EmptyState, Screen } from '@/components/ui';
import type { AppTabScreenProps } from '@/navigation/types';

type WaterPointListScreenProps = AppTabScreenProps<'WaterPoints'>;

export function WaterPointListScreen({ navigation }: WaterPointListScreenProps) {
  return (
    <Screen>
      <EmptyState
        icon="water-outline"
        title="Pontos de água"
        description="Os pontos de distribuição mais próximos serão exibidos aqui."
      />
      <Button
        title="Abrir ponto de exemplo"
        variant="outline"
        onPress={() => navigation.navigate('WaterPointDetails', { pointId: 'exemplo' })}
      />
    </Screen>
  );
}
