import { StyleSheet, View } from 'react-native';

import { AppText, Button, Icon } from '@/components/ui';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import type { Coordinates } from '@/utils/distance';

type LocationButtonProps = {
  value?: Coordinates;
  onChange: (coordinates: Coordinates | undefined) => void;
  label?: string;
};

// Preenche as coordenadas com o GPS do aparelho (opcional nos formulários).
export function LocationButton({
  value,
  onChange,
  label = 'Usar minha localização',
}: LocationButtonProps) {
  const { colors, spacing } = useAppTheme();
  const { showToast } = useToast();
  const { requestLocation, isLoading } = useCurrentLocation();

  const handlePress = async () => {
    const coordinates = await requestLocation();
    if (coordinates) {
      onChange(coordinates);
      showToast('Localização adicionada.', 'success');
    } else {
      showToast('Não foi possível obter sua localização. Verifique a permissão do GPS.', 'error');
    }
  };

  if (value) {
    return (
      <View style={[styles.attached, { gap: spacing.xs }]}>
        <Icon name="checkmark-circle" size={20} color={colors.success} />
        <AppText variant="label" style={styles.flex}>
          Localização: {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
        </AppText>
        <Button
          title="Remover"
          variant="ghost"
          fullWidth={false}
          onPress={() => onChange(undefined)}
        />
      </View>
    );
  }

  return (
    <Button
      title={label}
      variant="outline"
      icon="locate-outline"
      loading={isLoading}
      onPress={handlePress}
    />
  );
}

const styles = StyleSheet.create({
  attached: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});
