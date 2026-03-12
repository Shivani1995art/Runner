import axios from "axios";
import { getToken } from "../utils/token";
import { handleApiError } from "../utils/errorHandler";
import { API_BASE_URL } from "../Config/env";
import { logger } from "../utils/logger";

// ✅ Global references
let authContextRef: any = null;
let navigationRef: any = null;

// ✅ Export functions to set handlers
export const setAuthContextRef = (ref: any) => {
  authContextRef = ref;
  logger.log("✅ Auth context ref set");
};

export const setNavigationRef = (ref: any) => {
  navigationRef = ref;
  logger.log("✅ Navigation ref set");
};

// ✅ Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

// ✅ Flag to prevent multiple logout calls
let isLoggingOut = false;

// ═════════════════════════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR - Add auth token
// ═════════════════════════════════════════════════════════════════════════════

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      logger.log("📤 Request:", config.method?.toUpperCase(), config.url);
      return config;
    } catch (error) {
      logger.error("❌ Request interceptor error:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// ═════════════════════════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR - Handle errors & token expiration
// ═════════════════════════════════════════════════════════════════════════════

apiClient.interceptors.response.use(
  (response) => response,

  
  async (error) => {

     handleApiError(error);

    const status = error.response?.status;
    const url = error.config?.url;

    logger.error("📥 API Error:", {
      status,
      url,
      message: error.message,
    });

    // ✅ HANDLE 401 UNAUTHORIZED (Token Expired or Invalid)
    if (status === 401) {
      logger.warn("⚠️ 401 Unauthorized - Token expired or invalid");

      // ✅ Prevent multiple logout calls
      if (!isLoggingOut) {
        isLoggingOut = true;

        try {
          // 1️⃣ Call logout from AuthContext
          if (authContextRef?.logout && typeof authContextRef.logout === "function") {
            logger.log("🧹 Calling AuthContext logout...");
            await authContextRef.logout();
            logger.log("✅ AuthContext logout completed");
          } else {
            logger.error("❌ AuthContext logout function not available");
          }

          // 2️⃣ Navigate to login screen
          // if (navigationRef) {
          //   logger.log("🚀 Navigating to Login...");
          //   setTimeout(() => {
          //     navigationRef.reset({
          //       index: 0,
          //       routes: [{ name: "Login" }],
          //     });
          //   }, 500); // Small delay to ensure logout completes first
          // } else {
          //   logger.error("❌ Navigation ref not set!");
          // }
        } catch (logoutError) {
          logger.error("❌ Logout error:", logoutError);
        } finally {
          isLoggingOut = false;
        }
      } else {
        logger.log("⏭️ Logout already in progress, skipping...");
      }

      return Promise.reject(error);
    }

    // ✅ HANDLE OTHER ERRORS
   
    return Promise.reject(error);
  }
);