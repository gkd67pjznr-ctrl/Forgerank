// app/(tabs)/profile.tsx
import { Pressable, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { useThemeColors } from "../../src/ui/theme";

<Link href="/dev/plan-creator" asChild>
  <Pressable style={{ padding: 12, backgroundColor: '#FF6B6B' }}>
    <Text style={{ color: '#fff' }}>🔧 Plan Creator (Dev)</Text>
  </Pressable>
</Link>

export default function ProfileTab() {
  const c = useThemeColors();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate brief initialization
    // In the future, this will load user stats, settings, etc.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner briefly
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: c.bg, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <ActivityIndicator size="large" color={c.text} />
        <Text style={{ color: c.muted, marginTop: 12, fontSize: 14 }}>
          Loading profile...
        </Text>
      </View>
    );
  }

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
