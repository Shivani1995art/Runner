import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const ONBOARDING_KEY = 'ONBOARDING_VERSION';

export const useBootstrap = () => {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  useEffect(() => {
    bootstrap();
  }, []);
  const bootstrap = async () => {
    try {
      const [
        storedOnboardingVersion,
      ] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_KEY),
      ]);
      const currentVersion = DeviceInfo.getVersion();
    
      
      setHasSeenOnboarding(storedOnboardingVersion === currentVersion);
    } catch (e) {
      setHasSeenOnboarding(true);
    } finally {
      setIsBootstrapping(false);
    }
  };

  return {
    hasSeenOnboarding,
    isBootstrapping,
  };
};
