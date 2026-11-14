import { Alert, View } from 'react-native';

import { AppText, Badge, Button, Card, Screen } from '@/components/ui';
import { userRoleLabels } from '@/constants/domain';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import type { AppTabScreenProps } from '@/navigation/types';

type ProfileScreenProps = AppTabScreenProps<'Profile'>;

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { spacing } = useAppTheme();
  const { user, signOut } = useAuth();

  const confirmSignOut = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair do Nexus Verde?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <Screen scroll>
      <View style={{ gap: spacing.md }}>
        <Card style={{ gap: spacing.xs }}>
          <AppText variant="subtitle">{user?.name}</AppText>
          <AppText tone="muted">{user?.email}</AppText>
          {user ? <Badge label={userRoleLabels[user.role]} tone="primary" /> : null}
        </Card>

        <Button
          title="Sobre o App"
          variant="outline"
          icon="information-circle-outline"
          onPress={() => navigation.navigate('About')}
        />
        <Button title="Sair" variant="ghost" icon="log-out-outline" onPress={confirmSignOut} />
      </View>
    </Screen>
  );
}
