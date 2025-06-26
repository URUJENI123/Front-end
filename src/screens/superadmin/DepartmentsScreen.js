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
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const DepartmentsScreen = ({ navigation }) => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    filterDepartments();
  }, [searchQuery, departments]);

  const loadDepartments = async () => {
    try {
      const departmentsData = await AsyncStorage.getItem("departments");
      if (departmentsData) {
        const allDepartments = JSON.parse(departmentsData);
        setDepartments(
          allDepartments.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const filterDepartments = () => {
    if (!searchQuery) {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDepartments(filtered);
    }
  };

  const saveDepartment = async () => {
    if (!formData.name || !formData.description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      let updatedDepartments;

      if (editingDepartment) {
        // Update existing department
        updatedDepartments = departments.map((dept) =>
          dept.id === editingDepartment.id
            ? { ...dept, ...formData, updatedAt: new Date().toISOString() }
            : dept
        );
      } else {
        // Create new department
        const newDepartment = {
          id: Date.now().toString(),
          ...formData,
          active: true,
          createdAt: new Date().toISOString(),
        };
        updatedDepartments = [newDepartment, ...departments];
      }

      await AsyncStorage.setItem(
        "departments",
        JSON.stringify(updatedDepartments)
      );
      setDepartments(updatedDepartments);
      setModalVisible(false);
      setEditingDepartment(null);
      setFormData({ name: "", description: "" });

      Alert.alert(
        "Success",
        `Department ${editingDepartment ? "updated" : "created"} successfully!`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save department");
    }
  };

  const toggleDepartmentStatus = async (departmentId, currentStatus) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this department?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const updatedDepartments = departments.map((dept) =>
                dept.id === departmentId
                  ? {
                      ...dept,
                      active: !currentStatus,
                      updatedAt: new Date().toISOString(),
                    }
                  : dept
              );
              await AsyncStorage.setItem(
                "departments",
                JSON.stringify(updatedDepartments)
              );
              setDepartments(updatedDepartments);
              Alert.alert(
                "Success",
                `Department ${
                  !currentStatus ? "activated" : "deactivated"
                } successfully!`
              );
            } catch (error) {
              Alert.alert("Error", "Failed to update department status");
            }
          },
        },
      ]
    );
  };

  const deleteDepartment = async (departmentId, departmentName) => {
    Alert.alert(
      "Delete Department",
      `Are you sure you want to delete "${departmentName}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedDepartments = departments.filter(
                (dept) => dept.id !== departmentId
              );
              await AsyncStorage.setItem(
                "departments",
                JSON.stringify(updatedDepartments)
              );
              setDepartments(updatedDepartments);
              Alert.alert("Success", "Department deleted successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to delete department");
            }
          },
        },
      ]
    );
  };

  const openEditModal = (department = null) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({
        name: department.name,
        description: department.description,
      });
    } else {
      setEditingDepartment(null);
      setFormData({ name: "", description: "" });
    }
    setModalVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
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
        placeholder="Search departments..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredDepartments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="business-center" size={60} color="#9E9E9E" />
              <Title style={styles.emptyTitle}>No Departments Found</Title>
              <Paragraph style={styles.emptyText}>
                {searchQuery
                  ? "No departments match your search."
                  : "No departments have been created yet."}
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          filteredDepartments.map((department) => (
            <Card key={department.id} style={styles.departmentCard}>
              <Card.Content>
                <View style={styles.departmentHeader}>
                  <View style={styles.departmentInfo}>
                    <Title style={styles.departmentName}>
                      {department.name}
                    </Title>
                    <Paragraph style={styles.departmentDescription}>
                      {department.description}
                    </Paragraph>
                  </View>
                  <Chip
                    style={[
                      styles.statusChip,
                      {
                        backgroundColor: department.active
                          ? "#4CAF50"
                          : "#F44336",
                      },
                    ]}
                    textStyle={{ color: "white", fontSize: 12 }}
                  >
                    {department.active ? "Active" : "Inactive"}
                  </Chip>
                </View>

                <View style={styles.departmentMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="calendar-today" size={16} color="#666" />
                    <Paragraph style={styles.metaText}>
                      Created {formatDate(department.createdAt)}
                    </Paragraph>
                  </View>
                  {department.updatedAt && (
                    <View style={styles.metaItem}>
                      <Icon name="update" size={16} color="#666" />
                      <Paragraph style={styles.metaText}>
                        Updated {formatDate(department.updatedAt)}
                      </Paragraph>
                    </View>
                  )}
                </View>

                <View style={styles.actionContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => openEditModal(department)}
                    style={styles.actionButton}
                    icon="edit"
                    compact
                  >
                    Edit
                  </Button>

                  <Button
                    mode={department.active ? "outlined" : "contained"}
                    onPress={() =>
                      toggleDepartmentStatus(department.id, department.active)
                    }
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: department.active
                          ? "transparent"
                          : "#4CAF50",
                      },
                    ]}
                    compact
                  >
                    {department.active ? "Deactivate" : "Activate"}
                  </Button>

                  <Button
                    mode="outlined"
                    onPress={() =>
                      deleteDepartment(department.id, department.name)
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

      {/* Add/Edit Department Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title>
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </Title>

              <TextInput
                label="Department Name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Description"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />

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
                  onPress={saveDepartment}
                  style={styles.modalButton}
                >
                  {editingDepartment ? "Update" : "Create"}
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
  departmentCard: {
    margin: 15,
    marginBottom: 10,
    elevation: 2,
  },
  departmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  departmentInfo: {
    flex: 1,
    marginRight: 15,
  },
  departmentName: {
    fontSize: 18,
    marginBottom: 5,
  },
  departmentDescription: {
    color: "#666",
    lineHeight: 20,
  },
  statusChip: {
    height: 28,
  },
  departmentMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#666",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    minWidth: 80,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
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

export default DepartmentsScreen;
