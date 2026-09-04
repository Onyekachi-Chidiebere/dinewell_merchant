import { useCallback, useEffect, useState } from 'react';
import axios from '../api/axios';

export interface AppNotification {
  id: number;
  title: string;
  body: string;
  type: string;
  data: Record<string, any>;
  isRead: boolean;
  dateCreated: string;
}

export interface NotificationPreferences {
  appNotifications: boolean;
  emailNotifications: boolean;
}

export function useNotifications(userId?: string | number | null) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    appNotifications: true,
    emailNotifications: false,
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prefsLoading, setPrefsLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`/users/${userId}/notifications/unread-count`);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('fetchUnreadCount error:', error);
    }
  }, [userId]);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(`/users/${userId}/notifications`, {
        params: { page: 1, limit: 50 },
      });
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('fetchNotifications error:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchPreferences = useCallback(async () => {
    if (!userId) return;
    setPrefsLoading(true);
    try {
      const response = await axios.get(`/users/${userId}/notification-preferences`);
      if (response.data?.data) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error('fetchPreferences error:', error);
    } finally {
      setPrefsLoading(false);
    }
  }, [userId]);

  const updatePreferences = useCallback(
    async (updates: Partial<NotificationPreferences>) => {
      if (!userId) return;
      const previous = preferences;
      setPreferences((prev) => ({ ...prev, ...updates }));
      try {
        const response = await axios.put(`/users/${userId}/notification-preferences`, updates);
        if (response.data?.data) {
          setPreferences(response.data.data);
        }
        if (updates.appNotifications === true) {
          const { registerDeviceToken } = await import('../services/pushNotifications');
          await registerDeviceToken(userId, 'merchant');
        }
      } catch (error) {
        setPreferences(previous);
        console.error('updatePreferences error:', error);
        throw error;
      }
    },
    [userId, preferences]
  );

  const markAsRead = useCallback(
    async (notificationId: number) => {
      if (!userId) return;
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      try {
        await axios.patch(`/users/${userId}/notifications/${notificationId}/read`);
      } catch (error) {
        console.error('markAsRead error:', error);
        fetchNotifications();
      }
    },
    [userId, fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await axios.patch(`/users/${userId}/notifications/read-all`);
    } catch (error) {
      console.error('markAllAsRead error:', error);
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  useEffect(() => {
    if (!userId) return;
    fetchPreferences();
    fetchNotifications();
  }, [userId, fetchPreferences, fetchNotifications]);

  return {
    notifications,
    preferences,
    unreadCount,
    loading,
    prefsLoading,
    fetchNotifications,
    fetchUnreadCount,
    fetchPreferences,
    updatePreferences,
    markAsRead,
    markAllAsRead,
  };
}
