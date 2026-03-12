// import { StyleSheet, Text, View } from 'react-native'
// import React, { useContext, useEffect } from 'react'
// import { NavigationContainer } from '@react-navigation/native';
// import MainScreenNavigation from './Main/MainScreenNavigation';
// import AuthNavigation from './Auth/AuthNavigation';
// import SplashScreen from '../screens/SplashScreen/SplashScreen';
// import { AuthContext } from '../context/AuthContext';
// import { logger } from '../utils/logger';
// import { useBootstrap } from '../hooks/useBootstrap';
// const Routes = () => {
//     // Grab isLogin (or isAuthenticated) from context
//     const { isLogin } = useContext(AuthContext);
//       const { hasSeenOnboarding } = useBootstrap();
//     const [showSplash, setShowSplash] = React.useState(true);
//     logger.log('===hasSeenOnboarding=====',hasSeenOnboarding)
// logger.log('===isLogin=====',isLogin)
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowSplash(false);
//         }, 500);
//         return () => clearTimeout(timer); // Cleanup timer
//     }, []);

//     // 1. While checking AsyncStorage (isLogin is null), show Splash
//     // 2. While your 3s timer is running, show Splash
//     if (isLogin === null || showSplash) {
//         return <SplashScreen />;
//     }

//     return (
//         <NavigationContainer>
//             {/* Toggle between stacks based on isLogin */}
//             {isLogin ? <MainScreenNavigation /> :<AuthNavigation hasSeenOnboarding={hasSeenOnboarding} />}
//         </NavigationContainer>
//     );
// };

// export default Routes

// const styles = StyleSheet.create({})

// import { StyleSheet } from 'react-native'
// import React, { useContext, useEffect, useState } from 'react'
// import { NavigationContainer } from '@react-navigation/native';
// import MainScreenNavigation from './Main/MainScreenNavigation';
// import AuthNavigation from './Auth/AuthNavigation';
// import SplashScreen from '../screens/SplashScreen/SplashScreen';
// import { AuthContext } from '../context/AuthContext';
// import { logger } from '../utils/logger';
// import { useBootstrap } from '../hooks/useBootstrap';
// import MainScreenNavigationWithNotifications from './Main/MainScreenNavigation';


// const Routes = () => {
//     const { isLogin } = useContext(AuthContext);
//     const { hasSeenOnboarding, isBootstrapping } = useBootstrap();
//     const [minSplashDone, setMinSplashDone] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => setMinSplashDone(true), 100);
//         return () => clearTimeout(timer);
//     }, []);

//     const isLoading = isLogin === null || isBootstrapping || !minSplashDone;
// logger.log('isLogin', isLogin);
//     if (isLoading) {
//         return <SplashScreen />;
//     }

//     return (
//         <NavigationContainer>
//             {isLogin 
//                 ? <MainScreenNavigationWithNotifications />  // ← Use this
//                 : <AuthNavigation hasSeenOnboarding={hasSeenOnboarding} />
//             }
//         </NavigationContainer>
//     );
// };

// export default Routes;

// const styles = StyleSheet.create({});



/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROUTES - NAVIGATION ENTRY POINT
 * 
 * Handles app initialization with proper splash screen management
 * Smooth startup experience with minimum display time
 * ═══════════════════════════════════════════════════════════════════════════
 */

// import React, { useContext, useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { logger } from '../utils/logger';
// import { navigationRef } from '../navigation/NavigationRef';
// // ── Navigation ───────────────────────────────────────────────────────────────
// import MainScreenNavigationWithNotifications from './Main/MainScreenNavigation';
// import AuthNavigation from './Auth/AuthNavigation';

// // ── Context ──────────────────────────────────────────────────────────────────
// import { AuthContext } from '../context/AuthContext';

// // ── Hooks ────────────────────────────────────────────────────────────────────
// import { useBootstrap } from '../hooks/useBootstrap';

// // ── Screens ──────────────────────────────────────────────────────────────────
// import SplashScreen from '../screens/SplashScreen/SplashScreen';

// // ── Managers ─────────────────────────────────────────────────────────────────
// import { splashScreenManager, SplashState } from '../services/splash/splashScreenManager';

// // ═══════════════════════════════════════════════════════════════════════════
// // ROUTES - MAIN NAVIGATION ORCHESTRATOR
// // ═══════════════════════════════════════════════════════════════════════════

// const Routes = () => {
//   // ── Context & Hooks ─────────────────────────────────────────────────────────
//   const { isLogin } = useContext(AuthContext);
//   const { hasSeenOnboarding, isBootstrapping } = useBootstrap();

//   // ── State ────────────────────────────────────────────────────────────────────
//   const [splashVisible, setSplashVisible] = useState(true);
//   const [appReady, setAppReady] = useState(false);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // INITIALIZATION EFFECT - Run once on app start
//   // ═════════════════════════════════════════════════════════════════════════════

//   useEffect(() => {
//     logger.log('🚀 [Routes] App initialization started');

//     // Start splash screen timer
//     splashScreenManager.start();
//     splashScreenManager.setState(SplashState.INITIAL, 'Starting app...');

//     // Wait for bootstrap to complete
//     const checkBootstrap = async () => {
//       if (isBootstrapping) {
//         logger.log('⏳ [Routes] Waiting for bootstrap...');
//         splashScreenManager.setState(
//           SplashState.BOOTSTRAPPING,
//           'Loading app data...'
//         );
//         return; // Will be called again when bootstrapping changes
//       }

//       logger.log('✅ [Routes] Bootstrap complete');

