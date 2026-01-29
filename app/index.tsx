import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useIsAuthenticated, useAuthLoading } from "../src/lib/stores";
import { useThemeColors } from "../src/ui/theme";

/**
 * Root index - Smart redirect based on auth state
 * Uses Redirect component to avoid navigation timing issues
 */
export default function RootIndex() {
  const isAuthenticated = useIsAuthenticated();
  const loading = useAuthLoading();
  const c = useThemeColors();

  // Show loading while determining auth state
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={c.text} />
      </View>
    );
  }

  // Use Redirect component instead of router.replace() to avoid timing issues
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth/login" />;
}
