import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppTabParamList = {
  Home: undefined;
  HelpRequests: undefined;
  WaterPoints: undefined;
  Regions: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: NavigatorScreenParams<AppTabParamList> | undefined;
  HelpRequestDetails: { requestId: string };
  HelpRequestForm: { requestId?: string } | undefined;
  WaterPointDetails: { pointId: string };
  WaterPointForm: { pointId?: string } | undefined;
  About: undefined;
};

export type RootStackScreenProps<RouteName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, RouteName>;

export type AppTabScreenProps<RouteName extends keyof AppTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, RouteName>,
  NativeStackScreenProps<RootStackParamList>
>;

// Tipagem global das rotas para o useNavigation() reconhecer os nomes e parâmetros.
declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
