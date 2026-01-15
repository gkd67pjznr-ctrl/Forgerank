// app/(tabs)/profile.tsx
import { Pressable, ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { useThemeColors } from "../../src/ui/theme";

export default function ProfileTab() {
  const c = useThemeColors();

  const CardLink = (props: { href: string; title: string; subtitle: string }) => (
    <Link href={props.href as any} asChild>
      <Pressable
        style={{
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: 14,
          padding: 14,
          backgroundColor: c.card,
          gap: 6,
        }}
      >
        <Text style={{ color: c.text, fontSize: 18, fontWeight: "900" }}>{props.title}</Text>
        <Text style={{ color: c.muted, lineHeight: 18 }}>{props.subtitle}</Text>
      </Pressable>
    </Link>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.bg }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      <Text style={{ color: c.text, fontSize: 26, fontWeight: "900" }}>Profile</Text>

      <Text style={{ color: c.muted, lineHeight: 18 }}>
        Your training history, calendar, stats, and progress over time.
      </Text>

      {/* Calendar: real data lives in /calendar */}
      <CardLink
        href="/calendar"
        title="Workout Calendar"
        subtitle="Shows a month grid with highlighted workout days (real data)."
      />

      {/* History: real data lives in /history */}
      <CardLink
        href="/history"
        title="History"
        subtitle="Browse your saved workout sessions by day/time/duration (real data)."
      />

      <View style={{ height: 6 }} />

      <Text style={{ color: c.text, fontWeight: "900", fontSize: 16 }}>Coming next</Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: 14,
          padding: 14,
          backgroundColor: c.card,
          gap: 8,
        }}
      >
        <Text style={{ color: c.text, fontWeight: "900", fontSize: 16 }}>Day Details</Text>
        <Text style={{ color: c.muted, lineHeight: 18 }}>
          Each calendar day will eventually show a workout title and/or tiny muscle indicators.
        </Text>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: 14,
          padding: 14,
          backgroundColor: c.card,
          gap: 8,
        }}
      >
        <Text style={{ color: c.text, fontWeight: "900", fontSize: 16 }}>Stats & Ranks</Text>
        <Text style={{ color: c.muted, lineHeight: 18 }}>
          Lifetime PRs, streaks, volume charts, and exercise ranks will live here.
        </Text>
      </View>
    </ScrollView>
  );
}
