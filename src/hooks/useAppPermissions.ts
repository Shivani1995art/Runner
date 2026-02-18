import { Alert, Linking, Platform } from 'react-native';
import {
  openSettings,
  PERMISSIONS,
  request,
  requestNotifications,
  RESULTS,
  check,
  checkNotifications,
} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
export const useAppPermissions = () => {
  const checkNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      return true;
    }

    const { status } = await checkNotifications();
    return status === RESULTS.GRANTED;
  };
  const isLocationEnabled = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const enableResult = await promptForEnableLocationIfNeeded();
      return true;
    } catch (e) {
      return false;
    }
  };


  const checkLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);
    return result === RESULTS.GRANTED;
  };
  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version < 33) {
        // await enableNotification({ notification_enabled: true });
        return true;
      }

      const { status } = await requestNotifications(['alert', 'sound', 'badge']);

      if (status === RESULTS.GRANTED) {
        //await enableNotification({ notification_enabled: true });
        return true;
      }

      if (status === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications from settings',
          [{ text: 'Open Settings', onPress: () => openSettings(), }]
        );
      }

      // await enableNotification({ notification_enabled: false });
      return false;
    } catch {
      //  await enableNotification({ notification_enabled: false });
      return false;
    }
  };
  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      // Just request the permission
      const result = await request(permission);
      logger.log('Permission result:', result);

      if (result !== RESULTS.GRANTED) {
        if (result === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Required',
            'Please enable location from settings',
            [{ text: 'Open Settings', onPress:()=> openSettings() }]
          );
        }
        return false;
      }

      // ✅ Permission granted - DON'T prompt for GPS here
      return true;
    } catch (error) {
      logger.log('Location permission error:', error);
      return false;
    }
  };
  // const isLocationServicesEnabled = async () => {
  //   logger.log("is location service on==>")
  //   return new Promise((resolve) => {
  //     Geolocation.getCurrentPosition(
  //       () => resolve(true),
  //       (error) => {
  //         // Error code 2 = Location services disabled
  //           logger.log("error code in geolocation",error)
  //         if (error.code === 2) {
  //           logger.log("error  code==>",error.code)
  //           resolve(false);
  //         } else {
  //           logger.log("error  code==>",error.code)
  //           resolve(true); // Permission issue, not services disabled
  //         }
  //       },
  //       { timeout: 1000, maximumAge: 0, enableHighAccuracy: false }
  //     );
  //   });
  // };
  const requestLocationServices = async () => {
    if (Platform.OS === 'android') {
      try {
        logger.log('Attempting to enable location services...');
  
        await promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        });
  
        logger.log('Location services enabled successfully');
        return true;
      } catch (e) {
        logger.log('GPS enable error:', e);
  
        if (e?.code === 'ERR_ALREADY_ENABLED' || e?.message?.includes('already')) {
          logger.log('GPS already enabled');
          return true;
        }
  
        logger.log('User declined GPS enable');
        return false;
      }
    }
  
    // iOS: Just check, don't show alert (modal handles this)
    if (Platform.OS === 'ios') {
      const servicesEnabled = await isLocationServicesEnabled();

      logger.log("is service on==>",servicesEnabled)
      return servicesEnabled;
    }
  
    return true;
  };

// const ensureLocationAccess = async () => {
//   logger.log('ensureLocationAccess called');

//   // 1️⃣ FIRST: Check app permission
//   const hasPermission = await checkLocationPermission();
//   if (!hasPermission) {
//     return { status: 'NO_PERMISSION' };
//   }

//   // 2️⃣ SECOND: Check if location services are enabled (both iOS and Android)
//   const servicesEnabled = await isLocationServicesEnabled();
//   logger.log('Location services enabled:', servicesEnabled);
  
//   if (!servicesEnabled) {
//     return { status: 'SERVICES_DISABLED' };
//   }

//   return { status: 'OK' };
// };
// useAppPermissions.js - Key fixes

const isLocationServicesEnabled = async () => {
  if (Platform.OS === 'android') {
    // Android: Use your existing geolocation check
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        () => resolve(true),
        (error) => {
          logger.log("error code in geolocation", error);
          resolve(error.code !== 2);
        },
        { timeout: 1000, maximumAge: 0, enableHighAccuracy: false }
      );
    });
  }

  // iOS: Try to get location to check if services are enabled
  return new Promise((resolve) => {
    logger.log('Checking iOS location services...');
    
    Geolocation.getCurrentPosition(
      (position) => {
        logger.log('iOS location services are enabled');
        resolve(true);
      },
      (error) => {
        logger.log('iOS location services check error:', error);
        logger.log('Error code:', error.code);
        logger.log('Error message:', error.message);
        
        // Error code 1 = Permission denied
        // Error code 2 = Location services disabled  
        if (error.code === 2) {
          logger.log('iOS location services are DISABLED (error code 2)');
          resolve(false);
        } else if (error.code === 1) {
          logger.log('iOS location permission denied (error code 1) - services are likely ON');
          resolve(true);
        } else {
          // Other errors - assume services might be on
          logger.log(`Other iOS location error (code ${error.code}) - assuming services are ON`);
          resolve(true);
        }
      },
      { 
        timeout: 5000, 
        maximumAge: 0, 
        enableHighAccuracy: false 
      }
    );
  });
};

const ensureLocationAccess = async () => {
  logger.log('ensureLocationAccess called');

  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const currentStatus = await check(permission);
  logger.log('Current permission status:', currentStatus);

  // 1️⃣ If never asked, return OK to allow normal request flow
  if (currentStatus === RESULTS.DENIED) {
    return { status: 'OK' }; // Will trigger system prompt
  }

  // 2️⃣ If blocked (user denied in app settings)
  if (currentStatus === RESULTS.BLOCKED) {
    return { status: 'NO_PERMISSION' };
  }

  // 3️⃣ For iOS, check if location services are enabled by trying to get location
  if (Platform.OS === 'ios') {
    const servicesEnabled = await isLocationServicesEnabled();
    
    if (!servicesEnabled) {
      return { status: 'SERVICES_DISABLED' };
    }
  }

  // 4️⃣ For Android, check if services are enabled when permission is granted
  if (Platform.OS === 'android' && currentStatus === RESULTS.GRANTED) {
    const servicesEnabled = await isLocationServicesEnabled();
    
    if (!servicesEnabled) {
      return { status: 'SERVICES_DISABLED' };
    }
  }

  return { status: 'OK' };
};  



  return {
    checkNotificationPermission,
    checkLocationPermission,
    requestNotificationPermission,
    requestLocationPermission,
    isLocationEnabled,
    requestLocationServices,
    ensureLocationAccess
  };
};
