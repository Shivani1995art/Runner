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

import { StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import MainScreenNavigation from './Main/MainScreenNavigation';
import AuthNavigation from './Auth/AuthNavigation';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import { AuthContext } from '../context/AuthContext';
import { logger } from '../utils/logger';
import { useBootstrap } from '../hooks/useBootstrap';

const Routes = () => {
    const { isLogin } = useContext(AuthContext);
    const { hasSeenOnboarding, isBootstrapping } = useBootstrap();
    
    // Minimum splash display time to avoid flicker
    const [minSplashDone, setMinSplashDone] = useState(false);

    logger.log('===hasSeenOnboarding=====', hasSeenOnboarding);
    logger.log('===isLogin=====', isLogin);
    logger.log('===isBootstrapping=====', isBootstrapping);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinSplashDone(true);
        }, 100); // Minimum 1.5s splash time
        return () => clearTimeout(timer);
    }, []);

    // Show splash while:
    // 1. Auth state is still loading (isLogin === null)
    // 2. Bootstrap is still running (isBootstrapping === true)
    // 3. Minimum splash duration hasn't passed (minSplashDone === false)
    const isLoading = isLogin === null || isBootstrapping || !minSplashDone;

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            {isLogin 
                ? <MainScreenNavigation /> 
                : <AuthNavigation hasSeenOnboarding={hasSeenOnboarding} />
            }
        </NavigationContainer>
    );
};

export default Routes;

const styles = StyleSheet.create({});