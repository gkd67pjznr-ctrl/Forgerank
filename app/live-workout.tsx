// app/live-workout.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { makeDesignSystem } from "../src/ui/designSystem";
import { FR } from "../src/ui/forgerankStyle";
import { useThemeColors } from "../src/ui/theme";

import { EXERCISES_V1 } from "../src/data/exercises";
import type { UnitSystem } from "../src/lib/buckets";
import type { LoggedSet } from "../src/lib/loggerTypes";
import { generateCuesForExerciseSession, groupSetsByExercise } from "../src/lib/simpleSession";
import { lbToKg } from "../src/lib/units";

import {
  detectCueForWorkingSet,
  makeEmptyExerciseState,
  pickPunchyVariant,
  randomFallbackCue,
  randomFallbackEveryN,
  randomHighlightDurationMs,
  type Cue,
  type ExerciseSessionState,
} from "../src/lib/perSetCue";

import { uid as routineUid, type Routine, type RoutineExercise } from "../src/lib/routinesModel";
import { upsertRoutine } from "../src/lib/routinesStore";
import { getSettings } from "../src/lib/settings";
import { formatDuration, uid as uid2, type WorkoutSession, type WorkoutSet } from "../src/lib/workoutModel";
import { setCurrentPlan, useCurrentPlan } from "../src/lib/workoutPlanStore";
import { addWorkoutSession } from "../src/lib/workoutStore";

import { ExerciseBlocksCard } from "../src/ui/components/LiveWorkout/ExerciseBlocksCard";
import { ExercisePicker } from "../src/ui/components/LiveWorkout/ExercisePicker";
import { InstantCueToast, type InstantCue } from "../src/ui/components/LiveWorkout/InstantCueToast";
import { QuickAddSetCard } from "../src/ui/components/LiveWorkout/QuickAddSetCard";
import { RestTimerOverlay } from "../src/ui/components/RestTimerOverlay";

import {
  clearCurrentSession,
  ensureCurrentSession,
  updateCurrentSession,
  useCurrentSession,
} from "../src/lib/currentSessionStore";
import { useLiveWorkoutSession } from "../src/lib/hooks/useLiveWorkoutSession";

function exerciseName(exerciseId: string) {
  return EXERCISES_V1.find((e) => e.id === exerciseId)?.name ?? exerciseId;
}

// Optional runtime requires (no-op if not installed)
let Haptics: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Haptics = require("expo-haptics");
} catch {
  Haptics = null;
}

let Speech: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Speech = require("expo-speech");
} catch {
  Speech = null;
}

function onRestTimerDoneFeedback() {
  const s = getSettings();

  if (s.hapticsEnabled && Haptics) {
    Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Success).catch?.(() => {});
  }

  if (s.soundsEnabled && Speech) {
    Speech.stop?.();
    Speech.speak?.("Rest over.", { rate: 1.05, pitch: 1.1 });
  }
}

function hapticLight() {
  const s = getSettings();
  if (!s.hapticsEnabled || !Haptics) return;
  Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light).catch?.(() => {});
}

function hapticPR() {
  const s = getSettings();
  if (!s.hapticsEnabled || !Haptics) return;
  Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Success).catch?.(() => {});
}

function soundLight() {
  const s = getSettings();
  if (!s.soundsEnabled) return;
}
function soundPR() {
  const s = getSettings();
  if (!s.soundsEnabled) return;
}

