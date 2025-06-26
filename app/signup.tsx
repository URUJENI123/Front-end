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

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createUser } = useApp();

  const handleSignup = async () => {
    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    if (!agreeToTerms) {
      Alert.alert(
        "Error",
        "Please agree to the Terms of Service and Privacy Policy"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const result = await createUser({
        name: formData.fullName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        phone: formData.phoneNumber,
        role: "USER",
      });

      if (result.success) {
        Alert.alert(
          "Success",
          "Your account has been created successfully! You can now sign in.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Button
            mode="text"
            onPress={() => router.back()}
            textColor="#333333"
            style={styles.backButton}
            icon={() => (
              <MaterialIcons name="arrow-back" size={20} color="#333333" />
            )}
          />
        </View>

        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="flag" size={32} color="#FFFFFF" />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Title style={styles.title}>Create Account</Title>
          <Title style={styles.subtitle}>Join CitizenReport</Title>
          <Paragraph style={styles.description}>
            Help improve your community
          </Paragraph>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Paragraph style={styles.inputLabel}>Full Name</Paragraph>
            <TextInput
              value={formData.fullName}
              onChangeText={(text) => updateFormData("fullName", text)}
              mode="outlined"
              style={styles.input}
              placeholder="Enter your full name"
              autoCapitalize="words"
              outlineStyle={styles.inputOutline}
              theme={{
                colors: {
                  primary: "#4285F4",
                  outline: "#E0E0E0",
                },
              }}
              left={<TextInput.Icon icon="account" iconColor="#999999" />}
            />
          </View>

          <View style={styles.inputContainer}>
            <Paragraph style={styles.inputLabel}>Email Address</Paragraph>
            <TextInput
              value={formData.email}
              onChangeText={(text) => updateFormData("email", text)}
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
              left={<TextInput.Icon icon="email" iconColor="#999999" />}
            />
          </View>

          <View style={styles.inputContainer}>
            <Paragraph style={styles.inputLabel}>Phone Number</Paragraph>
            <TextInput
              value={formData.phoneNumber}
              onChangeText={(text) => updateFormData("phoneNumber", text)}
              mode="outlined"
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              outlineStyle={styles.inputOutline}
              theme={{
                colors: {
                  primary: "#4285F4",
                  outline: "#E0E0E0",
                },
              }}
              left={<TextInput.Icon icon="phone" iconColor="#999999" />}
            />
          </View>

          <View style={styles.inputContainer}>
            <Paragraph style={styles.inputLabel}>Password</Paragraph>
            <TextInput
              value={formData.password}
              onChangeText={(text) => updateFormData("password", text)}
              mode="outlined"
              style={styles.input}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              outlineStyle={styles.inputOutline}
              theme={{
                colors: {
                  primary: "#4285F4",
                  outline: "#E0E0E0",
                },
              }}
              left={<TextInput.Icon icon="lock" iconColor="#999999" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                  iconColor="#999999"
                />
              }
            />
            <Paragraph style={styles.passwordHint}>Password Strength</Paragraph>
          </View>

          <View style={styles.inputContainer}>
            <Paragraph style={styles.inputLabel}>Confirm Password</Paragraph>
            <TextInput
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData("confirmPassword", text)}
              mode="outlined"
              style={styles.input}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              outlineStyle={styles.inputOutline}
              theme={{
                colors: {
                  primary: "#4285F4",
                  outline: "#E0E0E0",
                },
              }}
              left={<TextInput.Icon icon="lock" iconColor="#999999" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  iconColor="#999999"
                />
              }
            />
          </View>

          {/* Terms Agreement */}
          <View style={styles.termsContainer}>
            <Checkbox
              status={agreeToTerms ? "checked" : "unchecked"}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              color="#4285F4"
            />
            <Paragraph style={styles.termsText}>
              I agree to the{" "}
              <Paragraph style={styles.termsLink}>Terms of Service</Paragraph>{" "}
              and <Paragraph style={styles.termsLink}>Privacy Policy</Paragraph>
            </Paragraph>
          </View>

          {/* Create Account Button */}
          <Button
            mode="contained"
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
            style={styles.createButton}
            contentStyle={styles.buttonContent}
            buttonColor="#4285F4"
          >
            Create Account
          </Button>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Paragraph style={styles.dividerText}>or</Paragraph>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Signup */}
          <Button
            mode="outlined"
            onPress={() => Alert.alert("Info", "Google signup coming soon!")}
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
            Sign up with Google
          </Button>

          <Button
            mode="outlined"
            onPress={() => Alert.alert("Info", "Apple signup coming soon!")}
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
            Sign up with Apple
          </Button>
        </View>

        {/* Sign In Link */}
        <View style={styles.signinSection}>
          <Paragraph style={styles.signinText}>
            Already have an account?{" "}
            <Paragraph
              style={styles.signinLink}
              onPress={() => router.push("/login")}
            >
              Sign in
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
    backgroundColor: "#F8F9FF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: -12,
  },
  logoSection: {
    alignItems: "center",
    paddingBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  titleSection: {
    alignItems: "center",
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4285F4",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666666",
  },
  formContainer: {
    paddingBottom: 20,
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
  passwordHint: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  termsText: {
    fontSize: 14,
    color: "#666666",
    flex: 1,
    marginLeft: 8,
    lineHeight: 20,
  },
  termsLink: {
    color: "#4285F4",
    fontWeight: "500",
  },
  createButton: {
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
  signinSection: {
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 40,
  },
  signinText: {
    fontSize: 14,
    color: "#666666",
  },
  signinLink: {
    color: "#4285F4",
    fontWeight: "600",
  },
});
