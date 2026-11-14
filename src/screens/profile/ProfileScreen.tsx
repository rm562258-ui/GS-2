import { View } from 'react-native';

import { Button, EmptyState, Screen } from '@/components/ui';
import { useAppTheme } from '@/contexts/ThemeContext';
import type { AppTabScreenProps } from '@/navigation/types';

type ProfileScreenProps = AppTabScreenProps<'Profile'>;

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { spacing } = useAppTheme();

  return (
    <Screen>
      <EmptyState
        icon="person-circle-outline"
        title="Seu perfil"
        description="Seus dados e as preferências do app serão exibidos aqui."
      />
      <View style={{ gap: spacing.sm }}>
        <Button
          title="Sobre o App"
          variant="outline"
          icon="information-circle-outline"
          onPress={() => navigation.navigate('About')}
        />
        <Button
          title="Sair"
          variant="ghost"
          icon="log-out-outline"
          onPress={() => navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] })}
        />
      </View>
    </Screen>
  );
}
