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
  
  // Track current route without triggering re-renders
  const currentRouteRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // 1. Track Navigation State
    const unsubscribeNav = navigation.addListener('state', () => {
      const state = navigation.getState();
      const currentRoute = state?.routes[state.index];
      currentRouteRef.current = currentRoute?.name;
    });

    // 2. Define the Centralized Logic
    const handleForegroundNotification = (title: string, body: string, remoteMessage: any) => {
      const data = remoteMessage?.data;
      const type = data?.type;
      const currentRoute = currentRouteRef.current;

      logger.log(`🔔 Notification Received | Type: ${type} | Route: ${currentRoute}`);

      // Logic: Ignore if user is already looking at the relevant screen
      if (type === 'direct_message' && currentRoute === 'Chat') {
        logger.log('⏭️ Skipping: Already in Chat');
        return;
      }

      if (type === 'order_ready_for_pickup' && currentRoute === 'CustomerInfoScreen') {
        logger.log('⏭️ Skipping: Already in CustomerInfo');
        return;
      }

      // Show the Toast
      toast?.(`${title}\n${body}`, 'alert', 5000, () => {
        if (type === 'direct_message') {
          navigation.navigate('Chat', { orderId: data.orderId, fromNotification: true });
        } else if (type === 'order_ready_for_pickup') {
          navigation.navigate('CustomerInfoScreen', { orderId: data.orderId, fromNotification: true });
        }
      });
    };

    // 3. Subscribe to the Service
    NotificationService.addForegroundAlertHandler(handleForegroundNotification);
    const unsubscribeFCM = NotificationService.onForegroundMessage();

    return () => {
      NotificationService.removeForegroundAlertHandler(handleForegroundNotification);
      if (unsubscribeFCM) unsubscribeFCM();
      unsubscribeNav();
    };
  }, [navigation, toast]);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};