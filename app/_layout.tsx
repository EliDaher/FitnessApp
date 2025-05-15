import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { useTheme } from '@/context/ThemeContext';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

function InnerLayout() {
  // الآن صار داخل ThemeProvider وآمن
  const { useTailwind } = require('@/app/hooks/useTailwind'); // import داخلي
  const tw = useTailwind();
  const { mode } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={mode == 'dark' ? `dark-content` : `light-content`}
        backgroundColor={tw.color("black")}
        translucent={false}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(screens)/Landing" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <InnerLayout />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
