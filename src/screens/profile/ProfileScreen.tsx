import { Alert, StyleSheet, View } from 'react-native';

import { AppText, Badge, Card, Chip, ListItem, Screen } from '@/components/ui';
import { userRoleLabels } from '@/constants/domain';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme, type ThemePreference } from '@/contexts/ThemeContext';
import type { AppTabScreenProps } from '@/navigation/types';

type ProfileScreenProps = AppTabScreenProps<'Profile'>;

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { colors, spacing, radius, preference, setPreference } = useAppTheme();
  const { user, signOut } = useAuth();

  const confirmSignOut = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair do Nexus Verde?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  if (!user) {
    return null;
  }

  return (
    <Screen scroll>
      <View style={{ gap: spacing.md }}>
        <Card style={[styles.userCard, { gap: spacing.md }]}>
          <View
            style={[styles.avatar, { backgroundColor: colors.primary, borderRadius: radius.pill }]}
            accessibilityElementsHidden
          >
            <AppText variant="title" tone="onPrimary">
              {getInitials(user.name)}
            </AppText>
          </View>
          <View style={[styles.flex, { gap: spacing.xxs }]}>
            <AppText variant="subtitle">{user.name}</AppText>
            <AppText tone="muted">{user.email}</AppText>
            {user.city ? (
              <AppText variant="caption" tone="muted">
                {user.city}
              </AppText>
            ) : null}
            <Badge label={userRoleLabels[user.role]} tone="primary" />
          </View>
        </Card>

        <Card style={{ gap: spacing.sm }}>
          <AppText variant="bodyStrong">Aparência</AppText>
          <AppText variant="caption" tone="muted">
            Escolha o tema do aplicativo. A opção fica salva neste aparelho.
          </AppText>
          <View style={[styles.row, { gap: spacing.xs }]}>
            {themeOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={preference === option.value}
                onPress={() => setPreference(option.value)}
              />
            ))}
          </View>
        </Card>

        <Card style={{ paddingVertical: spacing.xs }}>
          <ListItem
            icon="information-circle-outline"
            title="Sobre o App"
            subtitle="Versão, commit de referência e equipe"
            onPress={() => navigation.navigate('About')}
          />
          <ListItem
            icon="log-out-outline"
            title="Sair da conta"
            tone="danger"
            onPress={confirmSignOut}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
