"use client";

import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Card, Title, Paragraph, Button, Avatar } from "react-native-paper";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "../../src/context/AppContext";

export default function CitizenDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const { user, getUserReports } = useApp();
  const userReports = getUserReports();

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "#FFC107";
      case "Resolved":
        return "#4CAF50";
      case "Pending":
        return "#FF5722";
      default:
        return "#9E9E9E";
    }
  };

  const reportCategories = [
    {
      id: 1,
      name: "Potholes",
      icon: "warning",
      color: "#FF5722",
      bgColor: "#FFEBEE",
    },
    {
      id: 2,
      name: "Garbage",
      icon: "delete",
      color: "#4CAF50",
      bgColor: "#E8F5E8",
    },
    {
      id: 3,
      name: "Street Lights",
      icon: "lightbulb",
      color: "#FFC107",
      bgColor: "#FFF8E1",
    },
    {
      id: 4,
      name: "Police",
      icon: "local-police",
      color: "#2196F3",
      bgColor: "#E3F2FD",
    },
  ];

  const recentReports = userReports.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Title style={styles.appName}>CitizenReport</Title>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <MaterialIcons name="notifications" size={24} color="#333333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Avatar.Text
                size={32}
                label={user?.name?.charAt(0) || "U"}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Report an Issue Section */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Report an Issue</Title>
          <View style={styles.categoriesGrid}>
            {reportCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push("/(tabs)/create-report")}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.bgColor },
                  ]}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={24}
                    color={category.color}
                  />
                </View>
                <Paragraph style={styles.categoryName}>
                  {category.name}
                </Paragraph>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Reports */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Recent Reports</Title>
            <Button
              mode="text"
              onPress={() => router.push("/(tabs)/my-reports")}
              textColor="#4285F4"
              style={styles.viewAllButton}
            >
              View All
            </Button>
          </View>

          {recentReports.length > 0 ? (
            <View style={styles.reportsContainer}>
              {recentReports.map((report) => (
                <TouchableOpacity key={report.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <View
                      style={[
                        styles.reportStatusIcon,
                        { backgroundColor: getStatusColor(report.status) },
                      ]}
                    >
                      <MaterialIcons
                        name={
                          report.status === "Resolved"
                            ? "check"
                            : report.status === "In Progress"
                            ? "autorenew"
                            : "warning"
                        }
                        size={16}
                        color="#FFFFFF"
                      />
                    </View>
                    <View style={styles.reportContent}>
                      <Paragraph style={styles.reportTitle} numberOfLines={1}>
                        {report.title}
                      </Paragraph>
                      <Paragraph style={styles.reportMeta}>
                        Reported •{" "}
                        {new Date(report.createdAt).toLocaleDateString()} • 👁{" "}
                        {Math.floor(Math.random() * 50) + 10} views
                      </Paragraph>
                      <View style={styles.reportStatus}>
                        <Paragraph
                          style={[
                            styles.reportStatusText,
                            { color: getStatusColor(report.status) },
                          ]}
                        >
                          {report.status}
                        </Paragraph>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <MaterialIcons name="report-off" size={48} color="#CCCCCC" />
                <Paragraph style={styles.emptyText}>No reports yet</Paragraph>
                <Button
                  mode="contained"
                  onPress={() => router.push("/(tabs)/create-report")}
                  style={styles.createFirstButton}
                  buttonColor="#4285F4"
                >
                  Create Your First Report
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Community Impact */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Community Impact</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>127</Title>
              <Paragraph style={styles.statLabel}>Reports Filed</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={[styles.statNumber, { color: "#4CAF50" }]}>
                94
              </Title>
              <Paragraph style={styles.statLabel}>Resolved</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={[styles.statNumber, { color: "#FFC107" }]}>
                33
              </Title>
              <Paragraph style={styles.statLabel}>In Progress</Paragraph>
            </View>
          </View>
        </View>

        {/* Emergency Report Button */}
        <View style={styles.emergencySection}>
          <Button
            mode="contained"
            onPress={() => router.push("/(tabs)/create-report")}
            style={styles.emergencyButton}
            contentStyle={styles.emergencyButtonContent}
            buttonColor="#FF5722"
            icon={() => (
              <MaterialIcons name="warning" size={20} color="#FFFFFF" />
            )}
          >
            Report Emergency
          </Button>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4285F4",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  avatar: {
    backgroundColor: "#4285F4",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  viewAllButton: {
    marginRight: -12,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    textAlign: "center",
  },
  reportsContainer: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  reportStatusIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 8,
  },
  reportStatus: {
    alignSelf: "flex-start",
  },
  reportStatusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 1,
  },
  emptyContent: {
    alignItems: "center",
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    marginVertical: 16,
  },
  createFirstButton: {
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    elevation: 1,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
  },
  emergencySection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emergencyButton: {
    borderRadius: 12,
    elevation: 4,
  },
  emergencyButtonContent: {
    paddingVertical: 12,
  },
});
