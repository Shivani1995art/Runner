import { Linking } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

type ToastFunction = (
  message: string,
  type?: ToastType,
  duration?: number
) => void;

export const makePhoneCall = async (
  phoneNumber: string,
  label: string = 'Phone',
  toast?: ToastFunction
) => {
  try {
    if (!phoneNumber) {
      toast?.(`Invalid ${label} number`, 'error', 3000);
      return;
    }

    const url = `tel:${phoneNumber}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      toast?.('Phone calls are not supported on this device', 'error', 3000);
      return;
    }

    await Linking.openURL(url);
  } catch (error) {
    toast?.('Unable to make phone call', 'error', 3000);
    console.log('Call error:', error);
  }
};