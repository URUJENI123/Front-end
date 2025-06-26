"use client"

import { useEffect, useState } from "react"
import { Redirect } from "expo-router"
import { View, StyleSheet } from "react-native"
import { ActivityIndicator, Text } from "react-native-paper"
import { useApp } from "../src/context/AppContext"

export default function Index() {
  const { user, isAuthenticated, loading } = useApp()
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setInitializing(false)
    }, 3000)

    if (!loading) {
      setInitializing(false)
      clearTimeout(timeout)
    }

    return () => clearTimeout(timeout)
  }, [loading])

  // Show loading screen while initializing
  if (loading || initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3F51B5" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  // Redirect to welcome if not authenticated
  if (!isAuthenticated || !user) {
    return <Redirect href="/welcome" />
  }

  // Redirect based on user role
  switch (user.role) {
    case "USER":
      return <Redirect href="/(tabs)/citizen" />
    case "STAFF":
      return <Redirect href="/(tabs)/staff" />
    case "SUPER_ADMIN":
      return <Redirect href="/(tabs)/admin" />
    default:
      return <Redirect href="/welcome" />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
})
