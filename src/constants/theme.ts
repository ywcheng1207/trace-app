/**
 * Design tokens for the app. Colors are defined for light and dark mode and consumed
 * via useTheme(); never hardcode hex in components. See styling-conventions.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#60646C',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    card: '#ffffff',
    border: '#E3E4E8',
    muted: '#8B8D98',
    primary: '#208AEF',
    primaryForeground: '#ffffff',
    accent: '#F97316',
    danger: '#E5484D',
    success: '#30A46C',
    warning: '#F5A623',
    overlay: 'rgba(0,0,0,0.4)',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#B0B4BA',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    card: '#161618',
    border: '#2A2C30',
    muted: '#7C7F88',
    primary: '#3C9DF5',
    primaryForeground: '#ffffff',
    accent: '#FB923C',
    danger: '#FF6369',
    success: '#3DD68C',
    warning: '#FFC53D',
    overlay: 'rgba(0,0,0,0.6)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
