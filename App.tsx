import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SplashScreen from './src/screens/SplashScreen/SplashScreen'
import Routes from './src/navigation/Routes'
import OnBoardingScreen from './src/screens/OnBoarding/OnBoardingScreen'
import { AuthProvider } from './src/context/AuthContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message'
import { LoaderProvider } from './src/context/LoaderContext'
import { NetworkProvider } from './src/context/NetworkProvider'
import { ToastProvider } from './src/hooks/ToastProvider'
const App = () => {
  return (
    <GestureHandlerRootView style={styles.AppContainer}>
      <StatusBar barStyle="dark-content"
        hidden
      />
      {/* <Routes /> */}
       <NetworkProvider>
        <AuthProvider>
          <LoaderProvider>
             <ToastProvider>
  <Routes />
            <Toast />
             </ToastProvider>
          
          </LoaderProvider>
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