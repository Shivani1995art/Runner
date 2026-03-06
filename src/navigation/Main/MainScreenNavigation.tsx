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
  // import { useNavigation } from '@react-navigation/native';
  // import NotificationService from '../../services/NotificationService/NotificationService';
  // import { getToastHandler } from '../../utils/toastHandler';

  // const Stack = createNativeStackNavigator();

  // /* -------------------- AppBootstrap -------------------- */

  // const AppBootstrap = ({ navigation }) => {
  //   const hasNavigated = useRef(false);

  //   useEffect(() => {
  //     const determineInitialRoute = async () => {
  //       if (hasNavigated.current) return;
        
  //       try {
  //         logger.log('🚀 AppBootstrap: Determining initial route...');
          
  //         // ✅ STEP 1: Check for notification FIRST (highest priority)
  //         logger.log('📲 Checking for initial notification...');
  //         const notificationData = await NotificationService.getInitialNotification();
          
  //         if (notificationData) {
  //           hasNavigated.current = true;
  //           logger.log('✅ App opened from notification:', notificationData);
            
  //           const type = notificationData?.type;
  //           const orderId = notificationData?.orderId;
            
  //           if (type === 'direct_message') {
  //             logger.log('➡️ Navigating to Chat from notification');
  //             navigation.replace('Chat', { 
  //               orderId: orderId,
  //               fromNotification: true 
  //             });
  //             return; // ✅ Exit early - don't check runner status
  //           } else if (type === 'order_ready_for_pickup') {
  //             logger.log('➡️ Navigating to CustomerInfoScreen from notification');
  //             navigation.replace('CustomerInfoScreen', { 
  //               orderId: orderId,
  //               fromNotification: true 
  //             });
  //             return; // ✅ Exit early - don't check runner status
  //           }
            
  //           // If notification type is unknown, continue to normal flow
  //           logger.log('⚠️ Unknown notification type:', type, '- proceeding to normal flow');
  //         } else {
  //           logger.log('ℹ️ No initial notification found');
  //         }
          
  //         // ✅ STEP 2: Check runner status (normal flow - no notification)
  //         logger.log('🔍 Checking runner status...');
  //         const res = await getRunnerStatus();
  //         logger.log('📦 Runner status response:', res);
  //         const status = res?.success ? res.data : null;
          
  //         hasNavigated.current = true;
          
  //         if (status?.current_assignment) {
  //           logger.log('✅ Active assignment found, navigating to CustomerInfoScreen');
  //           navigation.replace('CustomerInfoScreen', { 
  //             order: status.current_assignment 
  //           });
  //         } else {
  //           logger.log('✅ No active assignment, navigating to Home');
  //           navigation.replace('Home', { 
  //             initialStatus: status 
  //           });
  //         }
          
  //       } catch (e) {
  //         logger.log('❌ AppBootstrap error:', e);
  //         hasNavigated.current = true;
  //         navigation.replace('Home');
  //       }
  //     };
      
  //     determineInitialRoute();
  //   }, [navigation]);

  //   return <SplashScreen />;
  // };

  // /* -------------------- NotificationListener -------------------- */

  // const NotificationListener = ({ children }: { children: React.ReactNode }) => {
  //   const navigation = useNavigation<any>();
  //   const toast = getToastHandler();
  //   const [isReady, setIsReady] = useState(false);
  //   const currentRouteNameRef = useRef<string | undefined>(undefined);

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
  //   }, [isReady, navigation]);

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
  //         toast?.(
  //           `${title}\n${body}`,
  //           'alert',
  //           5000,
  //           () => {
  //             logger.log('🚀 Navigating to Chat from toast click');
  //             // ✅ Pass only orderId - ChatScreen will fetch customer data
  //             navigation.navigate('Chat', { 
  //               orderId: data.orderId,
  //               fromNotification: true 
  //             });
  //           }
  //         );
  //         return;
  //       }

  //       // ✅ Handle order_ready_for_pickup type
  //       if (type === 'order_ready_for_pickup') {
  //         // Skip toast if already on CustomerInfoScreen for this order
  //         // if (currentRouteNameRef.current === 'CustomerInfoScreen') {
  //         //   logger.log('⏭️ Already on CustomerInfoScreen, skipping toast');
  //         //   return;
  //         // }

  //         // Show toast with navigation on click
  //         toast?.(
  //           `${title}\n${body}`,
  //           'alert',
  //           5000,
  //           () => {
  //             logger.log('🚀 Navigating to CustomerInfoScreen from toast click');
  //             navigation.navigate('CustomerInfoScreen', { 
  //               orderId: data.orderId,
  //               fromNotification: true 
  //             });
  //           }
  //         );
  //         return;
  //       }

  //       // ✅ Handle any other notification types
  //       logger.log('ℹ️ Generic notification, showing toast without navigation');
  //       toast?.(
  //         `${title}\n${body}`,
  //         'alert',
  //         5000,
  //       );
  //     };

  //     NotificationService.addForegroundAlertHandler(handler);
  //     const unsubscribeFCM = NotificationService.onForegroundMessage();

  //     return () => {
  //       NotificationService.removeForegroundAlertHandler(handler);
  //       unsubscribeFCM();
  //     };
  //   }, [isReady, navigation, toast]);

  //   return <>{children}</>;
  // };

  // /* -------------------- Main Stack Navigator -------------------- */

  // const MainStackNavigator = () => {
  //   return (
  //     <Stack.Navigator
  //       screenOptions={{ headerShown: false }}
  //       initialRouteName="AppBootstrap"
  //     >
  //       <Stack.Screen name="AppBootstrap" component={AppBootstrap} />
  //       <Stack.Screen name="Home" component={HomeScreen} />
  //       <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  //       <Stack.Screen name="OrderHistory" component={OrderHistory} />
  //       <Stack.Screen name="HelpScreen" component={HelpScreen} />
  //       <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
  //       <Stack.Screen name="CustomerInfoScreen" component={CustomerInfoScreen} />
  //       <Stack.Screen name="Chat" component={ChatScreen} />
  //     </Stack.Navigator>
  //   );
  // };

  // /* -------------------- Main Navigation -------------------- */

  // const MainScreenNavigation = () => {
  //   const [showPermissionModal, setShowPermissionModal] = useState(false);
  //   const [permissionsGranted, setPermissionsGranted] = useState(false);
  //   const appState = useRef(AppState.currentState);
  //   const { 
  //     checkLocationPermission, 
  //     isLocationEnabled, 
  //     checkNotificationPermission 
  //   } = useAppPermissions();

  //   // ── Check all permissions and show modal if anything is missing ──────────
  //   const checkPermissions = async () => {
  //     try {
  //       logger.log('🔍 Checking permissions...');
  //       const hasLocation = await checkLocationPermission();
  //       const gpsEnabled = await isLocationEnabled();
  //       const hasNotification = await checkNotificationPermission();
      
  //       logger.log('📋 Permission check results:', { 
  //         hasLocation, 
  //         gpsEnabled, 
  //         hasNotification 
  //       });

  //       const allGranted = hasLocation && gpsEnabled && hasNotification;

  //       if (!allGranted) {
  //         logger.log('⚠️ Some permissions missing, showing modal');
  //         setShowPermissionModal(true);
  //         setPermissionsGranted(false);
  //       } else {
  //         logger.log('✅ All permissions granted');
  //         setShowPermissionModal(false);
  //         setPermissionsGranted(true);
  //       }
  //     } catch (e) {
  //       logger.log('❌ Permission check error:', e);
  //       setPermissionsGranted(false);
  //     }
  //   };

  //   // ── Handle permission modal completion ──────────────────────────────────
  //   const handlePermissionComplete = async () => {
  //     logger.log('✅ Permission modal completed, re-checking permissions...');
  //     setShowPermissionModal(false);
      
  //     // ✅ Re-check permissions after modal closes
  //     // Small delay to allow system to update permission state
  //     setTimeout(async () => {
  //       await checkPermissions();
  //     }, 500);
  //   };

  //   // ── On mount — small delay so navigator is fully ready ───────────────────
  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       logger.log('🚀 Initial permission check on mount');
  //       checkPermissions();
  //     }, 500);
  //     return () => clearTimeout(timer);
  //   }, []);

  //   // ── Every time app comes back to foreground (e.g. user closed GPS) ───────
  //   useEffect(() => {
  //     const subscription = AppState.addEventListener('change', (nextState) => {
  //       logger.log('📱 App state changed:', appState.current, '→', nextState);
        
  //       if (
  //         appState.current.match(/inactive|background/) &&
  //         nextState === 'active'
  //       ) {
  //         logger.log('🔄 App came to foreground, re-checking permissions');
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

  //       {/* 🔐 Permission Flow Modal */}
  //       <PermissionFlowModal
  //         visible={showPermissionModal}
  //         onComplete={handlePermissionComplete}
  //       />
  //     </>
  //   );
  // };

  // export default MainScreenNavigation;

  // const styles = StyleSheet.create({});

  // import { StyleSheet, AppState, BackHandler } from 'react-native';
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
  // import { useNavigation } from '@react-navigation/native';
  // import NotificationService from '../../services/NotificationService/NotificationService';
  // import { getToastHandler } from '../../utils/toastHandler';
  // import OrderHistoryDetails from '../../screens/OrderHistory/OrderHistoryDetails';

  // const Stack = createNativeStackNavigator();

  // /* -------------------- AppBootstrap -------------------- */

  // const AppBootstrap = ({ navigation }) => {
  //   const hasNavigated = useRef(false);

  //   useEffect(() => {
  //     const determineInitialRoute = async () => {
  //       if (hasNavigated.current) return;
        
  //       try {
  //         logger.log('🚀 AppBootstrap: Determining initial route...');
          
  //         // ✅ STEP 1: Check for notification FIRST (highest priority)
  //         logger.log('📲 Checking for initial notification...');
  //         const notificationData = await NotificationService.getInitialNotification();
          
  //         if (notificationData) {
  //           hasNavigated.current = true;
  //           logger.log('✅ App opened from notification:', notificationData);
            
  //           const type = notificationData?.type;
  //           const orderId = notificationData?.orderId;
            
  //           if (type === 'direct_message') {
  //             logger.log('➡️ Navigating to Chat from notification');
  //             navigation.replace('Chat', { 
  //               orderId: orderId,
  //               fromNotification: true 
  //             });
  //             return;
  //           } else if (type === 'order_ready_for_pickup') {
  //             logger.log('➡️ Navigating to CustomerInfoScreen from notification');
  //             navigation.replace('CustomerInfoScreen', { 
  //               orderId: orderId,
  //               fromNotification: true 
  //             });
  //             return;
  //           }
            
  //           logger.log('⚠️ Unknown notification type:', type, '- proceeding to normal flow');
  //         } else {
  //           logger.log('ℹ️ No initial notification found');
  //         }
          
  //         // ✅ STEP 2: Check runner status (normal flow - no notification)
  //         logger.log('🔍 Checking runner status...');
  //         const res = await getRunnerStatus();
  //         logger.log('📦 Runner status response:', res);
  //         const status = res?.success ? res.data : null;
          
  //         hasNavigated.current = true;
          
  //         if (status?.current_assignment) {
  //           logger.log('✅ Active assignment found, navigating to CustomerInfoScreen');
  //           navigation.replace('CustomerInfoScreen', { 
  //             order: status.current_assignment 
  //           });
  //         } else {
  //           logger.log('✅ No active assignment, navigating to Home');
  //           navigation.replace('Home', { 
  //             initialStatus: status 
  //           });
  //         }
          
  //       } catch (e) {
  //         logger.log('❌ AppBootstrap error:', e);
  //         hasNavigated.current = true;
  //         navigation.replace('Home');
  //       }
  //     };
      
  //     determineInitialRoute();
  //   }, [navigation]);

  //   return <SplashScreen />;
  // };

  // /* -------------------- NotificationListener -------------------- */

  // const NotificationListener = ({ children }: { children: React.ReactNode }) => {
  //   const navigation = useNavigation<any>();
  //   const toast = getToastHandler();
  //   const [isReady, setIsReady] = useState(false);
  //   const currentRouteNameRef = useRef<string | undefined>(undefined);

  //   useEffect(() => {
  //     const timer = setTimeout(() => setIsReady(true), 100);
  //     return () => clearTimeout(timer);
  //   }, []);

  //   useEffect(() => {
  //     if (!isReady) return;

  //     const unsubscribe = navigation.addListener('state', () => {
  //       const state = navigation.getState();
  //       const currentRoute = state?.routes[state.index];
  //       currentRouteNameRef.current = currentRoute?.name;
  //       logger.log('📍 Route changed to:', currentRouteNameRef.current);
  //     });

  //     const state = navigation.getState();
  //     const currentRoute = state?.routes[state.index];
  //     currentRouteNameRef.current = currentRoute?.name;

  //     return unsubscribe;
  //   }, [isReady, navigation]);

  //   useEffect(() => {
  //     if (!isReady) return;

  //     const handler = (title: string, body: string, remoteMessage: any) => {
  //       const data = remoteMessage?.data;
  //       const type = data?.type;
        
  //       logger.log('🔔 Foreground notification received:', { title, body, type, data });
  //       logger.log('📍 Current route:', currentRouteNameRef.current);

  //       if (type === 'direct_message') {
  //         if (currentRouteNameRef.current === 'Chat') {
  //           logger.log('⏭️ Already on Chat screen, skipping toast');
  //           return;
  //         }

  //         toast?.(
  //           `${title}\n${body}`,
  //           'alert',
  //           5000,
  //           () => {
  //             logger.log('🚀 Navigating to Chat from toast click');
  //             navigation.navigate('Chat', { 
  //               orderId: data.orderId,
  //               fromNotification: true 
  //             });
  //           }
  //         );
  //         return;
  //       }

  //       if (type === 'order_ready_for_pickup') {
  //         toast?.(
  //           `${title}\n${body}`,
  //           'alert',
  //           5000,
  //           () => {
  //             logger.log('🚀 Navigating to CustomerInfoScreen from toast click');
  //             navigation.navigate('CustomerInfoScreen', { 
  //               orderId: data.orderId,
  //               fromNotification: true 
  //             });
  //           }
  //         );
  //         return;
  //       }

  //       logger.log('ℹ️ Generic notification, showing toast without navigation');
  //       toast?.(
  //         `${title}\n${body}`,
  //         'alert',
  //         5000,
  //       );
  //     };

  //     NotificationService.addForegroundAlertHandler(handler);
  //     const unsubscribeFCM = NotificationService.onForegroundMessage();

  //     return () => {
  //       NotificationService.removeForegroundAlertHandler(handler);
  //       unsubscribeFCM();
  //     };
  //   }, [isReady, navigation, toast]);

  //   return <>{children}</>;
  // };

  // /* -------------------- Main Stack Navigator -------------------- */

  // const MainStackNavigator = () => {
  //   return (
  //     <Stack.Navigator
  //       screenOptions={{ headerShown: false }}
  //       initialRouteName="AppBootstrap"
  //     >
  //       <Stack.Screen name="AppBootstrap" component={AppBootstrap} />
  //       <Stack.Screen name="Home" component={HomeScreen} />
  //       <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  //       <Stack.Screen name="OrderHistory" component={OrderHistory} />
  //       <Stack.Screen name="HelpScreen" component={HelpScreen} />
  //       <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
  //       <Stack.Screen name="CustomerInfoScreen" component={CustomerInfoScreen} />
  //       <Stack.Screen name="OrderHistoryDetails" component={OrderHistoryDetails} />
  //       <Stack.Screen name="Chat" component={ChatScreen} />
  //     </Stack.Navigator>
  //   );
  // };

  // /* -------------------- Main Navigation -------------------- */

  // const MainScreenNavigation = () => {
  //   const [showPermissionModal, setShowPermissionModal] = useState(false);
  //   const [permissionsGranted, setPermissionsGranted] = useState(false);
  //   const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
    
  //   // ✅ FIX 3: Track if app has loaded at least once
  //   const hasLoadedOnceRef = useRef(false);
    
  //   const appState = useRef(AppState.currentState);
  //   const { 
  //     checkLocationPermission, 
  //     isLocationEnabled, 
  //     checkNotificationPermission,
  //     requestLocationPermission,
  //     requestLocationServices,
  //   } = useAppPermissions();

  //   useEffect(() => {
  //     const backHandler = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       () => showPermissionModal
  //     );
  //     return () => backHandler.remove();
  //   }, [showPermissionModal]);

  //   const checkPermissions = async () => {
  //     try {
  //       logger.log('🔍 Checking permissions...');
  //       setIsCheckingPermissions(true);

  //       const hasLocation = await checkLocationPermission();
  //       const gpsEnabled = await isLocationEnabled();
  //       const hasNotification = await checkNotificationPermission();
      
  //       logger.log('📋 Permission check results:', { 
  //         hasLocation, 
  //         gpsEnabled, 
  //         hasNotification 
  //       });

  //       const allGranted = hasLocation && gpsEnabled && hasNotification;

  //       if (!allGranted) {
  //         logger.log('⚠️ Some permissions missing, showing modal');
  //         setShowPermissionModal(true);
  //         setPermissionsGranted(false);
  //       } else {
  //         logger.log('✅ All permissions granted');
  //         setShowPermissionModal(false);
  //         setPermissionsGranted(true);
          
  //         // ✅ FIX 3: Mark as loaded once permissions are granted
  //         hasLoadedOnceRef.current = true;
  //       }
  //     } catch (e) {
  //       logger.log('❌ Permission check error:', e);
  //       setPermissionsGranted(false);
  //       setShowPermissionModal(true);
  //     } finally {
  //       setIsCheckingPermissions(false);
  //     }
  //   };

  //   const handlePermissionComplete = async () => {
  //     logger.log('✅ Permission modal completed, re-checking permissions...');
      
  //     setTimeout(async () => {
  //       await checkPermissions();
  //     }, 500);
  //   };

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       logger.log('🚀 Initial permission check on mount');
  //       checkPermissions();
  //     }, 500);
  //     return () => clearTimeout(timer);
  //   }, []);

  //   // ✅ FIX 3: Modified AppState listener - Don't reset permissions on background
  //   useEffect(() => {
  //     const subscription = AppState.addEventListener('change', (nextState) => {
  //       logger.log('📱 App state changed:', appState.current, '→', nextState);
        
  //       // ✅ Only check permissions when coming back to ACTIVE, not going to background
  //       if (
  //         appState.current.match(/inactive|background/) &&
  //         nextState === 'active'
  //       ) {
  //         logger.log('🔄 App came to foreground');
          
  //         // ✅ FIX 3: Only check permissions if app has loaded before
  //         // This prevents showing splash when just unlocking phone
  //         if (hasLoadedOnceRef.current) {
  //           logger.log('🔍 Re-checking permissions on foreground (app was loaded before)');
  //           checkPermissions();
  //         } else {
  //           logger.log('⏭️ Skipping permission check - app hasn\'t fully loaded yet');
  //         }
  //       }
        
  //       appState.current = nextState;
  //     });
      
  //     return () => subscription.remove();
  //   }, []);

  //   // ✅ FIX 3: Show splash ONLY on first load OR when permissions missing
  //   // Don't show splash when just unlocking phone (background → active)
  //   if (isCheckingPermissions && !hasLoadedOnceRef.current) {
  //     logger.log('⏳ Initial check in progress, showing splash...');
  //     return <SplashScreen />;
  //   }

  //   if (!permissionsGranted) {
  //     logger.log('❌ Permissions not granted, showing modal...');
  //     return (
  //       <>
  //         <SplashScreen />
  //         <PermissionFlowModal
  //           visible={showPermissionModal}
  //           onComplete={handlePermissionComplete}
  //         />
  //       </>
  //     );
  //   }

  //   logger.log('✅ Permissions granted, rendering app');
  //   return (
  //     <>
  //       <NotificationListener>
  //         <MainStackNavigator />
  //       </NotificationListener>

  //       <PermissionFlowModal
  //         visible={showPermissionModal}
  //         onComplete={handlePermissionComplete}
  //       />
  //     </>
  //   );
  // };

  // export default MainScreenNavigation;

  // const styles = StyleSheet.create({});

  // import { StyleSheet, AppState, BackHandler } from 'react-native';
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
  // import { useNavigation } from '@react-navigation/native';
  // import NotificationService from '../../services/NotificationService/NotificationService';
  // import { getToastHandler } from '../../utils/toastHandler';
  // import OrderHistoryDetails from '../../screens/OrderHistory/OrderHistoryDetails';
  // import LoadingScreen from '../../components/modals/Loadingscreen';

  // const Stack = createNativeStackNavigator();

  // /* -------------------- AppBootstrap -------------------- */

  // const AppBootstrap = ({ navigation }) => {
  //   const hasNavigated = useRef(false);

  //   useEffect(() => {
  //     const determineInitialRoute = async () => {
  //       if (hasNavigated.current) return;
        
  //       try {
  //         logger.log('🚀 AppBootstrap: Determining initial route...');
          
  //         // ✅ STEP 1: Check for notification FIRST (highest priority)
  //         logger.log('📲 Checking for initial notification...');
  //         const notificationData = await NotificationService.getInitialNotification();
          
  //         if (notificationData) {
  //           hasNavigated.current = true;
  //           logger.log('✅ App opened from notification:', notificationData);
            
  //           const type = notificationData?.type;
  //           const orderId = notificationData?.orderId;
            
  //           if (type === 'direct_message') {
  //             logger.log('➡️ Navigating to Chat from notification');
  //             navigation.replace('Chat', { 
  //               orderId: orderId,
  //               fromNotification: true 
  //             });
  //             return;
  //           } else if (type === 'order_ready_for_pickup') {
  //             logger.log('➡️ Navigating to CustomerInfoScreen from notification');
  //             navigation.replace('CustomerInfoScreen', { 
  //               orderId: orderId,
  //               fromNotification: true 
  //             });
  //             return;
  //           }
            
  //           logger.log('⚠️ Unknown notification type:', type, '- proceeding to normal flow');
  //         } else {
  //           logger.log('ℹ️ No initial notification found');
  //         }
          
  //         // ✅ STEP 2: Check runner status (normal flow - no notification)
  //         logger.log('🔍 Checking runner status...');
  //         const res = await getRunnerStatus();
  //         logger.log('📦 Runner status response:', res);
  //         const status = res?.success ? res.data : null;
          
  //         hasNavigated.current = true;
          
  //         if (status?.current_assignment) {
  //           logger.log('✅ Active assignment found, navigating to CustomerInfoScreen');
  //           navigation.replace('CustomerInfoScreen', { 
  //             order: status.current_assignment 
  //           });
  //         } else {
  //           logger.log('✅ No active assignment, navigating to Home');
  //           navigation.replace('Home', { 
  //             initialStatus: status 
  //           });
  //         }
          
  //       } catch (e) {
  //         logger.log('❌ AppBootstrap error:', e);
  //         hasNavigated.current = true;
  //         navigation.replace('Home');
  //       }
  //     };
      
  //     determineInitialRoute();
  //   }, [navigation]);

  //   return <LoadingScreen message="Loading your orders..." />;
  // };

  // /* -------------------- NotificationListener -------------------- */

  // const NotificationListener = ({ children }: { children: React.ReactNode }) => {
  //   const navigation = useNavigation<any>();
  //   const toast = getToastHandler();
  //   const [isReady, setIsReady] = useState(false);
  //   const currentRouteNameRef = useRef<string | undefined>(undefined);

  //   useEffect(() => {
  //     const timer = setTimeout(() => setIsReady(true), 100);
  //     return () => clearTimeout(timer);
  //   }, []);

  //   useEffect(() => {
  //     if (!isReady) return;

  //     const unsubscribe = navigation.addListener('state', () => {
  //       const state = navigation.getState();
  //       const currentRoute = state?.routes[state.index];
  //       currentRouteNameRef.current = currentRoute?.name;
  //       logger.log('📍 Route changed to:', currentRouteNameRef.current);
  //     });

  //     const state = navigation.getState();
  //     const currentRoute = state?.routes[state.index];
  //     currentRouteNameRef.current = currentRoute?.name;

  //     return unsubscribe;
  //   }, [isReady, navigation]);

  //   useEffect(() => {
  //     if (!isReady) return;

  //     const handler = (title: string, body: string, remoteMessage: any) => {
  //       const data = remoteMessage?.data;
  //       const type = data?.type;
        
  //       logger.log('🔔 Foreground notification received:', { title, body, type, data });
  //       logger.log('📍 Current route:', currentRouteNameRef.current);

  //       if (type === 'direct_message') {
  //         if (currentRouteNameRef.current === 'Chat') {
  //           logger.log('⏭️ Already on Chat screen, skipping toast');
  //           return;
  //         }

  //         toast?.(
  //           `${title}\n${body}`,
  //           'alert',
  //           5000,
  //           () => {
  //             logger.log('🚀 Navigating to Chat from toast click');
  //             navigation.navigate('Chat', { 
  //               orderId: data.orderId,
  //               fromNotification: true 
  //             });
  //           }
  //         );
  //         return;
  //       }

  //       if (type === 'order_ready_for_pickup') {
  //         toast?.(
  //           `${title}\n${body}`,
  //           'alert',
  //           5000,
  //           () => {
  //             logger.log('🚀 Navigating to CustomerInfoScreen from toast click');
  //             navigation.navigate('CustomerInfoScreen', { 
  //               orderId: data.orderId,
  //               fromNotification: true 
  //             });
  //           }
  //         );
  //         return;
  //       }

  //       logger.log('ℹ️ Generic notification, showing toast without navigation');
  //       toast?.(
  //         `${title}\n${body}`,
  //         'alert',
  //         5000,
  //       );
  //     };

  //     NotificationService.addForegroundAlertHandler(handler);
  //     const unsubscribeFCM = NotificationService.onForegroundMessage();

  //     return () => {
  //       NotificationService.removeForegroundAlertHandler(handler);
  //       unsubscribeFCM();
  //     };
  //   }, [isReady, navigation, toast]);

  //   return <>{children}</>;
  // };

  // /* -------------------- Main Stack Navigator -------------------- */

  // const MainStackNavigator = () => {
  //   return (
  //     <Stack.Navigator
  //       screenOptions={{ headerShown: false }}
  //       initialRouteName="AppBootstrap"
  //     >
  //       <Stack.Screen name="AppBootstrap" component={AppBootstrap} />
  //       <Stack.Screen name="Home" component={HomeScreen} />
  //       <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  //       <Stack.Screen name="OrderHistory" component={OrderHistory} />
  //       <Stack.Screen name="HelpScreen" component={HelpScreen} />
  //       <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
  //       <Stack.Screen name="CustomerInfoScreen" component={CustomerInfoScreen} />
  //       <Stack.Screen name="OrderHistoryDetails" component={OrderHistoryDetails} />
  //       <Stack.Screen name="Chat" component={ChatScreen} />
  //     </Stack.Navigator>
  //   );
  // };

  // /* -------------------- Main Navigation -------------------- */

  // const MainScreenNavigation = () => {
  //   const [showPermissionModal, setShowPermissionModal] = useState(false);
  //   const [permissionsGranted, setPermissionsGranted] = useState(false);
  //   const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
    
  //   // ✅ FIX 3: Track if app has loaded at least once
  //   const hasLoadedOnceRef = useRef(false);
    
  //   const appState = useRef(AppState.currentState);
  //   const { 
  //     checkLocationPermission, 
  //     isLocationEnabled, 
  //     checkNotificationPermission,
  //     requestLocationPermission,
  //     requestLocationServices,
  //   } = useAppPermissions();

  //   useEffect(() => {
  //     const backHandler = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       () => showPermissionModal
  //     );
  //     return () => backHandler.remove();
  //   }, [showPermissionModal]);

  //   const checkPermissions = async () => {
  //     try {
  //       logger.log('🔍 Checking permissions...');
  //       setIsCheckingPermissions(true);

  //       const hasLocation = await checkLocationPermission();
  //       const gpsEnabled = await isLocationEnabled();
  //       const hasNotification = await checkNotificationPermission();
      
  //       logger.log('📋 Permission check results:', { 
  //         hasLocation, 
  //         gpsEnabled, 
  //         hasNotification 
  //       });

  //       const allGranted = hasLocation && gpsEnabled && hasNotification;

  //       if (!allGranted) {
  //         logger.log('⚠️ Some permissions missing, showing modal');
  //         setShowPermissionModal(true);
  //         setPermissionsGranted(false);
  //       } else {
  //         logger.log('✅ All permissions granted');
  //         setShowPermissionModal(false);
  //         setPermissionsGranted(true);
          
  //         // ✅ FIX 3: Mark as loaded once permissions are granted
  //         hasLoadedOnceRef.current = true;
  //       }
  //     } catch (e) {
  //       logger.log('❌ Permission check error:', e);
  //       setPermissionsGranted(false);
  //       setShowPermissionModal(true);
  //     } finally {
  //       setIsCheckingPermissions(false);
  //     }
  //   };

  //   const handlePermissionComplete = async () => {
  //     logger.log('✅ Permission modal completed, re-checking permissions...');
      
  //     setTimeout(async () => {
  //       await checkPermissions();
  //     }, 500);
  //   };

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       logger.log('🚀 Initial permission check on mount');
  //       checkPermissions();
  //     }, 500);
  //     return () => clearTimeout(timer);
  //   }, []);

  //   // ✅ FIX 3: Modified AppState listener - Don't reset permissions on background
  //   useEffect(() => {
  //     const subscription = AppState.addEventListener('change', (nextState) => {
  //       logger.log('📱 App state changed:', appState.current, '→', nextState);
        
  //       // ✅ Only check permissions when coming back to ACTIVE, not going to background
  //       if (
  //         appState.current.match(/inactive|background/) &&
  //         nextState === 'active'
  //       ) {
  //         logger.log('🔄 App came to foreground');
          
  //         // ✅ FIX 3: Only check permissions if app has loaded before
  //         // This prevents showing splash when just unlocking phone
  //         if (hasLoadedOnceRef.current) {
  //           logger.log('🔍 Re-checking permissions on foreground (app was loaded before)');
  //           checkPermissions();
  //         } else {
  //           logger.log('⏭️ Skipping permission check - app hasn\'t fully loaded yet');
  //         }
  //       }
        
  //       appState.current = nextState;
  //     });
      
  //     return () => subscription.remove();
  //   }, []);

  //   // ✅ Show LoadingScreen instead of SplashScreen during permission checks
  //   if (isCheckingPermissions && !hasLoadedOnceRef.current) {
  //     logger.log('⏳ Initial check in progress, showing loading screen...');
  //     return  <LoadingScreen message="Loading your orders..." />;
  //     // <LoadingScreen message="Checking permissions..." />;
  //   }

  //   if (!permissionsGranted) {
  //     logger.log('❌ Permissions not granted, showing modal...');
  //     return (
  //       <>
  //         {/* <LoadingScreen message="Setting up..." /> */}
  //         <LoadingScreen message="Loading your orders..." />
  //         <PermissionFlowModal
  //           visible={showPermissionModal}
  //           onComplete={handlePermissionComplete}
  //         />
  //       </>
  //     );
  //   }

  //   logger.log('✅ Permissions granted, rendering app');
  //   return (
  //     <>
  //       <NotificationListener>
  //         <MainStackNavigator />
  //       </NotificationListener>

  //       <PermissionFlowModal
  //         visible={showPermissionModal}
  //         onComplete={handlePermissionComplete}
  //       />
  //     </>
  //   );
  // };

  // export default MainScreenNavigation;

  // const styles = StyleSheet.create({});


