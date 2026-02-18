export const ENDPOINTS = {
  RUNNER_AUTH: {
    LOGIN: '/api/runner/auth/login',
    FORGOT_PASSWORD: '/api/runner/auth/forgot-password',
    VERIFY_FORGOT_OTP: '/api/runner/auth/verify-forgot-otp',
    SET_NEW_PASSWORD: '/api/runner/auth/set-new-password',
    UPDATE_DEVICE: '/api/runner/auth/update-device',
    LOGOUT: '/api/runner/auth/logout',
    PROFILE: '/api/runner/auth/profile', // GET & PUT
  },

  RUNNER_STATUS: {
    SET_STATUS: '/api/runner/status/set',
    GET_STATUS: '/api/runner/status/get',
    PERFORMANCE: '/api/runner/status/performance',
  },

  RUNNER_ORDERS: {
    AVAILABLE: '/api/runner/orders/available',
    ORDER_BY_ID: (id: string | number) => `/api/runner/orders/${id}`,
    ACCEPT: (id: string | number) => `/api/runner/orders/${id}/accept`,
    PICKED: (id: string | number) => `/api/runner/orders/${id}/picked`,
    DELIVERED: (id: string | number) => `/api/runner/orders/${id}/delivered`,
    HISTORY: '/api/runner/orders/orders/history',
  },

  RUNNER_LOCATION: {
    UPDATE: '/api/runner/location/update',
  }
};
