import { useEffect, useState } from "react";
import type { WorkoutPlan } from "./workoutPlanModel";

let currentPlan: WorkoutPlan | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) fn();
}

export function setCurrentPlan(plan: WorkoutPlan | null) {
  currentPlan = plan;
  notify();
}

export function getCurrentPlan(): WorkoutPlan | null {
  return currentPlan;
}

export function updateCurrentPlan(updater: (prev: WorkoutPlan) => WorkoutPlan) {
  if (!currentPlan) return;
  currentPlan = updater(currentPlan);
  notify();
}

export function subscribeCurrentPlan(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCurrentPlan(): WorkoutPlan | null {
  const [p, setP] = useState(getCurrentPlan());
  useEffect(() => subscribeCurrentPlan(() => setP(getCurrentPlan())), []);
  return p;
}
