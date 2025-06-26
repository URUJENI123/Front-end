"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newReports: 47,
    inProgress: 23,
    resolved: 156,
    totalReports: 228,
  });

  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const [recentComplaints] = useState([
    {
      id: "RCR-2024-001",
      title: "Large pothole blocking traffic",
      description:
        "Main Street intersection causing major delays during rush hour. Multiple vehicles have been damaged.",
      priority: "High",
      category: "Roads",
      status: "New",
      reporter: "Sarah Johnson",
      location: "Main St & 5th Ave",
      time: "2 minutes ago",
      assignedTo: null,
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
      location: "Oak Ave & Park St",
      time: "1 hour ago",
      assignedTo: "John Smith",
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
      location: "Elm Street",
      time: "1 day ago",
      assignedTo: "Mike Garcia",
    },
    {
      id: "RCR-2024-004",
      title: "Broken playground equipment",
      description:
        "Swing set chain broken at Central Park. Child safety hazard needs immediate attention.",
      priority: "High",
      category: "Parks",
      status: "New",
      reporter: "Lisa Rodriguez",
      location: "Central Park",
      time: "2 hours ago",
      assignedTo: null,
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "#2196F3";
      case "Assigned":
        return "#FFC107";
      case "Resolved":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  };

  const StatCard = ({ number, label, color = "#4285F4" }: any) => (
    <View style={styles.statCard}>
      <Text style={[styles.statNumber, { color }]}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const FilterTab = ({ title, count, isActive, onPress }: any) => (
    <TouchableOpacity
      style={[styles.filterTab, isActive && styles.activeFilterTab]}
      onPress={onPress}
    >
      <Text
        style={[styles.filterTabText, isActive && styles.activeFilterTabText]}
      >
        {title} {count && `(${count})`}
      </Text>
    </TouchableOpacity>
  );

  const ComplaintCard = ({ complaint }: any) => (
    <View style={styles.complaintCard}>
      <View style={styles.complaintHeader}>
        <View style={styles.complaintTitleRow}>
          <Text style={styles.complaintId}>{complaint.id}</Text>
          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(complaint.priority) },
              ]}
            >
              <Text style={styles.badgeText}>
                {complaint.priority} Priority
              </Text>
            </View>
            <View
              style={[styles.categoryBadge, { backgroundColor: "#E3F2FD" }]}
            >
              <Text style={[styles.badgeText, { color: "#1976D2" }]}>
                {complaint.category}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(complaint.status) },
              ]}
            >
              <Text style={styles.badgeText}>{complaint.status}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.complaintTitle}>{complaint.title}</Text>
        <Text style={styles.complaintDescription}>{complaint.description}</Text>
      </View>

      <View style={styles.complaintMeta}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="person" size={14} color="#666" />
            <Text style={styles.metaText}>{complaint.reporter}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="location-on" size={14} color="#666" />
            <Text style={styles.metaText}>{complaint.location}</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="schedule" size={14} color="#666" />
            <Text style={styles.metaText}>{complaint.time}</Text>
          </View>
          {complaint.assignedTo && (
            <View style={styles.metaItem}>
              <Icon name="assignment-ind" size={14} color="#4285F4" />
              <Text style={[styles.metaText, { color: "#4285F4" }]}>
                Assigned to {complaint.assignedTo}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.complaintActions}>
        {!complaint.assignedTo && complaint.status === "New" && (
          <TouchableOpacity style={styles.assignButton}>
            <Text style={styles.assignButtonText}>Assign</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-horiz" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="search" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="filter-list" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            number={stats.newReports}
            label="New Reports"
            color="#2196F3"
          />
          <StatCard
            number={stats.inProgress}
            label="In Progress"
            color="#FFC107"
          />
          <StatCard number={stats.resolved} label="Resolved" color="#4CAF50" />
          <StatCard
            number={stats.totalReports}
            label="Total Reports"
            color="#9C27B0"
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterTab
              title="All"
              isActive={activeFilter === "All"}
              onPress={() => setActiveFilter("All")}
            />
            <FilterTab
              title="New"
              isActive={activeFilter === "New"}
              onPress={() => setActiveFilter("New")}
            />
            <FilterTab
              title="Assigned"
              isActive={activeFilter === "Assigned"}
              onPress={() => setActiveFilter("Assigned")}
            />
            <FilterTab
              title="Resolved"
              isActive={activeFilter === "Resolved"}
              onPress={() => setActiveFilter("Resolved")}
            />
          </ScrollView>
        </View>

        {/* Recent Complaints */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Complaints</Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/all-reports")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
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
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4285F4",
    fontWeight: "500",
  },
  complaintCard: {
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
  complaintHeader: {
    marginBottom: 12,
  },
  complaintTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  complaintId: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 4,
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
  complaintTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  complaintDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  complaintMeta: {
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
  complaintActions: {
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
  moreButton: {
    marginLeft: "auto",
    padding: 4,
  },
});
