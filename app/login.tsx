/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Paragraph,
  Card,
  Divider,
} from "react-native-paper";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "../src/context/AppContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useApp();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);

      if (result.success) {
        router.replace("/");
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role: string) => {
    setLoading(true);
    try {
      let email;
      switch (role) {
        case "citizen":
          email = "citizen@example.com";
          break;
        case "staff":
          email = "staff@example.com";
          break;
        case "admin":
          email = "admin@example.com";
          break;
      }

      const result = await login(email!, "password123");

      if (result.success) {
        router.replace("/");
      }
    } catch (_error) {
      Alert.alert("Error", "Quick login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="account-circle" size={80} color="#3F51B5" />
        <Title style={styles.title}>Welcome Back</Title>
        <Paragraph style={styles.subtitle}>Sign in to your account</Paragraph>
      </View>

      <Card style={styles.loginCard}>
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
          >
            Sign In
          </Button>

          <Divider style={styles.divider} />

          <Paragraph style={styles.demoTitle}>Demo Accounts:</Paragraph>

          <View style={styles.demoButtons}>
            <Button
              mode="outlined"
              onPress={() => quickLogin("citizen")}
              style={styles.demoButton}
              icon="person"
            >
              Citizen
            </Button>

            <Button
              mode="outlined"
              onPress={() => quickLogin("staff")}
              style={styles.demoButton}
              icon="badge"
            >
              Staff
            </Button>

            <Button
              mode="outlined"
              onPress={() => quickLogin("admin")}
              style={styles.demoButton}
              icon="admin-panel-settings"
            >
              Admin
            </Button>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Paragraph style={styles.footerText}>
          Don&apos;t have an account? Contact your administrator
        </Paragraph>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3F51B5",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  loginCard: {
    elevation: 4,
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 20,
  },
  demoTitle: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 15,
    color: "#666",
  },
  demoButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  demoButton: {
    flex: 1,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    textAlign: "center",
  },
});
