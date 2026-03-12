// // services/notification/NotificationService.ts
// import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
// import { Platform, AppState } from 'react-native';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
// import { logger } from '../../utils/logger';

// export type NotificationPayload = {
//   title?: string;
//   body?: string;
//   data?: Record<string, string>;
// };

// type MessageHandler = (message: FirebaseMessagingTypes.RemoteMessage) => void;
// type NotificationPressHandler = (data?: Record<string, string>) => void;
// type ForegroundAlertHandler = (title: string, body: string) => void;
// class NotificationService {
//   private _onMessageHandlers: MessageHandler[] = [];
//   private _onNotificationPressHandlers: NotificationPressHandler[] = [];
//   private _onForegroundAlertHandlers: ForegroundAlertHandler[] = [];



//   // ── Add / Remove foreground alert handlers ────────────────────────────────
//   addForegroundAlertHandler(handler: ForegroundAlertHandler): void {
//     this._onForegroundAlertHandlers.push(handler);
//   }

//   removeForegroundAlertHandler(handler: ForegroundAlertHandler): void {
//     this._onForegroundAlertHandlers = this._onForegroundAlertHandlers.filter(
//       (h) => h !== handler
//     );
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 1. Permission
//   // ─────────────────────────────────────────────────────────────────────────

//   async requestPermission(): Promise<boolean> {
//     try {
//       if (Platform.OS === 'ios') {
//         // iOS: must register device before getting token
//         await messaging().registerDeviceForRemoteMessages();
//       }

//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       logger.log('Notification permission status:', authStatus, '| enabled:', enabled);
//       return enabled;
//     } catch (error) {
//       logger.log('requestPermission error:', error);
//       return false;
//     }
//   }

//   async hasPermission(): Promise<boolean> {
//     const status = await messaging().hasPermission();
//     return (
//       status === messaging.AuthorizationStatus.AUTHORIZED ||
//       status === messaging.AuthorizationStatus.PROVISIONAL
//     );
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 2. Token Management
//   // ─────────────────────────────────────────────────────────────────────────

//   async getFCMToken(): Promise<string | null> {
//     try {
//       if (Platform.OS === 'ios') {
//         await messaging().registerDeviceForRemoteMessages();
//       }
//       const token = await messaging().getToken();
//       logger.log('FCM Token:', token);
//       return token;
//     } catch (error) {
//       logger.log('getFCMToken error:', error);
//       return null;
//     }
//   }

//   async deleteToken(): Promise<void> {
//     try {
//       await messaging().deleteToken();
//       logger.log('FCM token deleted');
//     } catch (error) {
//       logger.log('deleteToken error:', error);
//     }
//   }

//   onTokenRefresh(callback: (token: string) => void) {
//     return messaging().onTokenRefresh((token) => {
//       logger.log('FCM token refreshed:', token);
//       callback(token);
//     });
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 3. Create Notification Channel (Android only)
//   // ─────────────────────────────────────────────────────────────────────────

//   async createAndroidChannel(): Promise<void> {
//     if (Platform.OS !== 'android') return;
//     await notifee.createChannel({
//       id: 'runner_default',
//       name: 'Runner Notifications',
//       importance: AndroidImportance.HIGH,
//       sound: 'default',
//       vibration: true,
//     });
//     logger.log('Android notification channel created');
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 4. Display Local Notification (foreground messages)
//   // ─────────────────────────────────────────────────────────────────────────

//   async displayNotification(payload: NotificationPayload): Promise<void> {
//     try {
//       await notifee.displayNotification({
//         title: payload.title ?? 'New Notification',
//         body: payload.body ?? '',
//         data: payload.data,
//         android: {
//           channelId: 'runner_default',
//           importance: AndroidImportance.HIGH,
//           pressAction: { id: 'default' },
//           sound: 'default',
//         },
//         ios: {
//           sound: 'default',
//           foregroundPresentationOptions: {
//             alert: true,
//             badge: true,
//             sound: true,
//              banner: true,  // ← add this
//           list: true,    // ← add this
//           },
//         },
//       });
//     } catch (error) {
//       logger.log('displayNotification error:', error);
//     }
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 5. Foreground Message Handler (app is open)
//   // ─────────────────────────────────────────────────────────────────────────

// onForegroundMessage() {
//   logger.log('onForegroundMessage listener registered on:', Platform.OS);
//   return messaging().onMessage(async (remoteMessage) => {
//     logger.log('Foreground FCM message:', remoteMessage);

