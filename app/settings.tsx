"use client";

import type React from "react";

import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Title, Paragraph, Avatar } from "react-native-paper";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightComponent,
    iconColor = "#666666",
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
    iconColor?: string;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}
        >
          <MaterialIcons name={icon as any} size={20} color={iconColor} />
        </View>
        <View style={styles.settingText}>
          <Paragraph style={styles.settingTitle}>{title}</Paragraph>
          {subtitle && (
            <Paragraph style={styles.settingSubtitle}>{subtitle}</Paragraph>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && (
          <MaterialIcons name="chevron-right" size={20} color="#CCCCCC" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Settings</Title>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Admin User Profile */}
        <TouchableOpacity style={styles.profileSection}>
          <Avatar.Image
            size={48}
            source={{ uri: "/placeholder.svg?height=48&width=48" }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <Paragraph style={styles.profileName}>Admin User</Paragraph>
            <Paragraph style={styles.profileEmail}>
              admin@services.gov
            </Paragraph>
            <Paragraph style={styles.profileRole}>Administrator</Paragraph>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        {/* Account Section */}
        <View style={styles.section}>
          <Paragraph style={styles.sectionTitle}>Account</Paragraph>

          <SettingItem
            icon="person"
            title="Profile Information"
            iconColor="#4285F4"
            onPress={() => {}}
          />

          <SettingItem
            icon="security"
            title="Security & Privacy"
            iconColor="#4CAF50"
            onPress={() => {}}
          />

          <SettingItem
            icon="notifications"
            title="Notifications"
            iconColor="#9C27B0"
            showArrow={false}
            rightComponent={
              <View style={styles.switchContainer}>
                <Paragraph style={styles.switchLabel}>On</Paragraph>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#E0E0E0", true: "#4285F4" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            }
          />
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Paragraph style={styles.sectionTitle}>App Settings</Paragraph>

          <SettingItem
            icon="palette"
            title="Theme"
            subtitle="Light"
            iconColor="#FF9800"
            onPress={() => {}}
          />

          <SettingItem
            icon="language"
            title="Language"
            subtitle="English"
            iconColor="#673AB7"
            onPress={() => {}}
          />

          <SettingItem
            icon="storage"
            title="Data & Storage"
            iconColor="#F44336"
            onPress={() => {}}
          />
        </View>

        {/* Department Management Section */}
        <View style={styles.section}>
          <Paragraph style={styles.sectionTitle}>
            Department Management
          </Paragraph>

          <SettingItem
            icon="business"
            title="Manage Departments"
            iconColor="#00BCD4"
            onPress={() => router.push("/(tabs)/departments")}
          />

          <SettingItem
            icon="admin-panel-settings"
            title="User Permissions"
            iconColor="#4CAF50"
            onPress={() => {}}
          />

          <SettingItem
            icon="schedule"
            title="Response Times"
            iconColor="#FFC107"
            onPress={() => {}}
          />
        </View>

        {/* System Section */}
        <View style={styles.section}>
          <Paragraph style={styles.sectionTitle}>System</Paragraph>

          <SettingItem
            icon="backup"
            title="Backup & Export"
            iconColor="#607D8B"
            onPress={() => {}}
          />

          <SettingItem
            icon="analytics"
            title="Analytics Settings"
            iconColor="#3F51B5"
            onPress={() => {}}
          />

          <SettingItem
            icon="sync"
            title="Sync Settings"
            iconColor="#4CAF50"
            showArrow={false}
            rightComponent={
              <Switch
                value={syncEnabled}
                onValueChange={setSyncEnabled}
                trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        {/* Support & Legal Section */}
        <View style={styles.section}>
          <Paragraph style={styles.sectionTitle}>Support & Legal</Paragraph>

          <SettingItem
            icon="help"
            title="Help & Support"
            iconColor="#4CAF50"
            onPress={() => router.push("/(tabs)/help")}
          />

          <SettingItem
            icon="description"
            title="Terms & Privacy"
            iconColor="#673AB7"
            onPress={() => {}}
          />

          <SettingItem
            icon="info"
            title="About"
            subtitle="v2.1.0"
            iconColor="#E91E63"
            onPress={() => {}}
          />
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton}>
          <MaterialIcons name="logout" size={20} color="#F44336" />
          <Paragraph style={styles.signOutText}>Sign Out</Paragraph>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  profileAvatar: {
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 12,
    color: "#4285F4",
    fontWeight: "500",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
    marginLeft: 20,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingItem: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: "#666666",
    marginRight: 8,
  },
  signOutButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFE5E5",
  },
  signOutText: {
    fontSize: 16,
    color: "#F44336",
    fontWeight: "500",
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});
