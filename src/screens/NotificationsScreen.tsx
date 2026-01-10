import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon, BellIcon, EmailIcon } from '../assets/icons';

type RootStackParamList = {
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NotificationsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [appNotifications, setAppNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const menuItems = [
    {
      id: 1,
      title: 'App Notifications',
      subtitle: 'Account name,email,phone',
      isToggle: true,
      isEnabled: appNotifications,
      icon: BellIcon,
      onToggle: () => setAppNotifications(!appNotifications),
    },
    {
      id: 2,
      title: 'Email Notifications',
      subtitle: 'Account name,email,phone',
      isToggle: true,
      isEnabled: emailNotifications,
      icon: EmailIcon,
      onToggle: () => setEmailNotifications(!emailNotifications),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeftIcon width={24} height={24} color={colors.border.subtle} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.menuGroup}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onToggle}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <item.icon width={24} height={24} color={colors.primary.middle} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <View style={[
                styles.toggle,
                item.isEnabled ? styles.toggleActive : styles.toggleInactive
              ]}>
                <View style={[
                  styles.toggleCircle,
                  item.isEnabled ? styles.toggleCircleActive : styles.toggleCircleInactive
                ]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  header: {
    backgroundColor: colors.background.darksubtle,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 15,
  },
  headerContent: {
    backgroundColor: colors.background.subtle,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 80,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.subtitle1,
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  menuGroup: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
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
  menuItemContent: {
    gap: 4,
  },
  menuItemTitle: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontWeight: '600',
  },
  menuItemSubtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  toggle: {
    width: 32,
    height: 20,
    borderRadius: 40,
    padding: 2,
    borderWidth: 0.4,
  },
  toggleActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  toggleInactive: {
    backgroundColor: colors.background.paper,
    borderColor: colors.border.subtle,
  },
  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  toggleCircleActive: {
    backgroundColor: colors.text.white,
    transform: [{ translateX: 12 }],
  },
  toggleCircleInactive: {
    backgroundColor: colors.border.subtle,
    transform: [{ translateX: 0 }],
  },
});

export default NotificationsScreen; 