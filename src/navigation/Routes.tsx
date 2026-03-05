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
import MainScreenNavigationWithNotifications from './Main/MainScreenNavigation';


const Routes = () => {
    const { isLogin } = useContext(AuthContext);
    const { hasSeenOnboarding, isBootstrapping } = useBootstrap();
    const [minSplashDone, setMinSplashDone] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMinSplashDone(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const isLoading = isLogin === null || isBootstrapping || !minSplashDone;
logger.log('isLogin', isLogin);
    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            {isLogin 
                ? <MainScreenNavigationWithNotifications />  // ← Use this
                : <AuthNavigation hasSeenOnboarding={hasSeenOnboarding} />
            }
        </NavigationContainer>
    );
};

export default Routes;

const styles = StyleSheet.create({});