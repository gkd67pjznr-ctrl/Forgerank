import { View, Text, Switch, Pressable } from "react-native";
import { useThemeColors } from "../src/ui/theme";
import { useSettings, setSettings, resetSettings } from "../src/lib/settings";

export default function SettingsScreen() {
  const c = useThemeColors();
  const s = useSettings();

  const Row = (props: {
    title: string;
    subtitle?: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: c.border,
        borderRadius: 12,
        padding: 12,
        backgroundColor: c.card,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.text, fontSize: 16, fontWeight: "800" }}>{props.title}</Text>
        {!!props.subtitle && (
          <Text style={{ color: c.muted, marginTop: 4, lineHeight: 18 }}>{props.subtitle}</Text>
        )}
      </View>
      <Switch value={props.value} onValueChange={props.onChange} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, padding: 16, gap: 12 }}>
      <Text style={{ color: c.text, fontSize: 22, fontWeight: "900" }}>Settings</Text>

      <Row
        title="Haptics"
        subtitle="Light feedback for fallback cues, stronger feedback for PR cues."
        value={s.hapticsEnabled}
        onChange={(v) => setSettings({ hapticsEnabled: v })}
      />

      <Row
        title="Sounds"
        subtitle="Short audio cues (we’ll wire actual sound files next)."
        value={s.soundsEnabled}
        onChange={(v) => setSettings({ soundsEnabled: v })}
      />

      <Pressable
        onPress={resetSettings}
        style={{
          marginTop: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: c.border,
          backgroundColor: c.card,
          alignItems: "center",
        }}
      >
        <Text style={{ color: c.text, fontWeight: "800" }}>Reset to defaults</Text>
      </Pressable>
    </View>
  );
}
