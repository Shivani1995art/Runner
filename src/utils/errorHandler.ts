import { AxiosError } from 'axios';
import { logger } from './logger';
import { getToastHandler } from './toastHandler';

interface ApiErrorResponse {
  message?: string;
  errors?: string[];
}

export const handleApiError = (error: unknown): void => {
  const toast = getToastHandler();
 // If toast not ready yet (very important for interceptors)
  if (!toast) {
    console.warn('Toast handler not initialized');
    return;
  }
  if (error instanceof AxiosError) {
    logger.error('==== Error ====', error);

    const status = error.response?.status;
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (!error.response) {
      toast('Please check your internet connection.', 'error', 3000);
      return;
    }
logger.log('==== data ====', data);
    switch (status) {
      case 400:
        toast(data?.message || 'Invalid request.', 'error', 3000);
        break;

      case 401:
        toast(data?.message || 'Unauthorized. Please login again.', 'error', 3000);
        break;

      case 403:
        toast(data?.message || 'Access Denied', 'error', 3000);
        break;

      case 404:
        toast(data?.message || 'Requested resource not found.', 'error', 3000);
        break;

      case 500:
        toast('Something went wrong. Please try again later.', 'error', 3000
        );
        break;

      default:
        toast(data?.message || 'Unexpected error occurred.', 'error', 3000
        );
    }
  } else {
    toast('Something went wrong.', 'error', 3000);
  }
};
