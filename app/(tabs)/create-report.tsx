"use client";

import { useState } from "react";
import { StyleSheet, ScrollView, Alert, View } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Card,
  Menu,
  Divider,
} from "react-native-paper";
import { router } from "expo-router";
import { useApp } from "../../src/context/AppContext";

export default function CreateReportScreen() {
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <Card.Content style={styles.formContent}>
            <Title style={styles.formTitle}>Create New Report</Title>

            <TextInput
              label="Report Title *"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              placeholder="Brief description of the issue"
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
              label="Description *"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Provide detailed information about the issue"
              outlineColor="#E0E0E0"
              activeOutlineColor="#3F51B5"
              theme={{
                colors: {
                  primary: "#3F51B5",
                  outline: "#E0E0E0",
                },
              }}
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
                  placeholder="Select a category"
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
                      icon="chevron-down"
                      onPress={() => setCategoryMenuVisible(true)}
                    />
                  }
                  onPressIn={() => setCategoryMenuVisible(true)}
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
              outlineColor="#E0E0E0"
              activeOutlineColor="#3F51B5"
              theme={{
                colors: {
                  primary: "#3F51B5",
                  outline: "#E0E0E0",
                },
              }}
            />

            <Divider style={styles.divider} />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
              contentStyle={styles.buttonContent}
              buttonColor="#3F51B5"
            >
              Submit Report
            </Button>

            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.cancelButton}
              contentStyle={styles.buttonContent}
              textColor="#666666"
              theme={{
                colors: {
                  outline: "#E0E0E0",
                },
              }}
            >
              Cancel
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  formCard: {
    margin: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
  },
  formContent: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    minHeight: 100,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: "#E0E0E0",
  },
  submitButton: {
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelButton: {
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonContent: {
    paddingVertical: 12,
  },
});
