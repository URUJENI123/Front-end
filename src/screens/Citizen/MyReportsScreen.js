"use client";

import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Chip,
  FAB,
  Searchbar,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const MyReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserAndReports();
  }, []);

  useEffect(() => {
    filterReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, reports]);

  const loadUserAndReports = async () => {
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
        setReports(
          userReports.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }
    } catch (error) {
      console.error("Error loading reports:", error);
    }
  };

  const filterReports = () => {
    if (!searchQuery) {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter(
        (report) =>
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReports(filtered);
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
      <Searchbar
        placeholder="Search reports..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

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
                {searchQuery
                  ? "No reports match your search."
                  : "You haven't created any reports yet."}
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card
              key={report.id}
              style={styles.reportCard}
              onPress={() => navigation.navigate("ReportDetails", { report })}
            >
              <Card.Content>
                <View style={styles.reportHeader}>
                  <Title style={styles.reportTitle}>{report.title}</Title>
                  <View style={styles.chipContainer}>
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
                  <Chip
                    style={[
                      styles.priorityChip,
                      { backgroundColor: getPriorityColor(report.priority) },
                    ]}
                    textStyle={{ color: "white", fontSize: 10 }}
                  >
                    {report.priority}
                  </Chip>
                  <Paragraph style={styles.dateText}>
                    {formatDate(report.createdAt)}
                  </Paragraph>
                </View>
              </Card.Content>
            </Card>
          ))
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
  searchbar: {
    margin: 15,
    marginBottom: 10,
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
    alignItems: "flex-end",
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
    marginBottom: 15,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityChip: {
    height: 20,
  },
  dateText: {
    fontSize: 11,
    color: "#999",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#3F51B5",
  },
});

export default MyReportsScreen;
