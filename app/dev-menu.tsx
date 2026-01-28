import { Link, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useThemeColors } from "../src/ui/theme";

/**
 * Developer menu - Quick access to all screens for testing
 * Access from Settings > Dev Menu
 */
export default function DevMenu() {
  const c = useThemeColors();

  const CardLink = (props: { href: string; title: string; subtitle: string }) => (
    <Link href={props.href as Href} asChild>
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
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: c.text, fontSize: 28, fontWeight: "900" }}>Dev Menu</Text>
        <Text style={{ color: c.muted, lineHeight: 19 }}>
          Quick access to all screens for testing.
        </Text>

        <CardLink href="/workout/start" title="Start Workout" subtitle="Pick a routine or go free." />
        <CardLink href="/live-workout" title="Live Workout" subtitle="Log sets, cues, PRs, rest timer." />

        <CardLink href="/calendar" title="Calendar" subtitle="Month grid + highlighted workout days." />
        <CardLink href="/history" title="History" subtitle="Workout sessions by day, time, duration." />
        <CardLink href="/profile" title="Profile" subtitle="Stats, lifetime PRs, ranks summary." />

        <CardLink href="/routines" title="Routines" subtitle="Build routines and targets." />
        <CardLink href="/exercises" title="Exercise DB" subtitle="Browse exercises scaffold." />

        <CardLink href="/auth/login" title="Login" subtitle="Test login screen." />
        <CardLink href="/auth/signup" title="Signup" subtitle="Test signup screen." />

        <CardLink href="/debug/ranks" title="Debug: Ranks" subtitle="Verify 20-rank curve + thresholds." />
        <CardLink href="/settings" title="Settings" subtitle="Toggle haptics & sounds." />
      </ScrollView>
    </View>
  );
}
