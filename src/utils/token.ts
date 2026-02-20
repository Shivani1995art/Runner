import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveTokenToBackend } from '../services/auth/auth.api';
import { Platform } from 'react-native';
import { logger } from './logger';

const TOKEN_KEY = 'ACCESS_TOKEN';
const FCM_TOKEN_KEY = 'FCM_TOKEN';

export const getToken = async () => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const setToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const saveFCMToken = async (token: string) => {
  try {
    const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);

    // Optional duplicate protection
    if (storedToken === token){
      logger.log("Same FCM token")
      return;
    }

    const platform =
      Platform.OS === 'ios' ? 'runner_ios' : 'runner_android';

    await saveTokenToBackend({
      device_token: token,
      platform,
    });

    await AsyncStorage.setItem(FCM_TOKEN_KEY, token);

    console.log('FCM Token saved successfully');
  } catch (error) {
    console.log('Error saving FCM token:', error);
  }
};


export const clearFCMToken = async () => {
  await AsyncStorage.removeItem(FCM_TOKEN_KEY);
};