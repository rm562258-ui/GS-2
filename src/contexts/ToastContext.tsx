import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Icon, type IconName } from '@/components/ui/Icon';

import { useAppTheme } from './ThemeContext';

export type ToastType = 'success' | 'error' | 'info';

type ToastMessage = {
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const TOAST_DURATION_MS = 3200;
const HIDDEN_OFFSET = -160;

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toastIcons: Record<ToastType, IconName> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const { colors, radius, spacing, shadows } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [translateY] = useState(() => new Animated.Value(HIDDEN_OFFSET));
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    Animated.timing(translateY, {
      toValue: HIDDEN_OFFSET,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setToast(null));
  }, [translateY]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }

      setToast({ message, type });
      translateY.setValue(HIDDEN_OFFSET);
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      hideTimer.current = setTimeout(hideToast, TOAST_DURATION_MS);
    },
    [hideToast, translateY],
  );

  useEffect(() => {
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const toastColors = toast
    ? {
        success: { background: colors.success, content: colors.surface },
        error: { background: colors.danger, content: colors.surface },
        info: { background: colors.secondary, content: colors.surface },
      }[toast.type]
    : null;

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast && toastColors ? (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.container, { top: insets.top + spacing.xs, transform: [{ translateY }] }]}
        >
          <Pressable
            onPress={hideToast}
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
            accessibilityHint="Toque para fechar"
            style={[
              styles.toast,
              shadows.floating,
              {
                backgroundColor: toastColors.background,
                borderRadius: radius.md,
                marginHorizontal: spacing.md,
                padding: spacing.md,
                gap: spacing.sm,
              },
            ]}
          >
            <Icon name={toastIcons[toast.type]} size={22} color={toastColors.content} />
            <AppText variant="bodyStrong" style={[styles.message, { color: toastColors.content }]}>
              {toast.message}
            </AppText>
          </Pressable>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider.');
  }

  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    flex: 1,
  },
});
