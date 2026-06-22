import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { Loading } from '@/components/ui/loading';
import { useAuthBootstrap } from '@/features/auth/api/hooks';
import { AppProviders } from '@/providers/app-providers';
import { useAppSelector } from '@/store/hooks';

// libsodium 的 wasm2js build 會「故意」先試全域 WebAssembly（Hermes 沒有 → 快速失敗），
// catch 後才退回 asm.js 同步路徑完成初始化（login + 加密寫入皆正常）。這個快速失敗在 dev
// 留下無害的 ReferenceError / Aborted 噪音。LogBox 只蓋得住 App 內紅／黃框，Metro 終端
// 輸出仍會印出——屬正常 fallback，不影響功能。
LogBox.ignoreLogs([
  'failed to asynchronously prepare wasm',
  "Property 'WebAssembly' doesn't exist",
  'Aborted(',
]);

const RootNavigator = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const status = useAppSelector((state) => state.auth.status);

  useAuthBootstrap();

  useEffect(() => {
    if (status === 'restoring') return;
    const inAuthGroup = segments[0] === '(auth)';
    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/login');
    } else if (status === 'authenticated' && inAuthGroup) {
      router.replace('/schedule');
    }
  }, [status, segments, router]);

  if (status === 'restoring') {
    return <Loading />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
};

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
