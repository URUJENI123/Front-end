import { View, StyleSheet } from "react-native";
import { Title, Paragraph, Button, Card } from "react-native-paper";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="report-problem" size={48} color="#3F51B5" />
        </View>
        <Title style={styles.title}>Welcome to</Title>
        <Title style={styles.brandTitle}>CitizenReport</Title>
        <Paragraph style={styles.subtitle}>
          Report issues, track progress, and help improve your community
        </Paragraph>
      </View>

      {/* Feature Cards */}
      <View style={styles.features}>
        <Card style={styles.featureCard}>
          <Card.Content style={styles.featureContent}>
            <View style={styles.featureIconContainer}>
              <MaterialIcons name="report" size={32} color="#4CAF50" />
            </View>
            <View style={styles.featureTextContainer}>
              <Title style={styles.featureTitle}>Report Issues</Title>
              <Paragraph style={styles.featureText}>
                Easily report problems in your community with photos and
                location
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content style={styles.featureContent}>
            <View style={styles.featureIconContainer}>
              <MaterialIcons name="track-changes" size={32} color="#FF9800" />
            </View>
            <View style={styles.featureTextContainer}>
              <Title style={styles.featureTitle}>Track Progress</Title>
              <Paragraph style={styles.featureText}>
                Monitor the status of your reports and receive updates
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content style={styles.featureContent}>
            <View style={styles.featureIconContainer}>
              <MaterialIcons name="people" size={32} color="#9C27B0" />
            </View>
            <View style={styles.featureTextContainer}>
              <Title style={styles.featureTitle}>Community Impact</Title>
              <Paragraph style={styles.featureText}>
                Work together to make your community a better place
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => router.push("/signup")}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          buttonColor="#3F51B5"
        >
          Get Started
        </Button>

        <View style={styles.loginPrompt}>
          <Paragraph style={styles.loginText}>
            Already have an account?{" "}
            <Paragraph
              style={styles.loginLink}
              onPress={() => router.push("/login")}
            >
              Sign In
            </Paragraph>
          </Paragraph>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8EAF6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: "#333333",
    textAlign: "center",
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3F51B5",
    textAlign: "center",
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
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  featureContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  actions: {
    paddingBottom: 50,
  },
  primaryButton: {
    borderRadius: 8,
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  loginPrompt: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666666",
  },
  loginLink: {
    color: "#3F51B5",
    fontWeight: "600",
  },
});
