"use client";

import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  ProgressBar,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const StaffDashboard = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [assignedReports, setAssignedReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
    pending: 0,
  });

  useEffect(() => {
    loadUserData();
    loadAssignedReports();
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

  const loadAssignedReports = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const user = JSON.parse(userData);

      const reportsData = await AsyncStorage.getItem("reports");
      if (reportsData) {
        const allReports = JSON.parse(reportsData);
        const userAssignedReports = allReports.filter(
          (report) => report.assignedTo === user.id
        );
        setAssignedReports(userAssignedReports);

        // Calculate stats
        const total = userAssignedReports.length;
        const inProgress = userAssignedReports.filter(
          (r) => r.status === "In Progress"
        ).length;
        const resolved = userAssignedReports.filter(
          (r) => r.status === "Resolved"
        ).length;
        const pending = userAssignedReports.filter(
          (r) => r.status === "Pending"
        ).length;

        setStats({ total, inProgress, resolved, pending });
      }
    } catch (error) {
      console.error("Error loading assigned reports:", error);
    }
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

  const completionRate = stats.total > 0 ? stats.resolved / stats.total : 0;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <View style={styles.welcomeHeader}>
            <View>
              <Title>Welcome, {user?.name}!</Title>
              <Paragraph>Department Staff Dashboard</Paragraph>
            </View>
            <Icon name="badge" size={40} color="#3F51B5" />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Performance Overview</Title>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Paragraph>Completion Rate</Paragraph>
              <Paragraph style={styles.progressText}>
                {Math.round(completionRate * 100)}%
              </Paragraph>
            </View>
            <ProgressBar
              progress={completionRate}
              color="#4CAF50"
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="assignment" size={30} color="#3F51B5" />
            <Title>{stats.total}</Title>
            <Paragraph>Total Assigned</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="pending" size={30} color="#FFC107" />
            <Title>{stats.inProgress}</Title>
            <Paragraph>In Progress</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="check-circle" size={30} color="#4CAF50" />
            <Title>{stats.resolved}</Title>
            <Paragraph>Completed</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.actionCard}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <Button
            mode="contained"
            icon="list"
            onPress={() => navigation.navigate("Assigned Reports")}
            style={styles.actionButton}
          >
            View Assigned Reports
          </Button>
          <Button
            mode="outlined"
            icon="filter-list"
            onPress={() =>
              navigation.navigate("Assigned Reports", { filter: "pending" })
            }
            style={styles.actionButton}
          >
            View Pending Reports
          </Button>
        </Card.Content>
      </Card>

      {assignedReports.length > 0 && (
        <Card style={styles.recentCard}>
          <Card.Content>
            <Title>Recent Assignments</Title>
            {assignedReports.slice(0, 3).map((report) => (
              <View key={report.id} style={styles.reportItem}>
                <View style={styles.reportHeader}>
                  <Paragraph style={styles.reportTitle}>
                    {report.title}
                  </Paragraph>
                  <View style={styles.chipContainer}>
                    <Chip
                      style={[
                        styles.priorityChip,
                        { backgroundColor: getPriorityColor(report.priority) },
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
                  <Paragraph style={styles.reportLocation}>
                    {report.location}
                  </Paragraph>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
  },
  welcomeCard: {
    marginBottom: 15,
  },
  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsCard: {
    marginBottom: 15,
  },
  progressContainer: {
    marginTop: 15,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressText: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  statContent: {
    alignItems: "center",
  },
  actionCard: {
    marginBottom: 15,
  },
  actionButton: {
    marginTop: 10,
  },
  recentCard: {
    marginBottom: 15,
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
  reportLocation: {
    color: "#666",
    fontSize: 12,
  },
});

export default StaffDashboard;