//     // iOS data-only: title/body are in data, not notification
//     // Android: title/body are in notification
//     const title = remoteMessage.notification?.title 
//       ?? remoteMessage.data?.title as string;
//     const body  = remoteMessage.notification?.body  
//       ?? remoteMessage.data?.body as string;

//     // await this.displayNotification({
//     //   title,
//     //   body,
//     //   data: remoteMessage.data as Record<string, string>,
//     // });

//     // ✅ Emit to dialog instead of local notification
//     this._onForegroundAlertHandlers.forEach((handler) => handler(title, body));

//     this._onMessageHandlers.forEach((handler) => handler(remoteMessage));
//   });
// }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 6. Background / Quit Message Handler
//   //    Register these OUTSIDE of any component (e.g. index.js)
//   // ─────────────────────────────────────────────────────────────────────────

//   registerBackgroundHandler(): void {
//     // FCM background handler
//     messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//       logger.log('Background FCM message:', remoteMessage);

//       await this.displayNotification({
//         title: remoteMessage.notification?.title,
//         body: remoteMessage.notification?.body,
//         data: remoteMessage.data as Record<string, string>,
//       });
//     });

//     // Notifee background event (notification tapped while in background)
//     notifee.onBackgroundEvent(async ({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         logger.log('Notification pressed in background:', detail.notification?.data);
//         this._onNotificationPressHandlers.forEach((handler) =>
//           handler(detail.notification?.data as Record<string, string>)
//         );
//       }
//     });
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 7. Notification Tap Handlers (foreground via notifee)
//   // ─────────────────────────────────────────────────────────────────────────

//   onForegroundNotificationPress() {
//     return notifee.onForegroundEvent(({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         logger.log('Notification pressed in foreground:', detail.notification?.data);
//         this._onNotificationPressHandlers.forEach((handler) =>
//           handler(detail.notification?.data as Record<string, string>)
//         );
//       }
//     });
//   }

//   // App opened from a quit state by tapping notification
//   async getInitialNotification(): Promise<Record<string, string> | null> {
//     try {
//       // Check notifee (local notifications)
//       const notifeeInitial = await notifee.getInitialNotification();
//       if (notifeeInitial) {
//         logger.log('App opened from notifee notification:', notifeeInitial.notification?.data);
//         return notifeeInitial.notification?.data as Record<string, string>;
//       }

//       // Check FCM (remote notifications)
//       const fcmInitial = await messaging().getInitialNotification();
//       if (fcmInitial) {
//         logger.log('App opened from FCM notification:', fcmInitial.data);
//         return fcmInitial.data as Record<string, string>;
//       }

//       return null;
//     } catch (error) {
//       logger.log('getInitialNotification error:', error);
//       return null;
//     }
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 8. Subscribe / Unsubscribe Handlers
//   // ─────────────────────────────────────────────────────────────────────────

//   addMessageHandler(handler: MessageHandler): void {
//     this._onMessageHandlers.push(handler);
//   }

//   removeMessageHandler(handler: MessageHandler): void {
//     this._onMessageHandlers = this._onMessageHandlers.filter((h) => h !== handler);
//   }

//   addNotificationPressHandler(handler: NotificationPressHandler): void {
//     this._onNotificationPressHandlers.push(handler);
//   }

//   removeNotificationPressHandler(handler: NotificationPressHandler): void {
//     this._onNotificationPressHandlers = this._onNotificationPressHandlers.filter(
//       (h) => h !== handler
//     );
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 9. Bootstrap — call once when app starts
//   // ─────────────────────────────────────────────────────────────────────────

//   async bootstrap(): Promise<void> {
//     await this.createAndroidChannel();
//     this.registerBackgroundHandler();
//     logger.log('NotificationService bootstrapped');
//   }
// }

// export default new NotificationService();


// services/notification/NotificationService.ts
// import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
// import { Platform, AppState } from 'react-native';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
// import { logger } from '../../utils/logger';

// export type NotificationPayload = {
//   title?: string;
//   body?: string;
//   data?: Record<string, string>;
// };

// type MessageHandler = (message: FirebaseMessagingTypes.RemoteMessage) => void;
// type NotificationPressHandler = (data?: Record<string, string>) => void;
// type ForegroundAlertHandler = (title: string, body: string, remoteMessage: FirebaseMessagingTypes.RemoteMessage) => void;

