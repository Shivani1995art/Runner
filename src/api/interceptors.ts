import { apiClient } from './axios';
import { handleApiError } from '../utils/errorHandler';

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // refresh token or force logout
    }
    handleApiError(error);
    return Promise.reject(error);
  }
);
