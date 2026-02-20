import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
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
import useNotificationSetup from '../../hooks/useNotificationSetup';
import { saveFCMToken } from '../../utils/token';
import { useAppPermissions } from '../../hooks/useAppPermissions';
import messaging from '@react-native-firebase/messaging';
const Stack = createNativeStackNavigator();
const checkPermission = async () => {
  const authStatus = await messaging().hasPermission();
  
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    return true;
  } else {
    console.log('Permissions are NOT enabled');
    return false;
  }
};
const AppBootstrap = ({ navigation }) => {
   const { checkNotificationPermission, checkLocationPermission } = useAppPermissions()
  useEffect(() => {
    const check = async () => {
      try {
        const res = await getRunnerStatus();
        logger.log('AppBootstrap status res:', res);

        const status = res?.success ? res.data : null;

        // If active assignment exists → go directly to CustomerInfoScreen
        if (status?.current_assignment) {
          navigation.replace('CustomerInfoScreen', {
            order: status.current_assignment,
          });
        } else {
          // Otherwise → go to Home and pass the status data to avoid re-fetch
          navigation.replace('Home', {
            initialStatus: status, // ← pass status to Home
          });
        }
      } catch (e) {
        logger.log('AppBootstrap error:', e);
        navigation.replace('Home');
      }
    };

    check();
  }, [navigation]);


  // useNotificationSetup(true, async (token) => {
  //   logger.log('MainScreenNavigation token:', token);
  //    // const hasPermission = await checkPermission()
  //    // if (hasPermission) {
  //         await saveFCMToken(token);
  //   //  }
  //   });

  return <SplashScreen />;
};

const MainScreenNavigation = () => {
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
    </Stack.Navigator>
  )
}

export default MainScreenNavigation

const styles = StyleSheet.create({})