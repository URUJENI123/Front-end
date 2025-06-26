"use client";

import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Card, Title, Paragraph, Chip, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Generate sample notifications based on user reports and activities
      const userData = await AsyncStorage.getItem("user");
      const user = JSON.parse(userData);

      const reportsData = await AsyncStorage.getItem("reports");
      const reports = reportsData ? JSON.parse(reportsData) : [];

      // Generate notifications based on user role and reports
      const sampleNotifications = generateNotifications(user, reports);
      setNotifications(sampleNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const generateNotifications = (user, reports) => {
    const notifications = [];
    const now = new Date();

    if (user.role === "USER") {
      // Citizen notifications
      const userReports = reports.filter((r) => r.userId === user.id);

      userReports.forEach((report, index) => {
        if (report.status === "In Progress") {
          notifications.push({
            id: `progress_${report.id}`,
            title: "Report Update",
            message: `Your report "${report.title}" is now in progress.`,
            type: "update",
            timestamp: new Date(now.getTime() - index * 3600000).toISOString(),
            read: Math.random() > 0.5,
            reportId: report.id,
          });
        }

        if (report.status === "Resolved") {
          notifications.push({
            id: `resolved_${report.id}`,
            title: "Report Resolved",
            message: `Your report "${report.title}" has been resolved.`,
            type: "success",
            timestamp: new Date(now.getTime() - index * 7200000).toISOString(),
            read: Math.random() > 0.3,
            reportId: report.id,
          });
        }
      });
    } else if (user.role === "STAFF") {
      // Staff notifications
      const assignedReports = reports.filter((r) => r.assignedTo === user.id);

      assignedReports.forEach((report, index) => {
        notifications.push({
          id: `assigned_${report.id}`,
          title: "New Assignment",
          message: `You have been assigned a new report: "${report.title}".`,
          type: "assignment",
          timestamp: new Date(now.getTime() - index * 1800000).toISOString(),
          read: Math.random() > 0.4,
          reportId: report.id,
        });
      });
    } else if (user.role === "SUPER_ADMIN") {
      // Super Admin notifications
      const recentReports = reports.slice(0, 5);

      recentReports.forEach((report, index) => {
        notifications.push({
          id: `new_report_${report.id}`,
          title: "New Report Submitted",
          message: `New report "${report.title}" submitted by ${report.userName}.`,
          type: "new",
          timestamp: new Date(now.getTime() - index * 900000).toISOString(),
          read: Math.random() > 0.6,
          reportId: report.id,
        });
      });
    }

    // Add some system notifications
    notifications.push(
      {
        id: "system_1",
        title: "System Maintenance",
        message:
          "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM.",
        type: "system",
        timestamp: new Date(now.getTime() - 86400000).toISOString(),
        read: false,
      },
      {
        id: "welcome",
        title: "Welcome!",
        message:
          "Welcome to the Citizen Complaint Portal. Start by creating your first report.",
        type: "info",
        timestamp: new Date(now.getTime() - 172800000).toISOString(),
        read: true,
      }
    );

    return notifications.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  const markAsRead = async (notificationId) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
  };

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      read: true,
    }));
    setNotifications(updatedNotifications);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "update":
        return "update";
      case "success":
        return "check-circle";
      case "assignment":
        return "assignment";
      case "new":
        return "fiber-new";
      case "system":
        return "settings";
      case "info":
        return "info";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "update":
        return "#FFC107";
      case "success":
        return "#4CAF50";
      case "assignment":
        return "#3F51B5";
      case "new":
        return "#FF5722";
      case "system":
        return "#9E9E9E";
      case "info":
        return "#2196F3";
      default:
        return "#9E9E9E";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleNotificationPress = (notification) => {
    markAsRead(notification.id);

    if (notification.reportId) {
      // Navigate to report details if notification has a report ID
      navigation.navigate("ReportDetails", {
        report: { id: notification.reportId },
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title>Notifications</Title>
              <Paragraph>{unreadCount} unread notifications</Paragraph>
            </View>
            {unreadCount > 0 && (
              <Button mode="outlined" onPress={markAllAsRead} compact>
                Mark All Read
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="notifications-none" size={60} color="#9E9E9E" />
              <Title style={styles.emptyTitle}>No Notifications</Title>
              <Paragraph style={styles.emptyText}>
                You're all caught up! New notifications will appear here.
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              <Card.Content>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationIcon}>
                    <Icon
                      name={getNotificationIcon(notification.type)}
                      size={24}
                      color={getNotificationColor(notification.type)}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationTitleRow}>
                      <Title style={styles.notificationTitle}>
                        {notification.title}
                      </Title>
                      {!notification.read && <View style={styles.unreadDot} />}
                    </View>
                    <Paragraph style={styles.notificationMessage}>
                      {notification.message}
                    </Paragraph>
                    <View style={styles.notificationFooter}>
                      <Chip
                        style={[
                          styles.typeChip,
                          {
                            backgroundColor: getNotificationColor(
                              notification.type
                            ),
                          },
                        ]}
                        textStyle={{ color: "white", fontSize: 10 }}
                      >
                        {notification.type.toUpperCase()}
                      </Chip>
                      <Paragraph style={styles.timestamp}>
                        {formatTimestamp(notification.timestamp)}
                      </Paragraph>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerCard: {
    margin: 15,
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyCard: {
    margin: 15,
    marginTop: 50,
  },
  emptyContent: {
    alignItems: "center",
    padding: 30,
  },
  emptyTitle: {
    marginTop: 15,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
  },
  notificationCard: {
    margin: 15,
    marginBottom: 10,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3F51B5",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationIcon: {
    marginRight: 15,
    marginTop: 5,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3F51B5",
    marginLeft: 10,
  },
  notificationMessage: {
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeChip: {
    height: 20,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
});

export default NotificationsScreen;
