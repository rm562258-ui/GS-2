import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useAppTheme } from '@/contexts/ThemeContext';

type SwitchFieldProps<TFormValues extends FieldValues, TTransformedValues = TFormValues> = {
  control: Control<TFormValues, unknown, TTransformedValues>;
  name: Path<TFormValues>;
  label: string;
  description?: string;
};

export function SwitchField<TFormValues extends FieldValues, TTransformedValues = TFormValues>({
  control,
  name,
  label,
  description,
}: SwitchFieldProps<TFormValues, TTransformedValues>) {
  const { colors, spacing } = useAppTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View style={[styles.row, { gap: spacing.sm }]}>
          <View style={styles.texts}>
            <AppText variant="bodyStrong">{label}</AppText>
            {description ? (
              <AppText variant="caption" tone="muted">
                {description}
              </AppText>
            ) : null}
          </View>
          <Switch
            value={Boolean(value)}
            onValueChange={onChange}
            accessibilityLabel={label}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.surface}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  texts: {
    flex: 1,
  },
});
