// import { StyleSheet, AppState } from 'react-native';
// import React, { useEffect, useState, useRef } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { getRunnerStatus } from '../../services/Orders/order.api';
// import { logger } from '../../utils/logger';

// import SplashScreen from '../../screens/SplashScreen/SplashScreen';
// import HomeScreen from '../../screens/HomeScreen/HomeScreen';
// import ProfileScreen from '../../screens/Profile/ProfileScreen';
// import OrderHistory from '../../screens/OrderHistory/OrderHistory';
// import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
// import HelpScreen from '../../screens/Profile/HelpScreen';
// import EditProfileScreen from '../../components/modals/EditProfileScreen';
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
// import { useAppPermissions } from '../../hooks/useAppPermissions'; // ← add
// import ChatScreen from '../../screens/Chat/ChatScreen';
// import useNotificationSetup from '../../hooks/useNotificationSetup';
// import { useAuth } from '../../hooks/useAuth';
// import { useNavigation, useNavigationState } from '@react-navigation/native';
// import NotificationService from '../../services/NotificationService/NotificationService';
// import NotificationAlertDialog from '../../components/modals/NotificationAlertDialog';
// import { useToast } from '../../hooks/ToastProvider';
// const Stack = createNativeStackNavigator();

// /* -------------------- AppBootstrap -------------------- */

// const AppBootstrap = ({ navigation }) => {
//   useEffect(() => {
//     const check = async () => {
//       try {
//         const res = await getRunnerStatus();
//         logger.log('AppBootstrap status res:', res);
//         const status = res?.success ? res.data : null;

//         if (status?.current_assignment) {
           
//           navigation.replace('CustomerInfoScreen', { order: status.current_assignment });
//         } else {
//           navigation.replace('Home', { initialStatus: status });
//         }
//       } catch (e) {
//         logger.log('AppBootstrap error:', e);
//         navigation.replace('Home');
//       }
//     };
//     check();
//   }, [navigation]);

//   return <SplashScreen />;
// };

// const NotificationListener = () => {
//   const navigation = useNavigation<any>();
//   const { toast } = useToast();
  
//   // Now this hook will work because it's INSIDE the Navigator
//   const currentRouteName = useNavigationState((state) => 
//     state?.routes[state.index]?.name
//   );

//   useEffect(() => {
//     const handler = (title: string, body: string, remoteMessage: any) => {
//       const data = remoteMessage?.data;
//        logger.log('Notification tapped, data:', data);
//       logger.log('currentRouteName:', currentRouteName);
//       // Prevent toast if already on Chat
//       if (data?.type === 'direct_message' && currentRouteName === 'Chat') {
//         return;
//       }

//       toast(
//         `${title}\n${body}`, 
//         'info', 
//         5000, 
//         () => {
//           if (data?.type === 'direct_message') {
//             navigation.navigate('Chat', { orderId: data.orderId });
//           }
//         }
//       );
//     };

//     NotificationService.addForegroundAlertHandler(handler);
//     const unsubscribeFCM = NotificationService.onForegroundMessage();

//     return () => {
//       NotificationService.removeForegroundAlertHandler(handler);
//       unsubscribeFCM();
//     };
//   }, [currentRouteName, navigation]);

//   return null; // This component doesn't render anything UI-wise
// };

// /* -------------------- Main Navigation -------------------- */

// const MainScreenNavigation = () => {
//   const navigation = useNavigation<any>();
//   const { toast } = useToast();
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const appState = useRef(AppState.currentState);                    // ← add
//   const { checkLocationPermission, isLocationEnabled, checkNotificationPermission } = useAppPermissions(); // ← add
//   const [canEnableNotifications, setCanEnableNotifications] = useState(false);
//  const { saveToken }   = useAuth();

//  // --- NEW STATE FOR GLOBAL ALERT ---
//   const [notifAlert, setNotifAlert] = useState({ visible: false, title: '', body: '', data: null as any });




//   useNotificationSetup(canEnableNotifications, saveToken, (data) => {
//               logger.log('Notification tapped, data:', data);
             
//             });




//   // ── Check all permissions and show modal if anything is missing ──────────
//   const checkPermissions = async () => {                             // ← add
//     try {
//       const hasLocation     = await checkLocationPermission();
//       const gpsEnabled      = await isLocationEnabled();
//       const hasNotification = await checkNotificationPermission();
     
//       setCanEnableNotifications(hasNotification)
     
