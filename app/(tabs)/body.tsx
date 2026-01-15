// app/(tabs)/body.tsx
import { ScrollView, Text, View } from "react-native";
import { useThemeColors } from "../../src/ui/theme";

export default function BodyTab() {
  const c = useThemeColors();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.bg }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      <Text style={{ color: c.text, fontSize: 26, fontWeight: "900" }}>Body</Text>

      <Text style={{ color: c.muted, lineHeight: 18 }}>
        Muscle heatmap + recovery shading based on your workout history.
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: 14,
          padding: 16,
          backgroundColor: c.card,
          gap: 8,
        }}
      >
        <Text style={{ color: c.text, fontWeight: "900", fontSize: 16 }}>
          Heatmap coming soon
        </Text>
        <Text style={{ color: c.muted, lineHeight: 18 }}>
          This page will show a body diagram with muscle groups that shade darker or lighter depending
          on how recently they were trained.
        </Text>
        <Text style={{ color: c.muted, lineHeight: 18 }}>
          It will pull from workout history + exercise metadata (primary / secondary muscles).
        </Text>
      </View>
    </ScrollView>
  );
}
