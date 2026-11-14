import { View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import type { AppTabScreenProps } from '@/navigation/types';

type HomeScreenProps = AppTabScreenProps<'Home'>;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { spacing } = useAppTheme();
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? '';

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <View style={{ gap: spacing.md }}>
        <AppText variant="title">Olá, {firstName}!</AppText>
        <AppText tone="muted">
          O resumo dos pedidos, pontos de água e alertas aparecerá aqui.
        </AppText>
        <Button
          title="Pedir ajuda"
          icon="hand-left-outline"
          onPress={() => navigation.navigate('HelpRequestForm')}
        />
        <Button
          title="Ver pontos de água"
          variant="outline"
          icon="water-outline"
          onPress={() => navigation.navigate('WaterPoints')}
        />
      </View>
    </Screen>
  );
}
