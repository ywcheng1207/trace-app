import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'trace.accessToken';

// expo-secure-store has no web implementation. On native we use the Keychain/Keystore
// (the only place tokens belong, see security-conventions). On web — used only for the
// dev preview, never a shipping target — we fall back to AsyncStorage.
const isWeb = Platform.OS === 'web';

export const getAccessToken = async (): Promise<string | null> => {
  if (isWeb) return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const setAccessToken = async (token: string): Promise<void> => {
  if (isWeb) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = async (): Promise<void> => {
  if (isWeb) {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
};
