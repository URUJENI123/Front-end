"use client";

import { useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Card,
  Menu,
  Divider,
} from "react-native-paper";
import { router } from "expo-router";
import { useApp } from "../../context/AppContext";

const CreateReportScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);

  const priorities = ["Low", "Medium", "High"];

  const { createReport, getActiveDepartments } = useApp();
  const departments = getActiveDepartments();

  const handleSubmit = async () => {
    if (!title || !description || !category || !location) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const result = await createReport({
        title,
        description,
        category,
        priority,
        location,
      });

      if (result.success) {
        Alert.alert("Success", "Your report has been submitted successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(tabs)/citizen");
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (_error) {
      Alert.alert("Error", "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.formCard}>
        <Card.Content>
          <Title style={styles.formTitle}>Create New Report</Title>

          <TextInput
            label="Report Title *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            placeholder="Brief description of the issue"
          />

          <TextInput
            label="Description *"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Provide detailed information about the issue"
          />

          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TextInput
                label="Category *"
                value={category}
                mode="outlined"
                style={styles.input}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="chevron-down"
                    onPress={() => setCategoryMenuVisible(true)}
                  />
                }
                onPressIn={() => setCategoryMenuVisible(true)}
                placeholder="Select a category"
              />
            }
          >
            {departments.map((dept) => (
              <Menu.Item
                key={dept.id}
                onPress={() => {
                  setCategory(dept.name);
                  setCategoryMenuVisible(false);
                }}
                title={dept.name}
              />
            ))}
          </Menu>

          <Menu
            visible={priorityMenuVisible}
            onDismiss={() => setPriorityMenuVisible(false)}
            anchor={
              <TextInput
                label="Priority"
                value={priority}
                mode="outlined"
                style={styles.input}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="chevron-down"
                    onPress={() => setPriorityMenuVisible(true)}
                  />
                }
                onPressIn={() => setPriorityMenuVisible(true)}
              />
            }
          >
            {priorities.map((p) => (
              <Menu.Item
                key={p}
                onPress={() => {
                  setPriority(p);
                  setPriorityMenuVisible(false);
                }}
                title={p}
              />
            ))}
          </Menu>

          <TextInput
            label="Location *"
            value={location}
            onChangeText={setLocation}
            mode="outlined"
            style={styles.input}
            placeholder="Where is this issue located?"
          />

          <Divider style={styles.divider} />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
          >
            Submit Report
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
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
  formCard: {
    marginBottom: 20,
  },
  formTitle: {
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  divider: {
    marginVertical: 20,
  },
  submitButton: {
    marginBottom: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    marginBottom: 20,
  },
});

export default CreateReportScreen;
