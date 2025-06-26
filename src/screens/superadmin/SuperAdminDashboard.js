"use client";

import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Card, Title, Paragraph, Button, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const SuperAdminDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
    totalUsers: 0,
    totalStaff: 0,
    totalDepartments: 0,
    activeDepartments: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load reports
      const reportsData = await AsyncStorage.getItem("reports");
      const reports = reportsData ? JSON.parse(reportsData) : [];

      // Load users
      const usersData = await AsyncStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : [];

      // Load staff
      const staffData = await AsyncStorage.getItem("staff");
      const staff = staffData ? JSON.parse(staffData) : [];

      // Load departments
      const departmentsData = await AsyncStorage.getItem("departments");
      const departments = departmentsData ? JSON.parse(departmentsData) : [];

      // Calculate stats
      const totalReports = reports.length;
      const pendingReports = reports.filter(
        (r) => r.status === "Pending"
      ).length;
      const inProgressReports = reports.filter(
        (r) => r.status === "In Progress"
      ).length;
      const resolvedReports = reports.filter(
        (r) => r.status === "Resolved"
      ).length;
      const totalUsers = users.filter((u) => u.role === "USER").length;
      const totalStaff = staff.length;
      const totalDepartments = departments.length;
      const activeDepartments = departments.filter((d) => d.active).length;

      setStats({
        totalReports,
        pendingReports,
        inProgressReports,
        resolvedReports,
        totalUsers,
        totalStaff,
        totalDepartments,
        activeDepartments,
      });

      // Get recent reports
      const sortedReports = reports.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentReports(sortedReports.slice(0, 5));
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Card */}
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <View style={styles.welcomeHeader}>
            <View>
              <Title>Super Admin Dashboard</Title>
              <Paragraph>System Overview and Management</Paragraph>
            </View>
            <Icon name="admin-panel-settings" size={40} color="#3F51B5" />
          </View>
        </Card.Content>
      </Card>

      {/* Reports Stats */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Reports Overview</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="list-alt" size={30} color="#3F51B5" />
              <Title>{stats.totalReports}</Title>
              <Paragraph>Total Reports</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Icon name="pending" size={30} color="#9E9E9E" />
              <Title>{stats.pendingReports}</Title>
              <Paragraph>Pending</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Icon name="autorenew" size={30} color="#FFC107" />
              <Title>{stats.inProgressReports}</Title>
              <Paragraph>In Progress</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Icon name="check-circle" size={30} color="#4CAF50" />
              <Title>{stats.resolvedReports}</Title>
              <Paragraph>Resolved</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* System Stats */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>System Overview</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="people" size={30} color="#4CAF50" />
              <Title>{stats.totalUsers}</Title>
              <Paragraph>Citizens</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Icon name="badge" size={30} color="#FF9800" />
              <Title>{stats.totalStaff}</Title>
              <Paragraph>Staff Members</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Icon name="business" size={30} color="#9C27B0" />
              <Title>{stats.totalDepartments}</Title>
              <Paragraph>Departments</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Icon name="verified" size={30} color="#4CAF50" />
              <Title>{stats.activeDepartments}</Title>
              <Paragraph>Active Depts</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon="assignment-ind"
              onPress={() => navigation.navigate("Assign")}
              style={styles.actionButton}
            >
              Assign Reports
            </Button>
            <Button
              mode="outlined"
              icon="people"
              onPress={() => navigation.navigate("Users")}
              style={styles.actionButton}
            >
              Manage Users
            </Button>
            <Button
              mode="outlined"
              icon="business"
              onPress={() => navigation.navigate("Departments")}
              style={styles.actionButton}
            >
              Manage Departments
            </Button>
            <Button
              mode="outlined"
              icon="supervisor-account"
              onPress={() => navigation.navigate("Staff")}
              style={styles.actionButton}
            >
              Manage Staff
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Reports */}
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
                  <Paragraph style={styles.reportUser}>
                    by {report.userName}
                  </Paragraph>
                  <Paragraph style={styles.reportDate}>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </Paragraph>
                </View>
              </View>
            ))}
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Reports")}
              style={styles.viewAllButton}
            >
              View All Reports
            </Button>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
  },
  statItem: {
    width: "48%",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    marginBottom: 10,
  },
  actionsCard: {
    marginBottom: 15,
  },
  actionButtons: {
    marginTop: 15,
  },
  actionButton: {
    marginBottom: 10,
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
  reportUser: {
    color: "#666",
    fontSize: 12,
  },
  reportDate: {
    color: "#666",
    fontSize: 12,
  },
  viewAllButton: {
    marginTop: 15,
  },
});

export default SuperAdminDashboard;
