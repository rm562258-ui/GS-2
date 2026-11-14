import { Image, StyleSheet, View } from 'react-native';

import { AppText, Badge } from '@/components/ui';
import { userRoleLabels } from '@/constants/domain';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';

function greetingForHour(hour: number) {
  if (hour < 12) {
    return 'Bom dia';
  }
  if (hour < 18) {
    return 'Boa tarde';
  }
  return 'Boa noite';
}

export function HomeHeader() {
  const { spacing } = useAppTheme();
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? '';

  return (
    <View style={[styles.row, { gap: spacing.sm }]}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.flex}>
        <AppText variant="title" accessibilityRole="header">
          {greetingForHour(new Date().getHours())}, {firstName}!
        </AppText>
        {user ? <Badge label={userRoleLabels[user.role]} tone="primary" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
    gap: 4,
  },
  logo: {
    width: 52,
    height: 52,
  },
});
