// // context/NotificationContext.tsx
// import React, { createContext, useContext, useEffect, useRef } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import NotificationService from '../services/NotificationService/NotificationService';
// import { getToastHandler } from '../utils/toastHandler';
// import { logger } from '../utils/logger';

// const NotificationContext = createContext({});

// export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
//   const navigation = useNavigation<any>();
//   const toast = getToastHandler();
  
//   // Track current route without triggering re-renders
//   const currentRouteRef = useRef<string | undefined>(undefined);

//   useEffect(() => {
//     // 1. Track Navigation State
//     const unsubscribeNav = navigation.addListener('state', () => {
//       const state = navigation.getState();
//       const currentRoute = state?.routes[state.index];
//       currentRouteRef.current = currentRoute?.name;
//     });

//     // 2. Define the Centralized Logic
//     const handleForegroundNotification = (title: string, body: string, remoteMessage: any) => {
//       const data = remoteMessage?.data;
//       const type = data?.type;
//       const currentRoute = currentRouteRef.current;

//       logger.log(`🔔 Notification Received | Type: ${type} | Route: ${currentRoute}`);

//       // Logic: Ignore if user is already looking at the relevant screen
//       if (type === 'direct_message' && currentRoute === 'Chat') {
//         logger.log('⏭️ Skipping: Already in Chat');
//         return;
//       }

//       if (type === 'order_ready_for_pickup' && currentRoute === 'CustomerInfoScreen') {
//         logger.log('⏭️ Skipping: Already in CustomerInfo');
//         return;
//       }

//       // Show the Toast
//       toast?.(`${title}\n${body}`, 'alert', 5000, () => {
//         if (type === 'direct_message') {
//           navigation.navigate('Chat', { orderId: data.orderId, fromNotification: true });
//         } else if (type === 'order_ready_for_pickup') {
//           navigation.navigate('CustomerInfoScreen', { orderId: data.orderId, fromNotification: true });
//         }
//       });
//     };

//     // 3. Subscribe to the Service
//     NotificationService.addForegroundAlertHandler(handleForegroundNotification);
//     const unsubscribeFCM = NotificationService.onForegroundMessage();

//     return () => {
//       NotificationService.removeForegroundAlertHandler(handleForegroundNotification);
//       if (unsubscribeFCM) unsubscribeFCM();
//       unsubscribeNav();
//     };
//   }, [navigation, toast]);

//   return (
//     <NotificationContext.Provider value={{}}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// context/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import NotificationService from '../services/NotificationService/NotificationService';
import { getToastHandler } from '../utils/toastHandler';
import { logger } from '../utils/logger';

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const navigation = useNavigation<any>();
  const toast = getToastHandler();
  
  // ✅ Track current route without triggering re-renders
  const currentRouteRef = useRef<string | undefined>(undefined);
  
  // ✅ NEW: Prevent duplicate notifications with a dedup map
  const recentNotificationsRef = useRef<Map<string, number>>(new Map());
  const DEDUP_WINDOW_MS = 2000; // 2 seconds - if same notification arrives within this, ignore it

  useEffect(() => {
    // 1. Track Navigation State
    const unsubscribeNav = navigation.addListener('state', () => {
      const state = navigation.getState();
      const currentRoute = state?.routes[state.index];
      currentRouteRef.current = currentRoute?.name;
      logger.log(`📍 Navigation: Current route = ${currentRoute?.name}`);
    });

    // ✅ 2. Create a unique key for the notification
    const createNotificationKey = (data: any): string => {
      const type = data?.type || 'unknown';
      const orderId = data?.orderId || 'no-id';
      const timestamp = data?.timestamp || 'no-time';
      return `${type}-${orderId}-${timestamp}`;
    };

    // ✅ 3. Check if notification was recently processed
    const isDuplicate = (key: string): boolean => {
      const lastTime = recentNotificationsRef.current.get(key);
      const now = Date.now();

      if (lastTime && now - lastTime < DEDUP_WINDOW_MS) {
        logger.log(`⏭️ [Dedup] Notification already processed within ${DEDUP_WINDOW_MS}ms`);
        return true;
      }

      // Mark this notification as processed
      recentNotificationsRef.current.set(key, now);
      
      // Cleanup old entries (older than 5 seconds)
      recentNotificationsRef.current.forEach((time, k) => {
        if (now - time > 5000) {
          recentNotificationsRef.current.delete(k);
        }
      });

      return false;
    };

    // ✅ 4. Define the Centralized Logic
    const handleForegroundNotification = (title: string, body: string, remoteMessage: any) => {
      const data = remoteMessage?.data;
      const type = data?.type;
      const currentRoute = currentRouteRef.current;
      const notificationKey = createNotificationKey(data);

      logger.log(`🔔 Notification Received | Type: ${type} | Route: ${currentRoute}`);

      // ✅ Check for duplicates
      if (isDuplicate(notificationKey)) {
        logger.log(`❌ DUPLICATE DETECTED - Skipping this notification`);
        return;
      }

      // ✅ Logic: Ignore if user is already looking at the relevant screen
      if (type === 'direct_message' && currentRoute === 'Chat') {
        logger.log('⏭️ Skipping: Already in Chat screen');
        return;
      }

      if (type === 'order_ready_for_pickup' && currentRoute === 'CustomerInfoScreen') {
        logger.log('⏭️ Skipping: Already in CustomerInfo screen');
        return;
      }

      // ✅ Show the Toast (only once!)
      logger.log(`✅ Showing toast: ${title}`);
      toast?.(`${title}\n${body}`, 'alert', 5000, () => {
        logger.log(`🧭 Toast action tapped - navigating`);
        
        if (type === 'direct_message') {
          navigation.navigate('Chat', { orderId: data?.orderId, fromNotification: true });
        } else if (type === 'order_ready_for_pickup') {
          navigation.navigate('CustomerInfoScreen', { orderId: data?.orderId, fromNotification: true });
        }
      });
    };

    // ✅ 5. Subscribe to the Service (only foreground alert handler)
    NotificationService.addForegroundAlertHandler(handleForegroundNotification);
    
    // ✅ IMPORTANT: Don't call onForegroundMessage() here - it's already called in bootstrap()
    // const unsubscribeFCM = NotificationService.onForegroundMessage();

    return () => {
      NotificationService.removeForegroundAlertHandler(handleForegroundNotification);
      // if (unsubscribeFCM) unsubscribeFCM();
      unsubscribeNav();
    };
  }, [navigation, toast]);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};