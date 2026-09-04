import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon, BellIcon, EmailIcon } from '../assets/icons';
import { useAppContext } from '../context/AppContext';
import { useNotifications } from '../customHooks/useNotifications';

type RootStackParamList = {
  Profile: undefined;
  Notifications: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const formatTime = (value: string) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const NotificationsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppContext();
  const {
    notifications,
    preferences,
    unreadCount,
    loading,
    fetchNotifications,
    updatePreferences,
    markAsRead,
    markAllAsRead,
  } = useNotifications(user?.id);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const menuItems = [
    {
      id: 1,
      title: 'App Notifications',
      subtitle: 'Show alerts in your inbox',
      isEnabled: preferences.appNotifications,
      icon: BellIcon,
      onToggle: () =>
        updatePreferences({ appNotifications: !preferences.appNotifications }).catch(() => {}),
    },
    {
      id: 2,
      title: 'Email Notifications',
      subtitle: 'Receive updates by email',
      isEnabled: preferences.emailNotifications,
      icon: EmailIcon,
      onToggle: () =>
        updatePreferences({ emailNotifications: !preferences.emailNotifications }).catch(() => {}),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ArrowLeftIcon width={24} height={24} color={colors.border.subtle} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.markAll}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchNotifications} />
        }
        ListHeaderComponent={
          <View style={styles.menuGroup}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onToggle}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconContainer}>
                    <item.icon width={24} height={24} color={colors.primary.middle} />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.toggle,
                    item.isEnabled ? styles.toggleActive : styles.toggleInactive,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleCircle,
                      item.isEnabled ? styles.toggleCircleActive : styles.toggleCircleInactive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))}
            <Text style={styles.sectionTitle}>Inbox</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary.main} style={{ marginTop: 24 }} />
          ) : (
            <Text style={styles.emptyText}>No notifications yet</Text>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notificationCard, !item.isRead && styles.notificationUnread]}
            onPress={() => markAsRead(item.id)}
          >
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationBody}>{item.body}</Text>
            <Text style={styles.notificationTime}>{formatTime(item.dateCreated)}</Text>
          </TouchableOpacity>
        )}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  markAll: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  menuGroup: {
    gap: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    ...typography.subtitle2,
    color: colors.text.secondary,
    fontWeight: '700',
    marginTop: 8,
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
    flex: 1,
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
    flex: 1,
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
  emptyText: {
    ...typography.body2,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 24,
  },
  notificationCard: {
    backgroundColor: colors.background.default,
    borderRadius: 12,
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
    padding: 14,
    marginBottom: 10,
  },
  notificationUnread: {
    borderColor: colors.primary.main,
    backgroundColor: colors.background.subtle,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontWeight: '700',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
    marginLeft: 8,
  },
  notificationBody: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  notificationTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});

export default NotificationsScreen;
