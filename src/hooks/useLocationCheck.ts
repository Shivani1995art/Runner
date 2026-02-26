import { Platform } from 'react-native';
import { useUserLocation } from './useUserLocation';
import LocationService from './LocationModule.android';
import { logger } from '../utils/logger';

export const useLocationCheck = () => {
  const { refetch: fetchIOSLocation } = useUserLocation();

  const fetchLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const locationData = await LocationService.getCurrentLocation();
        return { latitude: locationData.latitude, longitude: locationData.longitude };
      }
      return await fetchIOSLocation(); // already handles permission internally
    } catch (error) {
      logger.error('fetchLocation error:', error);
      return null;
    }
  };

  return { fetchLocation };
};