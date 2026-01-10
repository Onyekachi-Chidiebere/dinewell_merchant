import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  BottomTab: undefined;
  ManagePoints: {type: string};
  QrCode: {type: string; orderItems?: any[]; totalPrice?: number; totalPoints?: number; qrCode?: string; pointsId?: number};
  DishesScreen: undefined;
  Topup: undefined;
  ManageCards: undefined;
  RestaurantDiscovery: undefined;
  AccountSettings: undefined;
  ProfileDetails: undefined;
  Security: undefined;
  Notifications: undefined;
  GetHelp: undefined;
  Legal: undefined;
  // Add other screen params here as needed
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BottomTab'
>;

export type ManagePointsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ManagePoints'
>;