// app/(tabs)/feed.tsx
import { ScrollView, Text, View } from "react-native";
import { useThemeColors } from "../../src/ui/theme";

export default function FeedTab() {
  const c = useThemeColors();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.bg }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      <Text style={{ color: c.text, fontSize: 26, fontWeight: "900" }}>
        Friends
      </Text>

      <Text style={{ color: c.muted, lineHeight: 18 }}>
        See workouts, PRs, and milestones from people you follow.
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
        <Text style={{ color: c.text, fontWeight: "800", fontSize: 16 }}>
          Social feed coming soon
        </Text>
        <Text style={{ color: c.muted }}>
          This is where friend activity, comments, and shared workouts will live.
        </Text>
      </View>
    </ScrollView>
  );
}
