import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { useAppTheme } from '@/contexts/ThemeContext';

export type IconName = ComponentProps<typeof Ionicons>['name'];

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 20, color }: IconProps) {
  const { colors } = useAppTheme();

  return (
    <Ionicons
      name={name}
      size={size}
      color={color ?? colors.text}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
