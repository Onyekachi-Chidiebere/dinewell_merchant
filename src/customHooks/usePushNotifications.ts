import { useEffect } from 'react';

/**
 * Registers FCM + foreground listeners after mount.
 * Uses dynamic import so a Firebase failure cannot blank the first paint.
 */
export function usePushNotifications(
  userId?: string | number | null,
  appName: 'client' | 'merchant' = 'merchant'
) {
  useEffect(() => {
    if (!userId) return;

    let unsubForeground: (() => void) | undefined;
    let unsubRefresh: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      try {
        const push = await import('../services/pushNotifications');
        await push.registerDeviceToken(userId, appName);
        if (cancelled) return;
        unsubForeground = push.setupForegroundHandlers();
        unsubRefresh = push.onTokenRefresh(userId, appName);
      } catch (error) {
        console.error('usePushNotifications setup error:', error);
      }
    })();

    return () => {
      cancelled = true;
      if (unsubForeground) unsubForeground();
      if (unsubRefresh) unsubRefresh();
    };
  }, [userId, appName]);
}
