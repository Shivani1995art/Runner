// import { AppState, BackHandler, Platform } from 'react-native';
// import React, { useEffect, useState, useRef } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { logger } from '../../utils/logger';

// // ── Services ─────────────────────────────────────────────────────────────────
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
// import { useAuth } from '../../hooks/useAuth';
// import { useUserLocation } from '../../hooks/useUserLocation';
// import { useOrdersContext } from '../../context/OrdersContext';

// // ── Context ──────────────────────────────────────────────────────────────────
// import { NotificationProvider } from '../../context/NotificationProvider';

// // ── Permissions Manager ──────────────────────────────────────────────────────
// import { permissionsManager, PermissionStatus } from '../../services/permissions/permissionManager';

// // ── Utils ────────────────────────────────────────────────────────────────────
// import LocationService from '../../hooks/LocationModule.android';

// const Stack = createNativeStackNavigator();

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN STACK NAVIGATOR
// // ═════════════════════════════════════════════════════════════════════════════

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
// // MAIN SCREEN NAVIGATION
// // ═════════════════════════════════════════════════════════════════════════════

// const MainScreenNavigation = () => {
//   // ── State ────────────────────────────────────────────────────────────────────
//   const [appState, setAppState] = useState<'loading' | 'ready'>('loading');
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Loading data...');
//   const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('UNKNOWN');
//   const [initialRoute, setInitialRoute] = useState<'Home' | 'CustomerInfoScreen'>('Home');

//   // ── Refs ─────────────────────────────────────────────────────────────────────
//   const hasLoadedOnceRef = useRef(false);
//   const isCheckingRef = useRef(false);
//   const appStateRef = useRef(AppState.currentState);

//   // ── Hooks ────────────────────────────────────────────────────────────────────
//   const { saveToken } = useAuth();
//   const appPermissions = useAppPermissions();
//   const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();
//   const { loadRunnerStatus, loadOrders } = useOrdersContext();

//   // ── Initialize Permissions Manager ───────────────────────────────────────────
//   useEffect(() => {
//     permissionsManager.initialize(appPermissions);
//   }, []);

//   // ── Back Button Handler ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => showPermissionModal
//     );
//     return () => backHandler.remove();
//   }, [showPermissionModal]);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // GET LOCATION COORDINATES
//   // ═════════════════════════════════════════════════════════════════════════════

//   const getLocationCoords = async (): Promise<{ latitude: number; longitude: number } | null> => {
//     try {
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

//   const handlePermissionButtonPress = async () => {
//     logger.log('🔐 [Permission Button] Status:', permissionStatus);

//     // Request appropriate permission based on status
//     let permissionRequested = false;

//     if (permissionStatus === 'NO_PERMISSION') {
//       permissionRequested = await permissionsManager.requestPermission('location');
//     } else if (permissionStatus === 'SERVICES_DISABLED') {
//       permissionRequested = await permissionsManager.requestPermission('locationServices');
//     } else if (permissionStatus === 'NOTIF_DENIED') {
//       permissionRequested = await permissionsManager.requestPermission('notification');
//     }

//     // Re-check permissions after user action
//     logger.log('🔄 Re-checking permissions...');
//     executeAppFlow();
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // MAIN FLOW ORCHESTRATION
//   // ═════════════════════════════════════════════════════════════════════════════

//   const executeAppFlow = async (): Promise<void> => {
//     if (isCheckingRef.current) {
//       logger.log('⏭️ Flow already running');
//       return;
//     }

//     isCheckingRef.current = true;

//     try {
//       setAppState('loading');

//       // ── STEP 1: CHECK PERMISSIONS ────────────────────────────────────────────
//       logger.log('🔐 [Flow] Step 1: Checking Permissions');

//       const status = await permissionsManager.checkAllPermissions();
//       setPermissionStatus(status);

//       if (status !== 'OK') {
//         setShowPermissionModal(true);
//         isCheckingRef.current = false;
//         return;
//       }

//       setShowPermissionModal(false);

//       // ── STEP 2: SAVE NOTIFICATION TOKEN ──────────────────────────────────────
//       logger.log('🔐 [Flow] Step 2: Saving Notification Token');
//       setLoadingMessage('Finalizing setup...');

