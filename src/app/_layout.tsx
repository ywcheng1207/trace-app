import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Loading } from '@/components/ui/loading';
import { useAuthBootstrap } from '@/features/auth/api/hooks';
import { AppProviders } from '@/providers/app-providers';
import { useAppSelector } from '@/store/hooks';

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