//   import { StyleSheet, AppState, BackHandler } from 'react-native';
//   import React, { useEffect, useState, useRef } from 'react';
//   import { createNativeStackNavigator } from '@react-navigation/native-stack';
//   import { getRunnerStatus } from '../../services/Orders/order.api';
//   import { logger } from '../../utils/logger';

//   import SplashScreen from '../../screens/SplashScreen/SplashScreen';
//   import HomeScreen from '../../screens/HomeScreen/HomeScreen';
//   import ProfileScreen from '../../screens/Profile/ProfileScreen';
//   import OrderHistory from '../../screens/OrderHistory/OrderHistory';
//   import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
//   import HelpScreen from '../../screens/Profile/HelpScreen';
//   import EditProfileScreen from '../../components/modals/EditProfileScreen';
//   import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
//   import { useAppPermissions } from '../../hooks/useAppPermissions';
//   import ChatScreen from '../../screens/Chat/ChatScreen';
//   import { useNavigation } from '@react-navigation/native';
//   import NotificationService from '../../services/NotificationService/NotificationService';
//   import { getToastHandler } from '../../utils/toastHandler';
//   import OrderHistoryDetails from '../../screens/OrderHistory/OrderHistoryDetails';
//   import LoadingScreen from '../../components/modals/Loadingscreen';
// import useNotificationSetup from '../../hooks/useNotificationSetup';
// import { useAuth } from '../../hooks/useAuth';