//       const platform = Platform.OS === 'ios' ? 'runner_ios' : 'runner_android';
//       const token = await NotificationService.getFCMToken();

//       if (token) {
//         await saveToken(token, platform);
//         logger.log('✅ Token saved to backend');
//       }

//       // ── STEP 3: GET RUNNER STATUS ────────────────────────────────────────────
//       logger.log('🔐 [Flow] Step 3: Checking Runner Status');
//       setLoadingMessage('Fetching your status...');

//       const statusRes = await loadRunnerStatus();
//       logger.log('========statusRes========', statusRes);

//       // Check for active assignment
//       if (statusRes?.current_assignment) {
//         logger.log('✅ Active assignment found, routing to CustomerInfoScreen');
//         setInitialRoute('CustomerInfoScreen');
//         setAppState('ready');
//         hasLoadedOnceRef.current = true;
//         isCheckingRef.current = false;
//         return;
//       }

//       // If on duty but no assignment, load orders
//       if (statusRes?.is_on_duty) {
//         logger.log('ℹ️ Runner on duty, loading orders');
//         setLoadingMessage('Loading your orders...');

//         const coords = await getLocationCoords();
//         logger.log('========coords========', coords);

//         if (coords) {
//           const loadedOrders = await loadOrders(coords.latitude, coords.longitude);
//           logger.log('========orders========', loadedOrders);
//         }
//       } else {
//         logger.log('ℹ️ Runner is OFF duty');
//       }

//       setInitialRoute('Home');
//       setAppState('ready');
//       hasLoadedOnceRef.current = true;
//     } catch (error) {
//       logger.error('❌ Flow Error:', error);
//       setInitialRoute('Home');
//       setAppState('ready');
//     } finally {
//       isCheckingRef.current = false;
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // EFFECTS
//   // ═════════════════════════════════════════════════════════════════════════════

//   // Initial Flow on Mount
//   useEffect(() => {
//     logger.log('🚀 [Mount] Starting app flow...');
//     executeAppFlow();
//   }, []);

