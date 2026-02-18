// import { ENDPOINTS } from '../../api/endpoints';
// import { apiClient } from '../../api/axios';

// export const getProfile = async () => {
//   const { data } = await apiClient.get(ENDPOINTS.RUNNER_AUTH.PROFILE);
//   return data;
// };

// export const updateProfile = async (payload: {
//   display_name?: string;
//   phone?: string;
//   password?: string;
//   image?: {
//     uri: string;
//     name: string;
//     type: string;
//   } | null;
// }) => {
//   const formData = new FormData();

//   if (payload.display_name) {
//     formData.append('display_name', payload.display_name);
//   }
//   if (payload.phone) {
//     formData.append('phone', payload.phone);
//   }
//   if (payload.password) {
//     formData.append('password', payload.password);
//   }
//   if (payload.image?.uri) {
//     formData.append('image', {
//       uri: payload.image.uri,
//       name: payload.image.name ?? 'profile.jpg',
//       type: payload.image.type ?? 'image/jpeg',
//     } as any);
//   }

//   const { data } = await apiClient.put(
//     ENDPOINTS.RUNNER_AUTH.PROFILE,
//     formData,
//     {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     }
//   );
//   return data;
// };

// export const getPerformance = async () => {
//   const { data } = await apiClient.get(ENDPOINTS.RUNNER_STATUS.PERFORMANCE);
//   return data;
// };

import { apiClient } from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import { logger } from '../../utils/logger';

// ── getProfile ───────────────────────────────────────────────────────────────
export const getProfile = async () => {
  const response = await apiClient.get(ENDPOINTS.RUNNER_AUTH.PROFILE);
  logger.log('getProfile response:', response.data);
  return response.data;
};

// ── getPerformance ───────────────────────────────────────────────────────────
export const getPerformance = async () => {
  const response = await apiClient.get(ENDPOINTS.RUNNER_STATUS.PERFORMANCE);
  logger.log('getPerformance response:', response.data);
  return response.data;
};

// ── updateProfile ────────────────────────────────────────────────────────────
// Builds FormData and sends it — the axios interceptor in axios.ts automatically
// detects FormData and removes Content-Type so the correct multipart boundary
// is set. No manual header manipulation needed here.
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = async (payload: {
  display_name?: string;
  phone?:        string;
  password?:     string;
  image?:        { uri: string; name: string; type: string } | null;
}) => {
  const formData = new FormData();

  if (payload.display_name) formData.append('display_name', payload.display_name);
  if (payload.phone)        formData.append('phone',        payload.phone);
  if (payload.password)     formData.append('password',     payload.password);

  if (payload.image) {
    formData.append('image', {
      uri:  payload.image.uri,
      name: payload.image.name,
      type: payload.image.type,
    } as any);
  }

  logger.log('updateProfile FormData parts:', (formData as any)._parts);

  const response = await apiClient.put(ENDPOINTS.RUNNER_AUTH.PROFILE, formData);

  logger.log('updateProfile response:', response);
  return response;
};