// class NotificationService {
//   private _onMessageHandlers: MessageHandler[] = [];
//   private _onNotificationPressHandlers: NotificationPressHandler[] = [];
//   private _onForegroundAlertHandlers: ForegroundAlertHandler[] = [];
// private _foregroundUnsubscribe: (() => void) | null = null;


//   // ── Add / Remove foreground alert handlers ────────────────────────────────
//   addForegroundAlertHandler(handler: ForegroundAlertHandler): void {
//     this._onForegroundAlertHandlers.push(handler);
//   }

//   removeForegroundAlertHandler(handler: ForegroundAlertHandler): void {
//     this._onForegroundAlertHandlers = this._onForegroundAlertHandlers.filter(
//       (h) => h !== handler
//     );
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 1. Permission
//   // ─────────────────────────────────────────────────────────────────────────

//   async requestPermission(): Promise<boolean> {
//     try {
//       if (Platform.OS === 'ios') {
//         // iOS: must register device before getting token
//         await messaging().registerDeviceForRemoteMessages();
//       }

//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       logger.log('Notification permission status:', authStatus, '| enabled:', enabled);
//       return enabled;
//     } catch (error) {
//       logger.log('requestPermission error:', error);
//       return false;
//     }
//   }

//   async hasPermission(): Promise<boolean> {
//     const status = await messaging().hasPermission();
//     return (
//       status === messaging.AuthorizationStatus.AUTHORIZED ||
//       status === messaging.AuthorizationStatus.PROVISIONAL
//     );
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 2. Token Management
//   // ─────────────────────────────────────────────────────────────────────────

//   async getFCMToken(): Promise<string | null> {
//     try {
//       if (Platform.OS === 'ios') {
//         await messaging().registerDeviceForRemoteMessages();
//       }
//       const token = await messaging().getToken();
//       logger.log('FCM Token:', token);
//       return token;
//     } catch (error) {
//       logger.log('getFCMToken error:', error);
//       return null;
//     }
//   }

//   async deleteToken(): Promise<void> {
//     try {
//       await messaging().deleteToken();
//       logger.log('FCM token deleted');
//     } catch (error) {
//       logger.log('deleteToken error:', error);
//     }
//   }

//   onTokenRefresh(callback: (token: string) => void) {
//     return messaging().onTokenRefresh((token) => {
//       logger.log('FCM token refreshed:', token);
//       callback(token);
//     });
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 3. Create Notification Channel (Android only)
//   // ─────────────────────────────────────────────────────────────────────────

//   async createAndroidChannel(): Promise<void> {
//     if (Platform.OS !== 'android') return;
//     await notifee.createChannel({
//       id: 'runner_default',
//       name: 'Runner Notifications',
//       importance: AndroidImportance.HIGH,
//       sound: 'honestbee',
//       vibration: true,
//     });
//     logger.log('Android notification channel created');
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 4. Display Local Notification (foreground messages)
//   // ─────────────────────────────────────────────────────────────────────────

//   async displayNotification(payload: NotificationPayload): Promise<void> {
//     try {
//       await notifee.displayNotification({
//         title: payload.title ?? 'New Notification',
//         body: payload.body ?? '',
//         data: payload.data,
//         android: {
//           channelId: 'runner_default',
//           importance: AndroidImportance.HIGH,
//           pressAction: { id: 'default' },
//           sound: 'honestbee',
//         },
//         ios: {
//           sound: 'honestbee.wav',
//           foregroundPresentationOptions: {
//             alert: true,
//             badge: true,
//             sound: true,
//             banner: true,
//             list: true,
//           },
//         },
//       });
//     } catch (error) {
//       logger.log('displayNotification error:', error);
//     }
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 5. Foreground Message Handler (app is open)
//   // ─────────────────────────────────────────────────────────────────────────

// onForegroundMessage() {
//   if (this._foregroundUnsubscribe) {
//     return this._foregroundUnsubscribe;
//   }

//   logger.log('onForegroundMessage listener registered on:', Platform.OS);

//   this._foregroundUnsubscribe = messaging().onMessage(async (remoteMessage) => {
//     logger.log('Foreground FCM message:', remoteMessage);

//     const title =
//       remoteMessage.notification?.title ??
//       (remoteMessage.data?.title as string);

