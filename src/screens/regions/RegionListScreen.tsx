import { EmptyState, Screen } from '@/components/ui';

export function RegionListScreen() {
  return (
    <Screen>
      <EmptyState
        icon="warning-outline"
        title="Regiões afetadas"
        description="Os alertas das regiões com problemas de abastecimento serão exibidos aqui."
      />
    </Screen>
  );
}
