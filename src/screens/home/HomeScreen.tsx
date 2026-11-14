import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { RefreshControl, View } from 'react-native';

import { CitizenHome } from '@/components/home/CitizenHome';
import { HomeHeader } from '@/components/home/HomeHeader';
import { TeamHome } from '@/components/home/TeamHome';
import { Screen } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import type { AppTabScreenProps } from '@/navigation/types';

type HomeScreenProps = AppTabScreenProps<'Home'>;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { spacing } = useAppTheme();
  const { isTeamMember } = useAuth();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAll = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setIsRefreshing(false);
  };

  const openPoint = (pointId: string) => navigation.navigate('WaterPointDetails', { pointId });

  return (
    <Screen
      scroll
      edges={['top', 'left', 'right']}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshAll} />}
    >
      <View style={{ gap: spacing.lg }}>
        <HomeHeader />
        {isTeamMember ? (
          <TeamHome
            onOpenRequests={() => navigation.navigate('HelpRequests')}
            onOpenRequest={(requestId) => navigation.navigate('HelpRequestDetails', { requestId })}
            onOpenPoints={() => navigation.navigate('WaterPoints')}
            onOpenPoint={openPoint}
          />
        ) : (
          <CitizenHome
            onRequestHelp={() => navigation.navigate('HelpRequestForm')}
            onOpenRequests={() => navigation.navigate('HelpRequests')}
            onOpenPoints={() => navigation.navigate('WaterPoints')}
            onOpenPoint={openPoint}
            onOpenRegions={() => navigation.navigate('Regions')}
          />
        )}
      </View>
    </Screen>
  );
}
