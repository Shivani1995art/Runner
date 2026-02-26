import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const ONBOARDING_KEY = 'ONBOARDING_VERSION';

export const useBootstrap = () => {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const bootstrap = useCallback(async () => {
    setIsBootstrapping(true);
    try {
      const storedOnboardingVersion = await AsyncStorage.getItem(ONBOARDING_KEY);
      const currentVersion = DeviceInfo.getVersion();
      setHasSeenOnboarding(storedOnboardingVersion === currentVersion);
    } catch (e) {
      setHasSeenOnboarding(true);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, []);

  return {
    hasSeenOnboarding,
    isBootstrapping,
    recheckOnboarding: bootstrap, // ← expose this
  };
};