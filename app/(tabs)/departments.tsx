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

export default function DepartmentsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [stats] = useState({
    total: 8,
    active: 6,
    inactive: 2,
  });

  const [departments] = useState([
    {
      id: 1,
      name: "Roads & Infrastructure",
      description: "Municipal roads, bridges, traffic",
      status: "Active",
      activeReports: 47,
      staffMembers: 12,
      resolutionRate: 89,
      manager: {
        name: "John Smith",
        title: "Manager",
        lastUpdate: "2 min ago",
      },
      workload: "high",
    },
    {
      id: 2,
      name: "Parks & Recreation",
      description: "Community parks, sports facilities",
      status: "Active",
      activeReports: 23,
      staffMembers: 8,
      resolutionRate: 94,
      manager: {
        name: "Maria Garcia",
        title: "Manager",
        lastUpdate: "5 min ago",
      },
      workload: "normal",
    },
    {
      id: 3,
      name: "Sanitation",
      description: "Waste collection, recycling",
      status: "Active",
      activeReports: 31,
      staffMembers: 15,
      resolutionRate: 92,
      manager: {
        name: "David Wilson",
        title: "Manager",
        lastUpdate: "1 hour ago",
      },
      workload: "medium",
    },
    {
      id: 4,
      name: "Utilities",
      description: "Water, electricity, gas",
      status: "Active",
      activeReports: 18,
      staffMembers: 10,
      resolutionRate: 96,
      manager: {
        name: "Mike Chen",
        title: "Manager",
        lastUpdate: "30 min ago",
      },
      workload: "normal",
    },
    {
      id: 5,
      name: "Public Safety",
      description: "Emergency services, security",
      status: "Inactive",
      activeReports: 0,
      staffMembers: 0,
      resolutionRate: 0,
      manager: null,
      workload: "none",
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case "high":
        return "#F44336";
      case "medium":
        return "#FFC107";
      case "normal":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  };

  const getWorkloadText = (workload: string) => {
    switch (workload) {
      case "high":
        return "High Load";
      case "medium":
        return "Medium Load";
      case "normal":
        return "Normal Load";
      default:
        return "";
    }
  };

  const getDepartmentIcon = (name: string) => {
    if (name.includes("Roads")) return "construction";
    if (name.includes("Parks")) return "park";
    if (name.includes("Sanitation")) return "delete";
    if (name.includes("Utilities")) return "flash-on";
    if (name.includes("Safety")) return "security";
    return "business";
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
        {title} ({count})
      </Text>
    </TouchableOpacity>
  );

  const DepartmentCard = ({ department }: any) => (
    <View style={styles.departmentCard}>
      <View style={styles.departmentHeader}>
        <View style={styles.departmentTitleRow}>
          <View style={styles.departmentIconContainer}>
            <Icon
              name={getDepartmentIcon(department.name)}
              size={24}
              color="#4285F4"
            />
          </View>
          <View style={styles.departmentInfo}>
            <Text style={styles.departmentName}>{department.name}</Text>
            <Text style={styles.departmentDescription}>
              {department.description}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    department.status === "Active" ? "#4CAF50" : "#F44336",
                },
              ]}
            >
              <Text style={styles.statusText}>{department.status}</Text>
            </View>
            {department.workload !== "none" &&
              department.workload !== "normal" && (
                <View style={styles.workloadIndicator}>
                  <Icon
                    name="warning"
                    size={12}
                    color={getWorkloadColor(department.workload)}
                  />
                </View>
              )}
          </View>
        </View>
      </View>

      {department.status === "Active" && (
        <>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{department.activeReports}</Text>
              <Text style={styles.statLabel}>Active Reports</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{department.staffMembers}</Text>
              <Text style={styles.statLabel}>Staff Members</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: "#4CAF50" }]}>
                {department.resolutionRate}%
              </Text>
              <Text style={styles.statLabel}>Resolution Rate</Text>
            </View>
          </View>

          {department.manager && (
            <View style={styles.managerInfo}>
              <View style={styles.managerAvatar}>
                <Text style={styles.managerInitial}>
                  {department.manager.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </Text>
              </View>
              <View style={styles.managerDetails}>
                <Text style={styles.managerName}>
                  {department.manager.name} - {department.manager.title}
                </Text>
                <Text style={styles.managerUpdate}>
                  Updated {department.manager.lastUpdate}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.departmentActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
            >
              <Text
                style={[styles.actionButtonText, styles.secondaryButtonText]}
              >
                Manage Staff
              </Text>
            </TouchableOpacity>
            {department.workload !== "normal" && (
              <View
                style={[
                  styles.workloadBadge,
                  { backgroundColor: getWorkloadColor(department.workload) },
                ]}
              >
                <Text style={styles.workloadText}>
                  {getWorkloadText(department.workload)}
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Departments</Text>
        <TouchableOpacity>
          <Icon name="search" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            number={stats.total}
            label="Total Departments"
            color="#4285F4"
          />
          <StatCard number={stats.active} label="Active" color="#4CAF50" />
          <StatCard number={stats.inactive} label="Inactive" color="#F44336" />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#666" />
            <Text style={styles.searchPlaceholder}>Search departments...</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterTab
              title="All"
              count={8}
              isActive={activeFilter === "All"}
              onPress={() => setActiveFilter("All")}
            />
            <FilterTab
              title="Active"
              count={6}
              isActive={activeFilter === "Active"}
              onPress={() => setActiveFilter("Active")}
            />
            <FilterTab
              title="Inactive"
              count={2}
              isActive={activeFilter === "Inactive"}
              onPress={() => setActiveFilter("Inactive")}
            />
          </ScrollView>
        </View>

        {/* Departments List */}
        <View style={styles.departmentsList}>
          {departments.map((department) => (
            <DepartmentCard key={department.id} department={department} />
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
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
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
  departmentsList: {
    paddingHorizontal: 16,
  },
  departmentCard: {
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
  departmentHeader: {
    marginBottom: 16,
  },
  departmentTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  departmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  departmentDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  workloadIndicator: {
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  managerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  managerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  managerInitial: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  managerDetails: {
    flex: 1,
  },
  managerName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  managerUpdate: {
    fontSize: 12,
    color: "#666",
  },
  departmentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    backgroundColor: "#4285F4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  secondaryButtonText: {
    color: "#666",
  },
  workloadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: "auto",
  },
  workloadText: {
    fontSize: 10,
    fontWeight: "500",
    color: "white",
  },
});
