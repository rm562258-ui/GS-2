import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { ChipSelectField } from '@/components/form/ChipSelectField';
import { FormTextField } from '@/components/form/FormTextField';
import { LocationButton } from '@/components/form/LocationButton';
import { Button, ErrorState, InlineMessage, LoadingState, Screen } from '@/components/ui';
import { waterPointStatusOptions, waterPointTypeOptions } from '@/constants/domain';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { useCreateWaterPoint, useUpdateWaterPoint, useWaterPoint } from '@/hooks/useWaterPoints';
import type { RootStackScreenProps } from '@/navigation/types';
import {
  waterPointSchema,
  type WaterPointFormInput,
  type WaterPointFormOutput,
} from '@/schemas/waterPointSchema';
import { getErrorMessage } from '@/utils/appError';

type WaterPointFormScreenProps = RootStackScreenProps<'WaterPointForm'>;

export function WaterPointFormScreen({ navigation, route }: WaterPointFormScreenProps) {
  const pointId = route.params?.pointId;
  const isEditing = Boolean(pointId);
  const { spacing } = useAppTheme();
  const { showToast } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const existingPoint = useWaterPoint(pointId);
  const createPoint = useCreateWaterPoint();
  const updatePoint = useUpdateWaterPoint();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<WaterPointFormInput, unknown, WaterPointFormOutput>({
    resolver: zodResolver(waterPointSchema),
    defaultValues: {
      name: '',
      type: 'POSTO_DISTRIBUICAO',
      status: 'DISPONIVEL',
      address: '',
      city: '',
      latitude: '',
      longitude: '',
      capacityLiters: '',
      availableLiters: '',
      openingHours: '',
      contactPhone: '',
    },
  });

  useEffect(() => {
    const point = existingPoint.data;
    if (point) {
      reset({
        name: point.name,
        type: point.type,
        status: point.status,
        address: point.address,
        city: point.city,
        latitude: String(point.latitude),
        longitude: String(point.longitude),
        capacityLiters: String(point.capacityLiters),
        availableLiters: String(point.availableLiters),
        openingHours: point.openingHours,
        contactPhone: point.contactPhone ?? '',
      });
    }
  }, [existingPoint.data, reset]);

  const onSubmit = async (data: WaterPointFormOutput) => {
    setSubmitError(null);
    const input = { ...data, contactPhone: data.contactPhone || undefined };

    try {
      if (pointId) {
        await updatePoint.mutateAsync({ id: pointId, input });
        showToast('Ponto de água atualizado.', 'success');
      } else {
        await createPoint.mutateAsync(input);
        showToast('Ponto de água cadastrado.', 'success');
      }
      navigation.goBack();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  if (isEditing && existingPoint.isLoading) {
    return <LoadingState message="Carregando o ponto de água..." />;
  }

  if (isEditing && existingPoint.isError) {
    return (
      <ErrorState message={getErrorMessage(existingPoint.error)} onRetry={existingPoint.refetch} />
    );
  }

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <View style={{ gap: spacing.lg }}>
        <FormTextField
          control={control}
          name="name"
          label="Nome do ponto"
          icon="water-outline"
          placeholder="Ex.: Posto Escola Rio Branco"
        />
        <ChipSelectField
          control={control}
          name="type"
          label="Tipo"
          options={waterPointTypeOptions}
        />
        <ChipSelectField
          control={control}
          name="status"
          label="Situação"
          options={waterPointStatusOptions}
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
          placeholder="Ex.: Porto Alegre"
        />

        <LocationButton
          label="Usar minha localização atual"
          onChange={(coordinates) => {
            if (coordinates) {
              setValue('latitude', String(coordinates.latitude), { shouldValidate: true });
              setValue('longitude', String(coordinates.longitude), { shouldValidate: true });
            }
          }}
        />
        <View style={[styles.row, { gap: spacing.sm }]}>
          <FormTextField
            control={control}
            name="latitude"
            label="Latitude"
            placeholder="-30,0346"
            keyboardType="numbers-and-punctuation"
            containerStyle={styles.flex}
          />
          <FormTextField
            control={control}
            name="longitude"
            label="Longitude"
            placeholder="-51,2177"
            keyboardType="numbers-and-punctuation"
            containerStyle={styles.flex}
          />
        </View>

        <View style={[styles.row, { gap: spacing.sm }]}>
          <FormTextField
            control={control}
            name="capacityLiters"
            label="Capacidade (L)"
            placeholder="20000"
            keyboardType="number-pad"
            containerStyle={styles.flex}
          />
          <FormTextField
            control={control}
            name="availableLiters"
            label="Estoque (L)"
            placeholder="15000"
            keyboardType="number-pad"
            containerStyle={styles.flex}
          />
        </View>

        <FormTextField
          control={control}
          name="openingHours"
          label="Horário de funcionamento"
          icon="time-outline"
          placeholder="Ex.: 08h às 18h"
        />
        <FormTextField
          control={control}
          name="contactPhone"
          label="Telefone (opcional)"
          icon="call-outline"
          placeholder="(51) 3333-3333"
          keyboardType="phone-pad"
        />

        {submitError ? <InlineMessage message={submitError} /> : null}

        <Button
          title={isEditing ? 'Salvar alterações' : 'Cadastrar ponto'}
          icon="checkmark"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});
