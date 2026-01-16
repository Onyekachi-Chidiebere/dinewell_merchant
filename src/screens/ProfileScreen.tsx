import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowRightIcon, SecurityIcon, SettingsIcon, NotificationFadeIcon } from '../assets/icons';
import { useAppContext } from '../context/AppContext';

type RootStackParamList = {
  AccountSettings: undefined;
  Security: undefined;
  Notifications: undefined;
  GetHelp: undefined;
  Legal: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 1,
      title: 'Account Settings',
      icon: SettingsIcon,
      onPress: () => navigation.navigate('AccountSettings'),
    },
    {
      id: 2,
      title: 'Security',
      icon: SecurityIcon,
      onPress: () => navigation.navigate('Security'),
    },
    {
      id: 3,
      title: 'Notifications',
      icon: NotificationFadeIcon,
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      id: 4,
      title: 'Get Help',
      icon: null,
      onPress: () => navigation.navigate('GetHelp'),
    },
    {
      id: 5,
      title: 'Legal',
      icon: null,
      onPress: () => navigation.navigate('Legal'),
    },
    {
      id: 6,
      title: 'About Dine Well',
      icon: null,
      onPress: () => { },
    },
  ];

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        {item.icon && (
          <View style={styles.iconContainer}>
            <item.icon width={24} height={24} color={colors.primary.middle} />
          </View>
        )}
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <View style={styles.arrowContainer}>
        <ArrowRightIcon width={16} height={16} color={colors.border.subtle} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  user?.restaurant_logo || user?.profile_image
                    ? { uri: user.restaurant_logo || user.profile_image }
                    : require('../assets/images/avatar.png')
                }
                style={styles.avatar}
              />
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{user?.restaurant_name || user?.name || 'Restaurant'}</Text>
              <View style={styles.usernameContainer}>
                <Text style={styles.usernameLabel}>ID</Text>
                <Text style={styles.username}>{user?.id || ''}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('ProfileDetails' as never)}
          >
            <ArrowRightIcon width={24} height={24} color={colors.border.subtle} />
          </TouchableOpacity>
        </View>

        <View
          style={styles.decorationSection}
        >

        </ View>
      </View>
   
      <ScrollView style={styles.scrollView}>

        <View style={styles.menuSection}>
          <View style={styles.menuGroup}>
            {menuItems.slice(0, 3).map(renderMenuItem)}
          </View>
          <View style={styles.divider} />
          <View style={styles.menuGroup}>
            {menuItems.slice(3).map(renderMenuItem)}
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.background.darksubtle,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileSection: {
    backgroundColor: colors.background.subtle,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    paddingTop: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary.main,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nameContainer: {
    gap: 4,
  },
  name: {
    ...typography.subtitle1,
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  usernameLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  username: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  editButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingRight: 16,
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
    borderRadius: 12,
    paddingVertical: 10,
  },

 
  menuSection: {
    padding: 16,
  },
  menuGroup: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 40,
    backgroundColor: colors.background.subtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontWeight: '600',
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border.subtle,
    marginVertical: 8,
  },
  logoutButton: {
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 8,
    backgroundColor: colors.background.default,
    borderRadius: 999,
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
    marginTop: 8,
  },
  logoutText: {
    ...typography.button,
    color: colors.text.primary,
    fontWeight: '400',
  },
});

export default ProfileScreen; 