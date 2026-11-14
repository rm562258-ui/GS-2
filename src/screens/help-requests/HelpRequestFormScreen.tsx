import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { ChipSelectField } from '@/components/form/ChipSelectField';
import { FormTextField } from '@/components/form/FormTextField';
import { SwitchField } from '@/components/form/SwitchField';
import { Button, ErrorState, InlineMessage, LoadingState, Screen } from '@/components/ui';
import { helpRequestTypeOptions, urgencyOptions } from '@/constants/domain';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import {
  useCreateHelpRequest,
  useHelpRequest,
  useUpdateHelpRequest,
} from '@/hooks/useHelpRequests';
import type { RootStackScreenProps } from '@/navigation/types';
import {
  helpRequestSchema,
  type HelpRequestFormInput,
  type HelpRequestFormOutput,
} from '@/schemas/helpRequestSchema';
import { getErrorMessage } from '@/utils/appError';

type HelpRequestFormScreenProps = RootStackScreenProps<'HelpRequestForm'>;

export function HelpRequestFormScreen({ navigation, route }: HelpRequestFormScreenProps) {
  const requestId = route.params?.requestId;
  const isEditing = Boolean(requestId);
  const { spacing } = useAppTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const existingRequest = useHelpRequest(requestId);
  const createRequest = useCreateHelpRequest();
  const updateRequest = useUpdateHelpRequest();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<HelpRequestFormInput, unknown, HelpRequestFormOutput>({
    resolver: zodResolver(helpRequestSchema),
    defaultValues: {
      type: 'FALTA_DE_AGUA',
      urgency: 'MEDIA',
      peopleCount: '',
      hasVulnerablePeople: false,
      description: '',
      address: '',
      city: user?.city ?? '',
    },
  });

  // Preenche o formulário com os dados atuais ao editar.
  useEffect(() => {
    const request = existingRequest.data;
    if (request) {
      reset({
        type: request.type,
        urgency: request.urgency,
        peopleCount: String(request.peopleCount),
        hasVulnerablePeople: request.hasVulnerablePeople,
        description: request.description,
        address: request.address,
        city: request.city,
      });
    }
  }, [existingRequest.data, reset]);

  const onSubmit = async (data: HelpRequestFormOutput) => {
    setSubmitError(null);
    const input = {
      ...data,
      latitude: existingRequest.data?.latitude,
      longitude: existingRequest.data?.longitude,
    };

    try {
      if (requestId) {
        await updateRequest.mutateAsync({ id: requestId, input });
        showToast('Pedido atualizado.', 'success');
      } else {
        await createRequest.mutateAsync(input);
        showToast('Pedido enviado! A equipe de apoio foi avisada.', 'success');
      }
      navigation.goBack();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  if (isEditing && existingRequest.isLoading) {
    return <LoadingState message="Carregando o pedido..." />;
  }

  if (isEditing && existingRequest.isError) {
    return (
      <ErrorState
        message={getErrorMessage(existingRequest.error)}
        onRetry={existingRequest.refetch}
      />
    );
  }

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <View style={{ gap: spacing.lg }}>
        <ChipSelectField
          control={control}
          name="type"
          label="Do que você precisa?"
          options={helpRequestTypeOptions}
        />
        <ChipSelectField
          control={control}
          name="urgency"
          label="Urgência"
          options={urgencyOptions}
        />
        <FormTextField
          control={control}
          name="peopleCount"
          label="Quantas pessoas estão sem água?"
          icon="people-outline"
          placeholder="Ex.: 4"
          keyboardType="number-pad"
          maxLength={3}
        />
        <SwitchField
          control={control}
          name="hasVulnerablePeople"
          label="Há pessoas em situação vulnerável?"
          description="Crianças, idosos, gestantes, pessoas com deficiência ou doentes."
        />
        <FormTextField
          control={control}
          name="description"
          label="Descreva a situação"
          placeholder="Ex.: Estamos sem água desde ontem e a torneira só sai água barrenta."
          multiline
          maxLength={500}
        />
        <FormTextField
          control={control}
          name="address"
          label="Endereço"
          icon="home-outline"
          placeholder="Rua, número e bairro"
        />
        <FormTextField
          control={control}
          name="city"
          label="Cidade"
          icon="location-outline"
          placeholder="Ex.: Canoas"
        />

        {submitError ? <InlineMessage message={submitError} /> : null}

        <Button
          title={isEditing ? 'Salvar alterações' : 'Enviar pedido de ajuda'}
          icon={isEditing ? 'checkmark' : 'send'}
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </Screen>
  );
}