//   const Stack = createNativeStackNavigator();

//   /* ────────────────────────────────────────────────────────────────────────────
//     AppBootstrap - Initial Route Determination
//     ──────────────────────────────────────────────────────────────────────────── */

//   const AppBootstrap = ({ navigation }) => {
//     const hasNavigated = useRef(false);
//     const [loadingMessage, setLoadingMessage] = useState('Loading delivery status...');

//     useEffect(() => {
//       const determineInitialRoute = async () => {
//         // ✅ Prevent multiple executions
//         if (hasNavigated.current) {
//           logger.log('⏭️ Already navigated, skipping');
//           return;
//         }
        
//         try {
//           logger.log('🚀 AppBootstrap: Determining initial route...');
          
//           // ✅ STEP 1: Check for notification FIRST
//         // setLoadingMessage('Checking notifications...');
//           logger.log('📲 Checking for initial notification...');
//           const notificationData = await NotificationService.getInitialNotification();
          
//           if (notificationData) {
//             hasNavigated.current = true;
//             logger.log('✅ App opened from notification:', notificationData);
            
//             const type = notificationData?.type;
//             const orderId = notificationData?.orderId;
            
//             if (type === 'direct_message') {
//               setLoadingMessage('Opening chat...');
//               logger.log('➡️ Navigating to Chat from notification');
//               setTimeout(() => {
//                 navigation.replace('Chat', { 
//                   orderId: orderId,
//                   fromNotification: true 
//                 });
//               }, 300);
//               return;
//             } else if (type === 'order_ready_for_pickup') {
//               setLoadingMessage('Opening order details...');
//               logger.log('➡️ Navigating to CustomerInfoScreen from notification');
//               setTimeout(() => {
//                 navigation.replace('CustomerInfoScreen', { 
//                   orderId: orderId,
//                   fromNotification: true 
//                 });
//               }, 300);
//               return;
//             }
            
//             logger.log('⚠️ Unknown notification type:', type);
//           } else {
//             logger.log('ℹ️ No initial notification found');
//           }
          
//           // ✅ STEP 2: Check runner status
//           setLoadingMessage('Loading your delivery status...');
//           logger.log('🔍 Checking runner status...');
          
//           const res = await getRunnerStatus();
//           logger.log('📦 Runner status response:', res);
//           const status = res?.success ? res.data : null;
          
//           hasNavigated.current = true;
          
//           if (status?.current_assignment) {
//           // setLoadingMessage('Active delivery found...');
//             logger.log('✅ Active assignment found');
//             setTimeout(() => {
//               navigation.replace('CustomerInfoScreen', { 
//                 order: status.current_assignment 
//               });
//             }, 300);
//           } else {
//           //  setLoadingMessage('Loading available orders...');
//             logger.log('✅ No active assignment');
//             setTimeout(() => {
//               navigation.replace('Home', { 
//                 initialStatus: status 
//               });
//             }, 300);
//           }
          
//         } catch (e) {
//           logger.log('❌ AppBootstrap error:', e);
//           hasNavigated.current = true;
//           setLoadingMessage('Something went wrong...');
//           setTimeout(() => {
//             navigation.replace('Home');
//           }, 500);
//         }
//       };
      
//       determineInitialRoute();
//     }, [navigation]);

//     return <LoadingScreen message={loadingMessage} />;
//   };

//   /* ────────────────────────────────────────────────────────────────────────────
//     NotificationListener - Foreground Notification Handler
//     ──────────────────────────────────────────────────────────────────────────── */

//   const NotificationListener = ({ children }: { children: React.ReactNode }) => {
//     const navigation = useNavigation<any>();
//     const toast = getToastHandler();
//     const [isReady, setIsReady] = useState(false);
//     const currentRouteNameRef = useRef<string | undefined>(undefined);

//     useEffect(() => {
//       const timer = setTimeout(() => setIsReady(true), 100);
//       return () => clearTimeout(timer);
//     }, []);

//     useEffect(() => {
//       if (!isReady) return;

//       const unsubscribe = navigation.addListener('state', () => {
//         const state = navigation.getState();
//         const currentRoute = state?.routes[state.index];
//         currentRouteNameRef.current = currentRoute?.name;
//         logger.log('📍 Route changed to:', currentRouteNameRef.current);
//       });

//       const state = navigation.getState();
//       const currentRoute = state?.routes[state.index];
//       currentRouteNameRef.current = currentRoute?.name;

//       return unsubscribe;
//     }, [isReady, navigation]);

//     useEffect(() => {
//       if (!isReady) return;

//       const handler = (title: string, body: string, remoteMessage: any) => {
//         const data = remoteMessage?.data;
//         const type = data?.type;
        
//         logger.log('🔔 Foreground notification:', { title, body, type });
//         logger.log('📍 Current route:', currentRouteNameRef.current);

//         if (type === 'direct_message') {
//           if (currentRouteNameRef.current === 'Chat') {
//             logger.log('⏭️ Already on Chat, skipping');
//             return;
//           }

//           toast?.(
//             `${title}\n${body}`,
//             'alert',
//             5000,
//             () => {
//               navigation.navigate('Chat', { 
//                 orderId: data.orderId,
//                 fromNotification: true 
//               });
//             }
//           );
//           return;
//         }

//         if (type === 'order_ready_for_pickup') {
//           if (currentRouteNameRef.current === 'CustomerInfoScreen') {
//             logger.log('⏭️ Already on CustomerInfoScreen, skipping');
//             return;
//           }
//           toast?.(
//             `${title}\n${body}`,
//             'alert',
//             5000,
//             () => {
//               navigation.navigate('CustomerInfoScreen', { 
//                 orderId: data.orderId,
//                 fromNotification: true 
//               });
//             }
//           );
//           return;
//         }

//         toast?.(
//           `${title}\n${body}`,
//           'alert',
//           5000,
//         );
//       };

//       NotificationService.addForegroundAlertHandler(handler);
//       const unsubscribeFCM = NotificationService.onForegroundMessage();

//       return () => {
//         NotificationService.removeForegroundAlertHandler(handler);
//         unsubscribeFCM();
//       };
//     }, [isReady, navigation, toast]);

//     return <>{children}</>;
//   };

//   /* ────────────────────────────────────────────────────────────────────────────
//     Main Stack Navigator
//     ──────────────────────────────────────────────────────────────────────────── */

//   const MainStackNavigator = () => {
//     return (
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
//         <Stack.Screen name="OrderHistoryDetails" component={OrderHistoryDetails} />
//         <Stack.Screen name="Chat" component={ChatScreen} />
//       </Stack.Navigator>
//     );
//   };

//   /* ────────────────────────────────────────────────────────────────────────────
//     Main Navigation - Permission Management
//     ──────────────────────────────────────────────────────────────────────────── */

//   const MainScreenNavigation = () => {
//     const [showPermissionModal, setShowPermissionModal] = useState(false);
//     const [permissionsGranted, setPermissionsGranted] = useState(false);
//     const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
//     const [loadingMessage, setLoadingMessage] = useState('Loading your delivery status...');
//      const { saveToken } = useAuth();
//     // ✅ Prevent multiple permission checks
//     const hasLoadedOnceRef = useRef(false);
//     const isCheckingRef = useRef(false);
    
//     const appState = useRef(AppState.currentState);
//     const { 
//       checkLocationPermission, 
//       isLocationEnabled, 
//       checkNotificationPermission,
//     } = useAppPermissions();

//     // ✅ Disable back button when showing permission modal
//     useEffect(() => {
//       const backHandler = BackHandler.addEventListener(
//         'hardwareBackPress',
//         () => showPermissionModal
//       );
//       return () => backHandler.remove();
//     }, [showPermissionModal]);

//     // ✅ Check permissions (with guard to prevent duplicate calls)
//     const checkPermissions = async () => {
//       // ✅ Guard: prevent multiple simultaneous checks
//       if (isCheckingRef.current) {
//         logger.log('⏭️ Permission check already in progress, skipping');
//         return;
//       }

//       try {
//         isCheckingRef.current = true;
//         setIsCheckingPermissions(true);
        
//         logger.log('🔍 Checking permissions...');
//       // setLoadingMessage('Checking delivery permissions...');

//         const hasLocation = await checkLocationPermission();
//       //  setLoadingMessage('Checking GPS status...');
        
//         const gpsEnabled = await isLocationEnabled();
//       //  setLoadingMessage('Checking notification access...');
        
//         const hasNotification = await checkNotificationPermission();
      
//         logger.log('📋 Permission results:', { 
//           hasLocation, 
//           gpsEnabled, 
//           hasNotification 
//         });

//         const allGranted = hasLocation && gpsEnabled && hasNotification;

//         if (!allGranted) {
//           logger.log('⚠️ Some permissions missing');
//       //   setLoadingMessage('Permissions required...');

//           setShowPermissionModal(true);
//           setPermissionsGranted(false);

//         } else {
//           logger.log('✅ All permissions granted');
//       //   setLoadingMessage('All set! Loading app...');
//           setShowPermissionModal(false);
//           setPermissionsGranted(true);
//           hasLoadedOnceRef.current = true;
//           // useNotificationSetup(true, saveToken, (data) => {
//           //   logger.log('Token Save calling Main Navigation:', data);
//           // });
//         }
//       } catch (e) {
//         logger.log('❌ Permission check error:', e);
//       //  setLoadingMessage('Permission check failed...');
//         setPermissionsGranted(false);
//         setShowPermissionModal(true);
//       } finally {
//         setIsCheckingPermissions(false);
//         isCheckingRef.current = false;
//       }
//     };

//     // ✅ Handle permission modal completion
//     const handlePermissionComplete = async () => {
//       logger.log('✅ Permission modal completed');
//   //   setLoadingMessage('Rechecking permissions...');
      
//       setTimeout(async () => {
//         await checkPermissions();
//       }, 500);
//     };

//     // ✅ Initial permission check on mount
//     useEffect(() => {
//       const timer = setTimeout(() => {
//         logger.log('🚀 Initial permission check');
//         checkPermissions();
//       }, 500);
//       return () => clearTimeout(timer);
//     }, []); // ✅ Empty deps - runs once on mount

//     // ✅ Recheck permissions on foreground (only if already loaded)
//     useEffect(() => {
//       const subscription = AppState.addEventListener('change', (nextState) => {
//         logger.log('📱 App state:', appState.current, '→', nextState);
        
//         if (
//           appState.current.match(/inactive|background/) &&
//           nextState === 'active'
//         ) {
//           logger.log('🔄 App to foreground');
          
//           // ✅ Only recheck if app was previously loaded
//           if (hasLoadedOnceRef.current && !isCheckingRef.current) {
//             logger.log('🔍 Rechecking permissions');
//             checkPermissions();
//           } else {
//             logger.log('⏭️ Skip recheck - not loaded yet or already checking');
//           }
//         }
        
//         appState.current = nextState;
//       });
      
//       return () => subscription.remove();
//     }, []); // ✅ Empty deps - subscription persists

//     // ✅ Show loading screen during initial permission check
//     if (isCheckingPermissions && !hasLoadedOnceRef.current) {
//       logger.log('⏳ Initial check in progress');
//       return <LoadingScreen message={loadingMessage} />;
//     }

//     // ✅ Show loading screen + permission modal when permissions missing
//     if (!permissionsGranted) {
//       logger.log('❌ Permissions not granted');
//       return (
//         <>
//           <LoadingScreen message={loadingMessage} />
//           <PermissionFlowModal
//             visible={showPermissionModal}
//             onComplete={handlePermissionComplete}
//           />
//         </>
//       );
//     }

//     // ✅ All permissions granted - show app
//     logger.log('✅ Rendering app');
//     return (
//       <>
//         <NotificationListener>
//           <MainStackNavigator />
//         </NotificationListener>

//         {/* Keep modal available for future permission issues */}
//         <PermissionFlowModal
//           visible={showPermissionModal}
//           onComplete={handlePermissionComplete}
//         />
//       </>
//     );
//   };

