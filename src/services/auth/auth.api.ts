import { apiClient } from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import { logger } from '../../utils/logger';
import {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  VerfiyForgotPasswordOtp,
  SetNewPasswordPayload,
  LogoutPayload,
  SaveDeviceTokenPayload
} from './auth.types';

/* LOGIN */
export const login = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const { data } = await apiClient.post(
    ENDPOINTS.RUNNER_AUTH.LOGIN,
    payload
  );
  //logger.log('login res:', data);
  return data;
};

/* FORGOT PASSWORD */
export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<AuthResponse> => {
  const { data } = await apiClient.post(
    ENDPOINTS.RUNNER_AUTH.FORGOT_PASSWORD,
    payload
  );
  return data;
};

/* VERIFY FORGOT OTP */
export const verifyForgotPasswordOtp = async (
  payload: VerfiyForgotPasswordOtp
): Promise<AuthResponse> => {
  const { data } = await apiClient.post(
    ENDPOINTS.RUNNER_AUTH.VERIFY_FORGOT_OTP,
    payload
  );
  return data;
};

/* SET NEW PASSWORD */
export const setNewPassword = async (
  payload: SetNewPasswordPayload
): Promise<AuthResponse> => {
  const { data } = await apiClient.post(
    ENDPOINTS.RUNNER_AUTH.SET_NEW_PASSWORD,
    payload
  );
  return data;
};

/* LOGOUT */
export const LOGOUT = async (payload: LogoutPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post(
    ENDPOINTS.RUNNER_AUTH.LOGOUT,
    payload   // send body here
  );
  return data;
};


/* saveTokenToBackend */
export const saveTokenToBackend = async (payload: SaveDeviceTokenPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post(
    ENDPOINTS.RUNNER_AUTH.UPDATE_DEVICE,
    payload   // send body here
  );
  return data;
};


/* GET PROFILE */
export const getProfile = async () => {
  const { data } = await apiClient.get(
    ENDPOINTS.RUNNER_AUTH.PROFILE
  );
  return data;
};
