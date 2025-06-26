import { Tabs, router } from "expo-router"
import { View, TouchableOpacity } from "react-native"
import { Badge } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"
import { useApp } from "../../src/context/AppContext"

// Custom Tab Bar Icon with Badge
const TabBarIcon = ({
  name,
  focused,
  color,
  size,
  badgeCount = 0,
}: {
  name: keyof typeof MaterialIcons.glyphMap
  focused: boolean
  color: string
  size: number
  badgeCount?: number
}) => (
  <View style={{ position: "relative" }}>
    <MaterialIcons name={name} size={focused ? size + 4 : size} color={color} />
    {badgeCount > 0 && (
      <Badge
        style={{
          position: "absolute",
          top: -6,
          right: -6,
          backgroundColor: "#F44336",
          color: "white",
          fontSize: 10,
          minWidth: 16,
          height: 16,
        }}
      >
        {badgeCount > 99 ? "99+" : badgeCount}
      </Badge>
    )}
  </View>
)

// Custom Header Right Component
const HeaderRight = () => {
  const { getUnreadNotifications } = useApp()
  const unreadCount = getUnreadNotifications().length

  return (
    <View style={{ flexDirection: "row", marginRight: 15 }}>
      <TouchableOpacity onPress={() => router.push("/notifications")} style={{ marginRight: 15, position: "relative" }}>
        <MaterialIcons name="notifications" size={24} color="#FFFFFF" />
        {unreadCount > 0 && (
          <Badge
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              backgroundColor: "#F44336",
              color: "white",
              fontSize: 10,
              minWidth: 16,
              height: 16,
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/settings")}>
        <MaterialIcons name="settings" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}

export default function TabLayout() {
  const { user, getUserReports, getAssignedReports, getUnassignedReports, getUnreadNotifications, stats, initialized } =
    useApp()

  // Don't render tabs until app is initialized and user is loaded
  if (!initialized || !user) {
    return null
  }

  // Calculate badge counts based on user role
  const getBadgeCounts = () => {
    const unreadNotifications = getUnreadNotifications().length

    switch (user.role) {
      case "USER":
        const userReports = getUserReports()
        const pendingReports = userReports.filter((r: { status: string }) => r.status === "Pending").length
        return { reports: pendingReports, notifications: unreadNotifications }

      case "STAFF":
        const assignedReports = getAssignedReports()
        const pendingAssignments = assignedReports.filter((r: { status: string }) => r.status === "Pending").length
        return { reports: pendingAssignments, notifications: unreadNotifications }

      case "SUPER_ADMIN":
        const unassignedReports = getUnassignedReports().length
        return {
          reports: stats.pendingReports,
          unassigned: unassignedReports,
          notifications: unreadNotifications,
        }

      default:
        return { notifications: unreadNotifications }
    }
  }

  const badgeCounts = getBadgeCounts()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3F51B5",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 8,
          shadowOpacity: 0.1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: "#3F51B5",
          elevation: 4,
          shadowOpacity: 0.3,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerRight: () => <HeaderRight />,
      }}
    >
      {/* Citizen Tabs */}
      {user.role === "USER" && (
        <>
          <Tabs.Screen
            name="citizen"
            options={{
              title: "Dashboard",
              tabBarLabel: "Home",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="home" focused={focused} color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="create-report"
            options={{
              title: "Create Report",
              tabBarLabel: "Report",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="add-circle" focused={focused} color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="my-reports"
            options={{
              title: "My Reports",
              tabBarLabel: "My Reports",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon
                  name="list-alt"
                  focused={focused}
                  color={color}
                  size={size}
                  badgeCount={badgeCounts.reports}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarLabel: "Profile",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon
                  name="person"
                  focused={focused}
                  color={color}
                  size={size}
                  badgeCount={badgeCounts.notifications}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="help"
            options={{
              title: "Help & Support",
              tabBarLabel: "Help",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="help-outline" focused={focused} color={color} size={size} />
              ),
            }}
          />
        </>
      )}

      {/* Staff Tabs */}
      {user.role === "STAFF" && (
        <>
          <Tabs.Screen
            name="staff"
            options={{
              title: "Staff Dashboard",
              tabBarLabel: "Dashboard",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="dashboard" focused={focused} color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="assigned-reports"
            options={{
              title: "Assigned Reports",
              tabBarLabel: "Reports",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon
                  name="assignment"
                  focused={focused}
                  color={color}
                  size={size}
                  badgeCount={badgeCounts.reports}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarLabel: "Profile",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon
                  name="person"
                  focused={focused}
                  color={color}
                  size={size}
                  badgeCount={badgeCounts.notifications}
                />
              ),
            }}
          />
        </>
      )}

      {/* Super Admin Tabs */}
      {user.role === "SUPER_ADMIN" && (
        <>
          <Tabs.Screen
            name="admin"
            options={{
              title: "Admin Dashboard",
              tabBarLabel: "Dashboard",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="dashboard" focused={focused} color={color} size={size - 2} />
              ),
            }}
          />
          <Tabs.Screen
            name="all-reports"
            options={{
              title: "All Reports",
              tabBarLabel: "Reports",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon
                  name="list-alt"
                  focused={focused}
                  color={color}
                  size={size - 2}
                  badgeCount={badgeCounts.reports}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="users"
            options={{
              title: "User Management",
              tabBarLabel: "Users",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="people" focused={focused} color={color} size={size - 2} />
              ),
            }}
          />
          <Tabs.Screen
            name="departments"
            options={{
              title: "Departments",
              tabBarLabel: "Departments",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="business" focused={focused} color={color} size={size - 2} />
              ),
            }}
          />
          <Tabs.Screen
            name="staff-management"
            options={{
              title: "Staff Management",
              tabBarLabel: "Staff",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="supervisor-account" focused={focused} color={color} size={size - 2} />
              ),
            }}
          />
          <Tabs.Screen
            name="assign-reports"
            options={{
              title: "Assign Reports",
              tabBarLabel: "Assign",
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon
                  name="assignment-ind"
                  focused={focused}
                  color={color}
                  size={size - 2}
                  badgeCount={badgeCounts.unassigned}
                />
              ),
            }}
          />
        </>
      )}
    </Tabs>
  )
}
