"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function ProfileScreen() {
  const [userStats, setUserStats] = useState({
    reportsSubmitted: 24,
    issuesResolved: 18,
    inProgress: 6,
  });

  const [recentActivity] = useState([
    {
      id: 1,
      title: "Pothole on Main St resolved",
      description: "Your report was successfully fixed",
      time: "2 hours ago",
      type: "resolved",
      icon: "check-circle",
    },
    {
      id: 2,
      title: "Broken streetlight update",
      description: "Issue is now in progress",
      time: "1 day ago",
      type: "progress",
      icon: "autorenew",
    },
    {
      id: 3,
      title: "New report submitted",
      description: "Garbage collection issue reported",
      time: "3 days ago",
      type: "submitted",
      icon: "report",
    },
  ]);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("userToken");
          router.replace("/login");
        },
      },
    ]);
  };

  const QuickActionItem = ({ icon, title, onPress }: any) => (
    <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
      <View style={styles.quickActionLeft}>
        <Icon name={icon} size={24} color="#4285F4" />
        <Text style={styles.quickActionTitle}>{title}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#9E9E9E" />
    </TouchableOpacity>
  );

  const SettingsItem = ({ icon, title, onPress, isSignOut = false }: any) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsLeft}>
        <Icon name={icon} size={24} color={isSignOut ? "#F44336" : "#666"} />
        <Text style={[styles.settingsTitle, isSignOut && { color: "#F44336" }]}>
          {title}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#9E9E9E" />
    </TouchableOpacity>
  );

  const ActivityItem = ({ item }: any) => (
    <View style={styles.activityItem}>
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: getActivityColor(item.type) },
        ]}
      >
        <Icon name={item.icon} size={16} color="white" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );

  const getActivityColor = (type: string) => {
    switch (type) {
      case "resolved":
        return "#4CAF50";
      case "progress":
        return "#FFC107";
      case "submitted":
        return "#4285F4";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="notifications" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="settings" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                }}
                style={styles.avatar}
              />
              <View style={styles.verifiedBadge}>
                <Icon name="verified" size={16} color="white" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>John Anderson</Text>
              <Text style={styles.userEmail}>john.anderson@email.com</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFC107" />
                <Text style={styles.rating}>4.8 Rating</Text>
                <Text style={styles.memberSince}>Since 2022</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Reports{"\n"}Submitted</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Issues{"\n"}Resolved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>6</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.sectionContent}>
            <QuickActionItem
              icon="add-circle"
              title="Report New Issue"
              onPress={() => router.push("/create-report")}
            />
            <QuickActionItem
              icon="list-alt"
              title="My Reports"
              onPress={() => router.push("/(tabs)/my-reports")}
            />
            <QuickActionItem
              icon="favorite"
              title="Favorite Locations"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.sectionContent}>
            {recentActivity.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon="notifications"
              title="Notifications"
              onPress={() => router.push("/notifications")}
            />
            <SettingsItem
              icon="security"
              title="Privacy & Security"
              onPress={() => {}}
            />
            <SettingsItem
              icon="help"
              title="Help & Support"
              onPress={() => router.push("/(tabs)/help")}
            />
            <SettingsItem icon="info" title="About" onPress={() => {}} />
            <SettingsItem
              icon="logout"
              title="Sign Out"
              onPress={handleSignOut}
              isSignOut={true}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  profileSection: {
    backgroundColor: "white",
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#4285F4",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  memberSince: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionContent: {
    backgroundColor: "white",
  },
  quickActionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  quickActionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  quickActionTitle: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingsTitle: {
    fontSize: 16,
    color: "#1A1A1A",
  },
});
