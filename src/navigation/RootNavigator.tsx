import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@/contexts/ThemeContext';
import { AboutScreen } from '@/screens/about/AboutScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignUpScreen } from '@/screens/auth/SignUpScreen';
import { HelpRequestDetailsScreen } from '@/screens/help-requests/HelpRequestDetailsScreen';
import { HelpRequestFormScreen } from '@/screens/help-requests/HelpRequestFormScreen';
import { WaterPointDetailsScreen } from '@/screens/water-points/WaterPointDetailsScreen';
import { WaterPointFormScreen } from '@/screens/water-points/WaterPointFormScreen';

import { AppTabs } from './AppTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors, fontFamily } = useAppTheme();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontFamily: fontFamily.bold, fontSize: 18, color: colors.text },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Criar conta' }} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="MainTabs" component={AppTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="HelpRequestDetails"
          component={HelpRequestDetailsScreen}
          options={{ title: 'Detalhes do pedido' }}
        />
        <Stack.Screen
          name="HelpRequestForm"
          component={HelpRequestFormScreen}
          options={({ route }) => ({
            title: route.params?.requestId ? 'Editar pedido' : 'Novo pedido de ajuda',
          })}
        />
        <Stack.Screen
          name="WaterPointDetails"
          component={WaterPointDetailsScreen}
          options={{ title: 'Ponto de água' }}
        />
        <Stack.Screen
          name="WaterPointForm"
          component={WaterPointFormScreen}
          options={({ route }) => ({
            title: route.params?.pointId ? 'Editar ponto' : 'Novo ponto de água',
          })}
        />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'Sobre o App' }} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
