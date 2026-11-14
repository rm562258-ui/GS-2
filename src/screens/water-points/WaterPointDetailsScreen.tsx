import { Button, EmptyState, Screen } from '@/components/ui';
import type { RootStackScreenProps } from '@/navigation/types';

type WaterPointDetailsScreenProps = RootStackScreenProps<'WaterPointDetails'>;

export function WaterPointDetailsScreen({ navigation, route }: WaterPointDetailsScreenProps) {
  const { pointId } = route.params;

  return (
    <Screen>
      <EmptyState
        icon="location-outline"
        title={`Ponto ${pointId}`}
        description="Endereço, horário e estoque do ponto serão exibidos aqui."
      />
      <Button
        title="Editar ponto"
        icon="create-outline"
        onPress={() => navigation.navigate('WaterPointForm', { pointId })}
      />
    </Screen>
  );
}