//   export default MainScreenNavigation;

//   const styles = StyleSheet.create({});
// import { AppState, BackHandler } from 'react-native';
// import React, { useEffect, useState, useRef } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useNavigation } from '@react-navigation/native';
// import { logger } from '../../utils/logger';

// // ── Services ─────────────────────────────────────────────────────────────────
// import { getRunnerStatus, getAvailableOrders } from '../../services/Orders/order.api';
// import NotificationService from '../../services/NotificationService/NotificationService';

// // ── Screens ──────────────────────────────────────────────────────────────────
// import HomeScreen from '../../screens/HomeScreen/HomeScreen';
// import ProfileScreen from '../../screens/Profile/ProfileScreen';
// import OrderHistory from '../../screens/OrderHistory/OrderHistory';
// import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
// import HelpScreen from '../../screens/Profile/HelpScreen';
// import EditProfileScreen from '../../components/modals/EditProfileScreen';
// import ChatScreen from '../../screens/Chat/ChatScreen';
// import OrderHistoryDetails from '../../screens/OrderHistory/OrderHistoryDetails';

// // ── Components ───────────────────────────────────────────────────────────────
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
// import LoadingScreen from '../../components/modals/Loadingscreen';

// // ── Hooks ────────────────────────────────────────────────────────────────────
// import { useAppPermissions } from '../../hooks/useAppPermissions';
// import useNotificationSetup from '../../hooks/useNotificationSetup';
// import { useAuth } from '../../hooks/useAuth';
// import { useUserLocation } from '../../hooks/useUserLocation';

// // ── Context ──────────────────────────────────────────────────────────────────
// import { getToastHandler } from '../../utils/toastHandler';

// // ── Utils ────────────────────────────────────────────────────────────────────
// import LocationService from '../../hooks/LocationModule.android';
// import { Platform } from 'react-native';
// import { NotificationProvider } from '../../context/NotificationProvider';

// const Stack = createNativeStackNavigator();



// ═════════════════════════════════════════════════════════════════════════════
// MAIN STACK NAVIGATOR
// ═════════════════════════════════════════════════════════════════════════════

// interface MainStackParams {
//   Home: { preLoadedOrders?: any };
//   CustomerInfoScreen: { order: any };
//   ProfileScreen: undefined;
//   OrderHistory: undefined;
//   HelpScreen: undefined;
//   EditProfileScreen: undefined;
//   OrderHistoryDetails: undefined;
//   Chat: { orderId: string; fromNotification?: boolean };
// }

// const MainStackNavigator = ({ initialRoute, initialParams }: any) => {
//   return (
//     <Stack.Navigator
//       screenOptions={{ headerShown: false }}
//       initialRouteName={initialRoute}
//     >
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         initialParams={initialParams?.Home}
//       />
//       <Stack.Screen
//         name="CustomerInfoScreen"
//         component={CustomerInfoScreen}
//         initialParams={initialParams?.CustomerInfoScreen}
//       />
//       <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//       <Stack.Screen name="OrderHistory" component={OrderHistory} />
//       <Stack.Screen name="HelpScreen" component={HelpScreen} />
//       <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
//       <Stack.Screen name="OrderHistoryDetails" component={OrderHistoryDetails} />
//       <Stack.Screen name="Chat" component={ChatScreen} />
//     </Stack.Navigator>
//   );
// };

// ═════════════════════════════════════════════════════════════════════════════
// MAIN SCREEN NAVIGATION
// Flow: Permissions → Token Save → Status Check → Conditional Routing
// ═════════════════════════════════════════════════════════════════════════════

// const MainScreenNavigation = () => {
//   // ── State: Navigation ────────────────────────────────────────────────────────
//   const [appState, setAppState] = useState<'loading' | 'permission' | 'ready'>('loading');
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Loading...');

//   // ── State: Route Determination ───────────────────────────────────────────────
//   const [initialRoute, setInitialRoute] = useState<'Home' | 'CustomerInfoScreen'>('Home');
//   const [initialParams, setInitialParams] = useState<any>(null);

//   // ── Refs ─────────────────────────────────────────────────────────────────────
//   const hasLoadedOnceRef = useRef(false);
//   const isCheckingRef = useRef(false);
//   const appStateRef = useRef(AppState.currentState);

//   // ── Hooks ────────────────────────────────────────────────────────────────────
//   const { saveToken } = useAuth();
//   const {
//     checkLocationPermission,
//     isLocationEnabled,
//     checkNotificationPermission,
//   } = useAppPermissions();
//   const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();

//   // ── Back Button Handler ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => showPermissionModal
//     );
//     return () => backHandler.remove();
//   }, [showPermissionModal]);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 1: PERMISSION CHECK
//   // ═════════════════════════════════════════════════════════════════════════════

//   const checkAllPermissions = async (): Promise<boolean> => {
//     try {
//       logger.log('🔍 [Step 1] Checking permissions...');
//      // setLoadingMessage('Checking permissions...');

//       const hasLocation = await checkLocationPermission();
//       const gpsEnabled = await isLocationEnabled();
//       const hasNotification = await checkNotificationPermission();

//       logger.log('📋 Permission results:', {
//         hasLocation,
//         gpsEnabled,
//         hasNotification,
//       });

//       const allGranted = hasLocation && gpsEnabled && hasNotification;

//       if (!allGranted) {
//         logger.log('⚠️ [Step 1] Some permissions missing, showing modal');
//         setShowPermissionModal(true);
//         return false;
//       }

//       logger.log('✅ [Step 1] All permissions granted');
//       return true;
//     } catch (error) {
//       logger.error('❌ [Step 1] Permission check error:', error);
//       setShowPermissionModal(true);
//       return false;
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 2: SAVE NOTIFICATION TOKEN
//   // ═════════════════════════════════════════════════════════════════════════════

//   const setupNotifications = async (): Promise<void> => {
//     try {
//       logger.log('🔔 [Step 2] Setting up notifications...');
//      // setLoadingMessage('Setting up notifications...');

//       // Token is saved via useNotificationSetup hook in the wrapper component
//       // This ensures the setup is complete before proceeding
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       logger.log('✅ [Step 2] Notifications setup complete');
//     } catch (error) {
//       logger.error('❌ [Step 2] Notification setup error:', error);
//       // Non-critical, continue anyway
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 3: CHECK RUNNER STATUS
//   // ═════════════════════════════════════════════════════════════════════════════

//   const getLocationCoords = async (): Promise<{
//     latitude: number;
//     longitude: number;
//   } | null> => {
//     try {
//       if (Platform.OS === 'android') {
//         const locationData = await LocationService.getCurrentLocation();
//         return {
//           latitude: locationData.latitude,
//           longitude: locationData.longitude,
//         };
//       }
//       return await fetchIOSLocation();
//     } catch (error) {
//       logger.error('❌ Error getting location:', error);
//       return null;
//     }
//   };

//   const loadOrdersData = async (
//     latitude: number,
//     longitude: number
//   ): Promise<any[] | null> => {
//     try {
//       logger.log('📦 Loading orders...');
//       setLoadingMessage('Loading your orders...');

//       const ordersRes = await getAvailableOrders(latitude, longitude);

//       if (!ordersRes?.success) {
//         logger.log('❌ Failed to load orders');
//         return null;
//       }

//       const mapped = (ordersRes?.data || []).map((order: any) => ({
//         ...order,
//         distance:
//           parseFloat(order.distance?.kilometers) > 0
//             ? `${order.distance.kilometers} km`
//             : `${order.distance?.meters ?? 0} m`,
//         location: order.delivery_address || order.delivery_text || 'Resort pickup',
//         estimatedReadyAt: order.estimated_ready_at ?? null,
//         time: `${order.time_remaining ?? 0} min`,
//       }));

//       logger.log('✅ Orders loaded:', mapped.length);
//       return mapped;
//     } catch (error) {
//       logger.error('❌ Error loading orders:', error);
//       return null;
//     }
//   };

//   const checkRunnerStatusAndRoute = async (): Promise<void> => {
//     try {
//       logger.log('📊 [Step 3] Checking runner status...');
//       setLoadingMessage('Checking your status...');

//       const statusRes = await getRunnerStatus();

//       if (!statusRes?.success) {
//         logger.log('⚠️ Failed to get runner status, defaulting to Home');
//         setInitialRoute('Home');
//         setInitialParams({ Home: { preLoadedOrders: null } });
//         setAppState('ready');
//         return;
//       }

//       const status = statusRes.data;
//       logger.log('✅ [Step 3] Runner status received:', status);

//       // ── Has Active Assignment → Go to CustomerInfoScreen ─────────────────────
//       if (status?.current_assignment) {
//         logger.log('✅ [Step 3] Current assignment found, routing to CustomerInfoScreen');
//         setInitialRoute('CustomerInfoScreen');
//         setInitialParams({
//           CustomerInfoScreen: {
//             order: status.current_assignment,
//           },
//         });
//         setAppState('ready');
//         return;
//       }

//  // ── Runner NOT on duty → Home (no order loading) ─────────────────
//     if (!status?.is_on_duty) {
//       logger.log('ℹ️ Runner is OFF duty → Home without loading orders');

//       setInitialRoute('Home');
//       setInitialParams({
//         Home: { preLoadedOrders: null },
//       });

//       setAppState('ready');
//       return;
//     }

//       // ── No Assignment → Load Orders and Go to Home ──────────────────────────
//       logger.log('ℹ️ [Step 3] No assignment, loading orders for Home');
//       const coords = await getLocationCoords();

//       let preLoadedOrders = null;
//       if (coords?.latitude && coords?.longitude) {
//         preLoadedOrders = await loadOrdersData(coords.latitude, coords.longitude);
//       }

//       logger.log('✅ [Step 3] Ready for Home screen');
//       setInitialRoute('Home');
//       setInitialParams({
//         Home: { preLoadedOrders },
//       });
//       setAppState('ready');
//     } catch (error) {
//       logger.error('❌ [Step 3] Error checking status:', error);
//       setInitialRoute('Home');
//       setInitialParams({ Home: { preLoadedOrders: null } });
//       setAppState('ready');
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // MAIN FLOW ORCHESTRATION
//   // ═════════════════════════════════════════════════════════════════════════════

//   const executeAppFlow = async (): Promise<void> => {
//     if (isCheckingRef.current) {
//       logger.log('⏭️ Flow already running, skipping');
//       return;
//     }

//     isCheckingRef.current = true;

//     try {
//       // Step 1: Check Permissions
//       const permissionsOk = await checkAllPermissions();
//       if (!permissionsOk) {
//         isCheckingRef.current = false;
//         return;
//       }

//       // Step 2: Setup Notifications
//       await setupNotifications();

//       // Step 3: Check Status and Determine Route
//       await checkRunnerStatusAndRoute();

//       hasLoadedOnceRef.current = true;
//     } catch (error) {
//       logger.error('❌ Flow execution error:', error);
//       setAppState('ready');
//       setInitialRoute('Home');
//       setInitialParams({ Home: { preLoadedOrders: null } });
//     } finally {
//       isCheckingRef.current = false;
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // PERMISSION MODAL COMPLETION
//   // ═════════════════════════════════════════════════════════════════════════════

//   const handlePermissionComplete = async () => {
//     logger.log('✅ Permission modal completed, rerunning flow');
//     setShowPermissionModal(false);

//     setTimeout(() => {
//       setAppState('loading');
//       executeAppFlow();
//     }, 500);
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // EFFECTS
//   // ═════════════════════════════════════════════════════════════════════════════

