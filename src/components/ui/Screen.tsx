import { useRef, useState, type ComponentRef, type ReactElement, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  type RefreshControlProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useAppTheme } from '@/contexts/ThemeContext';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  refreshControl?: ReactElement<RefreshControlProps>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['left', 'right'],
  refreshControl,
  contentContainerStyle,
}: ScreenProps) {
  const { colors, spacing } = useAppTheme();
  const padding = padded ? spacing.md : 0;
  const containerRef = useRef<ComponentRef<typeof View>>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  // No Android de ponta a ponta a janela não encolhe quando o teclado abre. O KeyboardAvoidingView
  // precisa saber onde a tela começa (abaixo do cabeçalho) para calcular quanto o teclado cobre.
  const measureKeyboardOffset = () => {
    containerRef.current?.measureInWindow((_x, y) => setKeyboardOffset(y));
  };

  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: colors.background }]}>
      <View ref={containerRef} style={styles.flex} onLayout={measureKeyboardOffset}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior="padding"
          keyboardVerticalOffset={keyboardOffset}
        >
          {scroll ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              refreshControl={refreshControl}
              contentContainerStyle={[
                { padding, paddingBottom: padding + spacing.xxl },
                contentContainerStyle,
              ]}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.flex, { padding }, contentContainerStyle]}>{children}</View>
          )}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
