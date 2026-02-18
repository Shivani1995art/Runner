// import axios from "axios";
// import { API_BASE_URL } from "../Config/env";
// import { logger } from "../utils/logger";
// import { getToken } from "../utils/token";
// import { handleApiError } from "../utils/errorHandler";


// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout:  15000,
//   headers: { 'Content-Type': 'application/json' },
// });
// let logoutFunction = null;
// export const setLogoutHandler = (logoutRef) => {
//   logger.log("current logout ===>",logoutRef)
//   logoutFunction = logoutRef;
// };
// apiClient.interceptors.request.use(
//   async (config) => {
//     const token = await getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     logger.log("Request Config:", config);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor: handle errors globally
// apiClient.interceptors.response.use(
//   (response) => response,
//  async (error) => {
//     handleApiError(error);

//     // Optional: handle 401 globally here (e.g., logout)
//     if (error.response?.status === 401) {
//       logger.warn("⚠️ 401 Unauthorized - Session expired, logging out...");
//       logger.log("logoutFunction:", logoutFunction);
//       logger.log("logoutFunction.current:", logoutFunction?.current);
      
//       if (logoutFunction && typeof logoutFunction.current === 'function') {
//         logger.log("🔥 Calling logout function...");
//         await logoutFunction.current();
//         logger.log("✅ Logout completed");
//       }else{
//         logger.error("Logout function not properly set!");
//       }
//     }

//     return Promise.reject(error);
//   }
// );
import axios from "axios";
import { API_BASE_URL } from "../Config/env";
import { logger } from "../utils/logger";
import { getToken } from "../utils/token";
import { handleApiError } from "../utils/errorHandler";


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let logoutFunction = null;
export const setLogoutHandler = (logoutRef) => {
  logger.log("current logout ===>", logoutRef);
  logoutFunction = logoutRef;
};

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ── Auto-detect FormData and set correct Content-Type ──────────────────
    // When sending FormData (file uploads), delete Content-Type so axios
    // sets multipart/form-data with the correct boundary automatically.
    // For everything else, keep application/json as default.
    // ───────────────────────────────────────────────────────────────────────
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    logger.log("Request Config:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors globally
// Response interceptor: handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    logger.log("Response Data:", response);
    const data = response.data;

    // ── Global success:false handler ─────────────────────────────────────────
    // Server returns HTTP 2xx but success:false → treat as error globally
    // so every hook/screen catch block handles it without per-call checks
    // ─────────────────────────────────────────────────────────────────────────
    if (data && typeof data === 'object' && data.success === false) {
      const message = data.message || 'Something went wrong';
      logger.warn(`⚠️ API success:false — ${response.config.url} — ${message}`);

      const error: any  = new Error(message);
      error.response    = response;   // keep response accessible
      error.isApiError  = true;       // flag to distinguish from network errors
      return Promise.reject(error);
    }

    return response;
  },
  async (error) => {
    handleApiError(error);

    // Optional: handle 401 globally here (e.g., logout)
    if (error.response?.status === 401) {
      logger.warn("⚠️ 401 Unauthorized - Session expired, logging out...");
      logger.log("logoutFunction:", logoutFunction);
      logger.log("logoutFunction.current:", logoutFunction?.current);

      if (logoutFunction && typeof logoutFunction.current === 'function') {
        logger.log("🔥 Calling logout function...");
        await logoutFunction.current();
        logger.log("✅ Logout completed");
      } else {
        logger.error("Logout function not properly set!");
      }
    }

    return Promise.reject(error);
  }
);