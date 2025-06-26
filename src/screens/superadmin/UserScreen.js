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
  Avatar,
  Menu,
  Divider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const UsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const roleOptions = ["All", "USER", "STAFF", "SUPER_ADMIN"];

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterRole, users]);

  const loadUsers = async () => {
    try {
      const usersData = await AsyncStorage.getItem("users");
      if (usersData) {
        const allUsers = JSON.parse(usersData);
        setUsers(
          allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (filterRole !== "All") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this user?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const updatedUsers = users.map((user) =>
                user.id === userId ? { ...user, active: !currentStatus } : user
              );
              await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
              setUsers(updatedUsers);
              Alert.alert(
                "Success",
                `User ${
                  !currentStatus ? "activated" : "deactivated"
                } successfully!`
              );
            } catch (error) {
              Alert.alert("Error", "Failed to update user status");
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "USER":
        return "Citizen";
      case "STAFF":
        return "Staff";
      case "SUPER_ADMIN":
        return "Super Admin";
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "USER":
        return "#4CAF50";
      case "STAFF":
        return "#FF9800";
      case "SUPER_ADMIN":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Search and Filter */}
      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Search users..."
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
              {filterRole === "All"
                ? "All Roles"
                : getRoleDisplayName(filterRole)}
            </Button>
          }
        >
          {roleOptions.map((role) => (
            <Menu.Item
              key={role}
              onPress={() => {
                setFilterRole(role);
                setMenuVisible(false);
              }}
              title={role === "All" ? "All Roles" : getRoleDisplayName(role)}
            />
          ))}
        </Menu>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredUsers.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="people-outline" size={60} color="#9E9E9E" />
              <Title style={styles.emptyTitle}>No Users Found</Title>
              <Paragraph style={styles.emptyText}>
                {searchQuery || filterRole !== "All"
                  ? "No users match your current filters."
                  : "No users have been registered yet."}
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} style={styles.userCard}>
              <Card.Content>
                <View style={styles.userHeader}>
                  <Avatar.Text
                    size={50}
                    label={user.name.charAt(0).toUpperCase()}
                    style={[
                      styles.avatar,
                      { backgroundColor: getRoleColor(user.role) },
                    ]}
                  />
                  <View style={styles.userInfo}>
                    <Title style={styles.userName}>{user.name}</Title>
                    <Paragraph style={styles.userEmail}>{user.email}</Paragraph>
                    <View style={styles.userMeta}>
                      <Chip
                        style={[
                          styles.roleChip,
                          { backgroundColor: getRoleColor(user.role) },
                        ]}
                        textStyle={{ color: "white", fontSize: 10 }}
                      >
                        {getRoleDisplayName(user.role)}
                      </Chip>
                      <Chip
                        style={[
                          styles.statusChip,
                          {
                            backgroundColor: user.active
                              ? "#4CAF50"
                              : "#F44336",
                          },
                        ]}
                        textStyle={{ color: "white", fontSize: 10 }}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </Chip>
                    </View>
                  </View>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.userDetails}>
                  {user.phone && (
                    <View style={styles.detailItem}>
                      <Icon name="phone" size={16} color="#666" />
                      <Paragraph style={styles.detailText}>
                        {user.phone}
                      </Paragraph>
                    </View>
                  )}

                  {user.address && (
                    <View style={styles.detailItem}>
                      <Icon name="location-on" size={16} color="#666" />
                      <Paragraph style={styles.detailText}>
                        {user.address}
                      </Paragraph>
                    </View>
                  )}

                  {user.department && (
                    <View style={styles.detailItem}>
                      <Icon name="business" size={16} color="#666" />
                      <Paragraph style={styles.detailText}>
                        {user.departmentName || user.department}
                      </Paragraph>
                    </View>
                  )}

                  <View style={styles.detailItem}>
                    <Icon name="calendar-today" size={16} color="#666" />
                    <Paragraph style={styles.detailText}>
                      Joined {formatDate(user.createdAt)}
                    </Paragraph>
                  </View>
                </View>

                <View style={styles.actionContainer}>
                  <Button
                    mode="outlined"
                    onPress={() =>
                      Alert.alert(
                        "Info",
                        "View user details feature coming soon!"
                      )
                    }
                    style={styles.actionButton}
                    compact
                  >
                    View Details
                  </Button>

                  <Button
                    mode={user.active ? "outlined" : "contained"}
                    onPress={() => toggleUserStatus(user.id, user.active)}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: user.active
                          ? "transparent"
                          : "#4CAF50",
                      },
                    ]}
                    compact
                  >
                    {user.active ? "Deactivate" : "Activate"}
                  </Button>
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
  userCard: {
    margin: 15,
    marginBottom: 10,
    elevation: 2,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    marginBottom: 5,
  },
  userEmail: {
    color: "#666",
    marginBottom: 10,
  },
  userMeta: {
    flexDirection: "row",
    gap: 8,
  },
  roleChip: {
    height: 24,
  },
  statusChip: {
    height: 24,
  },
  divider: {
    marginVertical: 15,
  },
  userDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#666",
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

export default UsersScreen;
