import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { useThemeColors } from "../src/ui/theme";

export default function Index() {
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
    <View style={{ flex: 1, backgroundColor: c.bg, padding: 16, gap: 12 }}>
      <Text style={{ color: c.text, fontSize: 28, fontWeight: "900" }}>Forgerank</Text>
      <Text style={{ color: c.muted, lineHeight: 19 }}>
        Verified ranks. Real feedback. No fake leaderboards.
      </Text>

      <CardLink href="/live-workout" title="Live Workout" subtitle="Log sets, cues, PRs, rest timer." />
      <CardLink href="/calendar" title="Calendar" subtitle="Highlighted workout days + timeline." />
      <CardLink href="/history" title="History" subtitle="Workout sessions by day, duration, sets." />
      <CardLink href="/profile" title="Profile" subtitle="Stats, lifetime PRs, ranks summary." />

      <CardLink href="/routines" title="Routines" subtitle="Routine builder (scaffold)." />
      <CardLink href="/exercises" title="Exercise DB" subtitle="Browse exercises (scaffold)." />

      <CardLink href="/debug/ranks" title="Debug: Ranks" subtitle="Verify 20-rank curve + thresholds." />
      <CardLink href="/settings" title="Settings" subtitle="Toggle haptics & sounds (wired)." />
    </View>
  );
}
