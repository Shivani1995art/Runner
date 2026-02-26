// hooks/useNotificationSetup.ts
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { logger } from '../utils/logger';
import notifee from '@notifee/react-native';
import NotificationService from '../services/NotificationService/NotificationService';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
const useNotificationSetup = (
  isLogin: boolean | null,
  saveToken: (token: string, platform: 'runner_ios' | 'runner_android') => void,
  onNotificationPress?: (data?: Record<string, string>) => void
) => {


  // ── Clear notification tray when app comes to foreground ──────────────────
  useEffect(() => {
    if (!isLogin) return;

    // Clear on mount (app opened from quit state)
    notifee.cancelAllNotifications();

    // Clear every time app becomes active (from background)
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        notifee.cancelAllNotifications();
        logger.log('Notification tray cleared');
      }
    });

    return () => subscription.remove();
  }, [isLogin]);

  useEffect(() => {
    if (!isLogin) return;

    const platform = Platform.OS === 'ios' ? 'runner_ios' : 'runner_android';

    const setup = async () => {
      // 1. Bootstrap channel + background handler
      await NotificationService.bootstrap();

      // 2. Request permission
      const granted = await NotificationService.requestPermission();
      if (!granted) {
        logger.log('Notification permission not granted');
        return;
      }
// if (Platform.OS === 'ios') {
//   // ✅ Check if APNs token is available (required for FCM on iOS)
//   const apnsToken = await messaging().getAPNSToken();
//   logger.log('APNs token:', apnsToken); // ← if this is null, that's the root cause

//   if (!apnsToken) {
//     logger.log('APNs token null — waiting 2s and retrying...');
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     const retryApns = await messaging().getAPNSToken();
//     logger.log('APNs token retry:', retryApns);
//   }
// }


      // 3. Get & save token
      const token = await NotificationService.getFCMToken();
      if (token) saveToken(token, platform);

      // 4. Check if app was opened from notification (quit state)
      const initialData = await NotificationService.getInitialNotification();
      if (initialData) {
        onNotificationPress?.(initialData);
      }
    };

    setup();

    // 5. Foreground message listener
    const unsubForeground = NotificationService.onForegroundMessage();

    // 6. Foreground notification tap listener
    const unsubPress = NotificationService.onForegroundNotificationPress();

    // 7. Token refresh
    const unsubRefresh = NotificationService.onTokenRefresh((newToken) => {
         logger.log('FCM token refreshed:', newToken);
      saveToken(newToken, platform);
    });

    // 8. Register press handler for navigation
    if (onNotificationPress) {
      NotificationService.addNotificationPressHandler(onNotificationPress);
    }

    return () => {
      unsubForeground();
      unsubPress();
      unsubRefresh();
      if (onNotificationPress) {
        NotificationService.removeNotificationPressHandler(onNotificationPress);
      }
    };
  }, [isLogin]);
};

export default useNotificationSetup;