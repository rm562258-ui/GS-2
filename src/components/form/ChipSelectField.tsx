import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { AppText, Chip } from '@/components/ui';
import { useAppTheme } from '@/contexts/ThemeContext';

type ChipOption = { value: string; label: string };

type ChipSelectFieldProps<TFormValues extends FieldValues, TTransformedValues = TFormValues> = {
  control: Control<TFormValues, unknown, TTransformedValues>;
  name: Path<TFormValues>;
  label: string;
  options: ChipOption[];
};

// Seleção única em formato de chips, ligada ao react-hook-form.
export function ChipSelectField<TFormValues extends FieldValues, TTransformedValues = TFormValues>({
  control,
  name,
  label,
  options,
}: ChipSelectFieldProps<TFormValues, TTransformedValues>) {
  const { spacing } = useAppTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={{ gap: spacing.xs }} accessibilityRole="radiogroup" accessibilityLabel={label}>
          <AppText variant="label" tone="muted">
            {label}
          </AppText>
          <View style={[styles.options, { gap: spacing.xs }]}>
            {options.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={value === option.value}
                onPress={() => onChange(option.value)}
              />
            ))}
          </View>
          {error?.message ? (
            <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
              {error.message}
            </AppText>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
