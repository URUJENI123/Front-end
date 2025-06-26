"use client";

import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Card, Title, Paragraph, Button, FAB, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const CitizenDashboard = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const user = JSON.parse(userData);
      setUser(user);

      const reportsData = await AsyncStorage.getItem("reports");
      if (reportsData) {
        const allReports = JSON.parse(reportsData);
        const userReports = allReports.filter(
          (report) => report.userId === user.id
        );

        // Calculate stats
        const totalReports = userReports.length;
        const pendingReports = userReports.filter(
          (r) => r.status === "Pending"
        ).length;
        const inProgressReports = userReports.filter(
          (r) => r.status === "In Progress"
        ).length;
        const resolvedReports = userReports.filter(
          (r) => r.status === "Resolved"
        ).length;

        setStats({
          totalReports,
          pendingReports,
          inProgressReports,
          resolvedReports,
        });
        setRecentReports(
          userReports
            .slice(0, 3)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
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

  const getPriorityColor = (priority) => {
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <View style={styles.welcomeHeader}>
              <View>
                <Title>Welcome, {user?.name}!</Title>
                <Paragraph>Track your reports and community issues</Paragraph>
              </View>
              <Icon name="person" size={40} color="#3F51B5" />
            </View>
          </Card.Content>
        </Card>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="list-alt" size={30} color="#3F51B5" />
              <Title>{stats.totalReports}</Title>
              <Paragraph>Total Reports</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="pending" size={30} color="#9E9E9E" />
              <Title>{stats.pendingReports}</Title>
              <Paragraph>Pending</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="autorenew" size={30} color="#FFC107" />
              <Title>{stats.inProgressReports}</Title>
              <Paragraph>In Progress</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="check-circle" size={30} color="#4CAF50" />
              <Title>{stats.resolvedReports}</Title>
              <Paragraph>Resolved</Paragraph>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.actionCard}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <Button
              mode="contained"
              icon="add"
              onPress={() => navigation.navigate("Create Report")}
              style={styles.actionButton}
            >
              Create New Report
            </Button>
            <Button
              mode="outlined"
              icon="list"
              onPress={() => navigation.navigate("My Reports")}
              style={styles.actionButton}
            >
              View All Reports
            </Button>
          </Card.Content>
        </Card>

        {recentReports.length > 0 && (
          <Card style={styles.recentCard}>
            <Card.Content>
              <Title>Recent Reports</Title>
              {recentReports.map((report) => (
                <View key={report.id} style={styles.reportItem}>
                  <View style={styles.reportHeader}>
                    <Paragraph style={styles.reportTitle}>
                      {report.title}
                    </Paragraph>
                    <View style={styles.chipContainer}>
                      <Chip
                        style={[
                          styles.priorityChip,
                          {
                            backgroundColor: getPriorityColor(report.priority),
                          },
                        ]}
                        textStyle={{ color: "white", fontSize: 10 }}
                      >
                        {report.priority}
                      </Chip>
                      <Chip
                        style={[
                          styles.statusChip,
                          { backgroundColor: getStatusColor(report.status) },
                        ]}
                        textStyle={{ color: "white", fontSize: 10 }}
                      >
                        {report.status}
                      </Chip>
                    </View>
                  </View>
                  <View style={styles.reportMeta}>
                    <Paragraph style={styles.reportCategory}>
                      {report.category}
                    </Paragraph>
                    <Paragraph style={styles.reportDate}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Paragraph>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("Create Report")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  welcomeCard: {
    margin: 15,
    marginBottom: 10,
  },
  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginBottom: 10,
  },
  statContent: {
    alignItems: "center",
  },
  actionCard: {
    margin: 15,
    marginBottom: 10,
  },
  actionButton: {
    marginTop: 10,
  },
  recentCard: {
    margin: 15,
    marginBottom: 80,
  },
  reportItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  reportTitle: {
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  chipContainer: {
    flexDirection: "row",
    gap: 5,
  },
  priorityChip: {
    height: 20,
  },
  statusChip: {
    height: 20,
  },
  reportMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reportCategory: {
    color: "#666",
    fontSize: 12,
  },
  reportDate: {
    color: "#666",
    fontSize: 12,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#3F51B5",
  },
});

export default CitizenDashboard;