//      logger.log('Permission check:', { hasLocation, gpsEnabled, hasNotification });

//       if (!hasLocation || !gpsEnabled || !hasNotification) {
//         setShowPermissionModal(true);
//       }else{
//         setShowPermissionModal(false);
//       }
//     } catch (e) {
//       logger.log('Permission check error:', e);
//     }
//   };


// // useEffect(() => {
// //     // 1. Define the handler for foreground notifications
// //     const handler = (title: string, body: string, remoteMessage: any) => {
// //       const data = remoteMessage?.data;
// //       logger.log('Notification tapped, data:', data);
// //       logger.log('currentRouteName:', currentRouteName);
// //       // LOGIC: If it's a DM and user is already looking at Chat, don't show toast
// //       if (data?.type === 'direct_message' && currentRouteName === 'Chat') {
// //         return;
// //       }

// //       // 2. Trigger your custom clickable toast
// //       // Arguments: (message, type, duration, onPress)
// //       toast(
// //         `${title}\n${body}`, 
// //         'info', 
// //         5000, 
// //         () => {
// //           // This runs when the Toast is clicked
// //           if (data?.type === 'direct_message') {
// //             navigation.navigate('Chat', { orderId: data.orderId });
// //           }
// //         }
// //       );
// //     };

// //     // 3. Register with NotificationService
// //     NotificationService.addForegroundAlertHandler(handler);
    
// //     // Start listening for FCM messages while app is open
// //     const unsubscribeFCM = NotificationService.onForegroundMessage();

// //     return () => {
// //       NotificationService.removeForegroundAlertHandler(handler);
// //       unsubscribeFCM();
// //     };
// //   }, [currentRouteName]); // Effect re-runs when route changes to keep logic fresh

// // --- HANDLE ALERT CLICK ---
  




//   // ── On mount — small delay so navigator is fully ready ───────────────────
//   useEffect(() => {
//     const timer = setTimeout(() => checkPermissions(), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   // ── Every time app comes back to foreground (e.g. user closed GPS) ───────
//   useEffect(() => {                                                   // ← add
//     const subscription = AppState.addEventListener('change', (nextState) => {
//       if (
//         appState.current.match(/inactive|background/) &&
//         nextState === 'active'
//       ) {
//         checkPermissions();
//       }
//       appState.current = nextState;
//     });
//     return () => subscription.remove();
//   }, []);

//   return (
//     <>
//       <Stack.Navigator
//         screenOptions={{ headerShown: false }}
//         initialRouteName="AppBootstrap"
//       >
// {/* 🚀 ADD THIS HERE */}
//       <Stack.Group>
//        <Stack.Screen
//   name="_listener"
//   component={NotificationListener}
// />
//       </Stack.Group>

//         <Stack.Screen name="AppBootstrap" component={AppBootstrap} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//         <Stack.Screen name="OrderHistory" component={OrderHistory} />
//         <Stack.Screen name="HelpScreen" component={HelpScreen} />
//         <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
//         <Stack.Screen name="CustomerInfoScreen" component={CustomerInfoScreen} />
//           <Stack.Screen name="Chat" component={ChatScreen} />
//       </Stack.Navigator>




//       <PermissionFlowModal
//         visible={showPermissionModal}
//         onComplete={() => setShowPermissionModal(false)}
//       />
//     </>
//   );
// };

// export default MainScreenNavigation;

// const styles = StyleSheet.create({});



// import { StyleSheet, AppState } from 'react-native';
// import React, { useEffect, useState, useRef } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { getRunnerStatus } from '../../services/Orders/order.api';
// import { logger } from '../../utils/logger';

// import SplashScreen from '../../screens/SplashScreen/SplashScreen';
// import HomeScreen from '../../screens/HomeScreen/HomeScreen';
// import ProfileScreen from '../../screens/Profile/ProfileScreen';
// import OrderHistory from '../../screens/OrderHistory/OrderHistory';
// import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
// import HelpScreen from '../../screens/Profile/HelpScreen';
// import EditProfileScreen from '../../components/modals/EditProfileScreen';
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
// import { useAppPermissions } from '../../hooks/useAppPermissions';
// import ChatScreen from '../../screens/Chat/ChatScreen';
// import useNotificationSetup from '../../hooks/useNotificationSetup';
// import { useAuth } from '../../hooks/useAuth';
// import { useNavigation, useNavigationState } from '@react-navigation/native';
// import NotificationService from '../../services/NotificationService/NotificationService';
// import { useToast } from '../../hooks/ToastProvider';
// import { getToastHandler } from '../../utils/toastHandler';

