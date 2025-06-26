"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { initializeDefaultData } from "../utils/storage"

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  initialized: false,
  reports: [],
  departments: [],
  staff: [],
  users: [],
  notifications: [],
  settings: {
    notifications: true,
    emailNotifications: true,
    darkMode: false,
    autoSync: true,
    locationServices: false,
  },
  stats: {
    totalReports: 0,
    pendingReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
    totalUsers: 0,
    totalStaff: 0,
    totalDepartments: 0,
  },
}

// Action types
const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_INITIALIZED: "SET_INITIALIZED",
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
  SET_REPORTS: "SET_REPORTS",
  ADD_REPORT: "ADD_REPORT",
  UPDATE_REPORT: "UPDATE_REPORT",
  DELETE_REPORT: "DELETE_REPORT",
  SET_DEPARTMENTS: "SET_DEPARTMENTS",
  ADD_DEPARTMENT: "ADD_DEPARTMENT",
  UPDATE_DEPARTMENT: "UPDATE_DEPARTMENT",
  DELETE_DEPARTMENT: "DELETE_DEPARTMENT",
  SET_STAFF: "SET_STAFF",
  ADD_STAFF: "ADD_STAFF",
  UPDATE_STAFF: "UPDATE_STAFF",
  DELETE_STAFF: "DELETE_STAFF",
  SET_USERS: "SET_USERS",
  UPDATE_USER: "UPDATE_USER",
  SET_NOTIFICATIONS: "SET_NOTIFICATIONS",
  MARK_NOTIFICATION_READ: "MARK_NOTIFICATION_READ",
  SET_SETTINGS: "SET_SETTINGS",
  UPDATE_STATS: "UPDATE_STATS",
}

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload }

    case ActionTypes.SET_INITIALIZED:
      return { ...state, initialized: action.payload, loading: false }

    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      }

    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        reports: [],
        notifications: [],
      }

    case ActionTypes.SET_REPORTS:
      return { ...state, reports: action.payload }

    case ActionTypes.ADD_REPORT:
      return { ...state, reports: [action.payload, ...state.reports] }

    case ActionTypes.UPDATE_REPORT:
      return {
        ...state,
        reports: state.reports.map((report) =>
          report.id === action.payload.id ? { ...report, ...action.payload } : report,
        ),
      }

    case ActionTypes.DELETE_REPORT:
      return {
        ...state,
        reports: state.reports.filter((report) => report.id !== action.payload),
      }

    case ActionTypes.SET_DEPARTMENTS:
      return { ...state, departments: action.payload }

    case ActionTypes.ADD_DEPARTMENT:
      return { ...state, departments: [action.payload, ...state.departments] }

    case ActionTypes.UPDATE_DEPARTMENT:
      return {
        ...state,
        departments: state.departments.map((dept) =>
          dept.id === action.payload.id ? { ...dept, ...action.payload } : dept,
        ),
      }

    case ActionTypes.DELETE_DEPARTMENT:
      return {
        ...state,
        departments: state.departments.filter((dept) => dept.id !== action.payload),
      }

    case ActionTypes.SET_STAFF:
      return { ...state, staff: action.payload }

    case ActionTypes.ADD_STAFF:
      return { ...state, staff: [action.payload, ...state.staff] }

    case ActionTypes.UPDATE_STAFF:
      return {
        ...state,
        staff: state.staff.map((member) =>
          member.id === action.payload.id ? { ...member, ...action.payload } : member,
        ),
      }

    case ActionTypes.DELETE_STAFF:
      return {
        ...state,
        staff: state.staff.filter((member) => member.id !== action.payload),
      }

    case ActionTypes.SET_USERS:
      return { ...state, users: action.payload }

    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload.id ? { ...user, ...action.payload } : user)),
      }

    case ActionTypes.SET_NOTIFICATIONS:
      return { ...state, notifications: action.payload }

    case ActionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload ? { ...notif, read: true } : notif,
        ),
      }

    case ActionTypes.SET_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } }

    case ActionTypes.UPDATE_STATS:
      return { ...state, stats: { ...state.stats, ...action.payload } }

    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// Context provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize app data
  useEffect(() => {
    initializeApp()
  }, [])

  // Update stats when reports change
  useEffect(() => {
    if (state.initialized && state.reports.length >= 0) {
      updateStats()
    }
  }, [state.reports, state.users, state.staff, state.departments, state.initialized])

  const initializeApp = async () => {
    try {
      console.log("🚀 Initializing app...")
      dispatch({ type: ActionTypes.SET_LOADING, payload: true })

      // Initialize default data first
      console.log("📦 Initializing default data...")
      await initializeDefaultData()

      // Load all data
      console.log("📊 Loading app data...")
      await loadAllData()

      // Load user session
      console.log("👤 Loading user session...")
      await loadUserSession()

      console.log("✅ App initialization complete!")
      dispatch({ type: ActionTypes.SET_INITIALIZED, payload: true })
    } catch (error) {
      console.error("❌ Error initializing app:", error)
      dispatch({ type: ActionTypes.SET_LOADING, payload: false })
    }
  }

  const loadUserSession = async () => {
    try {
      const userData = await AsyncStorage.getItem("user")
      if (userData) {
        const user = JSON.parse(userData)
        console.log("👤 User session found:", user.email)
        dispatch({ type: ActionTypes.SET_USER, payload: user })
      } else {
        console.log("👤 No user session found")
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
      }
    } catch (error) {
      console.error("❌ Error loading user session:", error)
      dispatch({ type: ActionTypes.SET_LOADING, payload: false })
    }
  }

  const loadAllData = async () => {
    try {
      // Load reports
      const reportsData = await AsyncStorage.getItem("reports")
      if (reportsData) {
        const reports = JSON.parse(reportsData)
        console.log("📋 Loaded reports:", reports.length)
        dispatch({ type: ActionTypes.SET_REPORTS, payload: reports })
      }

      // Load departments
      const departmentsData = await AsyncStorage.getItem("departments")
      if (departmentsData) {
        const departments = JSON.parse(departmentsData)
        console.log("🏢 Loaded departments:", departments.length)
        dispatch({ type: ActionTypes.SET_DEPARTMENTS, payload: departments })
      }

      // Load staff
      const staffData = await AsyncStorage.getItem("staff")
      if (staffData) {
        const staff = JSON.parse(staffData)
        console.log("👥 Loaded staff:", staff.length)
        dispatch({ type: ActionTypes.SET_STAFF, payload: staff })
      }

      // Load users
      const usersData = await AsyncStorage.getItem("users")
      if (usersData) {
        const users = JSON.parse(usersData)
        console.log("👤 Loaded users:", users.length)
        dispatch({ type: ActionTypes.SET_USERS, payload: users })
      }

      // Load settings
      const settingsData = await AsyncStorage.getItem("appSettings")
      if (settingsData) {
        dispatch({ type: ActionTypes.SET_SETTINGS, payload: JSON.parse(settingsData) })
      }
    } catch (error) {
      console.error("❌ Error loading app data:", error)
    }
  }

  const updateStats = () => {
    const totalReports = state.reports.length
    const pendingReports = state.reports.filter((r) => r.status === "Pending").length
    const inProgressReports = state.reports.filter((r) => r.status === "In Progress").length
    const resolvedReports = state.reports.filter((r) => r.status === "Resolved").length
    const totalUsers = state.users.filter((u) => u.role === "USER").length
    const totalStaff = state.staff.length
    const totalDepartments = state.departments.length

    dispatch({
      type: ActionTypes.UPDATE_STATS,
      payload: {
        totalReports,
        pendingReports,
        inProgressReports,
        resolvedReports,
        totalUsers,
        totalStaff,
        totalDepartments,
      },
    })
  }

  // Auth actions
  const login = async (email, password) => {
    try {
      console.log("🔐 Attempting login for:", email)
      const user = state.users.find((u) => u.email === email && u.password === password && u.active)

      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user))
        dispatch({ type: ActionTypes.SET_USER, payload: user })
        console.log("✅ Login successful for:", user.email)
        return { success: true }
      } else {
        console.log("❌ Login failed: Invalid credentials")
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      return { success: false, error: "Login failed" }
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user")
      dispatch({ type: ActionTypes.LOGOUT })
      console.log("👋 User logged out")
    } catch (error) {
      console.error("❌ Error during logout:", error)
    }
  }

  // Report actions
  const createReport = async (reportData) => {
    try {
      const newReport = {
        id: Date.now().toString(),
        ...reportData,
        userId: state.user.id,
        userName: state.user.name,
        status: "Pending",
        createdAt: new Date().toISOString(),
        comments: [],
        images: [],
      }

      const updatedReports = [newReport, ...state.reports]
      await AsyncStorage.setItem("reports", JSON.stringify(updatedReports))
      dispatch({ type: ActionTypes.ADD_REPORT, payload: newReport })

      return { success: true, report: newReport }
    } catch (error) {
      return { success: false, error: "Failed to create report" }
    }
  }

  const updateReport = async (reportId, updates) => {
    try {
      const updatedReport = { ...updates, updatedAt: new Date().toISOString() }
      const updatedReports = state.reports.map((report) =>
        report.id === reportId ? { ...report, ...updatedReport } : report,
      )

      await AsyncStorage.setItem("reports", JSON.stringify(updatedReports))
      dispatch({ type: ActionTypes.UPDATE_REPORT, payload: { id: reportId, ...updatedReport } })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to update report" }
    }
  }

  const assignReport = async (reportId, staffId) => {
    try {
      const staff = state.staff.find((s) => s.id === staffId)
      const updates = {
        assignedTo: staffId,
        assignedStaffName: staff?.name,
        status: "Pending",
        updatedAt: new Date().toISOString(),
      }

      return await updateReport(reportId, updates)
    } catch (error) {
      return { success: false, error: "Failed to assign report" }
    }
  }

  // Department actions
  const createDepartment = async (departmentData) => {
    try {
      const newDepartment = {
        id: Date.now().toString(),
        ...departmentData,
        active: true,
        createdAt: new Date().toISOString(),
      }

      const updatedDepartments = [newDepartment, ...state.departments]
      await AsyncStorage.setItem("departments", JSON.stringify(updatedDepartments))
      dispatch({ type: ActionTypes.ADD_DEPARTMENT, payload: newDepartment })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to create department" }
    }
  }

  const updateDepartment = async (departmentId, updates) => {
    try {
      const updatedDepartment = { ...updates, updatedAt: new Date().toISOString() }
      const updatedDepartments = state.departments.map((dept) =>
        dept.id === departmentId ? { ...dept, ...updatedDepartment } : dept,
      )

      await AsyncStorage.setItem("departments", JSON.stringify(updatedDepartments))
      dispatch({ type: ActionTypes.UPDATE_DEPARTMENT, payload: { id: departmentId, ...updatedDepartment } })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to update department" }
    }
  }

  // Staff actions
  const createStaff = async (staffData) => {
    try {
      const newStaffId = Date.now().toString()
      const newStaff = {
        id: newStaffId,
        ...staffData,
        active: true,
        createdAt: new Date().toISOString(),
      }

      // Add to staff
      const updatedStaff = [newStaff, ...state.staff]
      await AsyncStorage.setItem("staff", JSON.stringify(updatedStaff))

      // Add to users
      const newUser = {
        id: newStaffId,
        name: staffData.name,
        email: staffData.email,
        password: "password123",
        role: "STAFF",
        phone: staffData.phone,
        department: staffData.department,
        departmentName: staffData.departmentName,
        active: true,
        createdAt: new Date().toISOString(),
      }

      const updatedUsers = [newUser, ...state.users]
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers))

      dispatch({ type: ActionTypes.ADD_STAFF, payload: newStaff })
      dispatch({ type: ActionTypes.SET_USERS, payload: updatedUsers })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to create staff" }
    }
  }

  // Settings actions
  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...state.settings, ...newSettings }
      await AsyncStorage.setItem("appSettings", JSON.stringify(updatedSettings))
      dispatch({ type: ActionTypes.SET_SETTINGS, payload: newSettings })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to update settings" }
    }
  }

  // Notification actions
  const markNotificationAsRead = (notificationId) => {
    dispatch({ type: ActionTypes.MARK_NOTIFICATION_READ, payload: notificationId })
  }

  // Utility functions
  const getUserReports = () => {
    if (!state.user) return []
    return state.reports.filter((report) => report.userId === state.user.id)
  }

  const getAssignedReports = () => {
    if (!state.user || state.user.role !== "STAFF") return []
    return state.reports.filter((report) => report.assignedTo === state.user.id)
  }

  const getUnassignedReports = () => {
    return state.reports.filter((report) => !report.assignedTo)
  }

  const getActiveDepartments = () => {
    return state.departments.filter((dept) => dept.active)
  }

  const getActiveStaff = () => {
    return state.staff.filter((member) => member.active)
  }

  const getUnreadNotifications = () => {
    return state.notifications.filter((notif) => !notif.read)
  }

  const contextValue = {
    // State
    ...state,

    // Auth actions
    login,
    logout,

    // Report actions
    createReport,
    updateReport,
    assignReport,

    // Department actions
    createDepartment,
    updateDepartment,

    // Staff actions
    createStaff,

    // Settings actions
    updateSettings,

    // Notification actions
    markNotificationAsRead,

    // Utility functions
    getUserReports,
    getAssignedReports,
    getUnassignedReports,
    getActiveDepartments,
    getActiveStaff,
    getUnreadNotifications,

    // Data refresh
    loadAllData,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export default AppContext
