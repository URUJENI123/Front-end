"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Card, Title, Paragraph, Button, FAB, Chip } from "react-native-paper";
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
        return "#9E9E9E";
      default:
        return "#9E9E9E";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#F44336";
      case "Medium":
        return "#FFC107";
      case "Low":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <Card.Content style={styles.welcomeContent}>
            <View style={styles.welcomeText}>
              <Title style={styles.welcomeTitle}>
                Welcome, {user?.name?.split(" ")[0]}!
              </Title>
              <Paragraph style={styles.welcomeSubtitle}>
                Track your reports and community issues
              </Paragraph>
            </View>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="person" size={32} color="#3F51B5" />
            </View>
          </Card.Content>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialIcons
                name="list-alt"
                size={24}
                color="#3F51B5"
                style={styles.statIcon}
              />
              <Title style={styles.statNumber}>{userReports.length}</Title>
              <Paragraph style={styles.statLabel}>Total Reports</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialIcons
                name="pending"
                size={24}
                color="#9E9E9E"
                style={styles.statIcon}
              />
              <Title style={styles.statNumber}>
                {userReports.filter((r: { status: string; }) => r.status === "Pending").length}
              </Title>
              <Paragraph style={styles.statLabel}>Pending</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialIcons
                name="autorenew"
                size={24}
                color="#FFC107"
                style={styles.statIcon}
              />
              <Title style={styles.statNumber}>
                {userReports.filter((r: { status: string; }) => r.status === "In Progress").length}
              </Title>
              <Paragraph style={styles.statLabel}>In Progress</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialIcons
                name="check-circle"
                size={24}
                color="#4CAF50"
                style={styles.statIcon}
              />
              <Title style={styles.statNumber}>
                {userReports.filter((r: { status: string; }) => r.status === "Resolved").length}
              </Title>
              <Paragraph style={styles.statLabel}>Resolved</Paragraph>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.actionCard}>
          <Card.Content style={styles.actionContent}>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <Button
              mode="contained"
              onPress={() => router.push("/(tabs)/create-report")}
              style={styles.primaryAction}
              contentStyle={styles.actionButtonContent}
              buttonColor="#3F51B5"
              icon="add"
            >
              Create New Report
            </Button>
            <Button
              mode="outlined"
              onPress={() => router.push("/(tabs)/my-reports")}
              style={styles.secondaryAction}
              contentStyle={styles.actionButtonContent}
              textColor="#3F51B5"
              theme={{
                colors: {
                  outline: "#3F51B5",
                },
              }}
              icon="list"
            >
              View All Reports
            </Button>
          </Card.Content>
        </Card>

        {/* Recent Reports */}
        {userReports.length > 0 && (
          <Card style={styles.recentCard}>
            <Card.Content style={styles.recentContent}>
              <Title style={styles.sectionTitle}>Recent Reports</Title>
              {userReports.slice(0, 3).map((report: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; priority: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; category: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; createdAt: string | number | Date; }) => (
                <View key={report.id} style={styles.reportItem}>
                  <View style={styles.reportHeader}>
                    <Paragraph style={styles.reportTitle} numberOfLines={1}>
                      {report.title}
                    </Paragraph>
                    <View style={styles.reportChips}>
                      <Chip
                        style={[
                          styles.priorityChip,
                          {
                            backgroundColor: getPriorityColor(report.priority),
                          },
                        ]}
                        textStyle={styles.chipText}
                      >
                        {report.priority}
                      </Chip>
                      <Chip
                        style={[
                          styles.statusChip,
                          { backgroundColor: getStatusColor(report.status) },
                        ]}
                        textStyle={styles.chipText}
                      >
                        {report.status}
                      </Chip>
                    </View>
                  </View>
                  <View style={styles.reportMeta}>
                    <Paragraph style={styles.metaText}>
                      {report.category}
                    </Paragraph>
                    <Paragraph style={styles.metaText}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Paragraph>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push("/(tabs)/create-report")}
        color="#FFFFFF"
      />
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
  welcomeCard: {
    margin: 15,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
  },
  welcomeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8EAF6",
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  statContent: {
    alignItems: "center",
    padding: 16,
  },
  statIcon: {
    marginBottom: 8,
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
    textAlign: "center",
  },
  actionCard: {
    margin: 15,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
  },
  actionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  primaryAction: {
    borderRadius: 8,
    marginBottom: 12,
  },
  secondaryAction: {
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  recentCard: {
    margin: 15,
    marginBottom: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
  },
  recentContent: {
    padding: 20,
  },
  reportItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
    marginRight: 8,
  },
  reportChips: {
    flexDirection: "row",
    gap: 4,
  },
  priorityChip: {
    height: 20,
  },
  statusChip: {
    height: 20,
  },
  chipText: {
    fontSize: 10,
    color: "#FFFFFF",
  },
  reportMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 12,
    color: "#666666",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#3F51B5",
  },
});
