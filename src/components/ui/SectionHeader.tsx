import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { AppText } from './AppText';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  const { spacing } = useAppTheme();

  return (
    <View style={[styles.row, { marginTop: spacing.xs }]}>
      <AppText variant="subtitle" accessibilityRole="header">
        {title}
      </AppText>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="link" hitSlop={12}>
          <AppText variant="label" tone="primary">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
  },
});