//     const body =
//       remoteMessage.notification?.body ??
//       (remoteMessage.data?.body as string);

//     this._onForegroundAlertHandlers.forEach((handler) =>
//       handler(title, body, remoteMessage)
//     );

//     this._onMessageHandlers.forEach((handler) =>
//       handler(remoteMessage)
//     );
//   });

//   return this._foregroundUnsubscribe;
// }

//   // onForegroundMessage() {
//   //   logger.log('onForegroundMessage listener registered on:', Platform.OS);
//   //   return messaging().onMessage(async (remoteMessage) => {
//   //     logger.log('Foreground FCM message:', remoteMessage);

//   //     // iOS data-only: title/body are in data, not notification
//   //     // Android: title/body are in notification
//   //     const title = remoteMessage.notification?.title 
//   //       ?? remoteMessage.data?.title as string;
//   //     const body  = remoteMessage.notification?.body  
//   //       ?? remoteMessage.data?.body as string;

//   //     // ✅ Emit to handler with full remoteMessage
//   //     this._onForegroundAlertHandlers.forEach((handler) => handler(title, body, remoteMessage));

//   //     this._onMessageHandlers.forEach((handler) => handler(remoteMessage));
//   //   });
//   // }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 6. Background / Quit Message Handler
//   //    Register these OUTSIDE of any component (e.g. index.js)
//   // ─────────────────────────────────────────────────────────────────────────

//   registerBackgroundHandler(): void {
//     // FCM background handler
//     messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//       logger.log('Background FCM message:', remoteMessage);

//       await this.displayNotification({
//         title: remoteMessage.notification?.title,
//         body: remoteMessage.notification?.body,
//         data: remoteMessage.data as Record<string, string>,
//       });
//     });

//     // Notifee background event (notification tapped while in background)
//     notifee.onBackgroundEvent(async ({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         logger.log('Notification pressed in background:', detail.notification?.data);
//         this._onNotificationPressHandlers.forEach((handler) =>
//           handler(detail.notification?.data as Record<string, string>)
//         );
//       }
//     });
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 7. Notification Tap Handlers (foreground via notifee)
//   // ─────────────────────────────────────────────────────────────────────────

//   onForegroundNotificationPress() {
//     return notifee.onForegroundEvent(({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         logger.log('Notification pressed in foreground:', detail.notification?.data);
//         this._onNotificationPressHandlers.forEach((handler) =>
//           handler(detail.notification?.data as Record<string, string>)
//         );
//       }
//     });
//   }

//   // App opened from a quit state by tapping notification
//   async getInitialNotification(): Promise<Record<string, string> | null> {
//     try {
//       // Check notifee (local notifications)
//       const notifeeInitial = await notifee.getInitialNotification();
//       if (notifeeInitial) {
//         logger.log('App opened from notifee notification:', notifeeInitial.notification?.data);
//         return notifeeInitial.notification?.data as Record<string, string>;
//       }

//       // Check FCM (remote notifications)
//       const fcmInitial = await messaging().getInitialNotification();
//       if (fcmInitial) {
//         logger.log('App opened from FCM notification:', fcmInitial.data);
//         return fcmInitial.data as Record<string, string>;
//       }

//       return null;
//     } catch (error) {
//       logger.log('getInitialNotification error:', error);
//       return null;
//     }
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 8. Subscribe / Unsubscribe Handlers
//   // ─────────────────────────────────────────────────────────────────────────

//   addMessageHandler(handler: MessageHandler): void {
//     this._onMessageHandlers.push(handler);
//   }

//   removeMessageHandler(handler: MessageHandler): void {
//     this._onMessageHandlers = this._onMessageHandlers.filter((h) => h !== handler);
//   }

//   addNotificationPressHandler(handler: NotificationPressHandler): void {
//     this._onNotificationPressHandlers.push(handler);
//   }

//   removeNotificationPressHandler(handler: NotificationPressHandler): void {
//     this._onNotificationPressHandlers = this._onNotificationPressHandlers.filter(
//       (h) => h !== handler
//     );
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // 9. Bootstrap — call once when app starts
//   // ─────────────────────────────────────────────────────────────────────────

//   async bootstrap(): Promise<void> {
//     await this.createAndroidChannel();
//     this.registerBackgroundHandler();
//     logger.log('NotificationService bootstrapped');
//   }
// }

// export default new NotificationService();


import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform, AppState, Vibration } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { logger } from '../../utils/logger';

