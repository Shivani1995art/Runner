import { Dimensions, Platform } from 'react-native';

const getAndroidNavBarHeight = () => {
  if (Platform.OS !== 'android') return 0;

  const screenHeight = Dimensions.get('screen').height;
  const windowHeight = Dimensions.get('window').height;

  const navigationBarHeight = screenHeight - windowHeight;

  // ✅ Only return positive values
  const finalHeight = navigationBarHeight > 0 ? navigationBarHeight : 0;

  console.log('navigationBarHeight:', finalHeight);

  return finalHeight;
};

export const navBarHeight = getAndroidNavBarHeight();