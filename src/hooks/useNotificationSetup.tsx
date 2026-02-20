import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useAppPermissions } from '../hooks/useAppPermissions';

const useNotificationSetup = (
  isLogin: boolean | null,
  onToken: (token: string) => void
) => {

  const { requestNotificationPermission } = useAppPermissions();

  useEffect(() => {
    if (!isLogin) return;

    const setup = async () => {
      const granted = await requestNotificationPermission();
      if (!granted) return;

      const token = await messaging().getToken();
      if (token) {
        onToken(token); // 🔥 delegate to auth
      }
    };

    setup();

    const unsubscribe = messaging().onTokenRefresh((newToken) => {
      onToken(newToken);
    });

    return unsubscribe;

  }, [isLogin]);
};

export default useNotificationSetup;
