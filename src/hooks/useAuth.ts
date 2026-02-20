// import { useContext } from 'react';
// import { setToken } from '../utils/token';
// import { logger } from '../utils/logger';
// import { LoaderContext } from '../context/LoaderContext';
// import { ForgotPasswordPayload, LoginPayload, SetNewPasswordPayload, VerfiyForgotPasswordOtp } from '../services/auth/auth.types';
// import { forgotPassword, login, LOGOUT, setNewPassword, verifyForgotPasswordOtp } from '../services/auth/auth.api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Platform } from 'react-native';
// import { AuthContext } from '../context/AuthContext';

// export const useAuth = () => {
//   const { show, hide } = useContext(LoaderContext);
// const { logout } = useContext(AuthContext);
//   const loginUser = async (payload: LoginPayload) => {
//     try {
//       show();
//       const response = await login(payload);
//       await setToken(response.token);
//       return response;
//     } catch (error) {
//       logger.error('login error:', error);
//       throw error;
//     } finally {
//       hide();
//     }
//   };

//   const forgotPasswordAuth = async (payload: ForgotPasswordPayload) => {
//     try {
//       show();
//       logger.log("==============payload==============", payload);
//       const response = await forgotPassword(payload);
//       return response;
//     } finally {
//       hide();
//     }
//   };

//   const verifyForgotOtpAuth = async (payload: VerfiyForgotPasswordOtp) => {
//     try {
//       show();
//       const response = await verifyForgotPasswordOtp(payload);
//       return response;
//     } finally {
//       hide();
//     }
//   };

//   const setNewPasswordAuth = async (payload: SetNewPasswordPayload) => {
//     try {
//       show();
//       logger.log("==============payload==============", payload);
//       const response = await setNewPassword(payload);
//       logger.log("==============response==============", response);
//       return response;
//     } finally {
//       hide();
//     }
//   };

//   const logoutUser = async (token: string, platform: 'ios' | 'android') => {
//   try {
//     show();
// logger.log("==============token==============", token);
// logger.log("==============platform==============", platform);
//     // call backend logout
//     await LOGOUT({
//       device_token: token,
//       platform: platform,
//     });

//   } catch (error) {
//     logger.error('logout error:', error);
//   } finally {
//     // clear token
//     logger.log("==============logout called==============");
//       await logout?.();
  
//     hide();
//   }
// };


//   return {
//     loginUser,
//     forgotPasswordAuth,
//     verifyForgotOtpAuth,
//     setNewPasswordAuth,
//     logoutUser,
//   };
// };
import { useContext } from 'react';
import { setToken } from '../utils/token';
import { logger } from '../utils/logger';
import { LoaderContext } from '../context/LoaderContext';
import { ForgotPasswordPayload, LoginPayload, SetNewPasswordPayload, VerfiyForgotPasswordOtp } from '../services/auth/auth.types';
import { forgotPassword, login, LOGOUT, saveTokenToBackend, setNewPassword, verifyForgotPasswordOtp } from '../services/auth/auth.api';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useToast } from './ToastProvider';

export const useAuth = () => {
  const { show, hide }  = useContext(LoaderContext);
  const { logout }      = useContext(AuthContext);
  const { toast }       = useToast();

  // ── loginUser ───────────────────────────────────────────────────────────────
  // res: { success, message, token, data: { runner } }
  // ─────────────────────────────────────────────────────────────────────────────
  const loginUser = async (payload: LoginPayload) => {
    try {
      show();
      const res = await login(payload);
     // logger.log('loginUser res:', res);

      if (res?.success) {
        await setToken(res.token);
        return res; // { runner }
      }
    } catch (error) {
      logger.error('login error:', error);
      throw error;
    } finally {
      hide();
    }
  };

  // ── forgotPassword ──────────────────────────────────────────────────────────
  // res: { success, message }
  // ─────────────────────────────────────────────────────────────────────────────
  const forgotPasswordAuth = async (payload: ForgotPasswordPayload) => {
    try {
      show();
      logger.log('forgotPasswordAuth payload:', payload);
      const res = await forgotPassword(payload);
      logger.log('forgotPasswordAuth res:', res);

      if (res?.success) {
        toast(res?.message || 'OTP sent successfully', 'success', 3000);
        return res.data;
      }
    } catch (error) {
      logger.error('forgotPassword error:', error);
      throw error;
    } finally {
      hide();
    }
  };

  // ── verifyForgotOtp ─────────────────────────────────────────────────────────
  // res: { success, message, data }
  // ─────────────────────────────────────────────────────────────────────────────
  const verifyForgotOtpAuth = async (payload: VerfiyForgotPasswordOtp) => {
    try {
      show();
      const res = await verifyForgotPasswordOtp(payload);
      logger.log('verifyForgotOtpAuth res:', res);

      if (res?.success) {
        return res.data;
      }
    } catch (error) {
      logger.error('verifyForgotOtp error:', error);
      throw error;
    } finally {
      hide();
    }
  };

  // ── setNewPassword ──────────────────────────────────────────────────────────
  // res: { success, message }
  // ─────────────────────────────────────────────────────────────────────────────
  const setNewPasswordAuth = async (payload: SetNewPasswordPayload) => {
    try {
      show();
      logger.log('setNewPasswordAuth payload:', payload);
      const res = await setNewPassword(payload);
      logger.log('setNewPasswordAuth res:', res);

      if (res?.success) {
        toast(res?.message || 'Password updated successfully', 'success', 3000);
        return res.data;
      }
    } catch (error) {
      logger.error('setNewPassword error:', error);
      throw error;
    } finally {
      hide();
    }
  };

  // ── logoutUser ──────────────────────────────────────────────────────────────
  // res: { success, message }
  // ─────────────────────────────────────────────────────────────────────────────
  const logoutUser = async (token: string, platform: 'ios' | 'android') => {
    try {
      show();
      logger.log('logoutUser token:', token);
      logger.log('logoutUser platform:', platform);

      const res = await LOGOUT({ device_token: token, platform });
      if (res?.success) {
        // 2️⃣ Delete FCM token locally (important)
        await messaging().deleteToken();
      }
      logger.log('logoutUser res:', res);
    } catch (error) {
      logger.error('logout error:', error);
    } finally {
      logger.log('logout called — clearing session');
      await logout?.();
      hide();
    }
  };
const saveToken = async (
  token: string,
  platform: 'ios' | 'android'
) => {
  try {
    logger.log('saveToken token:', token);
    logger.log('saveToken platform:', platform);

    const response = await saveTokenToBackend({
      device_token: token,
      platform,
    });

    console.log('saveTokenToBackend response:', response);
  } catch (error) {
    console.log('Error saving token:', error);
  }
};


  return {
    loginUser,
    forgotPasswordAuth,
    verifyForgotOtpAuth,
    setNewPasswordAuth,
    logoutUser,
  };
};