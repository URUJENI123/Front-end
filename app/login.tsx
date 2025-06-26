"use client";

import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Paragraph,
  Checkbox,
} from "react-native-paper";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "../src/context/AppContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="flag" size={32} color="#FFFFFF" />
          </View>
          <Title style={styles.appName}>CitizenReport</Title>
          <Paragraph style={styles.tagline}>
            Make your community better
          </Paragraph>
        </View>

        {/* Welcome Back */}
        <View style={styles.welcomeSection}>
          <Title style={styles.welcomeTitle}>Welcome Back</Title>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Paragraph style={styles.inputLabel}>Email Address</Paragraph>
            <TextInput
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              outlineStyle={styles.inputOutline}
              theme={{
                colors: {
                  primary: "#4285F4",
                  outline: "#E0E0E0",
                },
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Paragraph style={styles.inputLabel}>Password</Paragraph>
            <TextInput
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              outlineStyle={styles.inputOutline}
              theme={{
                colors: {
                  primary: "#4285F4",
                  outline: "#E0E0E0",
                },
              }}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                  iconColor="#999999"
                />
              }
            />
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={rememberMe ? "checked" : "unchecked"}
                onPress={() => setRememberMe(!rememberMe)}
                color="#4285F4"
              />
              <Paragraph style={styles.checkboxLabel}>Remember me</Paragraph>
            </View>
            <Button
              mode="text"
              onPress={() =>
                Alert.alert("Info", "Forgot password feature coming soon!")
              }
              textColor="#4285F4"
              style={styles.forgotButton}
            >
              Forgot password?
            </Button>
          </View>

          {/* Sign In Button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.signInButton}
            contentStyle={styles.buttonContent}
            buttonColor="#4285F4"
          >
            Sign In
          </Button>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Paragraph style={styles.dividerText}>or</Paragraph>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <Button
            mode="outlined"
            onPress={() => Alert.alert("Info", "Google login coming soon!")}
            style={styles.socialButton}
            contentStyle={styles.socialButtonContent}
            textColor="#333333"
            theme={{
              colors: {
                outline: "#E0E0E0",
              },
            }}
            icon={() => (
              <MaterialIcons name="google" size={20} color="#DB4437" />
            )}
          >
            Continue with Google
          </Button>

          <Button
            mode="outlined"
            onPress={() => Alert.alert("Info", "Apple login coming soon!")}
            style={styles.socialButton}
            contentStyle={styles.socialButtonContent}
            textColor="#333333"
            theme={{
              colors: {
                outline: "#E0E0E0",
              },
            }}
            icon={() => (
              <MaterialIcons name="apple" size={20} color="#000000" />
            )}
          >
            Continue with Apple
          </Button>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupSection}>
          <Paragraph style={styles.signupText}>
            Don't have an account?{" "}
            <Paragraph
              style={styles.signupLink}
              onPress={() => router.push("/signup")}
            >
              Sign up
            </Paragraph>
          </Paragraph>
        </View>

        {/* Bottom Navigation Placeholder */}
        <View style={styles.bottomNav}>
          <View style={styles.navItem}>
            <MaterialIcons name="report" size={24} color="#4285F4" />
            <Paragraph style={styles.navLabel}>Report Issues</Paragraph>
          </View>
          <View style={styles.navItem}>
            <MaterialIcons name="timeline" size={24} color="#999999" />
            <Paragraph style={styles.navLabel}>Track Progress</Paragraph>
          </View>
          <View style={styles.navItem}>
            <MaterialIcons name="people" size={24} color="#999999" />
            <Paragraph style={styles.navLabel}>Community</Paragraph>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: "#666666",
  },
  welcomeSection: {
    alignItems: "center",
    paddingBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
  },
  formContainer: {
    paddingBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 12,
    borderWidth: 1,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },
  forgotButton: {
    marginRight: -12,
  },
  signInButton: {
    borderRadius: 12,
    marginBottom: 30,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    fontSize: 14,
    color: "#999999",
    paddingHorizontal: 16,
  },
  socialButton: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  socialButtonContent: {
    paddingVertical: 12,
  },
  signupSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  signupText: {
    fontSize: 14,
    color: "#666666",
  },
  signupLink: {
    color: "#4285F4",
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingBottom: 40,
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
  },
});
