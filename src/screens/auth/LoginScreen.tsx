import { zodResolver } from '@hookform/resolvers/zod';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { FormTextField } from '@/components/form/FormTextField';
import { AppText, Button, InlineMessage, Screen } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import type { RootStackScreenProps } from '@/navigation/types';
import { signInSchema, type SignInFormData } from '@/schemas/authSchemas';
import { getErrorMessage } from '@/utils/appError';

type LoginScreenProps = RootStackScreenProps<'Login'>;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { colors, spacing, radius } = useAppTheme();
  const { signIn } = useAuth();
  const isFocused = useIsFocused();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInFormData) => {
    setSubmitError(null);
    try {
      await signIn(data);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <Screen scroll padded={false} edges={['bottom']}>
      {/* Ícones claros só enquanto a imagem escura do topo está visível. */}
      {isFocused ? <StatusBar style="light" /> : null}
      <Image
        source={require('../../../assets/images/hero-login.png')}
        style={styles.hero}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            padding: spacing.xl,
            gap: spacing.md,
          },
        ]}
      >
        <View style={[styles.brand, { gap: spacing.sm }]}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
          <View>
            <AppText variant="title">Nexus Verde</AppText>
            <AppText variant="caption" tone="muted">
              Água potável para quem precisa
            </AppText>
          </View>
        </View>

        <AppText variant="subtitle">Entre na sua conta</AppText>

        <FormTextField
          control={control}
          name="email"
          label="E-mail"
          icon="mail-outline"
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <FormTextField
          control={control}
          name="password"
          label="Senha"
          icon="lock-closed-outline"
          placeholder="Sua senha"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={() => handleSubmit(onSubmit)()}
        />

        {submitError ? <InlineMessage message={submitError} /> : null}

        <Button
          title="Entrar"
          icon="log-in-outline"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        <View style={[styles.footer, { gap: spacing.xxs }]}>
          <AppText tone="muted">Ainda não tem conta?</AppText>
          <Pressable
            onPress={() => navigation.navigate('SignUp')}
            accessibilityRole="link"
            hitSlop={12}
          >
            <AppText variant="bodyStrong" tone="primary">
              Criar conta
            </AppText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 260,
  },
  sheet: {
    flex: 1,
    marginTop: -28,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
});
