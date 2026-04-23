import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import AppSplashScreen from '@/components/splash-screen';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper'
import Toast from 'react-native-toast-message';
import { Colors } from '@/constants/theme';
import CartProvider from '@/context/CartContext';
// Thèmes Paper custom — injecte nos couleurs dans le système MD3
const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    surface: Colors.light.surface,
    onSurface: Colors.light.text,
    onBackground: Colors.light.text,
  },
}

const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    surface: Colors.dark.surface,
    onSurface: Colors.dark.text,
    onBackground: Colors.dark.text,
  },
}

// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true
// })
export const unstable_settings = {
  anchor: '(foods)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false)
    }, 2500)
  }, [])
  if (showSplash) return <AppSplashScreen />

  return (
    <CartProvider>
      <PaperProvider theme={colorScheme === 'dark' ? paperDarkTheme : paperLightTheme}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(foods)/index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
        <Toast />
      </PaperProvider>
    </CartProvider>
  );
}