// const Stack = createNativeStackNavigator();

// /* -------------------- AppBootstrap -------------------- */

// const AppBootstrap = ({ navigation }) => {
//   useEffect(() => {
//     const check = async () => {
//       try {
//         const res = await getRunnerStatus();
//         logger.log('AppBootstrap status res:', res);
//         const status = res?.success ? res.data : null;

//         if (status?.current_assignment) {
//           navigation.replace('CustomerInfoScreen', { order: status.current_assignment });
//         } else {
//           navigation.replace('Home', { initialStatus: status });
//         }
//       } catch (e) {
//         logger.log('AppBootstrap error:', e);
//         navigation.replace('Home');
//       }
//     };
//     check();
//   }, []);

//   return <SplashScreen />;
// };

// /* -------------------- BackgroundNotificationHandler -------------------- */

// const BackgroundNotificationHandler = () => {
//   const navigation = useNavigation<any>();
//   const { saveToken } = useAuth();
//   const [canEnableNotifications, setCanEnableNotifications] = useState(false);

//   // Check notification permission
//   useEffect(() => {
//     const checkPerm = async () => {
//       const hasNotification = await NotificationService.hasPermission();
//       setCanEnableNotifications(hasNotification);
//     };
//     checkPerm();
//   }, []);

//   // Setup notification tap handlers for background/quit state
//   useNotificationSetup(canEnableNotifications, saveToken, (data) => {
//     logger.log('📲 Notification tapped (background/quit):', data);
    
//     const type = data?.type;
    
//     // Navigate based on notification type
//     // ✅ Pass only orderId - screens will fetch additional data if needed
//     if (type === 'direct_message') {
//     //  navigation.navigate('Chat', { orderId: data?.orderId });

     
//   navigation.navigate('Chat', { 
//     orderId: data?.orderId,
//     fromNotification: true  // ✅ Add this flag
//   });


//     } else if (type === 'order_ready_for_pickup') {
//        navigation.navigate('CustomerInfoScreen', { orderId: data?.orderId });
 
//     }
//   });

//   return null;
// };

// /* -------------------- NotificationListener -------------------- */

// const NotificationListener = ({ children }: { children: React.ReactNode }) => {
//   const navigation = useNavigation<any>();
//   //const { toast } = useToast();
//    const toast = getToastHandler();
//   const [isReady, setIsReady] = useState(false);
//   const currentRouteNameRef = useRef<string | undefined>(undefined);
//   // toast?.(
//   //     `New Message for Order`,
//   //     'alert',
//   //     5000,
//   //   );

  

//   // Wait for navigation to be ready
//   useEffect(() => {
//     const timer = setTimeout(() => setIsReady(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   // Update current route name reference when navigation state changes
//   useEffect(() => {
//     if (!isReady) return;

//     const unsubscribe = navigation.addListener('state', () => {
//       const state = navigation.getState();
//       const currentRoute = state?.routes[state.index];
//       currentRouteNameRef.current = currentRoute?.name;
//       logger.log('📍 Route changed to:', currentRouteNameRef.current);
//     });

//     // Set initial route
//     const state = navigation.getState();
//     const currentRoute = state?.routes[state.index];
//     currentRouteNameRef.current = currentRoute?.name;

//     return unsubscribe;
//   }, [isReady]);

//   useEffect(() => {
//     // Don't setup listener until navigation is ready
//     if (!isReady) return;

//     const handler = (title: string, body: string, remoteMessage: any) => {
//       const data = remoteMessage?.data;
//       const type = data?.type;
      
//       logger.log('🔔 Foreground notification received:', { title, body, type, data });
//       logger.log('📍 Current route:', currentRouteNameRef.current);

//       // ✅ Handle direct_message type
//       if (type === 'direct_message') {
//         // Skip toast if already on Chat screen
//         if (currentRouteNameRef.current === 'Chat') {
//           logger.log('⏭️ Already on Chat screen, skipping toast');
//           return;
//         }

//         // Show toast with navigation on click

//           toast?.(
//       `${title}\n${body}`,
//       'alert',
//       5000,
//       () => {
//             logger.log('🚀 Navigating to Chat from toast click');
//             // ✅ Pass only orderId - ChatScreen will fetch customer data
//             navigation.navigate('Chat', { orderId: data.orderId });
//           }
//     );

      
//         return;
//       }

