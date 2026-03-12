import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from './src/screens/SplashScreen/SplashScreen'
import Routes from './src/navigation/Routes'
import OnBoardingScreen from './src/screens/OnBoarding/OnBoardingScreen'
import { AuthProvider } from './src/context/AuthContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message'
import { LoaderProvider } from './src/context/LoaderContext'
import { NetworkProvider } from './src/context/NetworkProvider'
import { ToastProvider } from './src/hooks/ToastProvider'
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useAuth } from './src/hooks/useAuth'
import { SOCKET_CONFIG } from './src/Config/socket'
import { SocketProvider } from './src/context/SocketProvider'
import LoadingScreen from './src/components/modals/Loadingscreen'
import { OrdersProvider } from './src/context/OrdersContext'
import notifee from '@notifee/react-native';

const App = () => {
useEffect(() => {
  const clearNotifications = async () => {
    await notifee.cancelAllNotifications();
  };

  clearNotifications();
}, []);

  return (
    <GestureHandlerRootView style={styles.AppContainer}>
      {/* <StatusBar barStyle="dark-content"
        hidden
      /> */}
       <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* <Routes /> */}
       <NetworkProvider>
         <ToastProvider>
        <AuthProvider>
           <SocketProvider>

            <OrdersProvider cacheTimeoutMs={30000}>
           
          <LoaderProvider>
            
              <KeyboardProvider>
               {/* <LoadingScreen message="Loading..." /> */}
    <Routes />
</KeyboardProvider>
 
            <Toast />
           
          
          </LoaderProvider>
           </OrdersProvider>
           </SocketProvider>
        </AuthProvider>
        </ToastProvider>
       </NetworkProvider>
      
    </GestureHandlerRootView>
  )
}
export default App
const styles = StyleSheet.create({
  AppContainer: {
    flex: 1,

  }
})