import { ActivityIndicator, View } from 'react-native';

import { InlineMessage } from '@/components/ui';
import { useAppTheme } from '@/contexts/ThemeContext';
import { getErrorMessage } from '@/utils/appError';

type SectionStatusProps = {
  isLoading: boolean;
  error: unknown;
};

// Estado de carregamento ou erro de cada bloco da tela inicial.
export function SectionStatus({ isLoading, error }: SectionStatusProps) {
  const { colors, spacing } = useAppTheme();

  if (isLoading) {
    return (
      <View style={{ paddingVertical: spacing.md }}>
        <ActivityIndicator color={colors.primary} accessibilityLabel="Carregando" />
      </View>
    );
  }

  if (error) {
    return <InlineMessage message={getErrorMessage(error)} />;
  }

  return null;
}
