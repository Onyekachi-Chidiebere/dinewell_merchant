/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { View, Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import PointHistoryScreen from './src/screens/PointsHistory';
import RestaurantDiscoveryScreen from './src/screens/RestaurantDiscoveryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AccountSettingsScreen from './src/screens/AccountSettingsScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import GetHelpScreen from './src/screens/GetHelpScreen';
import { BottomSheetProvider } from './src/context/BottomSheetContext';
import DynamicBottomSheet from './src/components/DynamicBottomSheet';
import LegalScreen from './src/screens/LegalScreen';
import {
  TabHomeActiveIcon,
  TabHomeinActiveIcon,
  TabFavouritesActiveIcon,
  TabFavouritesInactiveIcon,
  TabPayActiveIcon,
  TabPointsActiveIcon,
  TabPointsInactiveIcon,
  TabWalletActiveIcon,
  TabWalletInactiveIcon,
  TabProfileActiveIcon,
} from './src/assets/icons';
import colors from './src/theme/colors';
import ProfileDetailsScreen from './src/screens/ProfileDetailsScreen';
import GetStarted from './src/screens/GetStarted';
import Login from './src/screens/Login';
import QrCode from './src/screens/QrCode';
import ManagePoints from './src/screens/ManagePoints';
import Topup from './src/screens/Topup';
import DishesScreen from './src/screens/DishesScreen';
import WalletScreen from './src/screens/WalletScreen';
import ManageCards from './src/screens/ManageCards';
import Landing from './src/screens/Landing';
import RestaurantDetails from './src/screens/RestaurantDetails';
import RestaurantAddress from './src/screens/RestaurantAddress';
import RestaurantPictures from './src/screens/RestaurantPictures';
import { SignupProvider } from './src/context/SignupContext';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { DishProvider } from './src/context/DishContext';
import { CardProvider } from './src/context/CardContext';
import { STRIPE_PUBLIC_KEY } from './src/theme/constants';
import Toast from 'react-native-toast-message'
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PRIMARY_COLOR = colors.primary.main;
const INACTIVE_LABEL_COLOR = '#828DA9';


const AppContent = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 84,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          paddingTop: 10,
          // Shadow only on the top
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -1 },
              shadowOpacity: 0.08,
              shadowRadius: 1,
            },
            android: {
              elevation: 1,
            },
          }),
        },
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          const size = 24;
          switch (route.name) {
            case 'Home':
              return focused ? <TabHomeActiveIcon width={size} height={size} /> : <TabHomeinActiveIcon width={size} height={size} />;
            case 'Dishes':
              return focused ? <TabFavouritesActiveIcon width={size} height={size} /> : <TabFavouritesInactiveIcon width={size} height={size} />;
            case 'Points History':
              return focused ? <TabPointsActiveIcon width={size} height={size} /> : <TabPointsInactiveIcon width={size} height={size} />;
            case 'Wallet':
              return focused ? <TabWalletActiveIcon width={size} height={size} /> : <TabWalletInactiveIcon width={size} height={size} />;
            case 'Profile':
              return focused ? <TabProfileActiveIcon width={size} height={size} /> : <TabProfileActiveIcon width={size} height={size} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) =>
            focused
              ? <Text style={{ color: PRIMARY_COLOR, fontSize: 24, marginBottom: 0, marginTop: -8 }}>•</Text>
              : <Text style={{ fontFamily: 'RedHatDisplay-Regular', fontSize: 11, color: INACTIVE_LABEL_COLOR, marginTop: 0, marginBottom: 4 }}>Home</Text>,
        }}
      />
      <Tab.Screen
        name="Dishes"
        component={DishesScreen}
        options={{
          tabBarLabel: ({ focused }) =>
            focused
              ? <Text style={{ color: PRIMARY_COLOR, fontSize: 24, marginBottom: 0, marginTop: -8 }}>•</Text>
              : <Text style={{ fontFamily: 'RedHatDisplay-Regular', fontSize: 11, color: INACTIVE_LABEL_COLOR, marginTop: 0, marginBottom: 4 }}>Dishes</Text>,
        }}
      />
      <Tab.Screen
        name="Points History"
        component={PointHistoryScreen}
        options={{
          tabBarLabel: ({ focused }) =>
            focused
              ? <Text style={{ color: PRIMARY_COLOR, fontSize: 24, marginBottom: 0, marginTop: -8 }}>•</Text>
              : <Text style={{ fontFamily: 'RedHatDisplay-Regular', fontSize: 11, color: INACTIVE_LABEL_COLOR, marginTop: 0, marginBottom: 4 }}>Points History</Text>,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: ({ focused }) =>
            focused
              ? <Text style={{ color: PRIMARY_COLOR, fontSize: 24, marginBottom: 0, marginTop: -8 }}>•</Text>
              : <Text style={{ fontFamily: 'RedHatDisplay-Regular', fontSize: 11, color: INACTIVE_LABEL_COLOR, marginTop: 0, marginBottom: 4 }}>Wallet</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) =>
            focused
              ? <Text style={{ color: PRIMARY_COLOR, fontSize: 24, marginBottom: 0, marginTop: -8 }}>•</Text>
              : <Text style={{ fontFamily: 'RedHatDisplay-Regular', fontSize: 11, color: INACTIVE_LABEL_COLOR, marginTop: 0, marginBottom: 4 }}>Profile</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
const AuthStack = () => {
  return (
    <NavigationContainer>
      <SignupProvider>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="GetStarted"
        >
          <Stack.Screen name="GetStarted" component={GetStarted} />
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
          <Stack.Screen name="RestaurantAddress" component={RestaurantAddress} />
          <Stack.Screen name="RestaurantPictures" component={RestaurantPictures} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </SignupProvider>
    </NavigationContainer>
  );
};


const AppStack = () => {
  return (
    <NavigationContainer>
      <CardProvider>
        <DishProvider>
          <BottomSheetProvider>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName="BottomTab"
            >
              <Stack.Screen name="BottomTab" component={AppContent} />
              <Stack.Screen name="Topup" component={Topup} />
              <Stack.Screen name="ManageCards" component={ManageCards} />
              <Stack.Screen name="ManagePoints" component={ManagePoints} />
              <Stack.Screen name="QrCode" component={QrCode} />
              <Stack.Screen name="RestaurantDiscovery" component={RestaurantDiscoveryScreen} />
              <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
              <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
              <Stack.Screen name="Security" component={SecurityScreen} />
              <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
              <Stack.Screen name="GetHelp" component={GetHelpScreen} />
              <Stack.Screen name="Legal" component={LegalScreen} />
            </Stack.Navigator>
            <DynamicBottomSheet />
          </BottomSheetProvider>
        </DishProvider>
      </CardProvider>
    </NavigationContainer>
  );
};

const Root = () => {
  const { user } = useAppContext();
  return user ? <StripeProvider  publishableKey={STRIPE_PUBLIC_KEY}><AppStack /></StripeProvider> : <AuthWithSignup />;
};

const AuthWithSignup = () => (
  <NavigationContainer>
    <SignupProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="GetStarted"
      >
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
        <Stack.Screen name="RestaurantAddress" component={RestaurantAddress} />
        <Stack.Screen name="RestaurantPictures" component={RestaurantPictures} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </SignupProvider>
  </NavigationContainer>
);

const App = () => {
  return (
    <AppProvider>
      <Root />
      <Toast />
    </AppProvider>
  );
};

export default App;
