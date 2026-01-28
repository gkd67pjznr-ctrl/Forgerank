import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useIsAuthenticated, useAuthLoading } from "../src/lib/stores";
import { useThemeColors } from "../src/ui/theme";

/**
 * Root index - Smart redirect based on auth state
 * Redirects to /auth/login if not authenticated, or /(tabs) if authenticated
 */
export default function RootIndex() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const loading = useAuthLoading();
  const c = useThemeColors();

  useEffect(() => {
    // Wait for auth state to be determined
    if (loading) return;

    if (isAuthenticated) {
      router.replace("/(tabs)");
    } else {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while determining auth state
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={c.text} />
    </View>
  );
}
