import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { Loading } from '@/components/ui/loading';
import { useAuthBootstrap } from '@/features/auth/api/hooks';
import { AppProviders } from '@/providers/app-providers';
import { useAppSelector } from '@/store/hooks';

// libsodium's wasm2js build references a global `WebAssembly` (absent in Hermes) in
// an orphaned async init path, surfacing a harmless ReferenceError. Real crypto init
// succeeds via its local shim (login + encrypted writes work), so this only mutes the
// dev-only noise rather than altering initialization.
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