export type NotificationPayload = {
  title?: string;
  body?: string;
  data?: Record<string, string>;
};

type MessageHandler = (message: FirebaseMessagingTypes.RemoteMessage) => void;
type NotificationPressHandler = (data?: Record<string, string>) => void;
type ForegroundAlertHandler = (title: string, body: string, remoteMessage: FirebaseMessagingTypes.RemoteMessage) => void;

class NotificationService {
  private _onMessageHandlers: MessageHandler[] = [];
  private _onNotificationPressHandlers: NotificationPressHandler[] = [];
  private _onForegroundAlertHandlers: ForegroundAlertHandler[] = [];
  private _foregroundUnsubscribe: (() => void) | null = null;

  // ── Add / Remove foreground alert handlers ────────────────────────────────
  addForegroundAlertHandler(handler: ForegroundAlertHandler): void {
    this._onForegroundAlertHandlers.push(handler);
  }

  removeForegroundAlertHandler(handler: ForegroundAlertHandler): void {
    this._onForegroundAlertHandlers = this._onForegroundAlertHandlers.filter(
      (h) => h !== handler
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 1. Permission
  // ─────────────────────────────────────────────────────────────────────────

  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      logger.log('✅ Notification permission status:', authStatus, '| enabled:', enabled);
      return enabled;
    } catch (error) {
      logger.error('❌ requestPermission error:', error);
      return false;
    }
  }

