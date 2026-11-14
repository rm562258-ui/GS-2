import { useState, type ComponentRef, type Ref } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { MIN_TOUCH_SIZE } from '@/theme';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
  icon?: IconName;
  containerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<ComponentRef<typeof TextInput>>;
};

export function TextField({
  label,
  error,
  helperText,
  icon,
  containerStyle,
  secureTextEntry,
  multiline,
  onFocus,
  onBlur,
  ref,
  ...inputProps
}: TextFieldProps) {
  const { colors, radius, spacing, typography } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const borderColor = error ? colors.danger : isFocused ? colors.primary : colors.border;

  return (
    <View style={[{ gap: spacing.xxs }, containerStyle]}>
      <AppText variant="label" tone="muted">
        {label}
      </AppText>

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            borderRadius: radius.md,
            backgroundColor: colors.surface,
            paddingHorizontal: spacing.sm,
            gap: spacing.xs,
            alignItems: multiline ? 'flex-start' : 'center',
          },
        ]}
      >
        {icon ? (
          <View style={multiline ? { paddingTop: spacing.sm } : undefined}>
            <Icon name={icon} color={isFocused ? colors.primary : colors.placeholder} />
          </View>
        ) : null}

        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          multiline={multiline}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          style={[
            styles.input,
            typography.body,
            { color: colors.text },
            multiline && { minHeight: 110, paddingTop: spacing.sm, textAlignVertical: 'top' },
          ]}
          {...inputProps}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setIsSecureVisible((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel={isSecureVisible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={8}
            style={styles.secureToggle}
          >
            <Icon
              name={isSecureVisible ? 'eye-off-outline' : 'eye-outline'}
              color={colors.placeholder}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : helperText ? (
        <AppText variant="caption" tone="muted">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1.5,
    minHeight: MIN_TOUCH_SIZE + 4,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  secureToggle: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
