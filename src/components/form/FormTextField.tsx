import type { ComponentProps } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { TextField } from '@/components/ui';

type FormTextFieldProps<TFormValues extends FieldValues, TTransformedValues = TFormValues> = Omit<
  ComponentProps<typeof TextField>,
  'value' | 'onChangeText' | 'onBlur' | 'error'
> & {
  control: Control<TFormValues, unknown, TTransformedValues>;
  name: Path<TFormValues>;
};

// Liga o TextField ao react-hook-form, exibindo o erro de validação do campo.
export function FormTextField<TFormValues extends FieldValues, TTransformedValues = TFormValues>({
  control,
  name,
  ...textFieldProps
}: FormTextFieldProps<TFormValues, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
        <TextField
          ref={ref}
          value={value === undefined || value === null ? '' : String(value)}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...textFieldProps}
        />
      )}
    />
  );
}
