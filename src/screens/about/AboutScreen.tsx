import { EmptyState, Screen } from '@/components/ui';

export function AboutScreen() {
  return (
    <Screen>
      <EmptyState
        icon="information-circle-outline"
        title="Sobre o App"
        description="Versão, hash do commit e integrantes serão exibidos aqui."
      />
    </Screen>
  );
}
