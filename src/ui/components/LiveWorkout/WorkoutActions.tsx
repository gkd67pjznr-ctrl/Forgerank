/**
 * WorkoutActions Component
 *
 * Displays the bottom action buttons for the live workout screen.
 * - Finish Workout (primary action, accent color)
 * - Save Routine (disabled if no sets)
 * - Reset
 *
 * Extracted from live-workout.tsx to reduce component complexity.
 */

import { Pressable, Text, View } from "react-native";
import { FR } from "@/src/ui/forgerankStyle";
import { useThemeColors } from "@/src/ui/theme";
import { makeDesignSystem } from "@/src/ui/designSystem";

export interface WorkoutActionsProps {
  setsCount: number;
  onFinishWorkout: () => void;
  onSaveRoutine: () => void;
  onReset: () => void;
}

export function WorkoutActions({
  setsCount,
  onFinishWorkout,
  onSaveRoutine,
  onReset,
}: WorkoutActionsProps) {
  const c = useThemeColors();
  const ds = makeDesignSystem("dark", "toxic");
  const PILL_R = FR.radius.pill;

  const primaryButtonStyle = (pressed: boolean) => ({
    flex: 1,
    paddingVertical: FR.space.x3,
    paddingHorizontal: FR.space.x4,
    borderRadius: PILL_R,
    borderWidth: 1,
    borderColor: ds.tone.accent,
    backgroundColor: ds.tone.accent,
    alignItems: "center",
    justifyContent: "center",
    opacity: pressed ? ds.rules.tapOpacity : 1,
  });

  const secondaryButtonStyle = (pressed: boolean, disabled = false) => ({
    flex: 1,
    paddingVertical: FR.space.x3,
    paddingHorizontal: FR.space.x4,
    borderRadius: PILL_R,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.card,
    alignItems: "center",
    justifyContent: "center",
    opacity: disabled ? 0.5 : pressed ? ds.rules.tapOpacity : 1,
  });

  const iconButtonStyle = (pressed: boolean) => ({
    paddingVertical: FR.space.x3,
    paddingHorizontal: FR.space.x4,
    borderRadius: PILL_R,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.card,
    alignItems: "center",
    justifyContent: "center",
    opacity: pressed ? ds.rules.tapOpacity : 1,
  });

  return (
    <View style={{ flexDirection: "row", gap: FR.space.x2 }}>
      {/* Finish Workout - primary action */}
      <Pressable
        onPress={onFinishWorkout}
        style={({ pressed }) => primaryButtonStyle(pressed)}
      >
        <Text style={{ color: c.bg, ...FR.type.h3 }}>Finish Workout</Text>
      </Pressable>

      {/* Save Routine - disabled if no sets */}
      <Pressable
        onPress={onSaveRoutine}
        disabled={setsCount === 0}
        style={({ pressed }) => secondaryButtonStyle(pressed, setsCount === 0)}
      >
        <Text style={{ color: c.text, ...FR.type.h3 }}>Save Routine</Text>
      </Pressable>

      {/* Reset */}
      <Pressable
        onPress={onReset}
        style={({ pressed }) => iconButtonStyle(pressed)}
      >
        <Text style={{ color: c.text, ...FR.type.h3 }}>Reset</Text>
      </Pressable>
    </View>
  );
}
