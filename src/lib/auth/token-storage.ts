import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'trace.accessToken';

export const getAccessToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const setAccessToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
};
