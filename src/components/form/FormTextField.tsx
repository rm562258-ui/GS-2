import type { ComponentProps } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { TextField } from '@/components/ui';

type FormTextFieldProps<TFormValues extends FieldValues> = Omit<
  ComponentProps<typeof TextField>,
  'value' | 'onChangeText' | 'onBlur' | 'error'
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
};

// Liga o TextField ao react-hook-form, exibindo o erro de validação do campo.
export function FormTextField<TFormValues extends FieldValues>({
  control,
  name,
  ...textFieldProps
}: FormTextFieldProps<TFormValues>) {
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
