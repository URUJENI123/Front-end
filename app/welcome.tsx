import { View, StyleSheet } from "react-native";
import { Title, Paragraph, Button, Card } from "react-native-paper";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="report-problem" size={80} color="#3F51B5" />
        <Title style={styles.title}>Citizen Complaint Portal</Title>
        <Paragraph style={styles.subtitle}>
          Report issues, track progress, and help improve your community
        </Paragraph>
      </View>

      <View style={styles.features}>
        <Card style={styles.featureCard}>
          <Card.Content style={styles.featureContent}>
            <MaterialIcons name="report" size={40} color="#4CAF50" />
            <Title style={styles.featureTitle}>Report Issues</Title>
            <Paragraph style={styles.featureText}>
              Easily report problems in your community with photos and location
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content style={styles.featureContent}>
            <MaterialIcons name="track-changes" size={40} color="#FF9800" />
            <Title style={styles.featureTitle}>Track Progress</Title>
            <Paragraph style={styles.featureText}>
              Monitor the status of your reports and receive updates
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content style={styles.featureContent}>
            <MaterialIcons name="people" size={40} color="#9C27B0" />
            <Title style={styles.featureTitle}>Community Impact</Title>
            <Paragraph style={styles.featureText}>
              Work together to make your community a better place
            </Paragraph>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => router.push("/login")}
          style={styles.loginButton}
          contentStyle={styles.buttonContent}
        >
          Get Started
        </Button>

        <Paragraph style={styles.loginText}>
          Already have an account?
          <Paragraph
            style={styles.loginLink}
            onPress={() => router.push("/login")}
          >
            {" "}
            Sign In
          </Paragraph>
        </Paragraph>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3F51B5",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24,
  },
  features: {
    flex: 1,
    justifyContent: "center",
    marginVertical: 40,
  },
  featureCard: {
    marginBottom: 20,
    elevation: 2,
  },
  featureContent: {
    alignItems: "center",
    padding: 20,
  },
  featureTitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
  },
  featureText: {
    textAlign: "center",
    color: "#666",
    lineHeight: 20,
  },
  actions: {
    alignItems: "center",
    marginBottom: 40,
  },
  loginButton: {
    width: "100%",
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#3F51B5",
    fontWeight: "bold",
  },
});
