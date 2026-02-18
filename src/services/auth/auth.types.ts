export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerfiyForgotPasswordOtp {
  email: string;
  otp: string | number;
}

export interface SetNewPasswordPayload {
  reset_token: string;
  new_password: string;
}
export interface LogoutPayload {
  device_token: string;
  platform: 'ios' | 'android';
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  success?: boolean;
}

export interface UpdateDevicePayload {
  device_token: string;
  platform: 'ios' | 'android';
}
