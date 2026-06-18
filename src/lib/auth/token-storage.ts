import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'trace.accessToken';
const REFRESH_TOKEN_KEY = 'trace.refreshToken';
const SHARED_SECRET_KEY = 'trace.sharedSecret';

// expo-secure-store has no web implementation. On native we use the Keychain/Keystore
// (the only place tokens belong, see security-conventions). On web — used only for the
// dev preview, never a shipping target — we fall back to AsyncStorage.
const isWeb = Platform.OS === 'web';

const get = (key: string): Promise<string | null> =>
  isWeb ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key);

const set = async (key: string, value: string): Promise<void> => {
  if (isWeb) {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const remove = async (key: string): Promise<void> => {
  if (isWeb) {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

// accessToken
export const getAccessToken = () => get(ACCESS_TOKEN_KEY);
export const setAccessToken = (token: string) => set(ACCESS_TOKEN_KEY, token);
export const clearAccessToken = () => remove(ACCESS_TOKEN_KEY);

// refreshToken
export const getRefreshToken = () => get(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token: string) => set(REFRESH_TOKEN_KEY, token);
export const removeRefreshToken = () => remove(REFRESH_TOKEN_KEY);

// sharedSecret
export const getSharedSecret = () => get(SHARED_SECRET_KEY);
export const setSharedSecret = (secret: string) => set(SHARED_SECRET_KEY, secret);
export const removeSharedSecret = () => remove(SHARED_SECRET_KEY);

export const clearAllTokens = async (): Promise<void> => {
  await Promise.all([clearAccessToken(), removeRefreshToken(), removeSharedSecret()]);
};
