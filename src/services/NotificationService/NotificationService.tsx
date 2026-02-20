import messaging from '@react-native-firebase/messaging';

class NotificationService {

  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }

  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.log('Error getting FCM token:', error);
      return null;
    }
  }

  async deleteToken() {
    await messaging().deleteToken();
  }

  onTokenRefresh(callback: (token: string) => void) {
    return messaging().onTokenRefresh(callback);
  }
}

export default new NotificationService();
