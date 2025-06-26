import { View, StyleSheet } from "react-native";
import { Title, Paragraph, Button } from "react-native-paper";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <View style={styles.header}>
        <Button
          mode="text"
          onPress={() => router.push("/login")}
          textColor="#4285F4"
          style={styles.skipButton}
        >
          Skip
        </Button>
      </View>

      {/* App Logo */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="flag" size={32} color="#FFFFFF" />
        </View>

        <View style={styles.decorativeIcons}>
          <View
            style={[
              styles.smallIcon,
              { backgroundColor: "#FF5722", top: 20, left: -20 },
            ]}
          >
            <MaterialIcons name="warning" size={16} color="#FFFFFF" />
          </View>
          <View
            style={[
              styles.smallIcon,
              { backgroundColor: "#FFC107", top: 40, right: -30 },
            ]}
          >
            <MaterialIcons name="lightbulb" size={16} color="#FFFFFF" />
          </View>
          <View
            style={[
              styles.smallIcon,
              { backgroundColor: "#4CAF50", top: 60, left: -40 },
            ]}
          >
            <MaterialIcons name="delete" size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Welcome Content */}
      <View style={styles.content}>
        <Title style={styles.title}>Welcome to</Title>
        <Title style={styles.brandTitle}>CitizenReport</Title>
        <Paragraph style={styles.subtitle}>
          Your voice matters! Report community issues like potholes, broken
          streetlights, and more to help improve your neighborhood.
        </Paragraph>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: "#E3F2FD" }]}>
            <MaterialIcons name="camera-alt" size={20} color="#4285F4" />
          </View>
          <View style={styles.featureText}>
            <Paragraph style={styles.featureTitle}>Photo Reports</Paragraph>
            <Paragraph style={styles.featureDesc}>
              Capture and share evidence
            </Paragraph>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: "#E8F5E8" }]}>
            <MaterialIcons name="location-on" size={20} color="#4CAF50" />
          </View>
          <View style={styles.featureText}>
            <Paragraph style={styles.featureTitle}>GPS Location</Paragraph>
            <Paragraph style={styles.featureDesc}>
              Automatic location tagging
            </Paragraph>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: "#FFF3E0" }]}>
            <MaterialIcons name="notifications" size={20} color="#FF9800" />
          </View>
          <View style={styles.featureText}>
            <Paragraph style={styles.featureTitle}>Real-time Updates</Paragraph>
            <Paragraph style={styles.featureDesc}>
              Track report progress
            </Paragraph>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => router.push("/signup")}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          buttonColor="#4285F4"
        >
          Get Started
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/login")}
          textColor="#666666"
          style={styles.secondaryButton}
        >
          I Already Have an Account
        </Button>

        <Paragraph style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Paragraph>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "flex-end",
    paddingTop: 50,
    paddingBottom: 20,
  },
  skipButton: {
    marginRight: -12,
  },
  logoSection: {
    alignItems: "center",
    paddingVertical: 40,
    position: "relative",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  decorativeIcons: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  smallIcon: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  content: {
    alignItems: "center",
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: "#333333",
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4285F4",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  features: {
    paddingBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 14,
    color: "#666666",
  },
  actions: {
    paddingBottom: 40,
  },
  primaryButton: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  secondaryButton: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#999999",
    textAlign: "center",
    lineHeight: 18,
  },
});
