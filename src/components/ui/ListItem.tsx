import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { MIN_TOUCH_SIZE } from '@/theme';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type ListItemProps = {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress: () => void;
  tone?: 'default' | 'danger';
};

// Linha de menu com ícone e seta, usada no perfil.
export function ListItem({ icon, title, subtitle, onPress, tone = 'default' }: ListItemProps) {
  const { colors, spacing, radius } = useAppTheme();
  const contentColor = tone === 'danger' ? colors.danger : colors.text;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      style={({ pressed }) => [
        styles.row,
        {
          gap: spacing.sm,
          paddingVertical: spacing.sm,
          borderRadius: radius.md,
          backgroundColor: pressed ? colors.surfaceMuted : 'transparent',
        },
      ]}
    >
      <View
        style={[
          styles.icon,
          {
            borderRadius: radius.md,
            backgroundColor: tone === 'danger' ? colors.dangerSoft : colors.primarySoft,
          },
        ]}
      >
        <Icon name={icon} size={20} color={tone === 'danger' ? colors.danger : colors.primary} />
      </View>
      <View style={styles.texts}>
        <AppText variant="bodyStrong" style={{ color: contentColor }}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {tone === 'default' ? (
        <Icon name="chevron-forward" size={20} color={colors.placeholder} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH_SIZE + 8,
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
});