  async hasPermission(): Promise<boolean> {
    const status = await messaging().hasPermission();
    return (
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Token Management
  // ─────────────────────────────────────────────────────────────────────────

  async getFCMToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
      }
      const token = await messaging().getToken();
      logger.log('🔑 FCM Token:', token);
      return token;
    } catch (error) {
      logger.error('❌ getFCMToken error:', error);
      return null;
    }
  }

  async deleteToken(): Promise<void> {
    try {
      await messaging().deleteToken();
      logger.log('✅ FCM token deleted');
    } catch (error) {
      logger.error('❌ deleteToken error:', error);
    }
  }

  onTokenRefresh(callback: (token: string) => void) {
    return messaging().onTokenRefresh((token) => {
      logger.log('🔄 FCM token refreshed:', token.substring(0, 20) + '...');
      callback(token);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Delete Old Channels (prevents Android caching issues)
  // ─────────────────────────────────────────────────────────────────────────

  async deleteOldChannels(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      logger.log('🗑️  Attempting to delete old notification channels...');

      const channelIds = [
        'runner_default',
        'order_ready_pickup',
        'direct_message',
      ];

      for (const channelId of channelIds) {
        try {
          await notifee.deleteChannel(channelId);
          logger.log(`✅ Deleted old channel: ${channelId}`);
        } catch (error) {
          // Channel doesn't exist (first run) - this is fine
          logger.log(`ℹ️  Channel not found (first run?): ${channelId}`);
        }
      }
    } catch (error) {
      logger.error('⚠️  Error deleting channels:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Create Notification Channels (Android only)
  // IMPORTANT: Sound name must match the audio file in android/app/src/main/res/raw/
  // ─────────────────────────────────────────────────────────────────────────

  async createAndroidChannels(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      logger.log('🔔 Creating Android notification channels...');

      // ✅ ORDER READY CHANNEL - with custom sound
      await notifee.createChannel({
        id: 'order_ready_pickup',
        name: 'Order Ready for Pickup',
        importance: AndroidImportance.MAX,
        sound: 'honestbee', // ✅ Must match: android/app/src/main/res/raw/honestbee.mp3
        vibration: true,
        lights: true,
        lightColor: '#FF0000',
        bypassDnd: true,
        enableVibration: true,
        enableLights: true,
        description: 'Urgent notifications for orders ready for pickup',
      });
      logger.log('✅ Channel created: order_ready_pickup (sound: honestbee)');

      // ✅ DIRECT MESSAGE CHANNEL - with custom sound
      await notifee.createChannel({
        id: 'direct_message',
        name: 'Direct Messages',
        importance: AndroidImportance.HIGH,
        sound: 'honestbee', // ✅ Custom sound for messages
        vibration: true,
        description: 'Direct messages from customers',
      });
      logger.log('✅ Channel created: direct_message (sound: honestbee)');

      // ✅ DEFAULT CHANNEL - with custom sound
      await notifee.createChannel({
        id: 'runner_default',
        name: 'Runner Notifications',
        importance: AndroidImportance.HIGH,
        sound: 'honestbee', // ✅ Custom sound
        vibration: true,
        description: 'General notifications',
      });
      logger.log('✅ Channel created: runner_default (sound: honestbee)');

      logger.log('✅ All channels created successfully');
    } catch (error) {
      logger.error('❌ Error creating channels:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Get Channel ID and Vibration Pattern based on notification type
  // ─────────────────────────────────────────────────────────────────────────

  private _getChannelConfig(notificationType?: string): {
    channelId: string;
    vibrationPattern: number[];
    hasColor: boolean;
  } {
    switch (notificationType) {
      case 'order_ready_for_pickup':
        return {
          channelId: 'order_ready_pickup',
          vibrationPattern: [0, 500, 300, 500, 300, 500],
          hasColor: true,
        };
      case 'direct_message':
        return {
          channelId: 'direct_message',
          vibrationPattern: [0, 300],
          hasColor: false,
        };
      default:
        return {
          channelId: 'runner_default',
          vibrationPattern: [0, 200],
          hasColor: false,
        };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Display Local Notification (foreground messages)
  // ─────────────────────────────────────────────────────────────────────────

  async displayNotification(payload: NotificationPayload, notificationType?: string): Promise<void> {
    try {
      const config = this._getChannelConfig(notificationType);

      logger.log(`📢 Displaying notification | Type: ${notificationType} | Channel: ${config.channelId}`);

      // ✅ Trigger vibration for order ready (only on foreground)
      if (notificationType === 'order_ready_for_pickup') {
        Vibration.vibrate(config.vibrationPattern);
        logger.log('📳 Vibration triggered:', config.vibrationPattern);
      }

      const androidConfig: any = {
        channelId: config.channelId,
        importance: AndroidImportance.HIGH,
        pressAction: { id: 'default' },
        sound: 'honestbee', // ✅ Sound name (without extension)
        vibrationPattern: config.vibrationPattern,
        priority: AndroidImportance.HIGH,
      };

      // ✅ Add color and full screen action only for order ready
      if (config.hasColor) {
        androidConfig.fullScreenAction = { id: 'urgent' };
        androidConfig.color = '#FF0000';
        androidConfig.lights = [0xFF0000, 300, 600];
        logger.log('🔴 Red color and lights enabled');
      }

      await notifee.displayNotification({
        title: payload.title ?? 'New Notification',
        body: payload.body ?? '',
        data: payload.data,
        android: androidConfig,
        ios: {
          sound: 'honestbee', // ✅ iOS sound file
          critical: notificationType === 'order_ready_for_pickup',
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      });

      logger.log(`✅ Notification displayed successfully | Type: ${notificationType} | Sound: honestbee`);
    } catch (error) {
      logger.error('❌ displayNotification error:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 7. Foreground Message Handler (app is open)
  // ─────────────────────────────────────────────────────────────────────────

  onForegroundMessage() {
    if (this._foregroundUnsubscribe) {
      return this._foregroundUnsubscribe;
    }

    logger.log('📡 onForegroundMessage listener registered on:', Platform.OS);

    this._foregroundUnsubscribe = messaging().onMessage(async (remoteMessage) => {
      logger.log('📥 Foreground FCM message received');
      logger.log('   Type:', remoteMessage.data?.type);
      logger.log('   Title:', remoteMessage.notification?.title);
      logger.log('   Body:', remoteMessage.notification?.body);

      const title =
        remoteMessage.notification?.title ??
        (remoteMessage.data?.title as string);

      const body =
        remoteMessage.notification?.body ??
        (remoteMessage.data?.body as string);

      const notificationType = remoteMessage.data?.type as string;

      // ✅ Display notification with type
      // await this.displayNotification(
      //   {
      //     title,
      //     body,
      //     data: remoteMessage.data as Record<string, string>,
      //   },
      //   notificationType
      // );

      // ✅ Notify foreground alert handlers
      this._onForegroundAlertHandlers.forEach((handler) =>
        handler(title, body, remoteMessage)
      );

      // ✅ Notify message handlers
      this._onMessageHandlers.forEach((handler) =>
        handler(remoteMessage)
      );
    });

    return this._foregroundUnsubscribe;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. Background / Quit Message Handler
  // ─────────────────────────────────────────────────────────────────────────

  registerBackgroundHandler(): void {
    // ✅ FCM background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      logger.log('📬 Background FCM message received');
      logger.log('   Type:', remoteMessage.data?.type);

      const notificationType = remoteMessage.data?.type as string;
      const config = this._getChannelConfig(notificationType);

      // ✅ Trigger vibration for urgent notifications
      if (notificationType === 'order_ready_for_pickup') {
        try {
          Vibration.vibrate(config.vibrationPattern);
          logger.log('📳 Background vibration triggered');
        } catch (error) {
          logger.error('❌ Vibration error:', error);
        }
      }

      await this.displayNotification(
        {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          data: remoteMessage.data as Record<string, string>,
        },
        notificationType
      );
    });

    // ✅ Notifee background event (notification tapped while in background)
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        logger.log('👆 Notification pressed in background:', detail.notification?.data);

        const data = detail.notification?.data as Record<string, string>;
        const notificationType = data?.type;

        logger.log(`🧭 Handling notification navigation | Type: ${notificationType}`);

        this._onNotificationPressHandlers.forEach((handler) =>
          handler(data)
        );
      }
    });

    logger.log('✅ Background handler registered');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 9. Notification Tap Handlers (foreground via notifee)
  // ─────────────────────────────────────────────────────────────────────────

  onForegroundNotificationPress() {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        logger.log('👆 Notification pressed in foreground:', detail.notification?.data);

        const data = detail.notification?.data as Record<string, string>;
        const notificationType = data?.type;

        logger.log(`🧭 Handling notification navigation | Type: ${notificationType}`);

        this._onNotificationPressHandlers.forEach((handler) =>
          handler(data)
        );
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 10. App opened from a quit state by tapping notification
  // ─────────────────────────────────────────────────────────────────────────

  async getInitialNotification(): Promise<Record<string, string> | null> {
    try {
      // Check notifee (local notifications)
      const notifeeInitial = await notifee.getInitialNotification();
      if (notifeeInitial) {
        logger.log('🚀 App opened from notifee notification:', notifeeInitial.notification?.data);
        return notifeeInitial.notification?.data as Record<string, string>;
      }

      // Check FCM (remote notifications)
      const fcmInitial = await messaging().getInitialNotification();
      if (fcmInitial) {
        logger.log('🚀 App opened from FCM notification:', fcmInitial.data);
        return fcmInitial.data as Record<string, string>;
      }

      return null;
    } catch (error) {
      logger.error('❌ getInitialNotification error:', error);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 11. Subscribe / Unsubscribe Handlers
  // ─────────────────────────────────────────────────────────────────────────

  addMessageHandler(handler: MessageHandler): void {
    this._onMessageHandlers.push(handler);
  }

  removeMessageHandler(handler: MessageHandler): void {
    this._onMessageHandlers = this._onMessageHandlers.filter((h) => h !== handler);
  }

  addNotificationPressHandler(handler: NotificationPressHandler): void {
    this._onNotificationPressHandlers.push(handler);
  }

  removeNotificationPressHandler(handler: NotificationPressHandler): void {
    this._onNotificationPressHandlers = this._onNotificationPressHandlers.filter(
      (h) => h !== handler
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 12. Bootstrap — call once when app starts
  // IMPORTANT: Deletes old channels first, then creates fresh ones
  // ─────────────────────────────────────────────────────────────────────────

  async bootstrap(): Promise<void> {
    try {
      logger.log('🚀 NotificationService bootstrap starting...');

      // ✅ IMPORTANT: Delete old channels first (prevents caching issues)
      await this.deleteOldChannels();

      // ✅ Create fresh channels with new settings
      await this.createAndroidChannels();

      // ✅ Register handlers
      this.registerBackgroundHandler();
      this.onForegroundMessage();
      this.onForegroundNotificationPress();

      logger.log('✅ NotificationService bootstrapped successfully');
      logger.log('🔊 Sound: honestbee');
      logger.log('📱 Channels: order_ready_pickup, direct_message, runner_default');
    } catch (error) {
      logger.error('❌ Bootstrap error:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 13. Cleanup
  // ─────────────────────────────────────────────────────────────────────────

  cleanup(): void {
    if (this._foregroundUnsubscribe) {
      this._foregroundUnsubscribe();
      this._foregroundUnsubscribe = null;
    }
    logger.log('✅ NotificationService cleaned up');
  }
}

export default new NotificationService();