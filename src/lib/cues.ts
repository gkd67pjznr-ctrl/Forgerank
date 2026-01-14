import type { UnitSystem } from "./buckets";
import { bucketValueInUserUnit } from "./buckets";

export type CueEvent = {
  message: string;
  intensity: "low" | "med" | "high";
};

export function cardioCue(reps: number): CueEvent | null {
  if (reps >= 16) {
    return { message: "Did you just do cardio?", intensity: "med" };
  }
  return null;
}

export function repAtWeightCue(args: {
  weightKg: number;
  reps: number;
  unit: UnitSystem;
}): CueEvent {
  const w = bucketValueInUserUnit(args.weightKg, args.unit);
  const label = args.unit === "lb" ? `${w.toFixed(1)} lb` : `${Math.round(w)} kg`;
  return { message: `Rep PR at ${label}!`, intensity: "high" };
}
