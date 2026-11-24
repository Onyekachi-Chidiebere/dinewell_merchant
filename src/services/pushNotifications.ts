import { Platform, PermissionsAndroid } from 'react-native';
import {
  getMessaging,
  getToken,
  requestPermission,
  registerDeviceForRemoteMessages,
  onMessage,
  onTokenRefresh as onMessagingTokenRefresh,
  setBackgroundMessageHandler,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import api from '../api/axios';

const ANDROID_CHANNEL_ID = 'dinewell_default';

function messaging() {
  return getMessaging();
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') {return;}
  await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: 'DineWell Merchant',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
}

async function ensurePermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }
  }

  const authStatus = await requestPermission(messaging());
  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}

async function displayRemoteMessage(remoteMessage: any) {
  await ensureAndroidChannel();
  const title =
    remoteMessage?.notification?.title ||
    remoteMessage?.data?.title ||
    'DineWell';
  const body =
    remoteMessage?.notification?.body ||
    remoteMessage?.data?.body ||
    '';

  await notifee.displayNotification({
    title,
    body,
    data: remoteMessage?.data || {},
    android: {
      channelId: ANDROID_CHANNEL_ID,
      pressAction: { id: 'default' },
      smallIcon: 'ic_launcher',
    },
  });
}

export async function registerDeviceToken(
  userId: string | number,
  appName: 'client' | 'merchant' = 'merchant'
) {
  if (!userId) {return null;}

  try {
    const allowed = await ensurePermission();
    if (!allowed) {return null;}

    await ensureAndroidChannel();

    if (Platform.OS === 'ios') {
      await registerDeviceForRemoteMessages(messaging());
    }

    const token = await getToken(messaging());
    if (!token) {return null;}

    await api.post('/users/me/device-tokens', {
      token,
      platform: Platform.OS,
      app: appName,
    });

    return token;
  } catch {
    return null;
  }
}

export async function unregisterDeviceToken(userId: string | number) {
  if (!userId) {return;}
  try {
    const token = await getToken(messaging());
    if (token) {
      await api.delete('/users/me/device-tokens', { data: { token } });
    }
  } catch {}
}

export function setupBackgroundHandlers() {
  try {
    setBackgroundMessageHandler(messaging(), async (remoteMessage) => {
      if (!remoteMessage?.notification) {
        await displayRemoteMessage(remoteMessage);
      }
    });

    notifee.onBackgroundEvent(async () => {});
  } catch {}
}

export function setupForegroundHandlers() {
  try {
    const unsubMessage = onMessage(messaging(), async (remoteMessage) => {
      await displayRemoteMessage(remoteMessage);
    });

    const unsubNotifee = notifee.onForegroundEvent(({ type }) => {
      if (type === EventType.PRESS) {
        // no-op
      }
    });

    return () => {
      unsubMessage();
      unsubNotifee();
    };
  } catch {
    return () => {};
  }
}

export function onTokenRefresh(
  userId: string | number,
  appName: 'client' | 'merchant' = 'merchant'
) {
  try {
    return onMessagingTokenRefresh(messaging(), async (token) => {
      if (!userId || !token) {return;}
      try {
        await api.post('/users/me/device-tokens', {
          token,
          platform: Platform.OS,
          app: appName,
        });
      } catch {}
    });
  } catch {
    return () => {};
  }
}