//       // ✅ Handle order_ready_for_pickup type
//       if (type === 'order_ready_for_pickup') {
//         // Skip toast if already on CustomerInfoScreen for this order
//         if (currentRouteNameRef.current === 'CustomerInfoScreen') {
//           logger.log('⏭️ Already on CustomerInfoScreen, skipping toast');
//           return;
//         }

//         // Show toast with navigation on click
//            toast?.(
//       `${title}\n${body}`,
//       'alert',
//       5000,
//       () => {
//       logger.log('🚀 Navigating to CustomerInfoScreen from toast click');
//             navigation.navigate('CustomerInfoScreen', { 
//               order: { id: data.orderId } 
//             });
//       }
//     );
       
//         return;
//       }

//       // ✅ Handle any other notification types
//       logger.log('ℹ️ Generic notification, showing toast without navigation');
//        toast?.(
//       `${title}\n${body}`,
//       'alert',
//       5000,
//     );
//      // toast(`${title}\n${body}`, 'info', 5000);
//     };

//     NotificationService.addForegroundAlertHandler(handler);
//     const unsubscribeFCM = NotificationService.onForegroundMessage();

//     return () => {
//       NotificationService.removeForegroundAlertHandler(handler);
//       unsubscribeFCM();
//     };
//   }, [isReady, navigation]);

//   return <>{children}</>;
// };

// /* -------------------- Main Stack Navigator -------------------- */

// const MainStackNavigator = () => {
//   return (
//     <>
//       {/* Handle background notification taps - needs to be inside navigator */}
//       <BackgroundNotificationHandler />
      
//       <Stack.Navigator
//         screenOptions={{ headerShown: false }}
//         initialRouteName="AppBootstrap"
//       >
//         <Stack.Screen name="AppBootstrap" component={AppBootstrap} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//         <Stack.Screen name="OrderHistory" component={OrderHistory} />
//         <Stack.Screen name="HelpScreen" component={HelpScreen} />
//         <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
//         <Stack.Screen name="CustomerInfoScreen" component={CustomerInfoScreen} />
//         <Stack.Screen name="Chat" component={ChatScreen} />
//       </Stack.Navigator>
//     </>
//   );
// };

// /* -------------------- Main Navigation -------------------- */

// const MainScreenNavigation = () => {
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const appState = useRef(AppState.currentState);
//   const { checkLocationPermission, isLocationEnabled, checkNotificationPermission } = useAppPermissions();

//   // ── Check all permissions and show modal if anything is missing ──────────
//   const checkPermissions = async () => {
//     try {
//       const hasLocation = await checkLocationPermission();
//       const gpsEnabled = await isLocationEnabled();
//       const hasNotification = await checkNotificationPermission();
     
//       logger.log('Permission check:', { hasLocation, gpsEnabled, hasNotification });

//       if (!hasLocation || !gpsEnabled || !hasNotification) {
//         setShowPermissionModal(true);
//       } else {
//         setShowPermissionModal(false);
//       }
//     } catch (e) {
//       logger.log('Permission check error:', e);
//     }
//   };

//   // ── On mount — small delay so navigator is fully ready ───────────────────
//   useEffect(() => {
//     const timer = setTimeout(() => checkPermissions(), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   // ── Every time app comes back to foreground (e.g. user closed GPS) ───────
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextState) => {
//       if (
//         appState.current.match(/inactive|background/) &&
//         nextState === 'active'
//       ) {
//         checkPermissions();
//       }
//       appState.current = nextState;
//     });
//     return () => subscription.remove();
//   }, []);

//   return (
//     <>
//       {/* 🔔 Wrap Navigator with NotificationListener - always active, has access to navigation */}
//       <NotificationListener>
//         <MainStackNavigator />
//       </NotificationListener>

//       <PermissionFlowModal
//         visible={showPermissionModal}
//         onComplete={async () => {
//   setShowPermissionModal(false);
//   await checkPermissions(); // ✅ Re-check after modal closes
// }}
//        // onComplete={() => setShowPermissionModal(false)}
//       />
//     </>
//   );
// };

// export default MainScreenNavigation;

// const styles = StyleSheet.create({});


import { StyleSheet, AppState } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getRunnerStatus } from '../../services/Orders/order.api';
import { logger } from '../../utils/logger';

