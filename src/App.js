"use client";
import { Provider as PaperProvider } from "react-native-paper";
import { AppProvider } from "./context/AppContext";
import AppNavigation from "./navigation/AppNavigation";

const theme = {
  colors: {
    primary: "#3F51B5",
    accent: "#FFC107",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    text: "#000000",
    onSurface: "#000000",
    disabled: "#9E9E9E",
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppProvider>
        <AppNavigation />
      </AppProvider>
    </PaperProvider>
  );
}
