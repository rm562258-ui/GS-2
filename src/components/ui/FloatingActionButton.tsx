import { Pressable, StyleSheet } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type FloatingActionButtonProps = {
  label: string;
  icon?: IconName;
  onPress: () => void;
};

export function FloatingActionButton({ label, icon = 'add', onPress }: FloatingActionButtonProps) {
  const { colors, radius, spacing, shadows } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.fab,
        shadows.floating,
        {
          backgroundColor: pressed ? colors.primaryPressed : colors.primary,
          borderRadius: radius.pill,
          right: spacing.md,
          bottom: spacing.md,
          paddingHorizontal: spacing.lg,
          gap: spacing.xs,
        },
      ]}
    >
      <Icon name={icon} size={22} color={colors.onPrimary} />
      <AppText variant="button" tone="onPrimary">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
