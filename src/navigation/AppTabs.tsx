import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { IconName } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { HelpRequestListScreen } from '@/screens/help-requests/HelpRequestListScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { RegionListScreen } from '@/screens/regions/RegionListScreen';
import { WaterPointListScreen } from '@/screens/water-points/WaterPointListScreen';

import type { AppTabParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

const tabIcons: Record<keyof AppTabParamList, { active: IconName; inactive: IconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  HelpRequests: { active: 'hand-left', inactive: 'hand-left-outline' },
  WaterPoints: { active: 'water', inactive: 'water-outline' },
  Regions: { active: 'warning', inactive: 'warning-outline' },
  Profile: { active: 'person-circle', inactive: 'person-circle-outline' },
};

export function AppTabs() {
  const { colors, fontFamily } = useAppTheme();
  const { isTeamMember } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fontFamily.semiBold, fontSize: 12 },
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontFamily: fontFamily.bold, fontSize: 18, color: colors.text },
        headerShadowVisible: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = tabIcons[route.name];
          return (
            <Ionicons name={focused ? icons.active : icons.inactive} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início', headerShown: false }}
      />
      <Tab.Screen
        name="HelpRequests"
        component={HelpRequestListScreen}
        options={{
          title: isTeamMember ? 'Fila de pedidos' : 'Meus pedidos',
          tabBarLabel: 'Pedidos',
        }}
      />
      <Tab.Screen
        name="WaterPoints"
        component={WaterPointListScreen}
        options={{ title: 'Pontos de água', tabBarLabel: 'Pontos' }}
      />
      <Tab.Screen name="Regions" component={RegionListScreen} options={{ title: 'Alertas' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
