import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text } from "react-native";
import { useThemeColors } from "../../theme";

export type InstantCue = {
  message: string;
  detail?: string;
  intensity: "low" | "high";
};

type Props = {
  cue: InstantCue | null;
  onClear: () => void;
  randomHoldMs: (isHighlight: boolean) => number; // allows you to reuse your existing random durations
};

export function InstantCueToast(props: Props) {
  const c = useThemeColors();

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-18)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!props.cue) return;

    // reset any pending timer
    if (timerRef.current) clearTimeout(timerRef.current);

    toastOpacity.setValue(0);
    toastTranslateY.setValue(-18);

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const isHighlight = props.cue.intensity !== "low";
    const holdMs = props.randomHoldMs(isHighlight);

    timerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: -10,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) props.onClear();
      });

      timerRef.current = null;
    }, holdMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [props.cue, props, toastOpacity, toastTranslateY]);

  if (!props.cue) return null;

  const toastFontSize = props.cue.intensity === "low" ? 16 : 28;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        right: 12,
        zIndex: 1000,
        borderWidth: 1,
        borderColor: c.border,
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: c.card,
        opacity: toastOpacity,
        transform: [{ translateY: toastTranslateY }],
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      }}
    >
      <Text style={{ color: c.muted, marginBottom: 4, fontSize: 12 }}>Cue</Text>
      <Text
        style={{
          color: c.text,
          fontSize: toastFontSize,
          fontWeight: props.cue.intensity === "high" ? "800" : "700",
        }}
      >
        {props.cue.message}
      </Text>
      {!!props.cue.detail && <Text style={{ color: c.muted, marginTop: 6, fontSize: 13 }}>{props.cue.detail}</Text>}
    </Animated.View>
  );
}
