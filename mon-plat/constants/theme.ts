/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1a1a1a',
    background: '#FFF9F2',
    primary: '#FF6B00',
    subtitle: '#687076',
    surface: '#FFFFFF',
    icon: '#687076',
    border: '#F0E1D2',
    muted: '#8A7564',
    soft: '#FFE7D1',
  },
  dark: {
    text: '#FFF6ED',
    background: '#17110D',
    primary: '#FF8A2A',
    subtitle: '#C5B3A4',
    surface: '#241B16',
    icon: '#C5B3A4',
    border: '#3B2B22',
    muted: '#C5B3A4',
    soft: '#38251A',
  },
};

const appColors = {
  light: {
    background: '#FFF9F2',
    surface: '#FFFFFF',
    surfaceAlt: '#FFF2E4',
    primary: '#FF6B00',
    primaryDark: '#C94F00',
    text: '#211A16',
    muted: '#7E6D60',
    border: '#F0E1D2',
    success: '#1F8A5B',
    danger: '#D64B4B',
  },
  dark: {
    background: '#17110D',
    surface: '#241B16',
    surfaceAlt: '#38251A',
    primary: '#FF8A2A',
    primaryDark: '#FF6B00',
    text: '#FFF6ED',
    muted: '#C5B3A4',
    border: '#3B2B22',
    success: '#55C990',
    danger: '#FF7A7A',
  },
};

export const AppTheme = {
  colors: appColors.light,
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    pill: 999,
  },
  spacing: {
    screen: 20,
  },
};

export function getAppTheme(colorScheme?: 'light' | 'dark' | null) {
  return {
    ...AppTheme,
    colors: colorScheme === 'dark' ? appColors.dark : appColors.light,
    isDark: colorScheme === 'dark',
  };
}

export function useAppTheme() {
  return getAppTheme(useColorScheme());
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
