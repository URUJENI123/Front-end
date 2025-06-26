import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View, TouchableOpacity } from "react-native";
import { Badge } from "react-native-paper";
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useApp } from "../context/AppContext";

// Import screens
import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import CitizenDashboard from "../screens/citizen/CitizenDashboard";
import CreateReportScreen from "../screens/citizen/CreateReportScreen";
import MyReportsScreen from "../screens/citizen/MyReportScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StaffDashboard from "../screens/staff/StaffDashboard";
import AssignedReportsScreen from "../screens/staff/AssignedReportsScreen";
import ReportDetailsScreen from "../screens/ReportDetailsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import HelpSupportScreen from "../screens/HelpSupportScreen";
import SuperAdminDashboard from "../screens/superadmin/SuperAdminDashboard";
import AllReportsScreen from "../screens/superadmin/AllReportsScreen";
import UsersScreen from "../screens/superadmin/UserScreen";
import DepartmentsScreen from "../screens/superadmin/DepartmentsScreen";
import StaffManagementScreen from "../screens/superadmin/StaffManagementScreen";
import AssignReportsScreen from "../screens/superadmin/AssignReportsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Tab Bar Icon with Badge
const TabBarIcon = ({ name, focused, color, size, badgeCount = 0 }) => (
  <View style={{ position: "relative" }}>
    <Icon name={name} size={focused ? size + 4 : size} color={color} />
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
);

