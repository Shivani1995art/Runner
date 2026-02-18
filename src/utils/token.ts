import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'ACCESS_TOKEN';

export const getToken = async () => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const setToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};
