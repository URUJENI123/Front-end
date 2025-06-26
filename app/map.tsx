"use client";

import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Title, Paragraph } from "react-native-paper";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

export default function MapViewScreen() {
  const [activeFilter, setActiveFilter] = useState("All");

  const mapPins = [
    { id: 1, x: 120, y: 100, color: "#F44336", priority: "High" },
    { id: 2, x: 280, y: 140, color: "#FFC107", priority: "Medium" },
    { id: 3, x: 320, y: 180, color: "#FF9800", priority: "Medium" },
    { id: 4, x: 180, y: 220, color: "#4CAF50", priority: "Low" },
    { id: 5, x: 220, y: 280, color: "#2196F3", priority: "In Progress" },
  ];

  const recentReports = [
    {
      id: 1,
      title: "Broken Water Pipe",
      location: "Main Street & 3rd Ave",
      priority: "High Priority",
      time: "2 min ago",
      priorityColor: "#F44336",
    },
    {
      id: 2,
      title: "Pothole Repair Needed",
      location: "Oak Street near the park",
      priority: "Medium Priority",
      time: "15 min ago",
      priorityColor: "#FFC107",
    },
    {
      id: 3,
      title: "Tree Trimming Request",
      location: "Central Park Area",
      priority: "Low Priority",
      time: "1 hour ago",
      priorityColor: "#4CAF50",
    },
  ];

  const FilterTab = ({
    title,
    count,
    isActive,
    onPress,
  }: {
    title: string;
    count: number;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.filterTab, isActive && styles.activeFilterTab]}
      onPress={onPress}
    >
      <Paragraph
        style={[styles.filterTabText, isActive && styles.activeFilterTabText]}
      >
        {title} ({count})
      </Paragraph>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="filter-list" size={24} color="#333333" />
          </TouchableOpacity>
          <Title style={styles.headerTitle}>Map View</Title>
          <TouchableOpacity style={styles.searchButton}>
            <MaterialIcons name="search" size={24} color="#333333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Grid Background */}
        <View style={styles.mapGrid}>
          {/* Vertical Grid Lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={[styles.gridLineVertical, { left: i * 50 }]}
            />
          ))}
          {/* Horizontal Grid Lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={[styles.gridLineHorizontal, { top: i * 40 }]}
            />
          ))}

          {/* Map Pins */}
          {mapPins.map((pin) => (
            <TouchableOpacity
              key={pin.id}
              style={[
                styles.mapPin,
                {
                  left: pin.x,
                  top: pin.y,
                  backgroundColor: pin.color,
                },
              ]}
              onPress={() => {
                console.log(`Pin ${pin.id} pressed - ${pin.priority}`);
              }}
            >
              <View style={styles.pinInner} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapControlButton}>
            <MaterialIcons name="add" size={20} color="#333333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapControlButton}>
            <MaterialIcons name="remove" size={20} color="#333333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Paragraph style={styles.legendTitle}>Legend</Paragraph>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#F44336" }]} />
            <Paragraph style={styles.legendText}>High Priority</Paragraph>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FFC107" }]} />
            <Paragraph style={styles.legendText}>Medium Priority</Paragraph>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
            <Paragraph style={styles.legendText}>Low Priority</Paragraph>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#2196F3" }]} />
            <Paragraph style={styles.legendText}>In Progress</Paragraph>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <FilterTab
            title="All"
            count={47}
            isActive={activeFilter === "All"}
            onPress={() => setActiveFilter("All")}
          />
          <FilterTab
            title="Roads"
            count={13}
            isActive={activeFilter === "Roads"}
            onPress={() => setActiveFilter("Roads")}
          />
          <FilterTab
            title="Parks"
            count={8}
            isActive={activeFilter === "Parks"}
            onPress={() => setActiveFilter("Parks")}
          />
          <FilterTab
            title="Utilities"
            count={0}
            isActive={activeFilter === "Utilities"}
            onPress={() => setActiveFilter("Utilities")}
          />
        </ScrollView>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Paragraph style={[styles.statNumber, { color: "#F44336" }]}>
            8
          </Paragraph>
          <Paragraph style={styles.statLabel}>High Priority</Paragraph>
        </View>
        <View style={styles.statItem}>
          <Paragraph style={[styles.statNumber, { color: "#FFC107" }]}>
            15
          </Paragraph>
          <Paragraph style={styles.statLabel}>Medium</Paragraph>
        </View>
        <View style={styles.statItem}>
          <Paragraph style={[styles.statNumber, { color: "#4CAF50" }]}>
            24
          </Paragraph>
          <Paragraph style={styles.statLabel}>Low Priority</Paragraph>
        </View>
        <View style={styles.statItem}>
          <Paragraph style={[styles.statNumber, { color: "#333333" }]}>
            47
          </Paragraph>
          <Paragraph style={styles.statLabel}>Total</Paragraph>
        </View>
      </View>

      {/* Recent Reports */}
      <View style={styles.recentContainer}>
        <View style={styles.recentHeader}>
          <Paragraph style={styles.recentTitle}>
            Recent Reports in Area
          </Paragraph>
          <TouchableOpacity>
            <Paragraph style={styles.viewAllText}>View All</Paragraph>
          </TouchableOpacity>
        </View>

        {recentReports.map((report) => (
          <TouchableOpacity key={report.id} style={styles.reportItem}>
            <View style={styles.reportLeft}>
              <View
                style={[
                  styles.priorityIndicator,
                  { backgroundColor: report.priorityColor },
                ]}
              />
              <View style={styles.reportInfo}>
                <Paragraph style={styles.reportTitle}>{report.title}</Paragraph>
                <Paragraph style={styles.reportLocation}>
                  {report.location}
                </Paragraph>
                <View style={styles.reportMeta}>
                  <Paragraph
                    style={[
                      styles.reportPriority,
                      { color: report.priorityColor },
                    ]}
                  >
                    {report.priority}
                  </Paragraph>
                  <Paragraph style={styles.reportTime}>{report.time}</Paragraph>
                </View>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/citizen")}
        >
          <MaterialIcons name="home" size={24} color="#999999" />
          <Paragraph style={styles.navLabel}>Home</Paragraph>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/my-reports")}
        >
          <MaterialIcons name="list-alt" size={24} color="#999999" />
          <Paragraph style={styles.navLabel}>Reports</Paragraph>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/create-report")}
        >
          <View style={styles.addButton}>
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <MaterialIcons name="map" size={24} color="#4285F4" />
          <Paragraph style={[styles.navLabel, styles.activeNavLabel]}>
            Map
          </Paragraph>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <MaterialIcons name="person" size={24} color="#999999" />
          <Paragraph style={styles.navLabel}>Profile</Paragraph>
        </TouchableOpacity>
      </View>
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
  filterButton: {
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
  mapContainer: {
    height: 300,
    backgroundColor: "#E3F2FD",
    position: "relative",
    margin: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  mapGrid: {
    flex: 1,
    position: "relative",
  },
  gridLineVertical: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "#BBDEFB",
    opacity: 0.5,
  },
  gridLineHorizontal: {
    position: "absolute",
    height: 1,
    width: "100%",
    backgroundColor: "#BBDEFB",
    opacity: 0.5,
  },
  mapPin: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pinInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  mapControls: {
    position: "absolute",
    top: 15,
    right: 15,
    gap: 8,
  },
  mapControlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  legendContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#666666",
  },
  filterContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  activeFilterTab: {
    backgroundColor: "#4285F4",
    borderColor: "#4285F4",
  },
  filterTabText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  activeFilterTabText: {
    color: "#FFFFFF",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
  },
  recentContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 15,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4285F4",
    fontWeight: "500",
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  reportLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  reportLocation: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  reportMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reportPriority: {
    fontSize: 12,
    fontWeight: "500",
  },
  reportTime: {
    fontSize: 12,
    color: "#999999",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: "center",
    padding: 8,
  },
  activeNavItem: {
    // Active nav item styles
  },
  navLabel: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
  },
  activeNavLabel: {
    color: "#4285F4",
    fontWeight: "500",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