//       // Check auth status
//       if (isLogin === null) {
//         logger.log('🔐 [Routes] Checking auth status...');
//         splashScreenManager.setState(SplashState.CHECKING_AUTH, 'Verifying login...');
//         return; // Will be called again when isLogin changes
//       }

//       logger.log(`🎯 [Routes] Ready: isLogin=${isLogin}`);

//       // App is ready!
//       await splashScreenManager.markReady();
//       setAppReady(true);
//       setSplashVisible(false);

//       logger.log('✨ [Routes] App is ready to display');
//     };

//     checkBootstrap();
//   }, [isBootstrapping, isLogin]);

//   // ═════════════════════════════════════════════════════════════════════════════
//   // RENDER LOGIC
//   // ═════════════════════════════════════════════════════════════════════════════

//   // Show splash while loading
//   if (splashVisible) {
//     logger.log(`🎬 [RENDER] Splash screen visible (state: ${splashScreenManager.getState()})`);
//     return <SplashScreen />;
//   }

//   // Show app when ready
//   if (appReady) {
//     logger.log(`✅ [RENDER] App ready - isLogin: ${isLogin}`);

//     return (
//       <NavigationContainer ref={navigationRef}>
//         {isLogin 
//           ? <MainScreenNavigationWithNotifications />
//           : <AuthNavigation hasSeenOnboarding={hasSeenOnboarding} />
//         }
//       </NavigationContainer>
//     );
//   }

  
//   // Fallback (shouldn't reach here, but just in case)
//   logger.log('⚠️ [RENDER] Unexpected state, showing splash');
//   return <SplashScreen />;
// };

// export default Routes;

import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { logger } from '../utils/logger';

// ── Navigation ───────────────────────────────────────────────────────────────
import MainScreenNavigationWithNotifications from './Main/MainScreenNavigation';
import AuthNavigation from './Auth/AuthNavigation';

// ── Context ──────────────────────────────────────────────────────────────────
import { AuthContext } from '../context/AuthContext';

// ── Hooks ────────────────────────────────────────────────────────────────────
import { useBootstrap } from '../hooks/useBootstrap';

// ── Screens ──────────────────────────────────────────────────────────────────
import SplashScreen from '../screens/SplashScreen/SplashScreen';

// ── Managers ─────────────────────────────────────────────────────────────────
import { splashScreenManager, SplashState } from '../services/splash/splashScreenManager';
import { setAuthContextRef, setNavigationRef } from '../api/axios';

// ✅ NEW: Import API client setup


// ═══════════════════════════════════════════════════════════════════════════
// ROUTES - MAIN NAVIGATION ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

const Routes = () => {
  // ── Context & Hooks ─────────────────────────────────────────────────────────
  const authContext = useContext(AuthContext);
  const { isLogin } = authContext || {};
  const { hasSeenOnboarding, isBootstrapping } = useBootstrap();

  // ── State ────────────────────────────────────────────────────────────────────
  const [splashVisible, setSplashVisible] = useState(true);
  const [appReady, setAppReady] = useState(false);
  
  const navigationRef = React.useRef(null);

  // ═════════════════════════════════════════════════════════════════════════════
  // SETUP: Set API client handlers
  // ═════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    // ✅ Set AuthContext reference for API interceptor
    if (authContext) {
      setAuthContextRef(authContext);
      logger.log("✅ AuthContext reference set for API client");
    }

    // ✅ Set Navigation reference for API interceptor
    if (navigationRef.current) {
      setNavigationRef(navigationRef.current);
      logger.log("✅ Navigation reference set for API client");
    }
  }, [authContext]);

  // ═════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION EFFECT - Run once on app start
  // ═════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    logger.log('🚀 [Routes] App initialization started');

    // Start splash screen timer
    splashScreenManager.start();
    splashScreenManager.setState(SplashState.INITIAL, 'Starting app...');

    // Wait for bootstrap to complete
    const checkBootstrap = async () => {
      if (isBootstrapping) {
        logger.log('⏳ [Routes] Waiting for bootstrap...');
        splashScreenManager.setState(
          SplashState.BOOTSTRAPPING,
          'Loading app data...'
        );
        return; // Will be called again when bootstrapping changes
      }

      logger.log('✅ [Routes] Bootstrap complete');

      // Check auth status
      if (isLogin === null) {
        logger.log('🔐 [Routes] Checking auth status...');
        splashScreenManager.setState(SplashState.CHECKING_AUTH, 'Verifying login...');
        return; // Will be called again when isLogin changes
      }

      logger.log(`🎯 [Routes] Ready: isLogin=${isLogin}`);

      // App is ready!
      await splashScreenManager.markReady();
      setAppReady(true);
      setSplashVisible(false);

      logger.log('✨ [Routes] App is ready to display');
    };

    checkBootstrap();
  }, [isBootstrapping, isLogin]);

  // ═════════════════════════════════════════════════════════════════════════════
  // RENDER LOGIC
  // ═════════════════════════════════════════════════════════════════════════════

  // Show splash while loading
  if (splashVisible) {
    logger.log(`🎬 [RENDER] Splash screen visible (state: ${splashScreenManager.getState()})`);
    return <SplashScreen />;
  }

  // Show app when ready
  if (appReady) {
    logger.log(`✅ [RENDER] App ready - isLogin: ${isLogin}`);

    return (
      <NavigationContainer ref={navigationRef}>
        {isLogin 
          ? <MainScreenNavigationWithNotifications />
          : <AuthNavigation hasSeenOnboarding={hasSeenOnboarding} />
        }
      </NavigationContainer>
    );
  }

  // Fallback (shouldn't reach here, but just in case)
  logger.log('⚠️ [RENDER] Unexpected state, showing splash');
  return <SplashScreen />;
};

export default Routes;