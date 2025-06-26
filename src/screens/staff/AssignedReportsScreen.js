"use client";

import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  Searchbar,
  Menu,
  Divider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const AssignedReportsScreen = ({ navigation, route }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  const statusOptions = ["All", "Pending", "In Progress", "Resolved"];

  useEffect(() => {
    loadUserAndReports();
    if (route.params?.filter) {
      setFilterStatus(route.params.filter);
    }
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchQuery, filterStatus, reports]);

  const loadUserAndReports = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const user = JSON.parse(userData);
      setUser(user);

      const reportsData = await AsyncStorage.getItem("reports");
      if (reportsData) {
        const allReports = JSON.parse(reportsData);
        const assignedReports = allReports.filter(
          (report) => report.assignedTo === user.id
        );
        setReports(
          assignedReports.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }
    } catch (error) {
      console.error("Error loading reports:", error);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter((report) => report.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const reportsData = await AsyncStorage.getItem("reports");
      const allReports = JSON.parse(reportsData);
      const updatedReports = allReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : report
      );

      await AsyncStorage.setItem("reports", JSON.stringify(updatedReports));
      await loadUserAndReports();
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserAndReports();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Search reports..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              icon="filter-list"
              style={styles.filterButton}
            >
              {filterStatus}
            </Button>
          }
        >
          {statusOptions.map((status) => (
            <Menu.Item
              key={status}
              onPress={() => {
                setFilterStatus(status);
                setMenuVisible(false);
              }}
              title={status}
            />
          ))}
        </Menu>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredReports.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="assignment-turned-in" size={60} color="#9E9E9E" />
              <Title style={styles.emptyTitle}>No Reports Found</Title>
              <Paragraph style={styles.emptyText}>
                {searchQuery || filterStatus !== "All"
                  ? "No reports match your current filters."
                  : "You don't have any assigned reports yet."}
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} style={styles.reportCard}>
              <Card.Content>
                <View style={styles.reportHeader}>
                  <Title style={styles.reportTitle}>{report.title}</Title>
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
                      textStyle={{ color: "white", fontSize: 12 }}
                    >
                      {report.status}
                    </Chip>
                  </View>
                </View>

                <View style={styles.reportMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="category" size={16} color="#666" />
                    <Paragraph style={styles.metaText}>
                      {report.category}
                    </Paragraph>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="location-on" size={16} color="#666" />
                    <Paragraph style={styles.metaText}>
                      {report.location}
                    </Paragraph>
                  </View>
                </View>

                <Paragraph style={styles.description} numberOfLines={2}>
                  {report.description}
                </Paragraph>

                <View style={styles.reportFooter}>
                  <Paragraph style={styles.dateText}>
                    Created: {formatDate(report.createdAt)}
                  </Paragraph>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.actionContainer}>
                  <Button
                    mode="outlined"
                    onPress={() =>
                      navigation.navigate("ReportDetails", {
                        report,
                        isStaff: true,
                      })
                    }
                    style={styles.actionButton}
                    compact
                  >
                    View Details
                  </Button>

                  {report.status !== "Resolved" && (
                    <View style={styles.statusButtons}>
                      {report.status === "Pending" && (
                        <Button
                          mode="contained"
                          onPress={() =>
                            updateReportStatus(report.id, "In Progress")
                          }
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#FFC107" },
                          ]}
                          compact
                        >
                          Start Work
                        </Button>
                      )}

                      {report.status === "In Progress" && (
                        <Button
                          mode="contained"
                          onPress={() =>
                            updateReportStatus(report.id, "Resolved")
                          }
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#4CAF50" },
                          ]}
                          compact
                        >
                          Mark Done
                        </Button>
                      )}
                    </View>
                  )}
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
  filterContainer: {
    flexDirection: "row",
    padding: 15,
    paddingBottom: 10,
    gap: 10,
  },
  searchbar: {
    flex: 1,
  },
  filterButton: {
    alignSelf: "center",
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
  reportCard: {
    margin: 15,
    marginBottom: 10,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  reportTitle: {
    flex: 1,
    fontSize: 16,
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
    height: 24,
  },
  reportMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  metaText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#666",
  },
  description: {
    color: "#333",
    marginBottom: 10,
  },
  reportFooter: {
    marginBottom: 10,
  },
  dateText: {
    fontSize: 11,
    color: "#999",
  },
  divider: {
    marginVertical: 10,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    minWidth: 80,
  },
});

export default AssignedReportsScreen;