//   // Recheck on App Foreground
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextState) => {
//       logger.log('📱 App state:', appStateRef.current, '→', nextState);

//       if (
//         appStateRef.current.match(/inactive|background/) &&
//         nextState === 'active'
//       ) {
//         logger.log('🔄 App foreground, checking permissions only');

//         if (hasLoadedOnceRef.current && !isCheckingRef.current) {
//           permissionsManager.checkAllPermissions().then((status) => {
//             setPermissionStatus(status);
//             if (status !== 'OK') {
//               logger.log('⚠️ Permissions changed, showing modal');
//               setShowPermissionModal(true);
//             } else {
//               logger.log('✅ Permissions OK on foreground');
//               setShowPermissionModal(false);
//               setAppState('ready');
//             }
//           });
//         }
//       }

//       appStateRef.current = nextState;
//     });

//     return () => subscription.remove();
//   }, []);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════════════════════

//   if (appState === 'loading' && !showPermissionModal) {
//     return <LoadingScreen message={loadingMessage} />;
//   }

//   if (showPermissionModal) {
//     const modalConfig = permissionsManager.getModalConfig(permissionStatus);

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

//   return (
//     <NotificationProvider>
//       <MainStackNavigator initialRoute={initialRoute} />
//     </NotificationProvider>
//   );
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // EXPORT
// // ═════════════════════════════════════════════════════════════════════════════

// const MainScreenNavigationWithNotifications = () => {
//   return <MainScreenNavigation />;
// };

// export default MainScreenNavigationWithNotifications;


import { AppState, BackHandler, Platform } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { logger } from '../../utils/logger';

// ── Services ─────────────────────────────────────────────────────────────────
import NotificationService from '../../services/NotificationService/NotificationService';

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
import { NotificationProvider } from '../../context/NotificationProvider';

// ── Permissions Manager ──────────────────────────────────────────────────────
import { permissionsManager, PermissionStatus } from '../../services/permissions/permissionManager';

// ── Utils ────────────────────────────────────────────────────────────────────
import LocationService from '../../hooks/LocationModule.android';

const Stack = createNativeStackNavigator();

// ✅ TIMEOUT CONSTANTS
const API_TIMEOUT = 15000; // 15 seconds
const FLOW_TIMEOUT = 30000; // 30 seconds total

// ═════════════════════════════════════════════════════════════════════════════
// UTILITY: Promise timeout wrapper
// ═════════════════════════════════════════════════════════════════════════════

const promiseWithTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`⏱️ ${label} timeout after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
};

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
  const flowTimeoutRef = useRef<NodeJS.Timeout | null>(null); // ✅ NEW: Track flow timeout
  const abortControllerRef = useRef<AbortController>(new AbortController()); // ✅ NEW: Abort ongoing requests

  // ── Hooks ────────────────────────────────────────────────────────────────────
  const { saveToken } = useAuth();
  const appPermissions = useAppPermissions();
  const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();
  const { loadRunnerStatus, loadOrders } = useOrdersContext();

  // ── Initialize Permissions Manager ───────────────────────────────────────────
  useEffect(() => {
    permissionsManager.initialize(appPermissions);
  }, []);

  // ── Back Button Handler ──────────────────────────────────────────────────────
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => showPermissionModal
    );
    return () => backHandler.remove();
  }, [showPermissionModal]);

  // ═════════════════════════════════════════════════════════════════════════════
  // GET LOCATION COORDINATES
  // ═════════════════════════════════════════════════════════════════════════════

  const getLocationCoords = async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      logger.log('📍 [Step 3] Getting location coordinates...');
      setLoadingMessage('Getting your location...');

      if (Platform.OS === 'android') {
        const locationData = await promiseWithTimeout(
          LocationService.getCurrentLocation(),
          API_TIMEOUT,
          'Android location fetch'
        );
        logger.log('✅ [Step 3] Android location:', locationData);
        return {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };
      }

      const location = await promiseWithTimeout(
        fetchIOSLocation(),
        API_TIMEOUT,
        'iOS location fetch'
      );
      logger.log('✅ [Step 3] iOS location:', location);
      return location;
    } catch (error) {
      logger.error('❌ [Step 3] Error getting location:', error);
      return null; // ✅ Return null instead of throwing — allows flow to continue
    }
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // HANDLE PERMISSION BUTTON PRESS
  // ═════════════════════════════════════════════════════════════════════════════

  const handlePermissionButtonPress = async () => {
    logger.log('🔐 [Permission Button] Status:', permissionStatus);

    // Request appropriate permission based on status
    let permissionRequested = false;

    if (permissionStatus === 'NO_PERMISSION') {
      permissionRequested = await permissionsManager.requestPermission('location');
    } else if (permissionStatus === 'SERVICES_DISABLED') {
      permissionRequested = await permissionsManager.requestPermission('locationServices');
    } else if (permissionStatus === 'NOTIF_DENIED') {
      permissionRequested = await permissionsManager.requestPermission('notification');
    }

    // Re-check permissions after user action
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
    abortControllerRef.current = new AbortController(); // ✅ NEW: Fresh abort controller

    // ✅ NEW: Set overall flow timeout
    flowTimeoutRef.current = setTimeout(() => {
      logger.warn('⏱️ Flow timeout after', FLOW_TIMEOUT, 'ms — proceeding to Home');
      setAppState('ready');
      setInitialRoute('Home');
      isCheckingRef.current = false;
    }, FLOW_TIMEOUT);

    try {
      setAppState('loading');

      // ── STEP 1: CHECK PERMISSIONS ────────────────────────────────────────────
      logger.log('🔐 [Flow] Step 1: Checking Permissions');
      setLoadingMessage('Checking permissions...');

      const status = await promiseWithTimeout(
        permissionsManager.checkAllPermissions(),
        API_TIMEOUT,
        'Permission check'
      );
      setPermissionStatus(status);

      if (status !== 'OK') {
        logger.log('❌ Permissions not OK:', status);
        setShowPermissionModal(true);
        isCheckingRef.current = false;
        return;
      }

      setShowPermissionModal(false);
      logger.log('✅ Permissions OK');

      // ── STEP 2: SAVE NOTIFICATION TOKEN ──────────────────────────────────────
      logger.log('🔐 [Flow] Step 2: Saving Notification Token');
      setLoadingMessage('Finalizing setup...');

      try {
        const platform = Platform.OS === 'ios' ? 'runner_ios' : 'runner_android';
        const token = await promiseWithTimeout(
          NotificationService.getFCMToken(),
          API_TIMEOUT,
          'FCM token fetch'
        );

        if (token) {
          await promiseWithTimeout(
            saveToken(token, platform),
            API_TIMEOUT,
            'Token save'
          );
          logger.log('✅ Token saved to backend');
        }
      } catch (tokenError) {
        logger.warn('⚠️ Token save failed (non-critical):', tokenError);
        // Don't block flow if token fails — it's optional
      }

      // ── STEP 3: GET RUNNER STATUS ────────────────────────────────────────────
      logger.log('🔐 [Flow] Step 3: Checking Runner Status');
      setLoadingMessage('Fetching your status...');

      const statusRes = await promiseWithTimeout(
        (() => {
          // Wrap in function to allow abort signal if needed
          const promise = Promise.resolve(null);
          return loadRunnerStatus() || promise;
        })(),
        API_TIMEOUT,
        'Runner status fetch'
      );
      logger.log('========statusRes========', statusRes);

      // Check for active assignment
      if (statusRes?.current_assignment) {
        logger.log('✅ Active assignment found, routing to CustomerInfoScreen');
        setInitialRoute('CustomerInfoScreen');
        setAppState('ready');
        hasLoadedOnceRef.current = true;
        isCheckingRef.current = false;
        if (flowTimeoutRef.current) clearTimeout(flowTimeoutRef.current);
        return;
      }

      // If on duty but no assignment, load orders
      if (statusRes?.is_on_duty) {
        logger.log('ℹ️ Runner on duty, loading orders');
        setLoadingMessage('Loading your orders...');

        const coords = await getLocationCoords();
        logger.log('========coords========', coords);

        if (coords) {
          try {
            const loadedOrders = await promiseWithTimeout(
              loadOrders(coords.latitude, coords.longitude),
              API_TIMEOUT,
              'Orders fetch'
            );
            logger.log('========orders========', loadedOrders);
          } catch (orderError) {
            logger.warn('⚠️ Orders fetch failed:', orderError);
            // Continue anyway — show empty orders
          }
        }
      } else {
        logger.log('ℹ️ Runner is OFF duty');
      }

      setInitialRoute('Home');
      setAppState('ready');
      hasLoadedOnceRef.current = true;
    } catch (error) {
      logger.error('❌ Flow Error:', error);
      setInitialRoute('Home');
      setAppState('ready');
    } finally {
      isCheckingRef.current = false;
      if (flowTimeoutRef.current) clearTimeout(flowTimeoutRef.current);
    }
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═════════════════════════════════════════════════════════════════════════════

  // Initial Flow on Mount
  useEffect(() => {
    logger.log('🚀 [Mount] Starting app flow...');
    executeAppFlow();

    // ✅ NEW: Cleanup on unmount
    return () => {
      if (flowTimeoutRef.current) {
        clearTimeout(flowTimeoutRef.current);
      }
      abortControllerRef.current.abort();
    };
  }, []);

  // Recheck on App Foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      logger.log('📱 App state:', appStateRef.current, '→', nextState);

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        logger.log('🔄 App foreground, checking permissions only');

        if (hasLoadedOnceRef.current && !isCheckingRef.current) {
          permissionsManager.checkAllPermissions().then((status) => {
            setPermissionStatus(status);
            if (status !== 'OK') {
              logger.log('⚠️ Permissions changed, showing modal');
              setShowPermissionModal(true);
            } else {
              logger.log('✅ Permissions OK on foreground');
              setShowPermissionModal(false);
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

  if (appState === 'loading' && !showPermissionModal) {
    return <LoadingScreen message={loadingMessage} />;
  }

  if (showPermissionModal) {
    const modalConfig = permissionsManager.getModalConfig(permissionStatus);

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

  return (
    <NotificationProvider>
      <MainStackNavigator initialRoute={initialRoute} />
    </NotificationProvider>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═════════════════════════════════════════════════════════════════════════════

const MainScreenNavigationWithNotifications = () => {
  return <MainScreenNavigation />;
};

export default MainScreenNavigationWithNotifications;