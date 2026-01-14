import { useColorScheme } from "react-native";

export function useThemeColors() {
  const scheme = useColorScheme(); // "dark" | "light" | null
  const isDark = scheme === "dark";

  return {
    isDark,
    bg: isDark ? "#000000" : "#ffffff",
    card: isDark ? "#121212" : "#f5f5f5",
    text: isDark ? "#ffffff" : "#000000",
    border: isDark ? "#2a2a2a" : "#d0d0d0",
    muted: isDark ? "#b0b0b0" : "#555555",
  };
}