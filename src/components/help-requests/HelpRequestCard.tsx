import { StyleSheet, View } from 'react-native';

import { AppText, Badge, Card, Icon } from '@/components/ui';
import { helpRequestStatusInfo, helpRequestTypeInfo, urgencyInfo } from '@/constants/domain';
import { useAppTheme } from '@/contexts/ThemeContext';
import type { HelpRequest } from '@/types/models';
import { formatRelativeTime, pluralize } from '@/utils/formatters';

type HelpRequestCardProps = {
  request: HelpRequest;
  onPress: () => void;
  showRequester?: boolean;
};

export function HelpRequestCard({ request, onPress, showRequester = false }: HelpRequestCardProps) {
  const { colors, spacing, radius } = useAppTheme();
  const typeInfo = helpRequestTypeInfo[request.type];
  const statusInfo = helpRequestStatusInfo[request.status];

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${typeInfo.label}, ${statusInfo.label}, ${request.city}`}
      style={{ gap: spacing.sm }}
    >
      <View style={[styles.header, { gap: spacing.sm }]}>
        <View
          style={[
            styles.typeIcon,
            { backgroundColor: colors.secondarySoft, borderRadius: radius.md },
          ]}
        >
          <Icon name={typeInfo.icon} size={22} color={colors.secondary} />
        </View>
        <View style={styles.headerTexts}>
          <AppText variant="subtitle">{typeInfo.label}</AppText>
          <AppText variant="caption" tone="muted">
            {request.city} · {formatRelativeTime(request.createdAt)}
          </AppText>
        </View>
        {request.priority !== undefined ? (
          <View style={styles.priority}>
            <AppText variant="title" tone="primary">
              {request.priority}
            </AppText>
            <AppText variant="caption" tone="muted">
              prioridade
            </AppText>
          </View>
        ) : null}
      </View>

      <AppText tone="muted" numberOfLines={2}>
        {request.description}
      </AppText>

      <View style={[styles.badges, { gap: spacing.xs }]}>
        <Badge label={statusInfo.label} tone={statusInfo.tone} icon={statusInfo.icon} />
        <Badge
          label={`Urgência ${urgencyInfo[request.urgency].label.toLowerCase()}`}
          tone={urgencyInfo[request.urgency].tone}
        />
        <Badge label={pluralize(request.peopleCount, 'pessoa', 'pessoas')} tone="neutral" />
      </View>

      {showRequester ? (
        <AppText variant="caption" tone="muted">
          Solicitado por {request.requester.name}
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTexts: {
    flex: 1,
  },
  priority: {
    alignItems: 'center',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
