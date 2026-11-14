import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { FormTextField } from '@/components/form/FormTextField';
import { AppText, Button, InlineMessage, Screen } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import type { RootStackScreenProps } from '@/navigation/types';
import { signUpSchema, type SignUpFormData } from '@/schemas/authSchemas';
import { getErrorMessage } from '@/utils/appError';

type SignUpScreenProps = RootStackScreenProps<'SignUp'>;

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const { spacing } = useAppTheme();
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', phone: '', city: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async ({ name, email, phone, city, password }: SignUpFormData) => {
    setSubmitError(null);
    try {
      await signUp({ name, email, phone, city, password });
      showToast(`Conta criada! Boas-vindas, ${name.split(' ')[0]}.`, 'success');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <View style={{ gap: spacing.md }}>
        <AppText tone="muted">
          Crie sua conta para pedir ajuda, acompanhar seus pedidos e encontrar pontos de água
          potável perto de você.
        </AppText>

        <FormTextField
          control={control}
          name="name"
          label="Nome completo"
          icon="person-outline"
          placeholder="Como você se chama?"
          autoComplete="name"
          textContentType="name"
        />
        <FormTextField
          control={control}
          name="email"
          label="E-mail"
          icon="mail-outline"
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <FormTextField
          control={control}
          name="phone"
          label="Telefone (opcional)"
          icon="call-outline"
          placeholder="(51) 99999-9999"
          keyboardType="phone-pad"
          autoComplete="tel"
        />
        <FormTextField
          control={control}
          name="city"
          label="Cidade (opcional)"
          icon="location-outline"
          placeholder="Ex.: Canoas"
        />
        <FormTextField
          control={control}
          name="password"
          label="Senha"
          icon="lock-closed-outline"
          placeholder="Crie uma senha"
          helperText="Mínimo de 6 caracteres, com letras e números."
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
        />
        <FormTextField
          control={control}
          name="confirmPassword"
          label="Confirme a senha"
          icon="lock-closed-outline"
          placeholder="Digite a senha novamente"
          secureTextEntry
          autoCapitalize="none"
        />

        {submitError ? <InlineMessage message={submitError} /> : null}

        <Button
          title="Criar conta"
          icon="person-add-outline"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
        <Button title="Já tenho conta" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}
