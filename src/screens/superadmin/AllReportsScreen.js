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

const AllReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const statusOptions = ["All", "Pending", "In Progress", "Resolved"];
  const priorityOptions = ["All", "High", "Medium", "Low"];

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchQuery, filterStatus, filterPriority, reports]);

  const loadReports = async () => {
    try {
      const reportsData = await AsyncStorage.getItem("reports");
      if (reportsData) {
        const allReports = JSON.parse(reportsData);
        setReports(
          allReports.sort(
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

    // Filter by priority
    if (filterPriority !== "All") {
      filtered = filtered.filter(
        (report) => report.priority === filterPriority
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
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
      {/* Search and Filters */}
      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Search reports..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <View style={styles.filterButtons}>
          <Menu
            visible={statusMenuVisible}
            onDismiss={() => setStatusMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setStatusMenuVisible(true)}
                icon="filter-list"
                style={styles.filterButton}
                compact
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
                  setStatusMenuVisible(false);
                }}
                title={status}
              />
            ))}
          </Menu>

          <Menu
            visible={priorityMenuVisible}
            onDismiss={() => setPriorityMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setPriorityMenuVisible(true)}
                icon="priority-high"
                style={styles.filterButton}
                compact
              >
                {filterPriority}
              </Button>
            }
          >
            {priorityOptions.map((priority) => (
              <Menu.Item
                key={priority}
                onPress={() => {
                  setFilterPriority(priority);
                  setPriorityMenuVisible(false);
                }}
                title={priority}
              />
            ))}
          </Menu>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredReports.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="report-off" size={60} color="#9E9E9E" />
              <Title style={styles.emptyTitle}>No Reports Found</Title>
              <Paragraph style={styles.emptyText}>
                {searchQuery ||
                filterStatus !== "All" ||
                filterPriority !== "All"
                  ? "No reports match your current filters."
                  : "No reports have been submitted yet."}
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
                    <Icon name="person" size={16} color="#666" />
                    <Paragraph style={styles.metaText}>
                      {report.userName}
                    </Paragraph>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="category" size={16} color="#666" />
                    <Paragraph style={styles.metaText}>
                      {report.category}
                    </Paragraph>
                  </View>
                </View>

                <View style={styles.reportMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="location-on" size={16} color="#666" />
                    <Paragraph style={styles.metaText}>
                      {report.location}
                    </Paragraph>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="schedule" size={16} color="#666" />
                    <Paragraph style={styles.metaText}>
                      {formatDate(report.createdAt)}
                    </Paragraph>
                  </View>
                </View>

                <Paragraph style={styles.description} numberOfLines={2}>
                  {report.description}
                </Paragraph>

                {report.assignedTo && (
                  <View style={styles.assignmentInfo}>
                    <Icon name="assignment-ind" size={16} color="#3F51B5" />
                    <Paragraph style={styles.assignmentText}>
                      Assigned to staff
                    </Paragraph>
                  </View>
                )}

                <Divider style={styles.divider} />

                <View style={styles.actionContainer}>
                  <Button
                    mode="outlined"
                    onPress={() =>
                      navigation.navigate("ReportDetails", { report })
                    }
                    style={styles.actionButton}
                    compact
                  >
                    View Details
                  </Button>

                  {!report.assignedTo && (
                    <Button
                      mode="contained"
                      onPress={() =>
                        navigation.navigate("Assign", { reportId: report.id })
                      }
                      style={styles.actionButton}
                      compact
                    >
                      Assign
                    </Button>
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
    padding: 15,
    paddingBottom: 10,
  },
  searchbar: {
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 10,
  },
  filterButton: {
    flex: 1,
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
    marginBottom: 8,
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
  assignmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  assignmentText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#3F51B5",
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 10,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    minWidth: 80,
  },
});

export default AllReportsScreen;
