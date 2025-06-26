"use client";

import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Divider,
  List,
  Switch,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("user");
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            });
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
      },
    ]);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "USER":
        return "Citizen";
      case "STAFF":
        return "Department Staff";
      case "SUPER_ADMIN":
        return "Super Administrator";
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "USER":
        return "#4CAF50";
      case "STAFF":
        return "#FF9800";
      case "SUPER_ADMIN":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Card style={styles.loadingCard}>
          <Card.Content>
            <Paragraph>Loading profile...</Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={user.name.charAt(0).toUpperCase()}
            style={[
              styles.avatar,
              { backgroundColor: getRoleColor(user.role) },
            ]}
          />
          <View style={styles.profileInfo}>
            <Title style={styles.userName}>{user.name}</Title>
            <Paragraph style={styles.userEmail}>{user.email}</Paragraph>
            <View style={styles.roleContainer}>
              <Icon
                name="verified-user"
                size={16}
                color={getRoleColor(user.role)}
              />
              <Paragraph
                style={[styles.userRole, { color: getRoleColor(user.role) }]}
              >
                {getRoleDisplayName(user.role)}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Account Information */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>Account Information</Title>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="person" size={20} color="#666" />
            <View style={styles.infoText}>
              <Paragraph style={styles.infoLabel}>Full Name</Paragraph>
              <Paragraph style={styles.infoValue}>{user.name}</Paragraph>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#666" />
            <View style={styles.infoText}>
              <Paragraph style={styles.infoLabel}>Email</Paragraph>
              <Paragraph style={styles.infoValue}>{user.email}</Paragraph>
            </View>
          </View>

          {user.phone && (
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#666" />
              <View style={styles.infoText}>
                <Paragraph style={styles.infoLabel}>Phone</Paragraph>
                <Paragraph style={styles.infoValue}>{user.phone}</Paragraph>
              </View>
            </View>
          )}

          {user.address && (
            <View style={styles.infoRow}>
              <Icon name="location-on" size={20} color="#666" />
              <View style={styles.infoText}>
                <Paragraph style={styles.infoLabel}>Address</Paragraph>
                <Paragraph style={styles.infoValue}>{user.address}</Paragraph>
              </View>
            </View>
          )}

          {user.department && (
            <View style={styles.infoRow}>
              <Icon name="business" size={20} color="#666" />
              <View style={styles.infoText}>
                <Paragraph style={styles.infoLabel}>Department</Paragraph>
                <Paragraph style={styles.infoValue}>
                  {user.departmentName || user.department}
                </Paragraph>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <Icon name="calendar-today" size={20} color="#666" />
            <View style={styles.infoText}>
              <Paragraph style={styles.infoLabel}>Member Since</Paragraph>
              <Paragraph style={styles.infoValue}>
                {new Date(user.createdAt).toLocaleDateString()}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title>Settings</Title>
          <Divider style={styles.divider} />

          <List.Item
            title="Notifications"
            description="Receive push notifications"
            left={(props) => <List.Icon {...props} icon="notifications" />}
            right={() => (
              <Switch value={notifications} onValueChange={setNotifications} />
            )}
          />

          <List.Item
            title="Dark Mode"
            description="Use dark theme"
            left={(props) => <List.Icon {...props} icon="dark-mode" />}
            right={() => (
              <Switch value={darkMode} onValueChange={setDarkMode} />
            )}
          />

          <List.Item
            title="Settings"
            description="App preferences and configuration"
            left={(props) => <List.Icon {...props} icon="settings" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate("Settings")}
          />

          {user.role === "USER" && (
            <List.Item
              title="Help & Support"
              description="Get help and contact support"
              left={(props) => <List.Icon {...props} icon="help" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate("Help")}
            />
          )}
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Button
            mode="outlined"
            icon="edit"
            onPress={() =>
              Alert.alert("Info", "Edit profile feature coming soon!")
            }
            style={styles.actionButton}
          >
            Edit Profile
          </Button>

          <Button
            mode="outlined"
            icon="lock"
            onPress={() =>
              Alert.alert("Info", "Change password feature coming soon!")
            }
            style={styles.actionButton}
          >
            Change Password
          </Button>

          <Button
            mode="contained"
            icon="logout"
            onPress={handleLogout}
            style={[styles.actionButton, styles.logoutButton]}
            buttonColor="#F44336"
          >
            Logout
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
  profileCard: {
    marginBottom: 15,
  },
  profileContent: {
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    marginBottom: 15,
  },
  profileInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userRole: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 12,
  },
  infoCard: {
    marginBottom: 15,
  },
  divider: {
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
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
  settingsCard: {
    marginBottom: 15,
  },
  actionsCard: {
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 10,
  },
  loadingCard: {
    margin: 20,
    padding: 20,
    alignItems: "center",
  },
});

export default ProfileScreen;
