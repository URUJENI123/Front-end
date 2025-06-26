"use client";

import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  Chip,
  Menu,
  Divider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const AssignReportsScreen = ({ navigation, route }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Unassigned");
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [assignMenus, setAssignMenus] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const statusOptions = [
    "All",
    "Unassigned",
    "Assigned",
    "Pending",
    "In Progress",
    "Resolved",
  ];

  useEffect(() => {
    loadData();
    // If coming from a specific report, focus on unassigned
    if (route.params?.reportId) {
      setFilterStatus("Unassigned");
    }
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchQuery, filterStatus, reports]);

  const loadData = async () => {
    try {
      // Load reports
      const reportsData = await AsyncStorage.getItem("reports");
      if (reportsData) {
        const allReports = JSON.parse(reportsData);
        setReports(
          allReports.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }

      // Load staff
      const staffData = await AsyncStorage.getItem("staff");
      if (staffData) {
        const allStaff = JSON.parse(staffData);
        setStaff(allStaff.filter((member) => member.active));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    // Filter by assignment status
    if (filterStatus === "Unassigned") {
      filtered = filtered.filter((report) => !report.assignedTo);
    } else if (filterStatus === "Assigned") {
      filtered = filtered.filter((report) => report.assignedTo);
    } else if (filterStatus !== "All") {
      filtered = filtered.filter((report) => report.status === filterStatus);
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

  const assignReport = async (reportId, staffId) => {
    try {
      const selectedStaff = staff.find((member) => member.id === staffId);

      const updatedReports = reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              assignedTo: staffId,
              assignedStaffName: selectedStaff.name,
              status: "Pending",
              updatedAt: new Date().toISOString(),
            }
          : report
      );

      await AsyncStorage.setItem("reports", JSON.stringify(updatedReports));
      setReports(updatedReports);

      // Close the menu
      setAssignMenus({ ...assignMenus, [reportId]: false });

      Alert.alert(
        "Success",
        `Report assigned to ${selectedStaff.name} successfully!`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to assign report");
    }
  };

  const unassignReport = async (reportId) => {
    Alert.alert(
      "Unassign Report",
      "Are you sure you want to unassign this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unassign",
          onPress: async () => {
            try {
              const updatedReports = reports.map((report) =>
                report.id === reportId
                  ? {
                      ...report,
                      assignedTo: null,
                      assignedStaffName: null,
                      status: "Pending",
                      updatedAt: new Date().toISOString(),
                    }
                  : report
              );

              await AsyncStorage.setItem(
                "reports",
                JSON.stringify(updatedReports)
              );
              setReports(updatedReports);
              Alert.alert("Success", "Report unassigned successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to unassign report");
            }
          },
        },
      ]
    );
  };

  const toggleAssignMenu = (reportId) => {
    setAssignMenus({
      ...assignMenus,
      [reportId]: !assignMenus[reportId],
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
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

  const getStaffByDepartment = (category) => {
    return staff.filter(
      (member) =>
        member.departmentName.toLowerCase().includes(category.toLowerCase()) ||
        category.toLowerCase().includes(member.departmentName.toLowerCase())
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

        <Menu
          visible={statusMenuVisible}
          onDismiss={() => setStatusMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setStatusMenuVisible(true)}
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
                setStatusMenuVisible(false);
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
                  : "No reports available for assignment."}
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
                      Assigned to: {report.assignedStaffName || "Unknown Staff"}
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

                  {!report.assignedTo ? (
                    <Menu
                      visible={assignMenus[report.id] || false}
                      onDismiss={() => toggleAssignMenu(report.id)}
                      anchor={
                        <Button
                          mode="contained"
                          onPress={() => toggleAssignMenu(report.id)}
                          style={styles.actionButton}
                          icon="assignment-ind"
                          compact
                        >
                          Assign
                        </Button>
                      }
                    >
                      <Menu.Item
                        title="Suggested Staff:"
                        disabled
                        titleStyle={{ fontWeight: "bold", color: "#3F51B5" }}
                      />
                      {getStaffByDepartment(report.category).length > 0
                        ? getStaffByDepartment(report.category).map(
                            (staffMember) => (
                              <Menu.Item
                                key={staffMember.id}
                                onPress={() =>
                                  assignReport(report.id, staffMember.id)
                                }
                                title={`${staffMember.name} (${staffMember.departmentName})`}
                                leadingIcon="star"
                              />
                            )
                          )
                        : null}

                      {getStaffByDepartment(report.category).length > 0 && (
                        <Divider />
                      )}

                      <Menu.Item
                        title="All Staff:"
                        disabled
                        titleStyle={{ fontWeight: "bold", color: "#666" }}
                      />
                      {staff.map((staffMember) => (
                        <Menu.Item
                          key={staffMember.id}
                          onPress={() =>
                            assignReport(report.id, staffMember.id)
                          }
                          title={`${staffMember.name} (${staffMember.departmentName})`}
                        />
                      ))}
                    </Menu>
                  ) : (
                    <Button
                      mode="outlined"
                      onPress={() => unassignReport(report.id)}
                      style={styles.actionButton}
                      icon="assignment-return"
                      compact
                    >
                      Unassign
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
    backgroundColor: "#E3F2FD",
    padding: 8,
    borderRadius: 4,
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
    minWidth: 100,
  },
});

export default AssignReportsScreen;