import SplashScreen from '../../screens/SplashScreen/SplashScreen';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../../screens/Profile/ProfileScreen';
import OrderHistory from '../../screens/OrderHistory/OrderHistory';
import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
import HelpScreen from '../../screens/Profile/HelpScreen';
import EditProfileScreen from '../../components/modals/EditProfileScreen';
import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
import { useAppPermissions } from '../../hooks/useAppPermissions';
import ChatScreen from '../../screens/Chat/ChatScreen';
import { useNavigation } from '@react-navigation/native';
import NotificationService from '../../services/NotificationService/NotificationService';
import { getToastHandler } from '../../utils/toastHandler';

const Stack = createNativeStackNavigator();

/* -------------------- AppBootstrap -------------------- */

const AppBootstrap = ({ navigation }) => {
  const hasNavigated = useRef(false);

  useEffect(() => {
    const determineInitialRoute = async () => {
      if (hasNavigated.current) return;
      
      try {
        logger.log('🚀 AppBootstrap: Determining initial route...');
        
        // ✅ STEP 1: Check for notification FIRST (highest priority)
        logger.log('📲 Checking for initial notification...');
        const notificationData = await NotificationService.getInitialNotification();
        
        if (notificationData) {
          hasNavigated.current = true;
          logger.log('✅ App opened from notification:', notificationData);
          
          const type = notificationData?.type;
          const orderId = notificationData?.orderId;
          
          if (type === 'direct_message') {
            logger.log('➡️ Navigating to Chat from notification');
            navigation.replace('Chat', { 
              orderId: orderId,
              fromNotification: true 
            });
            return; // ✅ Exit early - don't check runner status
          } else if (type === 'order_ready_for_pickup') {
            logger.log('➡️ Navigating to CustomerInfoScreen from notification');
            navigation.replace('CustomerInfoScreen', { 
              orderId: orderId,
              fromNotification: true 
            });
            return; // ✅ Exit early - don't check runner status
          }
          
          // If notification type is unknown, continue to normal flow
          logger.log('⚠️ Unknown notification type:', type, '- proceeding to normal flow');
        } else {
          logger.log('ℹ️ No initial notification found');
        }
        
        // ✅ STEP 2: Check runner status (normal flow - no notification)
        logger.log('🔍 Checking runner status...');
        const res = await getRunnerStatus();
        logger.log('📦 Runner status response:', res);
        const status = res?.success ? res.data : null;
        
        hasNavigated.current = true;
        
        if (status?.current_assignment) {
          logger.log('✅ Active assignment found, navigating to CustomerInfoScreen');
          navigation.replace('CustomerInfoScreen', { 
            order: status.current_assignment 
          });
        } else {
          logger.log('✅ No active assignment, navigating to Home');
          navigation.replace('Home', { 
            initialStatus: status 
          });
        }
        
      } catch (e) {
        logger.log('❌ AppBootstrap error:', e);
        hasNavigated.current = true;
        navigation.replace('Home');
      }
    };
    
    determineInitialRoute();
  }, [navigation]);

  return <SplashScreen />;
};

/* -------------------- NotificationListener -------------------- */

