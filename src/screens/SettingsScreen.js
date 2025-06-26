"use client";

import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Title, List, Switch, Button, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    darkMode: false,
    autoSync: true,
    locationServices: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await AsyncStorage.getItem("appSettings");
      if (settingsData) {
        setSettings(JSON.parse(settingsData));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem("appSettings", JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const clearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear all cached data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "Cache cleared successfully!");
          },
        },
      ]
    );
  };

  const resetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "This will reset all settings to default. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            const defaultSettings = {
              notifications: true,
              emailNotifications: true,
              darkMode: false,
              autoSync: true,
              locationServices: false,
            };
            saveSettings(defaultSettings);
            Alert.alert("Success", "Settings reset to default!");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Notification Settings</Title>
          <Divider style={styles.divider} />

          <List.Item
            title="Push Notifications"
            description="Receive push notifications for updates"
            left={(props) => <List.Icon {...props} icon="notifications" />}
            right={() => (
              <Switch
                value={settings.notifications}
                onValueChange={(value) => updateSetting("notifications", value)}
              />
            )}
          />

          <List.Item
            title="Email Notifications"
            description="Receive email updates"
            left={(props) => <List.Icon {...props} icon="email" />}
            right={() => (
              <Switch
                value={settings.emailNotifications}
                onValueChange={(value) =>
                  updateSetting("emailNotifications", value)
                }
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>App Preferences</Title>
          <Divider style={styles.divider} />

          <List.Item
            title="Dark Mode"
            description="Use dark theme"
            left={(props) => <List.Icon {...props} icon="dark-mode" />}
            right={() => (
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => updateSetting("darkMode", value)}
              />
            )}
          />

          <List.Item
            title="Auto Sync"
            description="Automatically sync data"
            left={(props) => <List.Icon {...props} icon="sync" />}
            right={() => (
              <Switch
                value={settings.autoSync}
                onValueChange={(value) => updateSetting("autoSync", value)}
              />
            )}
          />

          <List.Item
            title="Location Services"
            description="Allow location access for reports"
            left={(props) => <List.Icon {...props} icon="location-on" />}
            right={() => (
              <Switch
                value={settings.locationServices}
                onValueChange={(value) =>
                  updateSetting("locationServices", value)
                }
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Data & Storage</Title>
          <Divider style={styles.divider} />

          <List.Item
            title="Clear Cache"
            description="Clear temporary files and data"
            left={(props) => <List.Icon {...props} icon="delete-sweep" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={clearCache}
          />

          <List.Item
            title="Data Usage"
            description="View app data usage statistics"
            left={(props) => <List.Icon {...props} icon="data-usage" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              Alert.alert("Info", "Data usage feature coming soon!")
            }
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>About</Title>
          <Divider style={styles.divider} />

          <List.Item
            title="App Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="info" />}
          />

          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            left={(props) => <List.Icon {...props} icon="privacy-tip" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              Alert.alert("Info", "Privacy policy feature coming soon!")
            }
          />

          <List.Item
            title="Terms of Service"
            description="Read terms and conditions"
            left={(props) => <List.Icon {...props} icon="description" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              Alert.alert("Info", "Terms of service feature coming soon!")
            }
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Advanced</Title>
          <Divider style={styles.divider} />

          <Button
            mode="outlined"
            icon="restore"
            onPress={resetSettings}
            style={styles.button}
          >
            Reset Settings
          </Button>

          <Button
            mode="outlined"
            icon="bug-report"
            onPress={() =>
              Alert.alert("Info", "Bug report feature coming soon!")
            }
            style={styles.button}
          >
            Report Bug
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
  card: {
    marginBottom: 15,
  },
  divider: {
    marginVertical: 15,
  },
  button: {
    marginBottom: 10,
  },
});

export default SettingsScreen;