//   // ── Initial Flow on Mount ────────────────────────────────────────────────────
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       logger.log('🚀 Starting app flow...');
//       executeAppFlow();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   // ── Recheck on App Foreground ────────────────────────────────────────────────
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextState) => {
//       logger.log('📱 App state:', appStateRef.current, '→', nextState);

//       if (
//         appStateRef.current.match(/inactive|background/) &&
//         nextState === 'active'
//       ) {
//         logger.log('🔄 App returned to foreground');

//         if (hasLoadedOnceRef.current && !isCheckingRef.current) {
//           logger.log('🔍 Rechecking permissions and status');
//           setAppState('loading');
//           executeAppFlow();
//         }
//       }

//       appStateRef.current = nextState;
//     });

//     return () => subscription.remove();
//   }, []);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════════════════════

//   // ── Loading State: Show loading screen ────────────────────────────────────────
//   if (appState === 'loading') {
//     logger.log('⏳ [RENDER] Loading state');
//     return <LoadingScreen message={loadingMessage} />;
//   }

//   // ── Permission State: Show permission modal ──────────────────────────────────
//   if (appState === 'permission' || showPermissionModal) {
//     logger.log('❌ [RENDER] Permission state');
//     return (
//       <>
//         <LoadingScreen message={loadingMessage} />
//         <PermissionFlowModal
//           visible={showPermissionModal}
//           onComplete={handlePermissionComplete}
//         />
//       </>
//     );
//   }

//   // ── Ready State: Show app with determined initial route ──────────────────────
//   //logger.log('✅ [RENDER] App ready, initial route:', initialRoute);
//   return (
//     <NotificationProvider>
//       <MainStackNavigator
//         initialRoute={initialRoute}
//         initialParams={initialParams}
//       />
//     </NotificationProvider>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // EXPORT WITH NOTIFICATION SETUP
// // ═════════════════════════════════════════════════════════════════════════════

// const MainScreenNavigationWithNotifications = () => {
//   const { saveToken } = useAuth();

//   // ── Setup notifications and save token ────────────────────────────────────────
//   useNotificationSetup(true, saveToken, (data) => {
//     logger.log('🔔 Notification tapped, data:', data);
//   });

//   return <MainScreenNavigation />;
// };

// export default MainScreenNavigationWithNotifications;


// import { AppState, BackHandler, Alert } from 'react-native';
// import React, { useEffect, useState, useRef } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useNavigation } from '@react-navigation/native';
// import { logger } from '../../utils/logger';

// // ── Services ─────────────────────────────────────────────────────────────────
// import { getRunnerStatus, getAvailableOrders } from '../../services/Orders/order.api';
// import NotificationService from '../../services/NotificationService/NotificationService';

// // ── Screens ──────────────────────────────────────────────────────────────────
// import HomeScreen from '../../screens/HomeScreen/HomeScreen';
// import ProfileScreen from '../../screens/Profile/ProfileScreen';
// import OrderHistory from '../../screens/OrderHistory/OrderHistory';
// import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
// import HelpScreen from '../../screens/Profile/HelpScreen';
// import EditProfileScreen from '../../components/modals/EditProfileScreen';
// import ChatScreen from '../../screens/Chat/ChatScreen';
// import OrderHistoryDetails from '../../screens/OrderHistory/OrderHistoryDetails';

// // ── Components ───────────────────────────────────────────────────────────────
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
// import LoadingScreen from '../../components/modals/Loadingscreen';

// // ── Hooks ────────────────────────────────────────────────────────────────────
// import { useAppPermissions } from '../../hooks/useAppPermissions';
// import useNotificationSetup from '../../hooks/useNotificationSetup';
// import { useAuth } from '../../hooks/useAuth';
// import { useUserLocation } from '../../hooks/useUserLocation';

// // ── Context ──────────────────────────────────────────────────────────────────
// import { getToastHandler } from '../../utils/toastHandler';

// // ── Utils ────────────────────────────────────────────────────────────────────
// import LocationService from '../../hooks/LocationModule.android';
// import { Platform } from 'react-native';
// import { NotificationProvider } from '../../context/NotificationProvider';

// const Stack = createNativeStackNavigator();



// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN STACK NAVIGATOR
// // ═════════════════════════════════════════════════════════════════════════════

// interface MainStackParams {
//   Home: { preLoadedOrders?: any };
//   CustomerInfoScreen: { order: any };
//   ProfileScreen: undefined;
//   OrderHistory: undefined;
//   HelpScreen: undefined;
//   EditProfileScreen: undefined;
//   OrderHistoryDetails: undefined;
//   Chat: { orderId: string; fromNotification?: boolean };
// }

// const MainStackNavigator = ({ initialRoute, initialParams }: any) => {
//   return (
//     <Stack.Navigator
//       screenOptions={{ headerShown: false }}
//       initialRouteName={initialRoute}
//     >
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         initialParams={initialParams?.Home}
//       />
//       <Stack.Screen
//         name="CustomerInfoScreen"
//         component={CustomerInfoScreen}
//         initialParams={initialParams?.CustomerInfoScreen}
//       />
//       <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//       <Stack.Screen name="OrderHistory" component={OrderHistory} />
//       <Stack.Screen name="HelpScreen" component={HelpScreen} />
//       <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
//       <Stack.Screen name="OrderHistoryDetails" component={OrderHistoryDetails} />
//       <Stack.Screen name="Chat" component={ChatScreen} />
//     </Stack.Navigator>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN SCREEN NAVIGATION
// // Flow: Permissions → Token Save → Status Check → Conditional Routing
// // ═════════════════════════════════════════════════════════════════════════════

// const MainScreenNavigation = () => {
//   // ── State: Navigation ────────────────────────────────────────────────────────
//   const [appState, setAppState] = useState<'loading' | 'permission' | 'ready'>('loading');
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Loading...');

//   // ── State: Route Determination ───────────────────────────────────────────────
//   const [initialRoute, setInitialRoute] = useState<'Home' | 'CustomerInfoScreen'>('Home');
//   const [initialParams, setInitialParams] = useState<any>(null);

//   // ── Refs ─────────────────────────────────────────────────────────────────────
//   const hasLoadedOnceRef = useRef(false);
//   const isCheckingRef = useRef(false);
//   const appStateRef = useRef(AppState.currentState);

//   // ── Hooks ────────────────────────────────────────────────────────────────────
//   const { saveToken } = useAuth();
//   const {
//     checkLocationPermission,
//     isLocationEnabled,
//     checkNotificationPermission,
//   } = useAppPermissions();
//   const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();

//   // ── Back Button Handler ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => showPermissionModal
//     );
//     return () => backHandler.remove();
//   }, [showPermissionModal]);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // MANDATORY PERMISSION ALERT
//   // ═════════════════════════════════════════════════════════════════════════════

//   const showMandatoryPermissionAlert = (missingPermissions: string[]) => {
//     Alert.alert(
//       '⚠️ Mandatory Permissions Required',
//       `The following permissions are required to use this app:\n\n${missingPermissions.join('\n')}\n\nPlease enable all permissions to continue.`,
//       [
//         {
//           text: 'Enable Permissions',
//           onPress: () => {
//             logger.log('✅ User agreed to enable permissions');
//             setShowPermissionModal(true);
//           },
//           style: 'default',
//         },
//         {
//           text: 'Exit App',
//           onPress: () => {
//             logger.log('❌ User refused permissions, exiting app');
//             // Exit app or show blocking screen
//             BackHandler.exitApp();
//           },
//           style: 'destructive',
//         },
//       ],
//       { cancelable: false } // User MUST choose an option
//     );
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 1: PERMISSION CHECK
//   // ═════════════════════════════════════════════════════════════════════════════

//   const checkAllPermissions = async (): Promise<boolean> => {
//     try {
//       logger.log('🔍 [Step 1] Checking permissions...');

//       const hasLocation = await checkLocationPermission();
//       const gpsEnabled = await isLocationEnabled();
//       const hasNotification = await checkNotificationPermission();

//       logger.log('📋 Permission results:', {
//         hasLocation,
//         gpsEnabled,
//         hasNotification,
//       });

//       const allGranted = hasLocation && gpsEnabled && hasNotification;

//       if (!allGranted) {
//         logger.log('⚠️ [Step 1] Some permissions missing, showing mandatory alert');
        
//         // Build list of missing permissions
//         const missingPermissions: string[] = [];
//         if (!hasLocation) missingPermissions.push('📍 Location Permission');
//         if (!gpsEnabled) missingPermissions.push('🗺️ GPS/Location Services');
//         if (!hasNotification) missingPermissions.push('🔔 Notification Permission');

//         // Show mandatory permission alert
//         showMandatoryPermissionAlert(missingPermissions);
//         return false;
//       }

//       logger.log('✅ [Step 1] All permissions granted');
//       return true;
//     } catch (error) {
//       logger.error('❌ [Step 1] Permission check error:', error);
//       showMandatoryPermissionAlert(['📍 Location', '🔔 Notifications']);
//       return false;
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 2: SAVE NOTIFICATION TOKEN
//   // ═════════════════════════════════════════════════════════════════════════════

//   const setupNotifications = async (): Promise<void> => {
//     try {
//       logger.log('🔔 [Step 2] Setting up notifications...');

//       // Token is saved via useNotificationSetup hook in the wrapper component
//       // This ensures the setup is complete before proceeding
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       logger.log('✅ [Step 2] Notifications setup complete');
//     } catch (error) {
//       logger.error('❌ [Step 2] Notification setup error:', error);
//       // Non-critical, continue anyway
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 3: CHECK RUNNER STATUS
//   // ═════════════════════════════════════════════════════════════════════════════

//   const getLocationCoords = async (): Promise<{
//     latitude: number;
//     longitude: number;
//   } | null> => {
//     try {
//       if (Platform.OS === 'android') {
//         const locationData = await LocationService.getCurrentLocation();
//         return {
//           latitude: locationData.latitude,
//           longitude: locationData.longitude,
//         };
//       }
//       return await fetchIOSLocation();
//     } catch (error) {
//       logger.error('❌ Error getting location:', error);
//       return null;
//     }
//   };

//   const loadOrdersData = async (
//     latitude: number,
//     longitude: number
//   ): Promise<any[] | null> => {
//     try {
//       logger.log('📦 Loading orders...');
//       setLoadingMessage('Loading your orders...');

//       const ordersRes = await getAvailableOrders(latitude, longitude);

//       if (!ordersRes?.success) {
//         logger.log('❌ Failed to load orders');
//         return null;
//       }

//       const mapped = (ordersRes?.data || []).map((order: any) => ({
//         ...order,
//         distance:
//           parseFloat(order.distance?.kilometers) > 0
//             ? `${order.distance.kilometers} km`
//             : `${order.distance?.meters ?? 0} m`,
//         location: order.delivery_address || order.delivery_text || 'Resort pickup',
//         estimatedReadyAt: order.estimated_ready_at ?? null,
//         time: `${order.time_remaining ?? 0} min`,
//       }));

//       logger.log('✅ Orders loaded:', mapped.length);
//       return mapped;
//     } catch (error) {
//       logger.error('❌ Error loading orders:', error);
//       return null;
//     }
//   };

//   const checkRunnerStatusAndRoute = async (): Promise<void> => {
//     try {
//       logger.log('📊 [Step 3] Checking runner status...');
//       setLoadingMessage('Checking your status...');

//       const statusRes = await getRunnerStatus();

//       if (!statusRes?.success) {
//         logger.log('⚠️ Failed to get runner status, defaulting to Home');
//         setInitialRoute('Home');
//         setInitialParams({ Home: { preLoadedOrders: null } });
//         setAppState('ready');
//         return;
//       }

//       const status = statusRes.data;
//       logger.log('✅ [Step 3] Runner status received:', status);

//       // ── Has Active Assignment → Go to CustomerInfoScreen ─────────────────────
//       if (status?.current_assignment) {
//         logger.log('✅ [Step 3] Current assignment found, routing to CustomerInfoScreen');
//         setInitialRoute('CustomerInfoScreen');
//         setInitialParams({
//           CustomerInfoScreen: {
//             order: status.current_assignment,
//           },
//         });
//         setAppState('ready');
//         return;
//       }

//       // ── Runner NOT on duty → Home (no order loading) ─────────────────
//       if (!status?.is_on_duty) {
//         logger.log('ℹ️ Runner is OFF duty → Home without loading orders');

//         setInitialRoute('Home');
//         setInitialParams({
//           Home: { preLoadedOrders: null },
//         });

//         setAppState('ready');
//         return;
//       }

//       // ── No Assignment → Load Orders and Go to Home ──────────────────────────
//       logger.log('ℹ️ [Step 3] No assignment, loading orders for Home');
//       const coords = await getLocationCoords();

//       let preLoadedOrders = null;
//       if (coords?.latitude && coords?.longitude) {
//         preLoadedOrders = await loadOrdersData(coords.latitude, coords.longitude);
//       }

//       logger.log('✅ [Step 3] Ready for Home screen');
//       setInitialRoute('Home');
//       setInitialParams({
//         Home: { preLoadedOrders },
//       });
//       setAppState('ready');
//     } catch (error) {
//       logger.error('❌ [Step 3] Error checking status:', error);
//       setInitialRoute('Home');
//       setInitialParams({ Home: { preLoadedOrders: null } });
//       setAppState('ready');
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // MAIN FLOW ORCHESTRATION
//   // ═════════════════════════════════════════════════════════════════════════════

//   const executeAppFlow = async (): Promise<void> => {
//     if (isCheckingRef.current) {
//       logger.log('⏭️ Flow already running, skipping');
//       return;
//     }

//     isCheckingRef.current = true;

//     try {
//       // Step 1: Check Permissions
//       const permissionsOk = await checkAllPermissions();
//       if (!permissionsOk) {
//         isCheckingRef.current = false;
//         return;
//       }

//       // Step 2: Setup Notifications
//       await setupNotifications();

//       // Step 3: Check Status and Determine Route
//       await checkRunnerStatusAndRoute();

//       hasLoadedOnceRef.current = true;
//     } catch (error) {
//       logger.error('❌ Flow execution error:', error);
//       setAppState('ready');
//       setInitialRoute('Home');
//       setInitialParams({ Home: { preLoadedOrders: null } });
//     } finally {
//       isCheckingRef.current = false;
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // PERMISSION MODAL COMPLETION
//   // ═════════════════════════════════════════════════════════════════════════════

//   const handlePermissionComplete = async () => {
//     logger.log('✅ Permission modal completed, rerunning flow');
//     setShowPermissionModal(false);

//     setTimeout(() => {
//       setAppState('loading');
//       executeAppFlow();
//     }, 500);
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // EFFECTS
//   // ═════════════════════════════════════════════════════════════════════════════

//   // ── Initial Flow on Mount ────────────────────────────────────────────────────
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       logger.log('🚀 Starting app flow...');
//       executeAppFlow();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   // ── Recheck on App Foreground ────────────────────────────────────────────────
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextState) => {
//       logger.log('📱 App state:', appStateRef.current, '→', nextState);

//       if (
//         appStateRef.current.match(/inactive|background/) &&
//         nextState === 'active'
//       ) {
//         logger.log('🔄 App returned to foreground');

//         if (hasLoadedOnceRef.current && !isCheckingRef.current) {
//           logger.log('🔍 Rechecking permissions and status');
//           setAppState('loading');
//           executeAppFlow();
//         }
//       }

//       appStateRef.current = nextState;
//     });

//     return () => subscription.remove();
//   }, []);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════════════════════

//   // ── Loading State: Show loading screen ────────────────────────────────────────
//   if (appState === 'loading') {
//     logger.log('⏳ [RENDER] Loading state');
//     return <LoadingScreen message={loadingMessage} />;
//   }

//   // ── Permission State: Show permission modal ──────────────────────────────────
//   if (appState === 'permission' || showPermissionModal) {
//     logger.log('❌ [RENDER] Permission state');
//     return (
//       <>
//         <LoadingScreen message={loadingMessage} />
//         <PermissionFlowModal
//           visible={showPermissionModal}
//           onComplete={handlePermissionComplete}
//         />
//       </>
//     );
//   }

//   // ── Ready State: Show app with determined initial route ──────────────────────
//   return (
//     <NotificationProvider>
//       <MainStackNavigator
//         initialRoute={initialRoute}
//         initialParams={initialParams}
//       />
//     </NotificationProvider>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // EXPORT WITH NOTIFICATION SETUP
// // ═════════════════════════════════════════════════════════════════════════════

// const MainScreenNavigationWithNotifications = () => {
//   const { saveToken } = useAuth();

//   // ── Setup notifications and save token ────────────────────────────────────────
//   useNotificationSetup(true, saveToken, (data) => {
//     logger.log('🔔 Notification tapped, data:', data);
//   });

//   return <MainScreenNavigation />;
// };

// export default MainScreenNavigationWithNotifications;



// import { AppState, BackHandler, Alert, Linking, Platform } from 'react-native';
// import React, { useEffect, useState, useRef } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useNavigation } from '@react-navigation/native';
// import { logger } from '../../utils/logger';
// import { openSettings } from 'react-native-permissions';

// // ── Services ─────────────────────────────────────────────────────────────────
// import { getRunnerStatus, getAvailableOrders } from '../../services/Orders/order.api';
// import NotificationService from '../../services/NotificationService/NotificationService';

// // ── Screens ──────────────────────────────────────────────────────────────────
// import HomeScreen from '../../screens/HomeScreen/HomeScreen';
// import ProfileScreen from '../../screens/Profile/ProfileScreen';
// import OrderHistory from '../../screens/OrderHistory/OrderHistory';
// import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
// import HelpScreen from '../../screens/Profile/HelpScreen';
// import EditProfileScreen from '../../components/modals/EditProfileScreen';
// import ChatScreen from '../../screens/Chat/ChatScreen';
// import OrderHistoryDetails from '../../screens/OrderHistory/OrderHistoryDetails';

// // ── Components ───────────────────────────────────────────────────────────────
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
// import LoadingScreen from '../../components/modals/Loadingscreen';

// // ── Hooks ────────────────────────────────────────────────────────────────────
// import { useAppPermissions } from '../../hooks/useAppPermissions';
// import useNotificationSetup from '../../hooks/useNotificationSetup';
// import { useAuth } from '../../hooks/useAuth';
// import { useUserLocation } from '../../hooks/useUserLocation';

// // ── Context ──────────────────────────────────────────────────────────────────
// import { getToastHandler } from '../../utils/toastHandler';

// // ── Utils ────────────────────────────────────────────────────────────────────
// import LocationService from '../../hooks/LocationModule.android';
// import { NotificationProvider } from '../../context/NotificationProvider';

// const Stack = createNativeStackNavigator();

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN STACK NAVIGATOR
// // ═════════════════════════════════════════════════════════════════════════════

// interface MainStackParams {
//   Home: { preLoadedOrders?: any };
//   CustomerInfoScreen: { order: any };
//   ProfileScreen: undefined;
//   OrderHistory: undefined;
//   HelpScreen: undefined;
//   EditProfileScreen: undefined;
//   OrderHistoryDetails: undefined;
//   Chat: { orderId: string; fromNotification?: boolean };
// }

// const MainStackNavigator = ({ initialRoute, initialParams }: any) => {
//   return (
//     <Stack.Navigator
//       screenOptions={{ headerShown: false }}
//       initialRouteName={initialRoute}
//     >
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         initialParams={initialParams?.Home}
//       />
//       <Stack.Screen
//         name="CustomerInfoScreen"
//         component={CustomerInfoScreen}
//         initialParams={initialParams?.CustomerInfoScreen}
//       />
//       <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//       <Stack.Screen name="OrderHistory" component={OrderHistory} />
//       <Stack.Screen name="HelpScreen" component={HelpScreen} />
//       <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
//       <Stack.Screen name="OrderHistoryDetails" component={OrderHistoryDetails} />
//       <Stack.Screen name="Chat" component={ChatScreen} />
//     </Stack.Navigator>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN SCREEN NAVIGATION
// // Flow: Location Check → Permissions → Token Save → Status Check → Routing
// // ═════════════════════════════════════════════════════════════════════════════

// type PermissionStatus = 'OK' | 'NO_PERMISSION' | 'SERVICES_DISABLED' | 'NOTIF_DENIED' | 'UNKNOWN';

// const MainScreenNavigation = () => {
//   // ── State: Navigation ────────────────────────────────────────────────────────
//   const [appState, setAppState] = useState<'loading' | 'permission' | 'ready'>('loading');
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Loading...');
//   const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('UNKNOWN');

//   // ── State: Route Determination ───────────────────────────────────────────────
//   const [initialRoute, setInitialRoute] = useState<'Home' | 'CustomerInfoScreen'>('Home');
//   const [initialParams, setInitialParams] = useState<any>(null);

//   // ── Refs ─────────────────────────────────────────────────────────────────────
//   const hasLoadedOnceRef = useRef(false);
//   const isCheckingRef = useRef(false);
//   const appStateRef = useRef(AppState.currentState);

//   // ── Hooks ────────────────────────────────────────────────────────────────────
//   const { saveToken } = useAuth();
//   const {
//     requestNotificationPermission,
//     checkLocationPermission,
//     isLocationEnabled,
//     checkNotificationPermission,
//     ensureLocationAccess,
//     requestLocationPermission,
//     requestLocationServices,
//   } = useAppPermissions();
//   const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();

//   // ── Back Button Handler ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => showPermissionModal
//     );
//     return () => backHandler.remove();
//   }, [showPermissionModal]);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // LOCATION PERMISSION MODAL (MANDATORY)
//   // ═════════════════════════════════════════════════════════════════════════════

//   const getLocationModalConfig = () => {
//     logger.log('🔍 Getting modal config for status:', permissionStatus);

//     if (permissionStatus === 'NO_PERMISSION') {
//       return {
//         title: '⚠️ Location Permission Required',
//         description: Platform.OS === 'ios'
//           ? 'Please enable Location Services in Settings > Privacy & Security > Location Services\n\nLocation is MANDATORY to access runner functionality.'
//           : 'Please enable Location Services in your device settings.\n\nLocation is MANDATORY to use this app.',
//         buttonText: 'Open Settings',
//       };
//     }

//     if (permissionStatus === 'SERVICES_DISABLED') {
//       return {
//         title: '📍 Enable Location Services',
//         description: 'We need location services enabled to track deliveries and find nearby orders.\n\nThis is MANDATORY for the app to work.',
//         buttonText: 'Enable Location',
//       };
//     }


//     if (permissionStatus === 'NOTIF_DENIED') {
//     return {
//       title: '🔔 Notifications Required',
//       description: 'To receive new order alerts and updates, notifications must be enabled.\n\nThis is MANDATORY for runners.',
//       buttonText: 'Enable Notifications',
//     };
//   }

//     return {
//       title: '📍 Location Permission Required',
//       description: 'We need your location to show available orders and track deliveries.\n\nThis permission is MANDATORY.',
//       buttonText: 'Grant Permission',
//     };
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 1: LOCATION PERMISSION CHECK (CRITICAL)
//   // ═════════════════════════════════════════════════════════════════════════════

//  const checkLocationPermissionCritical = async (): Promise<boolean> => {
//     try {
//       logger.log('🔍 [Step 1] Checking CRITICAL location permission...');
//       setLoadingMessage('Checking location access...');

//       // 1. Check Permission
//       const hasLocationPerm = await checkLocationPermission();
//       logger.log('📍 Has location permission:', hasLocationPerm);

//       if (!hasLocationPerm) {
//         logger.log('❌ [Step 1] Location permission NOT granted');
//         setPermissionStatus('NO_PERMISSION');
//         setShowPermissionModal(true);
//         return false;
//       }

//       // 2. Check GPS/Hardware Services
//       const gpsEnabled = await isLocationEnabled();
//       logger.log('📍 GPS enabled:', gpsEnabled);

//       if (!gpsEnabled) {
//         logger.log('❌ [Step 1] GPS services disabled');
//         setPermissionStatus('SERVICES_DISABLED');
//         setShowPermissionModal(true);
//         return false;
//       }

//       // ✅ SUCCESS: Clear everything
//       logger.log('✅ [Step 1] Location OK');
//       setPermissionStatus('OK');
//       setShowPermissionModal(false); // <--- Add this specifically
//       return true;
//     } catch (error) {
//       logger.error('❌ [Step 1] Location check error:', error);
//       setPermissionStatus('NO_PERMISSION');
//       setShowPermissionModal(true);
//       return false;
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 2: OTHER PERMISSIONS CHECK
//   // ═════════════════════════════════════════════════════════════════════════════

//  const checkOtherPermissions = async (): Promise<boolean> => {
//   try {
//     logger.log('🔍 [Step 2] Checking MANDATORY notifications...');

//     const hasNotification = await checkNotificationPermission();

//     if (!hasNotification) {
//       logger.log('❌ [Step 2] Notifications NOT granted');
//       setPermissionStatus('NOTIF_DENIED');
//       setShowPermissionModal(true);
//       return false; // This stops the executeAppFlow
//     }

//     logger.log('✅ [Step 2] Notifications OK');
//     return true;
//   } catch (error) {
//     logger.error('❌ [Step 2] Permission check error:', error);
//     return false;
//   }
// };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 3: SAVE NOTIFICATION TOKEN
//   // ═════════════════════════════════════════════════════════════════════════════

//   const setupNotifications = async (): Promise<void> => {
//     try {
//       logger.log('🔔 [Step 3] Setting up notifications...');

//       await new Promise((resolve) => setTimeout(resolve, 500));

//       logger.log('✅ [Step 3] Notifications setup complete');
//     } catch (error) {
//       logger.error('❌ [Step 3] Notification setup error:', error);
//       // Non-critical, continue anyway
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 4: CHECK RUNNER STATUS & LOAD DATA
//   // ═════════════════════════════════════════════════════════════════════════════

//   const getLocationCoords = async (): Promise<{
//     latitude: number;
//     longitude: number;
//   } | null> => {
//     try {
//       if (Platform.OS === 'android') {
//         const locationData = await LocationService.getCurrentLocation();
//         return {
//           latitude: locationData.latitude,
//           longitude: locationData.longitude,
//         };
//       }
//       return await fetchIOSLocation();
//     } catch (error) {
//       logger.error('❌ Error getting location:', error);
//       return null;
//     }
//   };

//   const loadOrdersData = async (
//     latitude: number,
//     longitude: number
//   ): Promise<any[] | null> => {
//     try {
//       logger.log('📦 Loading orders...');
//       setLoadingMessage('Loading your orders...');

//       const ordersRes = await getAvailableOrders(latitude, longitude);

//       if (!ordersRes?.success) {
//         logger.log('❌ Failed to load orders');
//         return null;
//       }

//       const mapped = (ordersRes?.data || []).map((order: any) => ({
//         ...order,
//         distance:
//           parseFloat(order.distance?.kilometers) > 0
//             ? `${order.distance.kilometers} km`
//             : `${order.distance?.meters ?? 0} m`,
//         location: order.delivery_address || order.delivery_text || 'Resort pickup',
//         estimatedReadyAt: order.estimated_ready_at ?? null,
//         time: `${order.time_remaining ?? 0} min`,
//       }));

//       logger.log('✅ Orders loaded:', mapped.length);
//       return mapped;
//     } catch (error) {
//       logger.error('❌ Error loading orders:', error);
//       return null;
//     }
//   };

//   const checkRunnerStatusAndRoute = async (): Promise<void> => {
//     try {
//       logger.log('📊 [Step 4] Checking runner status...');
//       setLoadingMessage('Checking your status...');

//       const statusRes = await getRunnerStatus();

//       if (!statusRes?.success) {
//         logger.log('⚠️ Failed to get runner status, defaulting to Home');
//         setInitialRoute('Home');
//         setInitialParams({ Home: { preLoadedOrders: null } });
//         setAppState('ready');
//         return;
//       }

//       const status = statusRes.data;
//       logger.log('✅ [Step 4] Runner status received:', status);

//       // ── Has Active Assignment → Go to CustomerInfoScreen ─────────────────────
//       if (status?.current_assignment) {
//         logger.log('✅ [Step 4] Current assignment found, routing to CustomerInfoScreen');
//         setInitialRoute('CustomerInfoScreen');
//         setInitialParams({
//           CustomerInfoScreen: {
//             order: status.current_assignment,
//           },
//         });
//         setAppState('ready');
//         return;
//       }

//       // ── Runner NOT on duty → Home (no order loading) ─────────────────
//       if (!status?.is_on_duty) {
//         logger.log('ℹ️ Runner is OFF duty → Home without loading orders');

//         setInitialRoute('Home');
//         setInitialParams({
//           Home: { preLoadedOrders: null },
//         });

//         setAppState('ready');
//         return;
//       }

//       // ── No Assignment → Load Orders and Go to Home ──────────────────────────
//       logger.log('ℹ️ [Step 4] No assignment, loading orders for Home');
//       const coords = await getLocationCoords();

//       let preLoadedOrders = null;
//       if (coords?.latitude && coords?.longitude) {
//         preLoadedOrders = await loadOrdersData(coords.latitude, coords.longitude);
//       }

//       logger.log('✅ [Step 4] Ready for Home screen');
//       setInitialRoute('Home');
//       setInitialParams({
//         Home: { preLoadedOrders },
//       });
//       setAppState('ready');
//     } catch (error) {
//       logger.error('❌ [Step 4] Error checking status:', error);
//       setInitialRoute('Home');
//       setInitialParams({ Home: { preLoadedOrders: null } });
//       setAppState('ready');
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // HANDLE LOCATION PERMISSION MODAL COMPLETION
//   // ═════════════════════════════════════════════════════════════════════════════

//  const handleLocationPermissionButtonPress = async () => {
//     try {
//       // Re-verify actual status before deciding what the button does




//       const hasPerm = await checkLocationPermission();
      
//       if (hasPerm) {
//         const gpsOn = await isLocationEnabled();
//         if (gpsOn) {
//           setShowPermissionModal(false);
//           setPermissionStatus('OK');
//           executeAppFlow();
//           return;
//         } else {
//           setPermissionStatus('SERVICES_DISABLED');
//           // continue to handle services
//         }
//       }

//       if (permissionStatus === 'NOTIF_DENIED') {
//       const granted = await requestNotificationPermission();
//       if (granted) {
//         setShowPermissionModal(false);
//         setAppState('loading');
//         executeAppFlow();
//       }
//       // Note: If requestNotificationPermission handles its own "BLOCKED" 
//       // alert with openSettings, it will work perfectly here.
//       return;
//     }

//       // ... rest of your existing logic for requestLocationServices or openSettings
//     } catch (error) {
//        logger.error('Error in button press:', error);
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // MAIN FLOW ORCHESTRATION
//   // ═════════════════════════════════════════════════════════════════════════════

//   // const executeAppFlow = async (): Promise<void> => {
//   //   if (isCheckingRef.current) {
//   //     logger.log('⏭️ Flow already running, skipping');
//   //     return;
//   //   }

//   //   isCheckingRef.current = true;

//   //   try {
//   //     // Step 1: Check Critical Location Permission (MANDATORY)
//   //     const locationOk = await checkLocationPermissionCritical();
      
//   //     logger.log('📍 Location check result:', locationOk);
//   //     logger.log('📍 Current permission status:', permissionStatus);

//   //     if (!locationOk) {
//   //       logger.log('⛔ Location not OK, stopping flow');
//   //       isCheckingRef.current = false;
//   //       return;
//   //     }

//   //     // Step 2: Check Other Permissions (Optional)
//   //     await checkOtherPermissions();

//   //     // Step 3: Setup Notifications
//   //     await setupNotifications();

//   //     // Step 4: Check Status and Determine Route
//   //     await checkRunnerStatusAndRoute();

//   //     hasLoadedOnceRef.current = true;
//   //   } catch (error) {
//   //     logger.error('❌ Flow execution error:', error);
//   //     setAppState('ready');
//   //     setInitialRoute('Home');
//   //     setInitialParams({ Home: { preLoadedOrders: null } });
//   //   } finally {
//   //     isCheckingRef.current = false;
//   //   }
//   // };
// const executeAppFlow = async (): Promise<void> => {
//   if (isCheckingRef.current) return;
//   isCheckingRef.current = true;

//   try {
//     // Gate 1: Location
//     const locationOk = await checkLocationPermissionCritical();
//     if (!locationOk) return; // Modal is already shown by the check function

//     // Gate 2: Notifications (Now Mandatory)
//     const notifOk = await checkOtherPermissions();
//     if (!notifOk) return; // Modal is now shown by checkOtherPermissions

//     // Gate 3: Finalize
//     await setupNotifications();
//     await checkRunnerStatusAndRoute();

//     setShowPermissionModal(false);
//     hasLoadedOnceRef.current = true;
//   } catch (error) {
//       logger.error('❌ Flow execution error:', error);
//   } finally {
//     isCheckingRef.current = false;
//   }
// };
//   // ═════════════════════════════════════════════════════════════════════════════
//   // EFFECTS
//   // ═════════════════════════════════════════════════════════════════════════════

//   // ── Initial Flow on Mount ────────────────────────────────────────────────────
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       logger.log('🚀 Starting app flow on mount...');
//       executeAppFlow();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   // ── Recheck on App Foreground ────────────────────────────────────────────────
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextState) => {
//       logger.log('📱 App state changed:', appStateRef.current, '→', nextState);

//       if (
//         appStateRef.current.match(/inactive|background/) &&
//         nextState === 'active'
//       ) {
//         logger.log('🔄 App returned to foreground, rechecking location');

//         if (hasLoadedOnceRef.current && !isCheckingRef.current) {
//           setAppState('loading');
//           executeAppFlow();
//         }
//       }

//       appStateRef.current = nextState;
//     });

//     return () => subscription.remove();
//   }, []);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════════════════════

//   // ── Loading State: Show loading screen ────────────────────────────────────────
//   if (appState === 'loading' && !showPermissionModal) {
//     logger.log('⏳ [RENDER] Loading state');
//     return <LoadingScreen message={loadingMessage} />;
//   }

//   // ── Permission State: Show mandatory location permission modal ──────────────
//   if (showPermissionModal) {
//     logger.log('❌ [RENDER] Permission modal visible, status:', permissionStatus);
//     const modalConfig = getLocationModalConfig();

//     return (
//       <PermissionFlowModal
//         visible={showPermissionModal}
//         title={modalConfig.title}
//         description={modalConfig.description}
//         buttonText={modalConfig.buttonText}
//         onComplete={handleLocationPermissionButtonPress}
//       />
//     );
//   }

//   // ── Ready State: Show app with determined initial route ──────────────────────
//   logger.log('✅ [RENDER] App ready, initial route:', initialRoute);
//   return (
//     <NotificationProvider>
//       <MainStackNavigator
//         initialRoute={initialRoute}
//         initialParams={initialParams}
//       />
//     </NotificationProvider>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // EXPORT WITH NOTIFICATION SETUP
// // ═════════════════════════════════════════════════════════════════════════════

// const MainScreenNavigationWithNotifications = () => {
//   const { saveToken } = useAuth();

//   useNotificationSetup(true, saveToken, (data) => {
//     logger.log('🔔 Notification tapped, data:', data);
//   });

//   return <MainScreenNavigation />;
// };

// export default MainScreenNavigationWithNotifications;





// import { AppState, BackHandler, Platform } from 'react-native';
// import React, { useEffect, useState, useRef, useContext } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { logger } from '../../utils/logger';

// // ── Services ─────────────────────────────────────────────────────────────────
// import { getRunnerStatus, getAvailableOrders } from '../../services/Orders/order.api';

// // ── Screens ──────────────────────────────────────────────────────────────────
// import HomeScreen from '../../screens/HomeScreen/HomeScreen';
// import ProfileScreen from '../../screens/Profile/ProfileScreen';
// import OrderHistory from '../../screens/OrderHistory/OrderHistory';
// import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
// import HelpScreen from '../../screens/Profile/HelpScreen';
// import EditProfileScreen from '../../components/modals/EditProfileScreen';
// import ChatScreen from '../../screens/Chat/ChatScreen';
// import OrderHistoryDetails from '../../screens/OrderHistory/OrderHistoryDetails';

// // ── Components ───────────────────────────────────────────────────────────────
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
// import LoadingScreen from '../../components/modals/Loadingscreen';

// // ── Hooks ────────────────────────────────────────────────────────────────────
// import { useAppPermissions } from '../../hooks/useAppPermissions';
// //import useNotificationSetup from '../../hooks/useNotificationSetup';
// import { useAuth } from '../../hooks/useAuth';
// import { useUserLocation } from '../../hooks/useUserLocation';
// import { useOrdersContext } from '../../context/OrdersContext'; // ✅ Global orders

// // ── Context ──────────────────────────────────────────────────────────────────
// import { AuthContext } from '../../context/AuthContext';
// import { NotificationProvider } from '../../context/NotificationProvider';

// // ── Utils ────────────────────────────────────────────────────────────────────
// import LocationService from '../../hooks/LocationModule.android';
// import { openSettings } from 'react-native-permissions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import NotificationService from '../../services/NotificationService/NotificationService';

// const Stack = createNativeStackNavigator();

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN STACK NAVIGATOR
// // ═════════════════════════════════════════════════════════════════════════════

// interface MainStackParams {
//   Home: undefined;
//   CustomerInfoScreen: { orderId: number };
//   ProfileScreen: undefined;
//   OrderHistory: undefined;
//   HelpScreen: undefined;
//   EditProfileScreen: undefined;
//   OrderHistoryDetails: undefined;
//   Chat: { orderId: string };
// }

// const MainStackNavigator = ({ initialRoute }: any) => {
//   return (
//     <Stack.Navigator
//       screenOptions={{ headerShown: false }}
//       initialRouteName={initialRoute}
//     >
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="CustomerInfoScreen" component={CustomerInfoScreen} />
//       <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//       <Stack.Screen name="OrderHistory" component={OrderHistory} />
//       <Stack.Screen name="HelpScreen" component={HelpScreen} />
//       <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
//       <Stack.Screen name="OrderHistoryDetails" component={OrderHistoryDetails} />
//       <Stack.Screen name="Chat" component={ChatScreen} />
//     </Stack.Navigator>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN SCREEN NAVIGATION (SIMPLIFIED)
// // ═════════════════════════════════════════════════════════════════════════════

// type PermissionStatus = 'OK' | 'NO_PERMISSION' | 'SERVICES_DISABLED' | 'NOTIF_DENIED' | 'UNKNOWN';

// const MainScreenNavigation = () => {
//   // ── State ────────────────────────────────────────────────────────────────────
//   const [appState, setAppState] = useState<'loading' | 'ready'>('loading');
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Loading data...');
//   const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('UNKNOWN');
//   const [initialRoute, setInitialRoute] = useState<'Home' | 'CustomerInfoScreen'>('Home');
//  const { saveToken } = useAuth();
//   // ── Refs ─────────────────────────────────────────────────────────────────────
//   const hasLoadedOnceRef = useRef(false);
//   const isCheckingRef = useRef(false);
//   const appStateRef = useRef(AppState.currentState);

//   // ── Hooks ────────────────────────────────────────────────────────────────────
//   const {
//     requestLocationPermission,
//     requestLocationServices,
//     requestNotificationPermission,
//     checkLocationPermission,
//     isLocationEnabled,
//     checkNotificationPermission,
//   } = useAppPermissions();
//   const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();

//   // ✅ GLOBAL ORDERS CONTEXT (loads directly to global state, not params)
//   const {loadRunnerStatus,loadOrders} = useOrdersContext();

//   // ── Back Button Handler ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => showPermissionModal
//     );
//     return () => backHandler.remove();
//   }, [showPermissionModal]);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // PERMISSION MODAL CONFIG
//   // ═════════════════════════════════════════════════════════════════════════════

//   const getPermissionModalConfig = () => {
//     logger.log('🔍 Getting modal config for status:', permissionStatus);

//     if (permissionStatus === 'NO_PERMISSION') {
//       return {
//         title: '⚠️ Location Permission Required',
//         description: Platform.OS === 'ios'
//           ? 'Please enable Location Services in Settings > Privacy & Security > Location Services\n\nLocation is MANDATORY to access runner functionality.'
//           : 'Please enable Location Services in your device settings.\n\nLocation is MANDATORY to use this app.',
//         buttonText: 'Open Settings',
//       };
//     }

//     if (permissionStatus === 'SERVICES_DISABLED') {
//       return {
//         title: '📍 Enable Location Services',
//         description: 'We need location services enabled to track deliveries and find nearby orders.\n\nThis is MANDATORY for the app to work.',
//         buttonText: 'Enable Location',
//       };
//     }

//     if (permissionStatus === 'NOTIF_DENIED') {
//       return {
//         title: '🔔 Notifications Required',
//         description: 'To receive new order alerts and updates, notifications must be enabled.\n\nThis is MANDATORY for runners.',
//         buttonText: 'Enable Notifications',
//       };
//     }

//     return {
//       title: '📍 Location Permission Required',
//       description: 'We need your location to show available orders and track deliveries.',
//       buttonText: 'Grant Permission',
//     };
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 1: CHECK LOCATION PERMISSION
//   // ═════════════════════════════════════════════════════════════════════════════

//   const checkLocationPermissionCritical = async (): Promise<boolean> => {
//     try {
//       logger.log('🔍 [Step 1] Checking location permission...');
//       setLoadingMessage('Checking location access...');

//       const hasLocationPerm = await checkLocationPermission();
//       logger.log('📍 Has location permission:', hasLocationPerm);

//       if (!hasLocationPerm) {
//         logger.log('❌ [Step 1] Location permission NOT granted');
//         setPermissionStatus('NO_PERMISSION');
//         setShowPermissionModal(true);
//         return false;
//       }

//       const gpsEnabled = await isLocationEnabled();
//       logger.log('📍 GPS enabled:', gpsEnabled);

//       if (!gpsEnabled) {
//         logger.log('❌ [Step 1] GPS services disabled');
//         setPermissionStatus('SERVICES_DISABLED');
//         setShowPermissionModal(true);
//         return false;
//       }

//       logger.log('✅ [Step 1] Location OK');
//       setPermissionStatus('OK');
//       setShowPermissionModal(false);
//       return true;
//     } catch (error) {
//       logger.error('❌ [Step 1] Location check error:', error);
//       setPermissionStatus('NO_PERMISSION');
//       setShowPermissionModal(true);
//       return false;
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 2: CHECK NOTIFICATION PERMISSION
//   // ═════════════════════════════════════════════════════════════════════════════

//   const checkNotificationPermissionCritical = async (): Promise<boolean> => {
//     try {
//       logger.log('🔍 [Step 2] Checking notification permission...');
//       setLoadingMessage('Checking notification access...');

//       const hasNotification = await checkNotificationPermission();
//       logger.log('🔔 Has notification permission:', hasNotification);

//       if (!hasNotification) {
//         logger.log('❌ [Step 2] Notifications NOT granted');
//         setPermissionStatus('NOTIF_DENIED');
//         setShowPermissionModal(true);
//         return false;
//       }

//       logger.log('✅ [Step 2] Notifications OK');
//       setPermissionStatus('OK');
//       setShowPermissionModal(false);
//       return true;
//     } catch (error) {
//       logger.error('❌ [Step 2] Notification check error:', error);
//       return false;
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // STEP 3: GET LOCATION COORDINATES
//   // ═════════════════════════════════════════════════════════════════════════════

//   const getLocationCoords = async (): Promise<{ latitude: number; longitude: number } | null> => {
//     try {
//      // setLoadingMessage('Getting your location...');
//       logger.log('📍 [Step 3] Getting location coordinates...');

//       if (Platform.OS === 'android') {
//         const locationData = await LocationService.getCurrentLocation();
//         logger.log('✅ [Step 3] Android location:', locationData);
//         return {
//           latitude: locationData.latitude,
//           longitude: locationData.longitude,
//         };
//       }

//       const location = await fetchIOSLocation();
//       logger.log('✅ [Step 3] iOS location:', location);
//       return location;
//     } catch (error) {
//       logger.error('❌ [Step 3] Error getting location:', error);
//       return null;
//     }
//   };



//   // ═════════════════════════════════════════════════════════════════════════════
//   // HANDLE PERMISSION BUTTON PRESS
//   // ═════════════════════════════════════════════════════════════════════════════

// const handlePermissionButtonPress = async () => {
//   if (permissionStatus === 'NO_PERMISSION') {
//     await openSettings(); // Blocked permissions require manual intervention
//   } else if (permissionStatus === 'SERVICES_DISABLED') {
//     await requestLocationServices();
//   } else if (permissionStatus === 'NOTIF_DENIED') {
//     const result = await requestNotificationPermission();
//     if (!result) {
//        await openSettings(); // If they denied twice, send to settings
//     }
//   } else {
//     await requestLocationPermission();
//   }
  
//   // Re-run the flow to check if the user actually fixed the issue
//   executeAppFlow();
// };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // MAIN FLOW ORCHESTRATION
//   // ═════════════════════════════════════════════════════════════════════════════

//  const executeAppFlow = async (): Promise<void> => {
//   if (isCheckingRef.current) {
//     logger.log('⏭️ Flow already running');
//     return;
//   }

//   isCheckingRef.current = true;

//   try {
//     // Show loading state while checking
//     setAppState('loading');

//     // ── STEP 1: LOCATION (MANDATORY) ──────────────────────────────────
//     logger.log('🔐 [Flow] Step 1: Checking Location');
//    // setLoadingMessage('Checking location access...');
    
//     const hasLocationPerm = await checkLocationPermission();
//     const gpsEnabled = await isLocationEnabled();

//     if (!hasLocationPerm) {
//       setPermissionStatus('NO_PERMISSION');
//       setShowPermissionModal(true);
//       isCheckingRef.current = false;
//       return; // ⛔ STOP HERE
//     }

//     if (!gpsEnabled) {
//       setPermissionStatus('SERVICES_DISABLED');
//       setShowPermissionModal(true);
//       isCheckingRef.current = false;
//       return; // ⛔ STOP HERE
//     }

//     // ── STEP 2: NOTIFICATIONS (MANDATORY) ─────────────────────────────
//     logger.log('🔐 [Flow] Step 2: Checking Notifications');
//    // setLoadingMessage('Checking notification access...');
    
//     const hasNotification = await checkNotificationPermission();
//     if (!hasNotification) {
//       setPermissionStatus('NOTIF_DENIED');
//       setShowPermissionModal(true);
//       isCheckingRef.current = false;
//       return; // ⛔ STOP HERE
//     }

//     // If we reach here, both permissions are OK
//     setShowPermissionModal(false);

//     // ── STEP 3: SAVE TOKEN ────────────────────────────────────────────
//     logger.log('🔐 [Flow] Step 3: Syncing Notification Token');
//    // setLoadingMessage('Finalizing setup...');
    

// // ── STEP 3: GET & SAVE TOKEN ───────────────────────────────────
//       // We only do this once permissions are verified
//      // setLoadingMessage('Syncing security token...');
//       const platform = Platform.OS === 'ios' ? 'runner_ios' : 'runner_android';
//       const token = await NotificationService.getFCMToken(); 
      
//       if (token) {
//         await saveToken(token, platform);
//         logger.log('✅ Token saved to backend');
//       }

//     // ── STEP 4: GET STATUS & LOAD ORDERS ──────────────────────────────
//     logger.log('🔐 [Flow] Step 4: Checking Runner Status');
//     setLoadingMessage('Fetching your status...');
    
//       const statusRes = await loadRunnerStatus();
// logger.log("========statusRes========",statusRes)
  
      
//       // Check for active assignment first
//       if (statusRes?.current_assignment) {
//         setInitialRoute('CustomerInfoScreen');
//         setAppState('ready');
//         isCheckingRef.current = false;
//         return;
//       }

//       // If on duty but no assignment, load orders
//       if (statusRes?.is_on_duty) {
//           setLoadingMessage('Loading your orders...');
//         const coords = await getLocationCoords();
//         logger.log("========coords========", coords);
//         if (coords) {
//        const loadedOrders = await loadOrders(coords.latitude, coords.longitude);
// logger.log("========orders========", loadedOrders);
//         }
//       }
    

//     // Default Fallback
//     setInitialRoute('Home');
//     setAppState('ready');
//     hasLoadedOnceRef.current = true;

//   } catch (error) {
//     logger.error('❌ Flow Error:', error);
//     setInitialRoute('Home');
//     setAppState('ready');
//   } finally {
//     isCheckingRef.current = false;
//   }
// };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // EFFECTS
//   // ═════════════════════════════════════════════════════════════════════════════

//   // ── Initial Flow on Mount ────────────────────────────────────────────────────
//   useEffect(() => {
//     logger.log('🚀 [Mount] Starting app flow...');
//     executeAppFlow();
//   }, []);

//   // ── Recheck on App Foreground ────────────────────────────────────────────────
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextState) => {
//       logger.log('📱 App state:', appStateRef.current, '→', nextState);

//       if (
//         appStateRef.current.match(/inactive|background/) &&
//         nextState === 'active'
//       ) {
//         logger.log('🔄 App foreground, rechecking permissions');

//         if (hasLoadedOnceRef.current && !isCheckingRef.current) {
//           setAppState('loading');
//           executeAppFlow();
//         }
//       }

//       appStateRef.current = nextState;
//     });

//     return () => subscription.remove();
//   }, []);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════════════════════

//   // ── Loading State ────────────────────────────────────────────────────────────
//   if (appState === 'loading' && !showPermissionModal) {
//     logger.log('⏳ [RENDER] Loading screen');
//     return <LoadingScreen message={loadingMessage} />;
//   }

//   // ── Permission Modal ─────────────────────────────────────────────────────────
//   if (showPermissionModal) {
//     logger.log('❌ [RENDER] Permission modal, status:', permissionStatus);
//     const modalConfig = getPermissionModalConfig();

//     return (
//       <PermissionFlowModal
//         visible={showPermissionModal}
//         title={modalConfig.title}
//         description={modalConfig.description}
//         buttonText={modalConfig.buttonText}
//         onComplete={handlePermissionButtonPress}
//       />
//     );
//   }

//   // ── Ready State: Show App ────────────────────────────────────────────────────
//   //logger.log('✅ [RENDER] App ready, route:', initialRoute);
//   return (
//     <NotificationProvider>
//       <MainStackNavigator initialRoute={initialRoute} />
//     </NotificationProvider>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // EXPORT WITH NOTIFICATION SETUP
// // ═════════════════════════════════════════════════════════════════════════════

// const MainScreenNavigationWithNotifications = () => {
//  // const { saveToken } = useAuth();

//   // useNotificationSetup(true, saveToken, (data) => {
//   //   logger.log('🔔 Notification tapped:', data);
//   // });

//   return <MainScreenNavigation />;
// };

// export default MainScreenNavigationWithNotifications;

import { AppState, BackHandler, Platform } from 'react-native';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { logger } from '../../utils/logger';

// ── Services ─────────────────────────────────────────────────────────────────
import { getRunnerStatus, getAvailableOrders } from '../../services/Orders/order.api';

// ── Screens ──────────────────────────────────────────────────────────────────
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../../screens/Profile/ProfileScreen';
import OrderHistory from '../../screens/OrderHistory/OrderHistory';
import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
import HelpScreen from '../../screens/Profile/HelpScreen';
import EditProfileScreen from '../../components/modals/EditProfileScreen';
import ChatScreen from '../../screens/Chat/ChatScreen';
import OrderHistoryDetails from '../../screens/OrderHistory/OrderHistoryDetails';

// ── Components ───────────────────────────────────────────────────────────────
import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
import LoadingScreen from '../../components/modals/Loadingscreen';

// ── Hooks ────────────────────────────────────────────────────────────────────
import { useAppPermissions } from '../../hooks/useAppPermissions';
import { useAuth } from '../../hooks/useAuth';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useOrdersContext } from '../../context/OrdersContext';

