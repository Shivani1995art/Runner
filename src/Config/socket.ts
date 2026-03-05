// config/socket.ts
export const SOCKET_CONFIG = {
  // Development
  DEV_URL: 'http://localhost:3000',
  
  // Staging
  STAGING_URL: 'https://staging-api.yourapp.com',
  
  // Production
  PROD_URL: 'https://api.yourapp.com',
  
  // Get current URL
  getUrl: () => {
    if (__DEV__) {
      return SOCKET_CONFIG.DEV_URL;
    }
    // Add logic to switch between staging/prod
    return SOCKET_CONFIG.PROD_URL;
  },
};

