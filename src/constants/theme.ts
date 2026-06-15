/**
 * Design tokens for the app. Colors are defined for light and dark mode and consumed
 * via useTheme(); never hardcode hex in components. See styling-conventions.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#09090b',
    textSecondary: '#71717a',
    background: '#ffffff',
    backgroundElement: '#f4f4f5',
    backgroundSelected: '#e4e4e7',
    card: '#ffffff',
    border: '#e4e4e7',
    muted: '#71717a',
    primary: '#18181b',
    primaryForeground: '#fafafa',
    accent: '#ff7d23',
    danger: '#dc2626',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    overlay: 'rgba(0,0,0,0.4)',
    brandOrange: '#ff7d23',
    brandYellow: '#f8d24e',
    brandBeige: '#e4dbd4',
    brandDark: '#333333',
  },
  dark: {
    text: '#fafafa',
    textSecondary: '#a1a1aa',
    background: '#09090b',
    backgroundElement: '#27272a',
    backgroundSelected: '#3f3f46',
    card: '#09090b',
    border: '#27272a',
    muted: '#a1a1aa',
    primary: '#fafafa',
    primaryForeground: '#18181b',
    accent: '#ff7d23',
    danger: '#ef4444',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#60a5fa',
    overlay: 'rgba(0,0,0,0.6)',
    brandOrange: '#ff7d23',
    brandYellow: '#f8d24e',
    brandBeige: '#e4dbd4',
    brandDark: '#333333',
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
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 999,
  sheet: 16,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
