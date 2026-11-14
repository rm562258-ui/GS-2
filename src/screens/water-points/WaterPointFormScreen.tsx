import { EmptyState, Screen } from '@/components/ui';
import type { RootStackScreenProps } from '@/navigation/types';

type WaterPointFormScreenProps = RootStackScreenProps<'WaterPointForm'>;

export function WaterPointFormScreen({ route }: WaterPointFormScreenProps) {
  const isEditing = Boolean(route.params?.pointId);

  return (
    <Screen>
      <EmptyState
        icon="create-outline"
        title={isEditing ? 'Editar ponto de água' : 'Novo ponto de água'}
        description="O formulário do ponto de água será exibido aqui."
      />
    </Screen>
  );
}
