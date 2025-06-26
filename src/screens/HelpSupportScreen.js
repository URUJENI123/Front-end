"use client";

import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Linking } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  List,
  Button,
  TextInput,
  Divider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

const HelpSupportScreen = () => {
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });

  const faqData = [
    {
      id: 1,
      question: "How do I create a new report?",
      answer:
        'Go to the "Create Report" tab, fill in all required fields including title, description, category, priority, and location. You can also add photos if needed.',
    },
    {
      id: 2,
      question: "How can I track my report status?",
      answer:
        'Visit the "My Reports" tab to see all your submitted reports and their current status (Pending, In Progress, or Resolved).',
    },
    {
      id: 3,
      question: "What are the different priority levels?",
      answer:
        "High: Urgent issues requiring immediate attention. Medium: Important issues that need attention soon. Low: Non-urgent issues that can be addressed when convenient.",
    },
    {
      id: 4,
      question: "How long does it take to resolve a report?",
      answer:
        "Resolution time varies depending on the issue complexity and priority. High priority issues are typically addressed within 24-48 hours.",
    },
    {
      id: 5,
      question: "Can I edit my report after submission?",
      answer:
        "Currently, reports cannot be edited after submission. If you need to add information, you can add comments to your existing report.",
    },
  ];

  const handleContactSubmit = () => {
    if (!contactForm.subject || !contactForm.message) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    Alert.alert(
      "Message Sent",
      "Your message has been sent to our support team. We will get back to you within 24 hours.",
      [
        {
          text: "OK",
          onPress: () => {
            setContactForm({ subject: "", message: "" });
          },
        },
      ]
    );
  };

  const openEmail = () => {
    Linking.openURL("mailto:support@citizenapp.com");
  };

  const openPhone = () => {
    Linking.openURL("tel:+1234567890");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Help</Title>
          <Divider style={styles.divider} />

          <List.Item
            title="Call Support"
            description="+1 (234) 567-8900"
            left={(props) => <List.Icon {...props} icon="phone" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={openPhone}
          />

          <List.Item
            title="Email Support"
            description="support@citizenapp.com"
            left={(props) => <List.Icon {...props} icon="email" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={openEmail}
          />

          <List.Item
            title="Live Chat"
            description="Chat with our support team"
            left={(props) => <List.Icon {...props} icon="chat" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              Alert.alert("Info", "Live chat feature coming soon!")
            }
          />
        </Card.Content>
      </Card>

      {/* FAQ Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Frequently Asked Questions</Title>
          <Divider style={styles.divider} />

          {faqData.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <View style={styles.questionContainer}>
                <Icon name="help-outline" size={20} color="#3F51B5" />
                <Paragraph style={styles.question}>{faq.question}</Paragraph>
              </View>
              <Paragraph style={styles.answer}>{faq.answer}</Paragraph>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Contact Form */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Contact Support</Title>
          <Paragraph style={styles.contactDescription}>
            Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll help
            you out.
          </Paragraph>
          <Divider style={styles.divider} />

          <TextInput
            label="Subject"
            value={contactForm.subject}
            onChangeText={(text) =>
              setContactForm({ ...contactForm, subject: text })
            }
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Message"
            value={contactForm.message}
            onChangeText={(text) =>
              setContactForm({ ...contactForm, message: text })
            }
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleContactSubmit}
            style={styles.submitButton}
            icon="send"
          >
            Send Message
          </Button>
        </Card.Content>
      </Card>

      {/* App Guide */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>How to Use the App</Title>
          <Divider style={styles.divider} />

          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Paragraph style={styles.stepNumberText}>1</Paragraph>
            </View>
            <View style={styles.stepContent}>
              <Paragraph style={styles.stepTitle}>Create a Report</Paragraph>
              <Paragraph style={styles.stepDescription}>
                Tap &quot;Create Report&quot; and fill in the details about the issue you
                want to report.
              </Paragraph>
            </View>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Paragraph style={styles.stepNumberText}>2</Paragraph>
            </View>
            <View style={styles.stepContent}>
              <Paragraph style={styles.stepTitle}>Track Progress</Paragraph>
              <Paragraph style={styles.stepDescription}>
                Monitor your report status in &quot;My Reports&quot; and receive updates.
              </Paragraph>
            </View>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Paragraph style={styles.stepNumberText}>3</Paragraph>
            </View>
            <View style={styles.stepContent}>
              <Paragraph style={styles.stepTitle}>Get Resolution</Paragraph>
              <Paragraph style={styles.stepDescription}>
                Department staff will work on your report and update you when
                it&apos;s resolved.
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* App Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>App Information</Title>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="info" size={20} color="#666" />
            <View style={styles.infoText}>
              <Paragraph style={styles.infoLabel}>Version</Paragraph>
              <Paragraph style={styles.infoValue}>1.0.0</Paragraph>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="update" size={20} color="#666" />
            <View style={styles.infoText}>
              <Paragraph style={styles.infoLabel}>Last Updated</Paragraph>
              <Paragraph style={styles.infoValue}>December 2024</Paragraph>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="developer-mode" size={20} color="#666" />
            <View style={styles.infoText}>
              <Paragraph style={styles.infoLabel}>Developer</Paragraph>
              <Paragraph style={styles.infoValue}>
                Citizen Services Team
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
  },
  card: {
    marginBottom: 15,
  },
  divider: {
    marginVertical: 15,
  },
  contactDescription: {
    color: "#666",
    marginTop: 10,
  },
  input: {
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 10,
  },
  faqItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  questionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  question: {
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
    color: "#3F51B5",
  },
  answer: {
    marginLeft: 30,
    color: "#666",
    lineHeight: 20,
  },
  guideStep: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3F51B5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  stepNumberText: {
    color: "white",
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  stepDescription: {
    color: "#666",
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoText: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default HelpSupportScreen;
