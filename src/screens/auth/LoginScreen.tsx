import { Image, StyleSheet, View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { useAppTheme } from '@/contexts/ThemeContext';
import type { RootStackScreenProps } from '@/navigation/types';

type LoginScreenProps = RootStackScreenProps<'Login'>;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { spacing } = useAppTheme();

  return (
    <Screen padded={false} edges={['bottom']}>
      <Image
        source={require('../../../assets/images/hero-login.png')}
        style={styles.hero}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <View style={[styles.content, { padding: spacing.xl, gap: spacing.md }]}>
        <AppText variant="display">Nexus Verde</AppText>
        <AppText tone="muted">Água potável para quem precisa, mesmo em situações de crise.</AppText>
        <Button
          title="Entrar"
          icon="log-in-outline"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
        />
        <Button title="Criar conta" variant="ghost" onPress={() => navigation.navigate('SignUp')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 320,
  },
  content: {
    flex: 1,
  },
});
