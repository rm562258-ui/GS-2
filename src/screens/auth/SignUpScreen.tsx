import { Button, EmptyState, Screen } from '@/components/ui';
import type { RootStackScreenProps } from '@/navigation/types';

type SignUpScreenProps = RootStackScreenProps<'SignUp'>;

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  return (
    <Screen>
      <EmptyState
        icon="person-add-outline"
        title="Cadastro de cidadão"
        description="O formulário de cadastro será exibido aqui."
      />
      <Button title="Já tenho conta" variant="ghost" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
