import Config from "react-native-config";
console.log("ENV CHECK =>", Config.API_BASE_URL);
export const ENV= Config.APP_ENV
export const API_BASE_URL =Config.API_BASE_URL
export const API_TIME_OUT= Config.API_TIME_OUT 
export const GOOGLE_MAP_API_KEY= Config.GOOGLE_MAP_API_KEY
if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is missing in .env');
  }