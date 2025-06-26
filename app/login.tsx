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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="account-circle" size={80} color="#3F51B5" />
          <Title style={styles.title}>Welcome Back</Title>
          <Paragraph style={styles.subtitle}>Sign in to your account</Paragraph>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            outlineColor="#E0E0E0"
            activeOutlineColor="#3F51B5"
            theme={{
              colors: {
                primary: "#3F51B5",
                outline: "#E0E0E0",
              },
            }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            outlineColor="#E0E0E0"
            activeOutlineColor="#3F51B5"
            theme={{
              colors: {
                primary: "#3F51B5",
                outline: "#E0E0E0",
              },
            }}
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
            buttonColor="#3F51B5"
          >
            Sign In
          </Button>

          <Divider style={styles.divider} />

          {/* Demo Accounts */}
          <Paragraph style={styles.demoTitle}>Demo Accounts:</Paragraph>

          <View style={styles.demoButtons}>
            <Button
              mode="outlined"
              onPress={() => quickLogin("citizen")}
              style={styles.demoButton}
              contentStyle={styles.demoButtonContent}
              textColor="#3F51B5"
              theme={{
                colors: {
                  outline: "#3F51B5",
                },
              }}
            >
              Citizen
            </Button>

            <Button
              mode="outlined"
              onPress={() => quickLogin("staff")}
              style={styles.demoButton}
              contentStyle={styles.demoButtonContent}
              textColor="#3F51B5"
              theme={{
                colors: {
                  outline: "#3F51B5",
                },
              }}
            >
              Staff
            </Button>

            <Button
              mode="outlined"
              onPress={() => quickLogin("admin")}
              style={styles.demoButton}
              contentStyle={styles.demoButtonContent}
              textColor="#3F51B5"
              theme={{
                colors: {
                  outline: "#3F51B5",
                },
              }}
            >
              Admin
            </Button>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Paragraph style={styles.signupText}>
            Don&apos;t have an account?{" "}
            <Paragraph
              style={styles.signupLink}
              onPress={() => router.push("/signup")}
            >
              Create Account
            </Paragraph>
          </Paragraph>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333333",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  loginButton: {
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  divider: {
    marginBottom: 24,
    backgroundColor: "#E0E0E0",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    textAlign: "center",
    marginBottom: 16,
  },
  demoButtons: {
    flexDirection: "row",
    gap: 8,
  },
  demoButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
  },
  demoButtonContent: {
    paddingVertical: 8,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  signupLink: {
    color: "#3F51B5",
    fontWeight: "600",
  },
});