const NotificationListener = ({ children }: { children: React.ReactNode }) => {
  const navigation = useNavigation<any>();
  const toast = getToastHandler();
  const [isReady, setIsReady] = useState(false);
  const currentRouteNameRef = useRef<string | undefined>(undefined);

  // Wait for navigation to be ready
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Update current route name reference when navigation state changes
  useEffect(() => {
    if (!isReady) return;

    const unsubscribe = navigation.addListener('state', () => {
      const state = navigation.getState();
      const currentRoute = state?.routes[state.index];
      currentRouteNameRef.current = currentRoute?.name;
      logger.log('📍 Route changed to:', currentRouteNameRef.current);
    });

    // Set initial route
    const state = navigation.getState();
    const currentRoute = state?.routes[state.index];
    currentRouteNameRef.current = currentRoute?.name;

    return unsubscribe;
  }, [isReady, navigation]);

  useEffect(() => {
    // Don't setup listener until navigation is ready
    if (!isReady) return;

    const handler = (title: string, body: string, remoteMessage: any) => {
      const data = remoteMessage?.data;
      const type = data?.type;
      
      logger.log('🔔 Foreground notification received:', { title, body, type, data });
      logger.log('📍 Current route:', currentRouteNameRef.current);

      // ✅ Handle direct_message type
      if (type === 'direct_message') {
        // Skip toast if already on Chat screen
        if (currentRouteNameRef.current === 'Chat') {
          logger.log('⏭️ Already on Chat screen, skipping toast');
          return;
        }

        // Show toast with navigation on click
        toast?.(
          `${title}\n${body}`,
          'alert',
          5000,
          () => {
            logger.log('🚀 Navigating to Chat from toast click');
            // ✅ Pass only orderId - ChatScreen will fetch customer data
            navigation.navigate('Chat', { 
              orderId: data.orderId,
              fromNotification: true 
            });
          }
        );
        return;
      }

      // ✅ Handle order_ready_for_pickup type
      if (type === 'order_ready_for_pickup') {
        // Skip toast if already on CustomerInfoScreen for this order
        if (currentRouteNameRef.current === 'CustomerInfoScreen') {
          logger.log('⏭️ Already on CustomerInfoScreen, skipping toast');
          return;
        }

        // Show toast with navigation on click
        toast?.(
          `${title}\n${body}`,
          'alert',
          5000,
          () => {
            logger.log('🚀 Navigating to CustomerInfoScreen from toast click');
            navigation.navigate('CustomerInfoScreen', { 
              orderId: data.orderId,
              fromNotification: true 
            });
          }
        );
        return;
      }

      // ✅ Handle any other notification types
      logger.log('ℹ️ Generic notification, showing toast without navigation');
      toast?.(
        `${title}\n${body}`,
        'alert',
        5000,
      );
    };

    NotificationService.addForegroundAlertHandler(handler);
    const unsubscribeFCM = NotificationService.onForegroundMessage();

    return () => {
      NotificationService.removeForegroundAlertHandler(handler);
      unsubscribeFCM();
    };
  }, [isReady, navigation, toast]);

  return <>{children}</>;
};

/* -------------------- Main Stack Navigator -------------------- */

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AppBootstrap"
    >
      <Stack.Screen name="AppBootstrap" component={AppBootstrap} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="HelpScreen" component={HelpScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="CustomerInfoScreen" component={CustomerInfoScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

/* -------------------- Main Navigation -------------------- */

const MainScreenNavigation = () => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const appState = useRef(AppState.currentState);
  const { 
    checkLocationPermission, 
    isLocationEnabled, 
    checkNotificationPermission 
  } = useAppPermissions();

  // ── Check all permissions and show modal if anything is missing ──────────
  const checkPermissions = async () => {
    try {
      logger.log('🔍 Checking permissions...');
      const hasLocation = await checkLocationPermission();
      const gpsEnabled = await isLocationEnabled();
      const hasNotification = await checkNotificationPermission();
     
      logger.log('📋 Permission check results:', { 
        hasLocation, 
        gpsEnabled, 
        hasNotification 
      });

      const allGranted = hasLocation && gpsEnabled && hasNotification;

      if (!allGranted) {
        logger.log('⚠️ Some permissions missing, showing modal');
        setShowPermissionModal(true);
        setPermissionsGranted(false);
      } else {
        logger.log('✅ All permissions granted');
        setShowPermissionModal(false);
        setPermissionsGranted(true);
      }
    } catch (e) {
      logger.log('❌ Permission check error:', e);
      setPermissionsGranted(false);
    }
  };

  // ── Handle permission modal completion ──────────────────────────────────
  const handlePermissionComplete = async () => {
    logger.log('✅ Permission modal completed, re-checking permissions...');
    setShowPermissionModal(false);
    
    // ✅ Re-check permissions after modal closes
    // Small delay to allow system to update permission state
    setTimeout(async () => {
      await checkPermissions();
    }, 500);
  };

  // ── On mount — small delay so navigator is fully ready ───────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      logger.log('🚀 Initial permission check on mount');
      checkPermissions();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // ── Every time app comes back to foreground (e.g. user closed GPS) ───────
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      logger.log('📱 App state changed:', appState.current, '→', nextState);
      
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        logger.log('🔄 App came to foreground, re-checking permissions');
        checkPermissions();
      }
      appState.current = nextState;
    });
    
    return () => subscription.remove();
  }, []);

  return (
    <>
      {/* 🔔 Wrap Navigator with NotificationListener - always active, has access to navigation */}
      <NotificationListener>
        <MainStackNavigator />
      </NotificationListener>

      {/* 🔐 Permission Flow Modal */}
      <PermissionFlowModal
        visible={showPermissionModal}
        onComplete={handlePermissionComplete}
      />
    </>
  );
};

export default MainScreenNavigation;

const styles = StyleSheet.create({});