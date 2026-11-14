import { Image, Linking, StyleSheet, View } from 'react-native';

import { AppText, Badge, Card, InfoRow, InlineMessage, ListItem, Screen } from '@/components/ui';
import { buildInfo } from '@/config/buildInfo';
import { SUSTAINABLE_DEVELOPMENT_GOALS, TEAM_MEMBERS } from '@/constants/team';
import { useAppTheme } from '@/contexts/ThemeContext';
import { formatDateTime } from '@/utils/formatters';

export function AboutScreen() {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <View style={{ gap: spacing.md }}>
        <View style={[styles.header, { gap: spacing.xs }]}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            accessibilityIgnoresInvertColors
          />
          <AppText variant="title">{buildInfo.appName}</AppText>
          <AppText tone="muted" align="center">
            Conectando pessoas, tecnologia e água para salvar vidas.
          </AppText>
        </View>

        <Card style={{ gap: spacing.sm }}>
          <AppText variant="overline" tone="primary">
            Identificação da versão
          </AppText>
          <InfoRow icon="pricetag-outline" label="Versão" value={buildInfo.version} />
          <InfoRow
            icon="calendar-outline"
            label="Data da build"
            value={buildInfo.builtAt ? formatDateTime(buildInfo.builtAt) : 'indisponível'}
          />

          <AppText variant="caption" tone="muted">
            Hash do commit de referência
          </AppText>
          <View
            style={[
              styles.hashBox,
              {
                backgroundColor: colors.surfaceMuted,
                borderColor: colors.border,
                borderRadius: radius.md,
                padding: spacing.sm,
                gap: spacing.xxs,
              },
            ]}
          >
            <AppText variant="subtitle" tone="primary" selectable style={styles.mono}>
              {buildInfo.shortCommitHash}
            </AppText>
            <AppText variant="caption" selectable style={styles.mono}>
              {buildInfo.commitHash}
            </AppText>
          </View>

          {buildInfo.hasUncommittedChanges ? (
            <InlineMessage
              tone="warning"
              message="Esta build foi gerada com alterações que não estavam no commit acima."
            />
          ) : null}
        </Card>

        {buildInfo.repositoryUrl ? (
          <Card style={{ paddingVertical: spacing.xs }}>
            <ListItem
              icon="logo-github"
              title="Código-fonte"
              subtitle={buildInfo.repositoryUrl.replace('https://', '')}
              onPress={() => Linking.openURL(buildInfo.repositoryUrl as string)}
            />
          </Card>
        ) : null}

        <Card style={{ gap: spacing.sm }}>
          <AppText variant="overline" tone="primary">
            Objetivos de Desenvolvimento Sustentável
          </AppText>
          {SUSTAINABLE_DEVELOPMENT_GOALS.map((goal) => (
            <View key={goal.number} style={[styles.row, { gap: spacing.sm }]}>
              <Badge label={`ODS ${goal.number}`} tone="info" />
              <AppText style={styles.flex}>{goal.title}</AppText>
            </View>
          ))}
        </Card>

        <Card style={{ gap: spacing.sm }}>
          <AppText variant="overline" tone="primary">
            Integrantes
          </AppText>
          {TEAM_MEMBERS.map((member) => (
            <View key={member.rm} style={[styles.row, { gap: spacing.sm }]}>
              <AppText style={styles.flex}>{member.name}</AppText>
              <AppText variant="caption" tone="muted">
                {member.rm}
              </AppText>
            </View>
          ))}
        </Card>

        <AppText variant="caption" tone="muted" align="center">
          Global Solution 2026/2 · FIAP · Mobile Application Development
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 88,
    height: 88,
  },
  hashBox: {
    borderWidth: 1,
  },
  mono: {
    fontFamily: 'monospace',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});
