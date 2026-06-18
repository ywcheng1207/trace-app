import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useAppSelector } from '@/store/hooks';

export function useColorScheme() {
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const systemScheme = useSystemColorScheme();

  if (themeMode === 'light') return 'light';
  if (themeMode === 'dark') return 'dark';
  return systemScheme ?? 'light';
}
