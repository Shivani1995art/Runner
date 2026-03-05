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
import { useSocket } from './src/hooks/useSocketListener'
import { SOCKET_CONFIG } from './src/Config/socket'
import { SocketProvider } from './src/context/SocketProvider'
import LoadingScreen from './src/components/modals/Loadingscreen'


const App = () => {

//  const { user, isLogin } = useAuth();

//    const { connect, disconnect, isConnected, getState } = useSocket({
//     url: SOCKET_CONFIG.getUrl(),
//     userId: user?.id,
//     userToken: user?.token,
//     autoConnect: true,
//     onConnect: () => {
//       console.log('✅ Socket connected');
//     },
//     onDisconnect: () => {
//       console.log('❌ Socket disconnected');
//     },
//     onError: (error) => {
//       console.error('❌ Socket error:', error);
//     },
//   });


//   // Connect when user logs in
//   useEffect(() => {
//     if (isLogin && user) {
//       connect();
//     } else {
//       disconnect();
//     }
//   }, [isLogin, user]);

  return (
    <GestureHandlerRootView style={styles.AppContainer}>
      {/* <StatusBar barStyle="dark-content"
        hidden
      /> */}
       <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* <Routes /> */}
       <NetworkProvider>
        <AuthProvider>
           <SocketProvider>
          <LoaderProvider>
             <ToastProvider>
              <KeyboardProvider>
              {/* <LoadingScreen message="Loading your orders..." /> */}
    <Routes />
</KeyboardProvider>
 
            <Toast />
             </ToastProvider>
          
          </LoaderProvider>
           </SocketProvider>
        </AuthProvider>
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