// ── Context ──────────────────────────────────────────────────────────────────
import { AuthContext } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationProvider';

// ── Utils ────────────────────────────────────────────────────────────────────
import LocationService from '../../hooks/LocationModule.android';
import { openSettings } from 'react-native-permissions';
import NotificationService from '../../services/NotificationService/NotificationService';

const Stack = createNativeStackNavigator();

// ═════════════════════════════════════════════════════════════════════════════
// MAIN STACK NAVIGATOR
// ═════════════════════════════════════════════════════════════════════════════

const MainStackNavigator = ({ initialRoute }: any) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CustomerInfoScreen" component={CustomerInfoScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="HelpScreen" component={HelpScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="OrderHistoryDetails" component={OrderHistoryDetails} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN SCREEN NAVIGATION
// ═════════════════════════════════════════════════════════════════════════════

type PermissionStatus = 'OK' | 'NO_PERMISSION' | 'SERVICES_DISABLED' | 'NOTIF_DENIED' | 'UNKNOWN';

const MainScreenNavigation = () => {
  // ── State ────────────────────────────────────────────────────────────────────
  const [appState, setAppState] = useState<'loading' | 'ready'>('loading');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading data...');
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('UNKNOWN');
  const [initialRoute, setInitialRoute] = useState<'Home' | 'CustomerInfoScreen'>('Home');

  // ── Refs ─────────────────────────────────────────────────────────────────────
  const hasLoadedOnceRef = useRef(false);
  const isCheckingRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  // ── Hooks ────────────────────────────────────────────────────────────────────
  const { saveToken } = useAuth();
  const {
    requestLocationPermission,
    requestLocationServices,
    requestNotificationPermission,
    checkLocationPermission,
    isLocationEnabled,
    checkNotificationPermission,
  } = useAppPermissions();
  const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();

  // ✅ GLOBAL ORDERS CONTEXT
  const { loadRunnerStatus, loadOrders } = useOrdersContext();

  // ── Back Button Handler ──────────────────────────────────────────────────────
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => showPermissionModal
    );
    return () => backHandler.remove();
  }, [showPermissionModal]);

  // ═════════════════════════════════════════════════════════════════════════════
  // PERMISSION MODAL CONFIG
  // ═════════════════════════════════════════════════════════════════════════════

  const getPermissionModalConfig = () => {
    logger.log('🔍 Getting modal config for status:', permissionStatus);

    if (permissionStatus === 'NO_PERMISSION') {
      return {
        title: '⚠️ Location Permission Required',
        description: Platform.OS === 'ios'
          ? 'Please enable Location Services in Settings > Privacy & Security > Location Services\n\nLocation is MANDATORY to access runner functionality.'
          : 'Please enable Location Services in your device settings.\n\nLocation is MANDATORY to use this app.',
        buttonText: 'Open Settings',
      };
    }

    if (permissionStatus === 'SERVICES_DISABLED') {
      return {
        title: '📍 Enable Location Services',
        description: 'We need location services enabled to track deliveries and find nearby orders.\n\nThis is MANDATORY for the app to work.',
        buttonText: 'Enable Location',
      };
    }

    if (permissionStatus === 'NOTIF_DENIED') {
      return {
        title: '🔔 Notifications Required',
        description: 'To receive new order alerts and updates, notifications must be enabled.\n\nThis is MANDATORY for runners.',
        buttonText: 'Enable Notifications',
      };
    }

    return {
      title: '📍 Location Permission Required',
      description: 'We need your location to show available orders and track deliveries.',
      buttonText: 'Grant Permission',
    };
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // GET LOCATION COORDINATES
  // ═════════════════════════════════════════════════════════════════════════════

  const getLocationCoords = async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      logger.log('📍 [Step 3] Getting location coordinates...');

      if (Platform.OS === 'android') {
        const locationData = await LocationService.getCurrentLocation();
        logger.log('✅ [Step 3] Android location:', locationData);
        return {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };
      }

      const location = await fetchIOSLocation();
      logger.log('✅ [Step 3] iOS location:', location);
      return location;
    } catch (error) {
      logger.error('❌ [Step 3] Error getting location:', error);
      return null;
    }
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // CHECK PERMISSIONS ONLY (NO API CALLS)
  // ═════════════════════════════════════════════════════════════════════════════

  const checkPermissionsOnly = async (): Promise<boolean> => {
    try {
      logger.log('🔐 [Permissions] Checking location & notifications...');

      // ── Check Location ────────────────────────────────────────────────────────
      const hasLocationPerm = await checkLocationPermission();
      const gpsEnabled = await isLocationEnabled();

      if (!hasLocationPerm) {
        logger.log('❌ Location permission NOT granted');
        setPermissionStatus('NO_PERMISSION');
        setShowPermissionModal(true);
        return false;
      }

      if (!gpsEnabled) {
        logger.log('❌ GPS services disabled');
        setPermissionStatus('SERVICES_DISABLED');
        setShowPermissionModal(true);
        return false;
      }

      // ── Check Notifications ───────────────────────────────────────────────────
      const hasNotification = await checkNotificationPermission();
      if (!hasNotification) {
        logger.log('❌ Notifications NOT granted');
        setPermissionStatus('NOTIF_DENIED');
        setShowPermissionModal(true);
        return false;
      }

      // ✅ All permissions OK
      logger.log('✅ All permissions OK');
      setPermissionStatus('OK');
      setShowPermissionModal(false);
      return true;
    } catch (error) {
      logger.error('❌ Permission check error:', error);
      return false;
    }
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // HANDLE PERMISSION BUTTON PRESS
  // ═════════════════════════════════════════════════════════════════════════════

  const handlePermissionButtonPress = async () => {
    logger.log('🔐 [Permission Button] Status:', permissionStatus);

    if (permissionStatus === 'NO_PERMISSION') {
      logger.log('🔓 Opening settings for location permission');
      await openSettings();
    } else if (permissionStatus === 'SERVICES_DISABLED') {
      logger.log('📍 Requesting location services');
      await requestLocationServices();
    } else if (permissionStatus === 'NOTIF_DENIED') {
      logger.log('🔔 Requesting notification permission');
      const result = await requestNotificationPermission();
      if (!result) {
        logger.log('❌ Notifications denied, opening settings');
        await openSettings();
      }
    } else {
      logger.log('🔓 Requesting location permission');
      await requestLocationPermission();
    }

    // ✅ Re-check permissions after user action
    logger.log('🔄 Re-checking permissions...');
    executeAppFlow();
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // MAIN FLOW ORCHESTRATION
  // ═════════════════════════════════════════════════════════════════════════════

  const executeAppFlow = async (): Promise<void> => {
    if (isCheckingRef.current) {
      logger.log('⏭️ Flow already running');
      return;
    }

    isCheckingRef.current = true;

    try {
      setAppState('loading');

      // ── STEP 1: CHECK PERMISSIONS ────────────────────────────────────────────
      logger.log('🔐 [Flow] Step 1: Checking Permissions');

      const permissionsOk = await checkPermissionsOnly();
      if (!permissionsOk) {
        // Modal is shown, stop here
        isCheckingRef.current = false;
        return;
      }

      // ── STEP 2: SAVE NOTIFICATION TOKEN ──────────────────────────────────────
      logger.log('🔐 [Flow] Step 2: Saving Notification Token');
      setLoadingMessage('Finalizing setup...');

      const platform = Platform.OS === 'ios' ? 'runner_ios' : 'runner_android';
      const token = await NotificationService.getFCMToken();

      if (token) {
        await saveToken(token, platform);
        logger.log('✅ Token saved to backend');
      }

      // ── STEP 3: GET RUNNER STATUS ────────────────────────────────────────────
      logger.log('🔐 [Flow] Step 3: Checking Runner Status');
      setLoadingMessage('Fetching your status...');

      const statusRes = await loadRunnerStatus();
      logger.log('========statusRes========', statusRes);

      // ── Check for active assignment ───────────────────────────────────────────
      if (statusRes?.current_assignment) {
        logger.log('✅ Active assignment found, routing to CustomerInfoScreen');
        setInitialRoute('CustomerInfoScreen');
        setAppState('ready');
        hasLoadedOnceRef.current = true;
        isCheckingRef.current = false;
        return;
      }

      // ── If on duty but no assignment, load orders ─────────────────────────────
      if (statusRes?.is_on_duty) {
        logger.log('ℹ️ Runner on duty, loading orders');
        setLoadingMessage('Loading your orders...');

        const coords = await getLocationCoords();
        logger.log('========coords========', coords);

        if (coords) {
          const loadedOrders = await loadOrders(coords.latitude, coords.longitude);
          logger.log('========orders========', loadedOrders);
        }
      } else {
        logger.log('ℹ️ Runner is OFF duty');
      }

      // ── Default: Go to Home ──────────────────────────────────────────────────
      setInitialRoute('Home');
      setAppState('ready');
      hasLoadedOnceRef.current = true;
    } catch (error) {
      logger.error('❌ Flow Error:', error);
      setInitialRoute('Home');
      setAppState('ready');
    } finally {
      isCheckingRef.current = false;
    }
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═════════════════════════════════════════════════════════════════════════════

  // ── Initial Flow on Mount ────────────────────────────────────────────────────
  useEffect(() => {
    logger.log('🚀 [Mount] Starting app flow...');
    executeAppFlow();
  }, []);

  // ── Recheck on App Foreground ────────────────────────────────────────────────
  // ✅ OPTIMIZED: Only check permissions, NOT API calls
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      logger.log('📱 App state:', appStateRef.current, '→', nextState);

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        logger.log('🔄 App foreground, checking permissions only (no API calls)');

        // ✅ Only check permissions, don't load orders again
        if (hasLoadedOnceRef.current && !isCheckingRef.current) {
          checkPermissionsOnly().then((permissionsOk) => {
            if (!permissionsOk) {
              logger.log('⚠️ Permissions changed, showing modal');
              // Modal is already shown by checkPermissionsOnly
            } else {
              logger.log('✅ Permissions OK on foreground');
              // Don't reload orders, just ensure app is ready
              setAppState('ready');
            }
          });
        }
      }

      appStateRef.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  // ═════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════════

  // ── Loading State ────────────────────────────────────────────────────────────
  if (appState === 'loading' && !showPermissionModal) {
    logger.log('⏳ [RENDER] Loading screen');
    return <LoadingScreen message={loadingMessage} />;
  }

  // ── Permission Modal ─────────────────────────────────────────────────────────
  if (showPermissionModal) {
    logger.log('❌ [RENDER] Permission modal, status:', permissionStatus);
    const modalConfig = getPermissionModalConfig();

    return (
      <PermissionFlowModal
        visible={showPermissionModal}
        title={modalConfig.title}
        description={modalConfig.description}
        buttonText={modalConfig.buttonText}
        onComplete={handlePermissionButtonPress}
      />
    );
  }

  // ── Ready State: Show App ────────────────────────────────────────────────────
  logger.log('✅ [RENDER] App ready, route:', initialRoute);
  return (
    <NotificationProvider>
      <MainStackNavigator initialRoute={initialRoute} />
    </NotificationProvider>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// EXPORT WITH NOTIFICATION SETUP
// ═════════════════════════════════════════════════════════════════════════════

const MainScreenNavigationWithNotifications = () => {
  return <MainScreenNavigation />;
};

export default MainScreenNavigationWithNotifications;






