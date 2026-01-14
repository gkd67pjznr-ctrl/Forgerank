import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { useThemeColors } from "../theme";

export function RestTimerOverlay(props: {
  visible: boolean;
  initialSeconds?: number; // default 90
  onClose: () => void;
}) {
  const c = useThemeColors();
  const initial = props.initialSeconds ?? 90;

  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(true);

  const opacity = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (!props.visible) return;

    // reset each time it opens
    setSeconds(initial);
    setRunning(true);

    opacity.setValue(0);
    y.setValue(10);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 160, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(y, { toValue: 0, duration: 160, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [props.visible, initial, opacity, y]);

  useEffect(() => {
    if (!props.visible) return;
    if (!running) return;

    const t = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [props.visible, running]);

  const mmss = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [seconds]);

  if (!props.visible) return null;

  const Btn = (p: { label: string; onPress: () => void }) => (
    <Pressable
      onPress={p.onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.card,
        alignItems: "center",
      }}
    >
      <Text style={{ color: c.text, fontWeight: "800" }}>{p.label}</Text>
    </Pressable>
  );

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 2000,
        opacity,
        transform: [{ translateY: y }],
      }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: 16,
          backgroundColor: c.card,
          padding: 12,
          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }}
      >
        <Text style={{ color: c.muted, fontSize: 12 }}>Rest Timer</Text>

        <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: 6 }}>
          <Text style={{ color: c.text, fontSize: 28, fontWeight: "900" }}>{mmss}</Text>
          <Pressable onPress={props.onClose}>
            <Text style={{ color: c.muted, fontWeight: "800" }}>Close</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <Btn label="-15s" onPress={() => setSeconds((s) => Math.max(0, s - 15))} />
          <Btn label="+15s" onPress={() => setSeconds((s) => s + 15)} />
          <Btn label={running ? "Stop" : "Start"} onPress={() => setRunning((r) => !r)} />
          <Btn label="Reset" onPress={() => setSeconds(initial)} />
        </View>
      </View>
    </Animated.View>
  );
}
