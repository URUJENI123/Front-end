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
  FAB,
  Searchbar,
  Chip,
  TextInput,
  Modal,
  Portal,
  Menu,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const StaffManagementScreen = ({ navigation }) => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [departmentMenuVisible, setDepartmentMenuVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    departmentName: "",
  });

  useEffect(() => {
    loadStaff();
    loadDepartments();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [searchQuery, staff]);

  const loadStaff = async () => {
    try {
      const staffData = await AsyncStorage.getItem("staff");
      if (staffData) {
        const allStaff = JSON.parse(staffData);
        setStaff(
          allStaff.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      }
    } catch (error) {
      console.error("Error loading staff:", error);
    }
  };

  const loadDepartments = async () => {
    try {
      const departmentsData = await AsyncStorage.getItem("departments");
      if (departmentsData) {
        const allDepartments = JSON.parse(departmentsData);
        setDepartments(allDepartments.filter((dept) => dept.active));
      }
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const filterStaff = () => {
    if (!searchQuery) {
      setFilteredStaff(staff);
    } else {
      const filtered = staff.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.departmentName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredStaff(filtered);
    }
  };

  const saveStaff = async () => {
    if (!formData.name || !formData.email || !formData.department) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      let updatedStaff;
      let updatedUsers;

      // Get current users
      const usersData = await AsyncStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : [];

      if (editingStaff) {
        // Update existing staff
        updatedStaff = staff.map((member) =>
          member.id === editingStaff.id
            ? { ...member, ...formData, updatedAt: new Date().toISOString() }
            : member
        );

        // Update in users table as well
        updatedUsers = users.map((user) =>
          user.id === editingStaff.id
            ? { ...user, ...formData, updatedAt: new Date().toISOString() }
            : user
        );
      } else {
        // Create new staff
        const newStaffId = Date.now().toString();
        const newStaff = {
          id: newStaffId,
          ...formData,
          active: true,
          createdAt: new Date().toISOString(),
        };

        // Add to staff
        updatedStaff = [newStaff, ...staff];

        // Add to users table
        const newUser = {
          id: newStaffId,
          name: formData.name,
          email: formData.email,
          password: "password123", // Default password
          role: "STAFF",
          phone: formData.phone,
          department: formData.department,
          departmentName: formData.departmentName,
          active: true,
          createdAt: new Date().toISOString(),
        };
        updatedUsers = [newUser, ...users];
      }

      await AsyncStorage.setItem("staff", JSON.stringify(updatedStaff));
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));

      setStaff(updatedStaff);
      setModalVisible(false);
      setEditingStaff(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        departmentName: "",
      });

      Alert.alert(
        "Success",
        `Staff member ${editingStaff ? "updated" : "created"} successfully!`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save staff member");
    }
  };

  const toggleStaffStatus = async (staffId, currentStatus) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this staff member?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const updatedStaff = staff.map((member) =>
                member.id === staffId
                  ? {
                      ...member,
                      active: !currentStatus,
                      updatedAt: new Date().toISOString(),
                    }
                  : member
              );

              // Update users table as well
              const usersData = await AsyncStorage.getItem("users");
              const users = usersData ? JSON.parse(usersData) : [];
              const updatedUsers = users.map((user) =>
                user.id === staffId
                  ? {
                      ...user,
                      active: !currentStatus,
                      updatedAt: new Date().toISOString(),
                    }
                  : user
              );

              await AsyncStorage.setItem("staff", JSON.stringify(updatedStaff));
              await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));

              setStaff(updatedStaff);
              Alert.alert(
                "Success",
                `Staff member ${
                  !currentStatus ? "activated" : "deactivated"
                } successfully!`
              );
            } catch (error) {
              Alert.alert("Error", "Failed to update staff status");
            }
          },
        },
      ]
    );
  };

  const deleteStaff = async (staffId, staffName) => {
    Alert.alert(
      "Delete Staff Member",
      `Are you sure you want to delete "${staffName}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedStaff = staff.filter(
                (member) => member.id !== staffId
              );

              // Remove from users table as well
              const usersData = await AsyncStorage.getItem("users");
              const users = usersData ? JSON.parse(usersData) : [];
              const updatedUsers = users.filter((user) => user.id !== staffId);

              await AsyncStorage.setItem("staff", JSON.stringify(updatedStaff));
              await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));

              setStaff(updatedStaff);
              Alert.alert("Success", "Staff member deleted successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to delete staff member");
            }
          },
        },
      ]
    );
  };

  const openEditModal = (staffMember = null) => {
    if (staffMember) {
      setEditingStaff(staffMember);
      setFormData({
        name: staffMember.name,
        email: staffMember.email,
        phone: staffMember.phone || "",
        department: staffMember.department,
        departmentName: staffMember.departmentName,
      });
    } else {
      setEditingStaff(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        departmentName: "",
      });
    }
    setModalVisible(true);
  };

  const selectDepartment = (dept) => {
    setFormData({
      ...formData,
      department: dept.id,
      departmentName: dept.name,
    });
    setDepartmentMenuVisible(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStaff();
    await loadDepartments();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <Searchbar
        placeholder="Search staff..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredStaff.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="badge" size={60} color="#9E9E9E" />
              <Title style={styles.emptyTitle}>No Staff Found</Title>
              <Paragraph style={styles.emptyText}>
                {searchQuery
                  ? "No staff members match your search."
                  : "No staff members have been added yet."}
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          filteredStaff.map((staffMember) => (
            <Card key={staffMember.id} style={styles.staffCard}>
              <Card.Content>
                <View style={styles.staffHeader}>
                  <View style={styles.staffInfo}>
                    <Title style={styles.staffName}>{staffMember.name}</Title>
                    <Paragraph style={styles.staffEmail}>
                      {staffMember.email}
                    </Paragraph>
                    <View style={styles.staffMeta}>
                      <Chip
                        style={styles.departmentChip}
                        textStyle={{ fontSize: 10 }}
                      >
                        {staffMember.departmentName}
                      </Chip>
                      <Chip
                        style={[
                          styles.statusChip,
                          {
                            backgroundColor: staffMember.active
                              ? "#4CAF50"
                              : "#F44336",
                          },
                        ]}
                        textStyle={{ color: "white", fontSize: 10 }}
                      >
                        {staffMember.active ? "Active" : "Inactive"}
                      </Chip>
                    </View>
                  </View>
                </View>

                {staffMember.phone && (
                  <View style={styles.contactInfo}>
                    <Icon name="phone" size={16} color="#666" />
                    <Paragraph style={styles.contactText}>
                      {staffMember.phone}
                    </Paragraph>
                  </View>
                )}

                <View style={styles.dateInfo}>
                  <Icon name="calendar-today" size={16} color="#666" />
                  <Paragraph style={styles.dateText}>
                    Joined {formatDate(staffMember.createdAt)}
                  </Paragraph>
                </View>

                <View style={styles.actionContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => openEditModal(staffMember)}
                    style={styles.actionButton}
                    icon="edit"
                    compact
                  >
                    Edit
                  </Button>

                  <Button
                    mode={staffMember.active ? "outlined" : "contained"}
                    onPress={() =>
                      toggleStaffStatus(staffMember.id, staffMember.active)
                    }
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: staffMember.active
                          ? "transparent"
                          : "#4CAF50",
                      },
                    ]}
                    compact
                  >
                    {staffMember.active ? "Deactivate" : "Activate"}
                  </Button>

                  <Button
                    mode="outlined"
                    onPress={() =>
                      deleteStaff(staffMember.id, staffMember.name)
                    }
                    style={[styles.actionButton, { borderColor: "#F44336" }]}
                    textColor="#F44336"
                    icon="delete"
                    compact
                  >
                    Delete
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Staff Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title>
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </Title>

              <TextInput
                label="Full Name *"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Email *"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
              />

              <TextInput
                label="Phone"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
              />

              <Menu
                visible={departmentMenuVisible}
                onDismiss={() => setDepartmentMenuVisible(false)}
                anchor={
                  <TextInput
                    label="Department *"
                    value={formData.departmentName}
                    mode="outlined"
                    style={styles.input}
                    editable={false}
                    right={
                      <TextInput.Icon
                        icon="chevron-down"
                        onPress={() => setDepartmentMenuVisible(true)}
                      />
                    }
                    onPressIn={() => setDepartmentMenuVisible(true)}
                  />
                }
              >
                {departments.map((dept) => (
                  <Menu.Item
                    key={dept.id}
                    onPress={() => selectDepartment(dept)}
                    title={dept.name}
                  />
                ))}
              </Menu>

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={saveStaff}
                  style={styles.modalButton}
                >
                  {editingStaff ? "Update" : "Create"}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      {/* FAB */}
      <FAB style={styles.fab} icon="plus" onPress={() => openEditModal()} />
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
  staffCard: {
    margin: 15,
    marginBottom: 10,
    elevation: 2,
  },
  staffHeader: {
    marginBottom: 15,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    marginBottom: 5,
  },
  staffEmail: {
    color: "#666",
    marginBottom: 10,
  },
  staffMeta: {
    flexDirection: "row",
    gap: 8,
  },
  departmentChip: {
    backgroundColor: "#E3F2FD",
    height: 24,
  },
  statusChip: {
    height: 24,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  dateText: {
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
    minWidth: 70,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: "80%",
  },
  input: {
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    minWidth: 80,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#3F51B5",
  },
});

export default StaffManagementScreen;
