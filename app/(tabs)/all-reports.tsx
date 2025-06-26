"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";

export default function AllReportsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const [reports] = useState([
    {
      id: "RCR-2024-001",
      title: "Large pothole blocking traffic",
      description:
        "Main Street intersection causing major delays during rush hour. Multiple vehicles have been damaged.",
      priority: "High Priority",
      category: "Roads",
      status: "New",
      reporter: "Sarah Johnson",
      reporterId: "#RCR2024001",
      location: "Main St & 5th Ave",
      time: "2 min ago",
      assignedTo: null,
      views: 3,
    },
    {
      id: "RCR-2024-002",
      title: "Streetlight not working",
      description:
        "Oak Avenue near the park entrance has been dark for 3 days. Safety concern for pedestrians.",
      priority: "Medium",
      category: "Utilities",
      status: "Assigned",
      reporter: "Mike Chen",
      reporterId: "#RCR2024002",
      location: "Oak Ave & Park St",
      time: "1 hour ago",
      assignedTo: "John Smith",
      views: 8,
    },
    {
      id: "RCR-2024-003",
      title: "Missed garbage collection",
      description:
        "Elm Street residents reported missed garbage pickup on Tuesday. Bins still full.",
      priority: "Low",
      category: "Sanitation",
      status: "Resolved",
      reporter: "David Wilson",
      reporterId: "#RCR2024003",
      location: "Elm Street",
      time: "1 day ago",
      assignedTo: "Mike Garcia",
      completedBy: "Mike Garcia",
      views: 12,
    },
    {
      id: "RCR-2024-004",
      title: "Broken playground equipment",
      description:
        "Swing set chain broken at Central Park. Child safety hazard needs immediate attention.",
      priority: "High Priority",
      category: "Parks",
      status: "New",
      reporter: "Lisa Rodriguez",
      reporterId: "#RCR2024004",
      location: "Central Park",
      time: "2 hours ago",
      assignedTo: null,
      views: 5,
    },
    {
      id: "RCR-2024-005",
      title: "Water leak on Pine Street",
      description:
        "Large water leak causing flooding on Pine Street near the intersection.",
      priority: "Medium",
      category: "Water",
      status: "In Progress",
      reporter: "Tom Wilson",
      reporterId: "#RCR2024005",
      location: "Pine Street",
      time: "3 hours ago",
      assignedTo: "Sarah Davis",
      views: 15,
    },
  ]);

  const filterCounts = {
    All: 228,
    New: 47,
    Assigned: 23,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    if (priority.includes("High")) return "#F44336";
    if (priority.includes("Medium")) return "#FFC107";
    if (priority.includes("Low")) return "#4CAF50";
    return "#9E9E9E";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "#2196F3";
      case "Assigned":
        return "#FFC107";
      case "In Progress":
        return "#FF9800";
      case "Resolved":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  };

  const FilterTab = ({ title, count, isActive, onPress }: any) => (
    <TouchableOpacity
      style={[styles.filterTab, isActive && styles.activeFilterTab]}
      onPress={onPress}
    >
      <Text
        style={[styles.filterTabText, isActive && styles.activeFilterTabText]}
      >
        {title} ({count})
      </Text>
    </TouchableOpacity>
  );

  const ReportCard = ({ report }: any) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.reportTitleRow}>
          <Text style={styles.reportId}>{report.id}</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="more-vert" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <Text style={styles.reportTitle}>{report.title}</Text>
        <Text style={styles.reportDescription}>{report.description}</Text>
      </View>

      <View style={styles.badgeRow}>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(report.priority) },
          ]}
        >
          <Text style={styles.badgeText}>{report.priority}</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: "#E3F2FD" }]}>
          <Text style={[styles.badgeText, { color: "#1976D2" }]}>
            {report.category}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(report.status) },
          ]}
        >
          <Text style={styles.badgeText}>{report.status}</Text>
        </View>
      </View>

      <View style={styles.reportMeta}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="person" size={14} color="#666" />
            <Text style={styles.metaText}>{report.reporter}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="schedule" size={14} color="#666" />
            <Text style={styles.metaText}>{report.time}</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="location-on" size={14} color="#666" />
            <Text style={styles.metaText}>{report.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="visibility" size={14} color="#666" />
            <Text style={styles.metaText}>{report.views} views</Text>
          </View>
        </View>
      </View>

      {report.assignedTo && (
        <View style={styles.assignmentInfo}>
          <Text style={styles.assignmentLabel}>
            {report.status === "Resolved" ? "Completed by" : "Assigned to"}{" "}
            {report.completedBy || report.assignedTo}
          </Text>
          <View style={styles.assignmentActions}>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
            {report.status === "Resolved" && (
              <View style={styles.resolvedBadge}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.resolvedText}>Resolved</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.reportActions}>
        {!report.assignedTo && report.status === "New" && (
          <TouchableOpacity style={styles.assignButton}>
            <Text style={styles.assignButtonText}>Assign</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsButtonText}>View Details</Text>
        </TouchableOpacity>
        <View style={styles.viewCount}>
          <Icon name="visibility" size={16} color="#666" />
          <Text style={styles.viewCountText}>{report.views} views</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Reports</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Icon name="filter-list" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="search" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterTab
            title="All"
            count={filterCounts.All}
            isActive={activeFilter === "All"}
            onPress={() => setActiveFilter("All")}
          />
          <FilterTab
            title="New"
            count={filterCounts.New}
            isActive={activeFilter === "New"}
            onPress={() => setActiveFilter("New")}
          />
          <FilterTab
            title="Assigned"
            count={filterCounts.Assigned}
            isActive={activeFilter === "Assigned"}
            onPress={() => setActiveFilter("Assigned")}
          />
        </ScrollView>
      </View>

      {/* Secondary Filters */}
      <View style={styles.secondaryFilters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.secondaryFilter}>
            <Text style={styles.secondaryFilterText}>All Departments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryFilter}>
            <Text style={styles.secondaryFilterText}>Roads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryFilter}>
            <Text style={styles.secondaryFilterText}>Utilities</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryFilter}>
            <Text style={styles.secondaryFilterText}>Sanitation</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Reports List */}
      <ScrollView
        style={styles.reportsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "white",
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  activeFilterTab: {
    backgroundColor: "#4285F4",
  },
  filterTabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeFilterTabText: {
    color: "white",
  },
  secondaryFilters: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "white",
  },
  secondaryFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  secondaryFilterText: {
    fontSize: 12,
    color: "#666",
  },
  reportsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  reportCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportHeader: {
    marginBottom: 12,
  },
  reportTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reportId: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  moreButton: {
    padding: 4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "white",
  },
  reportMeta: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
  assignmentInfo: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  assignmentLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  assignmentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  viewButton: {
    backgroundColor: "#4285F4",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewButtonText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  contactButton: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contactButtonText: {
    color: "#1976D2",
    fontSize: 10,
    fontWeight: "500",
  },
  resolvedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
  resolvedText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "500",
  },
  reportActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  assignButton: {
    backgroundColor: "#4285F4",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  assignButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  viewDetailsButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewDetailsButtonText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  viewCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
  viewCountText: {
    fontSize: 12,
    color: "#666",
  },
});