export default function LiveWorkout() {
  const c = useThemeColors();
  const ds = makeDesignSystem("dark", "toxic");

  // Unified spacing/radii via FR (ds still used for accent + tap opacity)
  const PAD = FR.space.x4;
  const GAP = FR.space.x3;
  const CARD_R = FR.radius.card;
  const PILL_R = FR.radius.pill;

  const unit: UnitSystem = "lb";

  const plan = useCurrentPlan();
  const planMode = !!plan && plan.exercises.length > 0;

  const plannedExerciseIds = plan?.exercises.map((x) => x.exerciseId) ?? [];
  const currentPlannedExerciseId = planMode ? plan!.exercises[plan!.currentExerciseIndex]?.exerciseId : null;

  const persisted = useCurrentSession();
  const initializedRef = useRef(false);

  const [pickerMode, setPickerMode] = useState<null | "changeSelected" | "addBlock">(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(currentPlannedExerciseId ?? EXERCISES_V1[0].id);
  const [exerciseBlocks, setExerciseBlocks] = useState<string[]>(() => (planMode ? plannedExerciseIds.slice() : []));
  const [focusMode, setFocusMode] = useState(false);

  const [restVisible, setRestVisible] = useState(false);

  const [instantCue, setInstantCue] = useState<InstantCue | null>(null);
  const randomHoldMs = randomHighlightDurationMs;

  const [recapCues, setRecapCues] = useState<Cue[]>([]);

  const [sessionStateByExercise, setSessionStateByExercise] = useState<Record<string, ExerciseSessionState>>({});
  const [fallbackCountdownByExercise, setFallbackCountdownByExercise] = useState<Record<string, number>>({});

  const selectedExerciseName = useMemo(() => exerciseName(selectedExerciseId), [selectedExerciseId]);

  useEffect(() => {
    if (initializedRef.current) return;
    if (persisted) {
      initializedRef.current = true;
      setSelectedExerciseId((persisted as any).selectedExerciseId ?? selectedExerciseId);
      setExerciseBlocks((persisted as any).exerciseBlocks?.length ? (persisted as any).exerciseBlocks : exerciseBlocks);
      return;
    }

    const first = currentPlannedExerciseId ?? EXERCISES_V1[0]?.id ?? "unknown";
    ensureCurrentSession({
      selectedExerciseId: first,
      exerciseBlocks: planMode ? plannedExerciseIds.slice() : first ? [first] : [],
    } as any);
    initializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persisted, planMode, currentPlannedExerciseId]);

  useEffect(() => {
    if (planMode && currentPlannedExerciseId) {
      setSelectedExerciseId(currentPlannedExerciseId);
      updateCurrentSession((s: any) => ({ ...s, selectedExerciseId: currentPlannedExerciseId }));
    }
  }, [planMode, currentPlannedExerciseId]);

  useEffect(() => {
    if (!planMode) return;
    setExerciseBlocks((prev) => (prev.length ? prev : plannedExerciseIds.slice()));
  }, [planMode, plannedExerciseIds]);

  useEffect(() => {
    updateCurrentSession((s: any) => ({ ...s, selectedExerciseId, exerciseBlocks }));
  }, [selectedExerciseId, exerciseBlocks]);

  const session = useLiveWorkoutSession({ selectedExerciseId } as any);

  function ensureExerciseState(exerciseId: string): ExerciseSessionState {
    const existing = sessionStateByExercise[exerciseId];
    if (existing) return existing;
    const next = makeEmptyExerciseState();
    setSessionStateByExercise((prev) => ({ ...prev, [exerciseId]: next }));
    return next;
  }

  function ensureCountdown(exerciseId: string): number {
    const v = fallbackCountdownByExercise[exerciseId];
    if (typeof v === "number") return v;
    const next = randomFallbackEveryN();
    setFallbackCountdownByExercise((prev) => ({ ...prev, [exerciseId]: next }));
    return next;
  }

  function callAddSet(exerciseId: string): LoggedSet | null {
    const anySession = session as any;
    const fn =
      anySession.addSet ??
      anySession.onAddSet ??
      anySession.commitSet ??
      anySession.logSet ??
      anySession.addWorkingSet ??
      null;

    if (typeof fn !== "function") return null;

    const out = fn(exerciseId);
    return (out as LoggedSet) ?? null;
  }

  function addSetInternal(exerciseId: string, source: "quick" | "block") {
    const set = callAddSet(exerciseId);
    if (!set) return;

    const anySet = set as any;
    const weightLb = typeof anySet.weightLb === "number" ? anySet.weightLb : 0;
    const reps = typeof anySet.reps === "number" ? anySet.reps : 0;

    const wKg = lbToKg(weightLb);
    const prev = ensureExerciseState(exerciseId);

    const res = detectCueForWorkingSet({
      weightKg: wKg,
      reps,
      unit,
      exerciseName: exerciseName(exerciseId),
      prev,
    } as any);

    const cue: Cue | null = (res as any)?.cue ?? null;
    const nextState: ExerciseSessionState = (res as any)?.next ?? prev;
    const meta = (res as any)?.meta;

    if (cue) {
      setSessionStateByExercise((p) => ({ ...p, [exerciseId]: nextState }));

      const t: "weight" | "rep" | "e1rm" =
        meta?.type === "rep" ? "rep" : meta?.type === "e1rm" ? "e1rm" : "weight";

      const title = pickPunchyVariant(t);
      const detail =
        typeof meta?.weightLabel === "string"
          ? meta.weightLabel
          : typeof (cue as any)?.detail === "string"
            ? (cue as any).detail
            : undefined;

      setInstantCue({ message: title, detail, intensity: "high" });
      hapticPR();
      soundPR();
    } else {
      const current = ensureCountdown(exerciseId);
      if (current <= 1) {
        setInstantCue(randomFallbackCue() as any);
        hapticLight();
        soundLight();
        setFallbackCountdownByExercise((p) => ({ ...p, [exerciseId]: randomFallbackEveryN() }));
      } else {
        setFallbackCountdownByExercise((p) => ({ ...p, [exerciseId]: current - 1 }));
      }
    }

    if (source === "quick") setSelectedExerciseId(exerciseId);
  }

  const addSet = () => addSetInternal(selectedExerciseId, "quick");
  const addSetForExercise = (exerciseId: string) => addSetInternal(exerciseId, "block");

  function makeRoutineNameNow(): string {
    const d = new Date();
    const date = d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
    const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    return `Workout • ${date} ${time}`;
  }

  function saveAsRoutine() {
    const now = Date.now();
    const sets: LoggedSet[] = (session as any).sets ?? [];

    if (!sets.length) {
      setInstantCue({ message: "No sets yet.", detail: "Log at least one set first.", intensity: "low" });
      hapticLight();
      soundLight();
      return;
    }

    const orderedExerciseIds =
      exerciseBlocks.length > 0
        ? exerciseBlocks.slice()
        : (() => {
            const seen = new Set<string>();
            const ordered: string[] = [];
            for (const s of sets as any[]) {
              if (!seen.has(s.exerciseId)) {
                seen.add(s.exerciseId);
                ordered.push(s.exerciseId);
              }
            }
            return ordered;
          })();

    const exercises = orderedExerciseIds.map((exerciseId): RoutineExercise => {
      return {
        id: routineUid(),
        exerciseId,
        targetSets: 3,
        targetRepsMin: 6,
        targetRepsMax: 12,
      };
    });

    const routine: Routine = {
      id: routineUid(),
      name: plan?.routineName ? `${plan.routineName} (Saved Copy)` : makeRoutineNameNow(),
      createdAtMs: now,
      updatedAtMs: now,
      exercises,
    };

    upsertRoutine(routine);

    setInstantCue({ message: "Routine saved.", detail: `${routine.exercises.length} exercises`, intensity: "low" });
    hapticLight();
    soundLight();
  }

  const finishWorkout = () => {
    const now = Date.now();
    const start = (persisted as any)?.startedAtMs ?? now;

    const sets: LoggedSet[] = (session as any).sets ?? [];

    const sessionObj: WorkoutSession = {
      id: uid2(),
      startedAtMs: start,
      endedAtMs: now,
      sets: sets.map(
        (s: any): WorkoutSet => ({
          id: s.id ?? uid2(),
          exerciseId: s.exerciseId,
          weightKg: typeof s.weightKg === "number" ? s.weightKg : lbToKg(typeof s.weightLb === "number" ? s.weightLb : 0),
          reps: typeof s.reps === "number" ? s.reps : 0,
          // WorkoutSet requires timestampMs
          timestampMs:
            typeof s.timestampMs === "number"
              ? s.timestampMs
              : typeof s.createdAtMs === "number"
                ? s.createdAtMs
                : now,
        })
      ),
      routineId: plan?.routineId,
      routineName: plan?.routineName,
      planId: plan?.id,
      plannedExercises: plan?.exercises?.map((e) => ({
        exerciseId: e.exerciseId,
        targetSets: e.targetSets,
        targetRepsMin: e.targetRepsMin,
        targetRepsMax: e.targetRepsMax,
      })),
      completionPct: undefined,
    };

    addWorkoutSession(sessionObj);

    const grouped = groupSetsByExercise(sets as any);
    const all: Cue[] = [];
    for (const [exerciseId, exerciseSets] of Object.entries(grouped)) {
      const cueEvents = generateCuesForExerciseSession({
        exerciseId,
        sets: exerciseSets as any,
        unit,
        previous: { bestE1RMKg: 0, bestRepsAtWeight: {} },
      });
      const name = exerciseName(exerciseId);
      all.push({ message: `— ${name} —`, intensity: "low" });
      all.push(...cueEvents);
    }
    if (all.length === 0) all.push({ message: "No working sets logged yet.", intensity: "low" });
    setRecapCues(all);

    setInstantCue({ message: "Workout saved.", detail: `Duration: ${formatDuration(now - start)}`, intensity: "low" });
    hapticLight();
    soundLight();

    clearCurrentSession();
    setCurrentPlan(null);
  };

  const reset = () => {
    clearCurrentSession();
    initializedRef.current = false;

    const first = currentPlannedExerciseId ?? EXERCISES_V1[0]?.id ?? "unknown";
    ensureCurrentSession({ selectedExerciseId: first, exerciseBlocks: first ? [first] : [] } as any);

    setRecapCues([]);
    setInstantCue(null);
    setSessionStateByExercise({});
    setFallbackCountdownByExercise({});
    setRestVisible(false);
    setFocusMode(false);
  };

  const allowedExerciseIds = planMode ? plannedExerciseIds : undefined;

  if (pickerMode) {
    return (
      <ExercisePicker
        visible
        allowedExerciseIds={allowedExerciseIds}
        selectedExerciseId={selectedExerciseId}
        onSelect={(id) => {
          if (pickerMode === "changeSelected") setSelectedExerciseId(id);
          else {
            setExerciseBlocks((prev) => (prev.includes(id) ? prev : [...prev, id]));
            setSelectedExerciseId(id);
          }
          setPickerMode(null);
        }}
        onBack={() => setPickerMode(null)}
      />
    );
  }

  const sets: LoggedSet[] = (session as any).sets ?? [];

  const isDoneFn = useMemo(() => {
    const anySession = session as any;
    if (typeof anySession.isDone === "function") return anySession.isDone as (setId: string) => boolean;
    if (anySession.isDone && typeof anySession.isDone === "object") {
      const map = anySession.isDone as Record<string, boolean>;
      return (setId: string) => !!map[setId];
    }
    if (typeof anySession.isDone === "boolean") {
      const all = anySession.isDone as boolean;
      return (_setId: string) => all;
    }
    return (_setId: string) => false;
  }, [session]);

  const toggleDone: any = (session as any).toggleDone;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <InstantCueToast cue={instantCue} onClear={() => setInstantCue(null)} randomHoldMs={randomHoldMs} />

      <RestTimerOverlay
        visible={restVisible}
        initialSeconds={90}
        onClose={() => setRestVisible(false)}
        onDone={onRestTimerDoneFeedback}
      />

      <ScrollView contentContainerStyle={{ padding: PAD, gap: GAP, paddingBottom: 140 }}>
        {/* Header card */}
        <View
          style={{
            borderWidth: 1,
            borderColor: c.border,
            backgroundColor: c.card,
            borderRadius: CARD_R,
            padding: FR.space.x4,
            gap: FR.space.x2,
          }}
        >
          <Text style={{ color: c.text, ...FR.type.h2 }}>
            {planMode ? plan?.routineName ?? "Planned Workout" : "Free Workout"}
          </Text>
          <Text style={{ color: c.muted, ...FR.type.sub }}>
            Sets logged: {sets.length} • Focus: {focusMode ? "On" : "Off"}
          </Text>
        </View>

        {/* Top controls */}
        <View style={{ flexDirection: "row", gap: FR.space.x2 }}>
          <Pressable
            onPress={() => setPickerMode("addBlock")}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: FR.space.x3,
              paddingHorizontal: FR.space.x4,
              borderRadius: PILL_R,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.card,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? ds.rules.tapOpacity : 1,
            })}
          >
            <Text style={{ color: c.text, ...FR.type.h3 }}>+ Exercise</Text>
          </Pressable>

          <Pressable
            onPress={() => setFocusMode((v) => !v)}
            style={({ pressed }) => ({
              paddingVertical: FR.space.x3,
              paddingHorizontal: FR.space.x4,
              borderRadius: PILL_R,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: focusMode ? c.bg : c.card,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? ds.rules.tapOpacity : 1,
            })}
          >
            <Text style={{ color: c.text, ...FR.type.h3 }}>{focusMode ? "Focus ✓" : "Focus"}</Text>
          </Pressable>

          <Pressable
            onPress={() => setPickerMode("changeSelected")}
            style={({ pressed }) => ({
              paddingVertical: FR.space.x3,
              paddingHorizontal: FR.space.x4,
              borderRadius: PILL_R,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.card,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? ds.rules.tapOpacity : 1,
            })}
          >
            <Text style={{ color: c.text, ...FR.type.h3 }}>Pick</Text>
          </Pressable>
        </View>

        {/* Exercise blocks */}
        <ExerciseBlocksCard
          exerciseIds={exerciseBlocks}
          sets={sets as any}
          focusedExerciseId={selectedExerciseId}
          focusMode={focusMode}
          onAddSetForExercise={addSetForExercise}
          onJumpToExercise={(id: string) => setSelectedExerciseId(id)}
          isDone={isDoneFn}
          toggleDone={toggleDone}
          setWeightForSet={(session as any).setWeightForSet}
          setRepsForSet={(session as any).setRepsForSet}
          kgToLb={(session as any).kgToLb}
          estimateE1RMLb={(session as any).estimateE1RMLb}
        />

        {/* Selected exercise card */}
        <View
          style={{
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: CARD_R,
            padding: FR.space.x4,
            backgroundColor: c.card,
            gap: FR.space.x2,
          }}
        >
          <Text style={{ color: c.muted, ...FR.type.sub }}>Selected Exercise (Quick Add)</Text>
          <Text style={{ color: c.text, ...FR.type.h2 }}>{selectedExerciseName}</Text>

          <Pressable
            onPress={() => setPickerMode("changeSelected")}
            style={({ pressed }) => ({
              paddingVertical: FR.space.x3,
              paddingHorizontal: FR.space.x4,
              borderRadius: PILL_R,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.bg,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? ds.rules.tapOpacity : 1,
            })}
          >
            <Text style={{ color: c.text, ...FR.type.h3 }}>Change Selected</Text>
          </Pressable>
        </View>

        {/* Quick add */}
        <QuickAddSetCard
          weightLb={(session as any).weightLb}
          reps={(session as any).reps}
          weightLbText={(session as any).weightLbText}
          repsText={(session as any).repsText}
          onWeightText={(session as any).onWeightText}
          onRepsText={(session as any).onRepsText}
          onWeightCommit={(session as any).onWeightCommit}
          onRepsCommit={(session as any).onRepsCommit}
          onDecWeight={(session as any).decWeight}
          onIncWeight={(session as any).incWeight}
          onDecReps={(session as any).decReps}
          onIncReps={(session as any).incReps}
          onAddSet={addSet}
        />

        {/* Bottom actions */}
        <View style={{ flexDirection: "row", gap: FR.space.x2 }}>
          <Pressable
            onPress={finishWorkout}
            style={({ pressed }) => ({
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
            })}
          >
            <Text style={{ color: c.bg, ...FR.type.h3 }}>Finish Workout</Text>
          </Pressable>

          <Pressable
            onPress={saveAsRoutine}
            disabled={sets.length === 0}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: FR.space.x3,
              paddingHorizontal: FR.space.x4,
              borderRadius: PILL_R,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.card,
              alignItems: "center",
              justifyContent: "center",
              opacity: sets.length === 0 ? 0.5 : pressed ? ds.rules.tapOpacity : 1,
            })}
          >
            <Text style={{ color: c.text, ...FR.type.h3 }}>Save Routine</Text>
          </Pressable>

          <Pressable
            onPress={reset}
            style={({ pressed }) => ({
              paddingVertical: FR.space.x3,
              paddingHorizontal: FR.space.x4,
              borderRadius: PILL_R,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.card,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? ds.rules.tapOpacity : 1,
            })}
          >
            <Text style={{ color: c.text, ...FR.type.h3 }}>Reset</Text>
          </Pressable>
        </View>

        {/* Recap cues */}
        <View
          style={{
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: CARD_R,
            padding: FR.space.x4,
            gap: FR.space.x2,
            backgroundColor: c.card,
          }}
        >
          <Text style={{ color: c.text, ...FR.type.h3 }}>Recap Cues</Text>

          {recapCues.length === 0 ? (
            <Text style={{ color: c.muted, ...FR.type.sub }}>Tap Finish Workout to generate recap cues.</Text>
          ) : (
            recapCues.map((cue, idx) => (
              <Text
                key={idx}
                style={{
                  color: c.text,
                  ...(cue.intensity === "high" ? FR.type.h3 : FR.type.body),
                }}
              >
                • {cue.message}
              </Text>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
