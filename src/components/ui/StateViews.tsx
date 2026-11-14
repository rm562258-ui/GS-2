import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  const { colors, spacing } = useAppTheme();

  return (
    <View
      style={[styles.center, { gap: spacing.sm }]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText tone="muted">{message}</AppText>
    </View>
  );
}

type FeedbackStateProps = {
  icon: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'primary' | 'danger';
};

function FeedbackState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  tone = 'primary',
}: FeedbackStateProps) {
  const { colors, spacing, radius } = useAppTheme();
  const isDanger = tone === 'danger';

  return (
    <View style={[styles.center, { gap: spacing.sm, padding: spacing.xl }]}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isDanger ? colors.dangerSoft : colors.primarySoft,
            borderRadius: radius.pill,
          },
        ]}
      >
        <Icon name={icon} size={32} color={isDanger ? colors.danger : colors.primary} />
      </View>
      <AppText variant="subtitle" align="center">
        {title}
      </AppText>
      {description ? (
        <AppText tone="muted" align="center">
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          fullWidth={false}
          style={{ marginTop: spacing.xs }}
        />
      ) : null}
    </View>
  );
}

type EmptyStateProps = Omit<FeedbackStateProps, 'tone'>;

export function EmptyState(props: EmptyStateProps) {
  return <FeedbackState {...props} />;
}

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <FeedbackState
      tone="danger"
      icon="cloud-offline-outline"
      title="Não foi possível carregar"
      description={message}
      actionLabel={onRetry ? 'Tentar novamente' : undefined}
      onAction={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
