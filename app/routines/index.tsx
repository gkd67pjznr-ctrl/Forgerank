import { View, Text } from "react-native";
import { useThemeColors } from "../../src/ui/theme";

export default function RoutinesHome() {
  const c = useThemeColors();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, padding: 16, gap: 12 }}>
      <Text style={{ color: c.text, fontSize: 22, fontWeight: "900" }}>Routines</Text>
      <Text style={{ color: c.muted }}>
        Scaffold screen. Next: routine list, create/edit, add exercises, set schemes.
      </Text>
    </View>
  );
}
