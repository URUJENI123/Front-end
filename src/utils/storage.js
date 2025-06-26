import AsyncStorage from "@react-native-async-storage/async-storage";

// User Management
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.error("Error removing user:", error);
  }
};

// Reports CRUD
export const saveReport = async (report) => {
  try {
    const existingReports = await getReports();
    const updatedReports = [...existingReports, report];
    await AsyncStorage.setItem("reports", JSON.stringify(updatedReports));
    return true;
  } catch (error) {
    console.error("Error saving report:", error);
    return false;
  }
};

export const getReports = async () => {
  try {
    const reportsData = await AsyncStorage.getItem("reports");
    return reportsData ? JSON.parse(reportsData) : [];
  } catch (error) {
    console.error("Error getting reports:", error);
    return [];
  }
};

export const updateReport = async (reportId, updates) => {
  try {
    const reports = await getReports();
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, ...updates } : report
    );
    await AsyncStorage.setItem("reports", JSON.stringify(updatedReports));
    return true;
  } catch (error) {
    console.error("Error updating report:", error);
    return false;
  }
};

export const deleteReport = async (reportId) => {
  try {
    const reports = await getReports();
    const filteredReports = reports.filter((report) => report.id !== reportId);
    await AsyncStorage.setItem("reports", JSON.stringify(filteredReports));
    return true;
  } catch (error) {
    console.error("Error deleting report:", error);
    return false;
  }
};

// Departments CRUD
export const saveDepartment = async (department) => {
  try {
    const existingDepartments = await getDepartments();
    const updatedDepartments = [...existingDepartments, department];
    await AsyncStorage.setItem(
      "departments",
      JSON.stringify(updatedDepartments)
    );
    return true;
  } catch (error) {
    console.error("Error saving department:", error);
    return false;
  }
};

export const getDepartments = async () => {
  try {
    const departmentsData = await AsyncStorage.getItem("departments");
    return departmentsData ? JSON.parse(departmentsData) : [];
  } catch (error) {
    console.error("Error getting departments:", error);
    return [];
  }
};

export const updateDepartment = async (departmentId, updates) => {
  try {
    const departments = await getDepartments();
    const updatedDepartments = departments.map((dept) =>
      dept.id === departmentId ? { ...dept, ...updates } : dept
    );
    await AsyncStorage.setItem(
      "departments",
      JSON.stringify(updatedDepartments)
    );
    return true;
  } catch (error) {
    console.error("Error updating department:", error);
    return false;
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
    const departments = await getDepartments();
    const filteredDepartments = departments.filter(
      (dept) => dept.id !== departmentId
    );
    await AsyncStorage.setItem(
      "departments",
      JSON.stringify(filteredDepartments)
    );
    return true;
  } catch (error) {
    console.error("Error deleting department:", error);
    return false;
  }
};

// Staff Management
export const saveStaff = async (staff) => {
  try {
    const existingStaff = await getStaff();
    const updatedStaff = [...existingStaff, staff];
    await AsyncStorage.setItem("staff", JSON.stringify(updatedStaff));
    return true;
  } catch (error) {
    console.error("Error saving staff:", error);
    return false;
  }
};

export const getStaff = async () => {
  try {
    const staffData = await AsyncStorage.getItem("staff");
    return staffData ? JSON.parse(staffData) : [];
  } catch (error) {
    console.error("Error getting staff:", error);
    return [];
  }
};

export const updateStaff = async (staffId, updates) => {
  try {
    const staff = await getStaff();
    const updatedStaff = staff.map((member) =>
      member.id === staffId ? { ...member, ...updates } : member
    );
    await AsyncStorage.setItem("staff", JSON.stringify(updatedStaff));
    return true;
  } catch (error) {
    console.error("Error updating staff:", error);
    return false;
  }
};

export const deleteStaff = async (staffId) => {
  try {
    const staff = await getStaff();
    const filteredStaff = staff.filter((member) => member.id !== staffId);
    await AsyncStorage.setItem("staff", JSON.stringify(filteredStaff));
    return true;
  } catch (error) {
    console.error("Error deleting staff:", error);
    return false;
  }
};

// Users Management
export const saveUserData = async (userData) => {
  try {
    const existingUsers = await getUsers();
    const updatedUsers = [...existingUsers, userData];
    await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    console.error("Error saving user data:", error);
    return false;
  }
};

export const getUsers = async () => {
  try {
    const usersData = await AsyncStorage.getItem("users");
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

// Initialize default data
export const initializeDefaultData = async () => {
  try {
    // Initialize departments
    const departments = await getDepartments();
    if (departments.length === 0) {
      const defaultDepartments = [
        {
          id: "1",
          name: "Sanitation Department",
          description: "Handles waste management and cleanliness",
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Police Department",
          description: "Law enforcement and security",
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Electricity Department",
          description: "Power supply and electrical issues",
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Water Supply Department",
          description: "Water distribution and quality",
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          name: "Roads Department",
          description: "Road maintenance and construction",
          active: true,
          createdAt: new Date().toISOString(),
        },
      ];
      await AsyncStorage.setItem(
        "departments",
        JSON.stringify(defaultDepartments)
      );
    }

    // Initialize default users
    const users = await getUsers();
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: "1",
          name: "John Citizen",
          email: "citizen@example.com",
          password: "password123",
          role: "USER",
          phone: "+1234567890",
          address: "123 Main St, City",
          createdAt: new Date().toISOString(),
          active: true,
        },
        {
          id: "2",
          name: "Jane Staff",
          email: "staff@example.com",
          password: "password123",
          role: "STAFF",
          phone: "+1234567891",
          department: "1",
          createdAt: new Date().toISOString(),
          active: true,
        },
        {
          id: "3",
          name: "Admin User",
          email: "admin@example.com",
          password: "password123",
          role: "SUPER_ADMIN",
          phone: "+1234567892",
          createdAt: new Date().toISOString(),
          active: true,
        },
      ];
      await AsyncStorage.setItem("users", JSON.stringify(defaultUsers));
    }

    // Initialize staff
    const staff = await getStaff();
    if (staff.length === 0) {
      const defaultStaff = [
        {
          id: "2",
          name: "Jane Staff",
          email: "staff@example.com",
          department: "1",
          departmentName: "Sanitation Department",
          phone: "+1234567891",
          active: true,
          createdAt: new Date().toISOString(),
        },
      ];
      await AsyncStorage.setItem("staff", JSON.stringify(defaultStaff));
    }

    // Initialize sample reports
    const reports = await getReports();
    if (reports.length === 0) {
      const sampleReports = [
        {
          id: "1",
          title: "Broken Street Light",
          description:
            "The street light on Main Street has been broken for a week, making it dangerous for pedestrians at night.",
          category: "Electricity",
          priority: "High",
          status: "Pending",
          location: "Main Street, Downtown",
          userId: "1",
          userName: "John Citizen",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          images: [],
          comments: [],
        },
        {
          id: "2",
          title: "Pothole on Highway",
          description:
            "Large pothole causing damage to vehicles on Highway 101.",
          category: "Roads",
          priority: "Medium",
          status: "In Progress",
          location: "Highway 101, Mile Marker 15",
          userId: "1",
          userName: "John Citizen",
          assignedTo: "2",
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          images: [],
          comments: [
            {
              id: "1",
              text: "We have received your report and assigned a team to investigate.",
              author: "Jane Staff",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ],
        },
      ];
      await AsyncStorage.setItem("reports", JSON.stringify(sampleReports));
    }
  } catch (error) {
    console.error("Error initializing default data:", error);
  }
};
