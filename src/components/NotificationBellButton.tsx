import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import colors from '../theme/colors';
import Bell from '../assets/icons/notification_bell.svg';
import { NotificationIcon } from '../assets/icons';
import axios from '../api/axios';

type Props = {
  userId?: string | number | null;
  variant?: 'bell' | 'icon';
  color?: string;
  size?: number;
};

const NotificationBellButton: React.FC<Props> = ({
  userId,
  variant = 'bell',
  color,
  size = 20,
}) => {
  const navigation = useNavigation<any>();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }
    try {
      const response = await axios.get(`/users/${userId}/notifications/unread-count`);
      setUnreadCount(response.data.unreadCount || 0);
    } catch {
      // Keep existing count on transient errors
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [fetchUnreadCount])
  );

  const Icon = variant === 'icon' ? NotificationIcon : Bell;
  const iconColor = color || colors.primary.main;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('Notifications')}
      accessibilityLabel="Notifications"
    >
      <Icon width={size} height={size} {...(variant === 'icon' ? { color: iconColor } : {})} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : String(unreadCount)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});

export default NotificationBellButton;
