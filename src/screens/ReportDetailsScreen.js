import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  Divider,
  Menu,
  TextInput,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const ReportDetailsScreen = ({ route, navigation }) => {
  const { report, isStaff = false } = route.params;
  const [currentUser, setCurrentUser] = useState(null);
  const [reportData, setReportData] = useState(report);
  const [menuVisible, setMenuVisible] = useState(false);
  const [assignMenuVisible, setAssignMenuVisible] = useState(false);
  const [staff, setStaff] = useState([]);
  const [comments, setComments] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  useEffect(() => {
    loadCurrentUser();
    loadStaff();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadStaff = async () => {
    try {
      const staffData = await AsyncStorage.getItem("staff");
      if (staffData) {
        setStaff(JSON.parse(staffData));
      }
    } catch (error) {
      console.error("Error loading staff data:", error);
    }
  };

  const updateReportStatus = async (newStatus) => {
    try {
      const reportsData = await AsyncStorage.getItem("reports");
      const allReports = JSON.parse(reportsData);
      const updatedReports = allReports.map((r) =>
        r.id === reportData.id
          ? { ...r, status: newStatus, updatedAt: new Date().toISOString() }
          : r
      );

      await AsyncStorage.setItem("reports", JSON.stringify(updatedReports));
      setReportData({ ...reportData, status: newStatus });
      setMenuVisible(false);
      Alert.alert("Success", "Report status updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update report status");
    }
  };

  const assignReport = async (staffId) => {
    try {
      const reportsData = await AsyncStorage.getItem("reports");
      const allReports = JSON.parse(reportsData);
      const updatedReports = allReports.map((r) =>
        r.id === reportData.id
          ? {
              ...r,
              assignedTo: staffId,
              status: "Pending",
              updatedAt: new Date().toISOString(),
            }
          : r
      );

      await AsyncStorage.setItem("reports", JSON.stringify(updatedReports));
      setReportData({ ...reportData, assignedTo: staffId, status: "Pending" });
      setAssignMenuVisible(false);
      Alert.alert("Success", "Report assigned successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to assign report");
    }
  };

  const addComment = async () => {
    if (!comments.trim()) return;

    try {
      const newComment = {
        id: Date.now().toString(),
        text: comments,
        author: currentUser.name,
        createdAt: new Date().toISOString(),
      };

      const reportsData = await AsyncStorage.getItem("reports");
      const allReports = JSON.parse(reportsData);
      const updatedReports = allReports.map((r) =>
        r.id === reportData.id
          ? { ...r, comments: [...(r.comments || []), newComment] }
          : r
      );

      await AsyncStorage.setItem("reports", JSON.stringify(updatedReports));
      setReportData({
        ...reportData,
        comments: [...(reportData.comments || []), newComment],
      });
      setComments("");
      setShowCommentInput(false);
      Alert.alert("Success", "Comment added successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to add comment");
    }
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

  const getAssignedStaffName = (staffId) => {
    const staffMember = staff.find((s) => s.id === staffId);
    return staffMember ? staffMember.name : "Unknown Staff";
  };

  const canUpdateStatus = () => {
    return (
      (currentUser?.role === "STAFF" &&
        reportData.assignedTo === currentUser.id) ||
      currentUser?.role === "SUPER_ADMIN"
    );
  };

  const canAssignReport = () => {
    return currentUser?.role === "SUPER_ADMIN";
  };

  return (
    <ScrollView style={styles.container}>
      {/* Report Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title style={styles.reportTitle}>{reportData.title}</Title>
            <View style={styles.chipContainer}>
              <Chip
                style={[
                  styles.priorityChip,
                  { backgroundColor: getPriorityColor(reportData.priority) },
                ]}
                textStyle={{ color: "white", fontSize: 12 }}
              >
                {reportData.priority}
              </Chip>
              <Chip
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(reportData.status) },
                ]}
                textStyle={{ color: "white", fontSize: 12 }}
              >
                {reportData.status}
              </Chip>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="category" size={16} color="#666" />
              <Paragraph style={styles.metaText}>
                {reportData.category}
              </Paragraph>
            </View>
            <View style={styles.metaItem}>
              <Icon name="location-on" size={16} color="#666" />
              <Paragraph style={styles.metaText}>
                {reportData.location}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Report Details */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Title>Description</Title>
          <Paragraph style={styles.description}>
            {reportData.description}
          </Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Paragraph style={styles.infoLabel}>Created</Paragraph>
              <Paragraph style={styles.infoValue}>
                {formatDate(reportData.createdAt)}
              </Paragraph>
            </View>
            {reportData.updatedAt && (
              <View style={styles.infoItem}>
                <Paragraph style={styles.infoLabel}>Last Updated</Paragraph>
                <Paragraph style={styles.infoValue}>
                  {formatDate(reportData.updatedAt)}
                </Paragraph>
              </View>
            )}
          </View>

          {reportData.assignedTo && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.assignmentInfo}>
                <Icon name="person" size={20} color="#666" />
                <View style={styles.assignmentText}>
                  <Paragraph style={styles.infoLabel}>Assigned to</Paragraph>
                  <Paragraph style={styles.infoValue}>
                    {getAssignedStaffName(reportData.assignedTo)}
                  </Paragraph>
                </View>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title>Actions</Title>

          <View style={styles.actionButtons}>
            {canUpdateStatus() && (
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="contained"
                    onPress={() => setMenuVisible(true)}
                    icon="edit"
                    style={styles.actionButton}
                  >
                    Update Status
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => updateReportStatus("Pending")}
                  title="Pending"
                />
                <Menu.Item
                  onPress={() => updateReportStatus("In Progress")}
                  title="In Progress"
                />
                <Menu.Item
                  onPress={() => updateReportStatus("Resolved")}
                  title="Resolved"
                />
              </Menu>
            )}

            {canAssignReport() && !reportData.assignedTo && (
              <Menu
                visible={assignMenuVisible}
                onDismiss={() => setAssignMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setAssignMenuVisible(true)}
                    icon="person-add"
                    style={styles.actionButton}
                  >
                    Assign Staff
                  </Button>
                }
              >
                {staff.map((staffMember) => (
                  <Menu.Item
                    key={staffMember.id}
                    onPress={() => assignReport(staffMember.id)}
                    title={staffMember.name}
                  />
                ))}
              </Menu>
            )}

            <Button
              mode="outlined"
              onPress={() => setShowCommentInput(!showCommentInput)}
              icon="comment"
              style={styles.actionButton}
            >
              Add Comment
            </Button>
          </View>

          {showCommentInput && (
            <View style={styles.commentInput}>
              <TextInput
                label="Add a comment"
                value={comments}
                onChangeText={setComments}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.commentTextInput}
              />
              <View style={styles.commentActions}>
                <Button onPress={() => setShowCommentInput(false)}>
                  Cancel
                </Button>
                <Button mode="contained" onPress={addComment}>
                  Add Comment
                </Button>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Comments */}
      {reportData.comments && reportData.comments.length > 0 && (
        <Card style={styles.commentsCard}>
          <Card.Content>
            <Title>Comments</Title>
            {reportData.comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Paragraph style={styles.commentAuthor}>
                    {comment.author}
                  </Paragraph>
                  <Paragraph style={styles.commentDate}>
                    {formatDate(comment.createdAt)}
                  </Paragraph>
                </View>
                <Paragraph style={styles.commentText}>{comment.text}</Paragraph>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
  },
  headerCard: {
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  reportTitle: {
    flex: 1,
    marginRight: 15,
  },
  chipContainer: {
    flexDirection: "row",
    gap: 8,
  },
  priorityChip: {
    height: 28,
  },
  statusChip: {
    height: 28,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  metaText: {
    marginLeft: 8,
    color: "#666",
  },
  detailsCard: {
    marginBottom: 15,
  },
  description: {
    marginTop: 10,
    lineHeight: 22,
  },
  divider: {
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  assignmentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  assignmentText: {
    marginLeft: 10,
  },
  actionsCard: {
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    minWidth: 120,
  },
  commentInput: {
    marginTop: 15,
  },
  commentTextInput: {
    marginBottom: 10,
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  commentsCard: {
    marginBottom: 15,
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#3F51B5",
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
  },
  commentText: {
    lineHeight: 20,
  },
});

export default ReportDetailsScreen;
