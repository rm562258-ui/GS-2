import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type InfoRowProps = {
  icon: IconName;
  label: string;
  value: string;
};

export function InfoRow({ icon, label, value }: InfoRowProps) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <View
      style={[styles.row, { gap: spacing.sm }]}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={[styles.icon, { backgroundColor: colors.primarySoft, borderRadius: radius.md }]}>
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.texts}>
        <AppText variant="caption" tone="muted">
          {label}
        </AppText>
        <AppText variant="bodyStrong">{value}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
});
