"use client";

import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Title, Paragraph, Button } from "react-native-paper";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "../../src/context/AppContext";

export default function MyReportsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const { getUserReports } = useApp();
  const userReports = getUserReports();

  const tabs = ["All", "Pending", "In Progress", "Resolved"];

  const filteredReports = userReports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || report.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getTabCount = (tab: string) => {
    if (tab === "All") return userReports.length;
    return userReports.filter((report) => report.status === tab).length;
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

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Title style={styles.headerTitle}>My Reports</Title>
          <TouchableOpacity style={styles.searchButton}>
            <MaterialIcons name="search" size={24} color="#333333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="filter-list" size={24} color="#333333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Paragraph
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Paragraph>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Title style={styles.statNumber}>{userReports.length}</Title>
          <Paragraph style={styles.statLabel}>Total</Paragraph>
        </View>
        <View style={styles.statItem}>
          <Title style={[styles.statNumber, { color: "#FF5722" }]}>
            {userReports.filter((r) => r.status === "Pending").length}
          </Title>
          <Paragraph style={styles.statLabel}>Pending</Paragraph>
        </View>
        <View style={styles.statItem}>
          <Title style={[styles.statNumber, { color: "#FFC107" }]}>
            {userReports.filter((r) => r.status === "In Progress").length}
          </Title>
          <Paragraph style={styles.statLabel}>Progress</Paragraph>
        </View>
        <View style={styles.statItem}>
          <Title style={[styles.statNumber, { color: "#4CAF50" }]}>
            {userReports.filter((r) => r.status === "Resolved").length}
          </Title>
          <Paragraph style={styles.statLabel}>Resolved</Paragraph>
        </View>
      </View>

      {/* Reports List */}
      <ScrollView
        style={styles.reportsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => router.push(`/report-details?id=${report.id}`)}
            >
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
                  <Paragraph style={styles.reportId}>
                    ID: #{report.id.slice(-8)}
                  </Paragraph>
                  <Paragraph style={styles.reportMeta}>
                    Submitted: {new Date(report.createdAt).toLocaleDateString()}{" "}
                    at{" "}
                    {new Date(report.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Paragraph>
                  <View style={styles.reportFooter}>
                    <View style={styles.reportViews}>
                      <MaterialIcons
                        name="visibility"
                        size={14}
                        color="#666666"
                      />
                      <Paragraph style={styles.viewsText}>
                        {Math.floor(Math.random() * 50) + 10} views
                      </Paragraph>
                    </View>
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
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="report-off" size={64} color="#CCCCCC" />
            <Title style={styles.emptyTitle}>No Reports Found</Title>
            <Paragraph style={styles.emptyText}>
              {searchQuery
                ? "No reports match your search."
                : `No ${activeTab.toLowerCase()} reports yet.`}
            </Paragraph>
            <Button
              mode="contained"
              onPress={() => router.push("/(tabs)/create-report")}
              style={styles.createButton}
              buttonColor="#4285F4"
            >
              Create New Report
            </Button>
          </View>
        )}
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
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  searchButton: {
    padding: 4,
  },
  filterButton: {
    padding: 4,
  },
  tabsContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tabsScroll: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  activeTab: {
    backgroundColor: "#4285F4",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    marginBottom: 1,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
  },
  reportsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  reportId: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportViews: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewsText: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4,
  },
  reportStatusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  createButton: {
    borderRadius: 8,
  },
});
