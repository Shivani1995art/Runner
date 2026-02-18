// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import HomeScreen from '../../screens/HomeScreen/HomeScreen';
// import ProfileScreen from '../../screens/Profile/ProfileScreen';
// import OrderHistory from '../../screens/OrderHistory/OrderHistory';
// import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
// import HelpScreen from '../../screens/Profile/HelpScreen';
// import EditProfileScreen from '../../components/modals/EditProfileScreen';


// const Stack = createNativeStackNavigator();
// const MainScreenNavigation = () => {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }} 
//     >
//     <Stack.Screen name ="Home" component={HomeScreen} />
//     <Stack.Screen name ="ProfileScreen" component={ProfileScreen} />
//     <Stack.Screen name ="OrderHistory" component={OrderHistory} />
//     <Stack.Screen name ="HelpScreen" component={HelpScreen} />
//     <Stack.Screen name ="EditProfileScreen" component={EditProfileScreen} />
//     <Stack.Screen  name ="CustomerInfoScreen" component={CustomerInfoScreen} />
//     </Stack.Navigator>
     

//   )
// }

// export default MainScreenNavigation

// const styles = StyleSheet.create({})

import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getRunnerStatus } from '../../services/Orders/order.api';
import { logger } from '../../utils/logger';

import SplashScreen from '../../screens/SplashScreen/SplashScreen'; // 👈 added
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../../screens/Profile/ProfileScreen';
import OrderHistory from '../../screens/OrderHistory/OrderHistory';
import CustomerInfoScreen from '../../screens/Customer/CustomerInfoScreen';
import HelpScreen from '../../screens/Profile/HelpScreen';
import EditProfileScreen from '../../components/modals/EditProfileScreen';

const Stack = createNativeStackNavigator();

const AppBootstrap = ({ navigation }) => {
  useEffect(() => {
    const check = async () => {
      try {
        const status = await getRunnerStatus();
        logger.log('AppBootstrap status:', status);

        if (status?.data?.current_assignment) {
          navigation.replace('CustomerInfoScreen', {
            order: status.data.current_assignment,
          });
        } else {
          navigation.replace('Home');
        }
      } catch (e) {
        logger.log('AppBootstrap error:', e);
        navigation.replace('Home');
      }
    };

    check();
  }, [navigation]);

  return <SplashScreen />; // 👈 changed: show branded splash instead of blank screen
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
