"use client"

import { useEffect } from "react"
import { Stack } from "expo-router"
import { Provider as PaperProvider } from "react-native-paper"
import { AppProvider } from "../src/context/AppContext"
import * as SplashScreen from "expo-splash-screen"

const theme = {
  colors: {
    primary: "#3F51B5",
    accent: "#FFC107",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    text: "#000000",
    onSurface: "#000000",
    disabled: "#9E9E9E",
  },
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <PaperProvider theme={theme}>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="report-details" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="notifications" />
        </Stack>
      </AppProvider>
    </PaperProvider>
  )
}