// Custom Header Right Component
const HeaderRight = ({ navigation }) => {
  const { getUnreadNotifications } = useApp();
  const unreadCount = getUnreadNotifications().length;

  return (
    <View style={{ flexDirection: "row", marginRight: 15 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Notifications")}
        style={{ marginRight: 15, position: "relative" }}
      >
        <Icon name="notifications" size={24} color="#FFFFFF" />
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
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Icon name="settings" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// Citizen Tabs
const CitizenTabs = () => {
  const { getUserReports, getUnreadNotifications } = useApp();
  const userReports = getUserReports();
  const pendingReports = userReports.filter(
    (r) => r.status === "Pending"
  ).length;
  const unreadNotifications = getUnreadNotifications().length;

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let badgeCount = 0;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Create Report":
              iconName = "add-circle";
              break;
            case "My Reports":
              iconName = "list-alt";
              badgeCount = pendingReports;
              break;
            case "Profile":
              iconName = "person";
              badgeCount = unreadNotifications;
              break;
            case "Help":
              iconName = "help-outline";
              break;
          }

          return (
            <TabBarIcon
              name={iconName}
              focused={focused}
              color={color}
              size={size}
              badgeCount={badgeCount}
            />
          );
        },
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
        headerRight: () => <HeaderRight navigation={navigation} />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={CitizenDashboard}
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Create Report"
        component={CreateReportScreen}
        options={{
          tabBarLabel: "Report",
          title: "Create Report",
        }}
      />
      <Tab.Screen
        name="My Reports"
        component={MyReportsScreen}
        options={{
          tabBarLabel: "My Reports",
          title: "My Reports",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          title: "Profile",
        }}
      />
      <Tab.Screen
        name="Help"
        component={HelpSupportScreen}
        options={{
          tabBarLabel: "Help",
          title: "Help & Support",
        }}
      />
    </Tab.Navigator>
  );
};

// Staff Tabs
const StaffTabs = () => {
  const { getAssignedReports, getUnreadNotifications } = useApp();
  const assignedReports = getAssignedReports();
  const pendingAssignments = assignedReports.filter(
    (r) => r.status === "Pending"
  ).length;
  const unreadNotifications = getUnreadNotifications().length;

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let badgeCount = 0;

          switch (route.name) {
            case "Home":
              iconName = "dashboard";
              break;
            case "Assigned Reports":
              iconName = "assignment";
              badgeCount = pendingAssignments;
              break;
            case "Profile":
              iconName = "person";
              badgeCount = unreadNotifications;
              break;
          }

          return (
            <TabBarIcon
              name={iconName}
              focused={focused}
              color={color}
              size={size}
              badgeCount={badgeCount}
            />
          );
        },
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
        headerRight: () => <HeaderRight navigation={navigation} />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={StaffDashboard}
        options={{
          title: "Staff Dashboard",
          tabBarLabel: "Dashboard",
        }}
      />
      <Tab.Screen
        name="Assigned Reports"
        component={AssignedReportsScreen}
        options={{
          tabBarLabel: "Reports",
          title: "Assigned Reports",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

// Super Admin Tabs
const SuperAdminTabs = () => {
  const { getUnassignedReports, getUnreadNotifications, stats } = useApp();
  const unassignedReports = getUnassignedReports().length;
  const unreadNotifications = getUnreadNotifications().length;

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let badgeCount = 0;

          switch (route.name) {
            case "Dashboard":
              iconName = "dashboard";
              break;
            case "Reports":
              iconName = "list-alt";
              badgeCount = stats.pendingReports;
              break;
            case "Users":
              iconName = "people";
              break;
            case "Departments":
              iconName = "business";
              break;
            case "Staff":
              iconName = "supervisor-account";
              break;
            case "Assign":
              iconName = "assignment-ind";
              badgeCount = unassignedReports;
              break;
          }

          return (
            <TabBarIcon
              name={iconName}
              focused={focused}
              color={color}
              size={size - 2}
              badgeCount={badgeCount}
            />
          );
        },
        tabBarActiveTintColor: "#3F51B5",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          height: 75,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 8,
          shadowOpacity: 0.1,
        },
        tabBarLabelStyle: {
          fontSize: 9,
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
        headerRight: () => <HeaderRight navigation={navigation} />,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={SuperAdminDashboard}
        options={{
          title: "Admin Dashboard",
        }}
      />
      <Tab.Screen
        name="Reports"
        component={AllReportsScreen}
        options={{
          title: "All Reports",
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          title: "User Management",
        }}
      />
      <Tab.Screen
        name="Departments"
        component={DepartmentsScreen}
        options={{
          title: "Departments",
        }}
      />
      <Tab.Screen
        name="Staff"
        component={StaffManagementScreen}
        options={{
          title: "Staff Management",
        }}
      />
      <Tab.Screen
        name="Assign"
        component={AssignReportsScreen}
        options={{
          title: "Assign Reports",
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigators
const CitizenStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CitizenTabs"
      component={CitizenTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ReportDetails"
      component={ReportDetailsScreen}
      options={{ title: "Report Details" }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "Settings" }}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ title: "Notifications" }}
    />
  </Stack.Navigator>
);

const StaffStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="StaffTabs"
      component={StaffTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ReportDetails"
      component={ReportDetailsScreen}
      options={{ title: "Report Details" }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "Settings" }}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ title: "Notifications" }}
    />
  </Stack.Navigator>
);

const SuperAdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SuperAdminTabs"
      component={SuperAdminTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ReportDetails"
      component={ReportDetailsScreen}
      options={{ title: "Report Details" }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "Settings" }}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ title: "Notifications" }}
    />
  </Stack.Navigator>
);

// Main Navigation Component
const AppNavigation = () => {
  const { user, isAuthenticated, loading } = useApp();

  if (loading) {
    return null; // You can add a loading screen here
  }

  const renderNavigationBasedOnRole = () => {
    if (!isAuthenticated || !user) {
      return <AuthStack />;
    }

    switch (user.role) {
      case "USER":
        return <CitizenStack />;
      case "STAFF":
        return <StaffStack />;
      case "SUPER_ADMIN":
        return <SuperAdminStack />;
      default:
        return <AuthStack />;
    }
  };

  return (
    <NavigationContainer>{renderNavigationBasedOnRole()}</NavigationContainer>
  );
};

export default AppNavigation;
