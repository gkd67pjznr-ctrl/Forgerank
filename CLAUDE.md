# FORGERANK CODEBASE DOCUMENTATION
**Complete Guide for AI Assistants**

Last Updated: 2026-01-23

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Directory Structure](#2-directory-structure)
3. [Core Features](#3-core-features)
4. [Data Management](#4-data-management)
5. [Routing & Navigation](#5-routing--navigation)
6. [UI & Styling](#6-ui--styling)
7. [Development Workflows](#7-development-workflows)
8. [Testing](#8-testing)
9. [Key Conventions](#9-key-conventions)
10. [Common Gotchas](#10-common-gotchas)

---

## 1. Project Overview

### What is Forgerank?

Forgerank is a **React Native fitness tracking app** built with Expo that focuses on:
- Verified strength ranks
- Per-set PR detection
- Real-time workout feedback
- Deterministic scoring (0-1000 scale)
- Local-first architecture

### Tech Stack

```json
{
  "framework": "React Native 0.81.5 with React 19.1.0",
  "platform": "Expo 54 (New Architecture enabled)",
  "language": "TypeScript 5.9 (strict mode)",
  "routing": "expo-router 6.0 (file-based)",
  "storage": "AsyncStorage (local-first)",
  "animation": "React Native Reanimated 4.1",
  "gestures": "React Native Gesture Handler 2.28"
}
```

### Architecture Pattern

- **File-based routing** via expo-router
- **Module-level state management** with subscription patterns
- **Local-first design** with AsyncStorage persistence
- **No backend yet** - all state is client-side
- **Dark-mode first** with "toxic" aesthetic

### Core Philosophy

1. **Deterministic scoring** - Same input always produces same output
2. **Explainable PR detection** - Users know exactly why they got a PR
3. **Fast, non-intrusive feedback** - Toast notifications, not modals
4. **Works offline** - All features work without network

---

## 2. Directory Structure

### Overview

```
/home/user/Forgerank/
├── app/                    # Routes & Screens (expo-router)
│   ├── (tabs)/            # Tab navigation screens
│   ├── workout/           # Workout-related routes
│   ├── routines/          # Routine management routes
│   ├── post/              # Social post routes
│   ├── u/                 # User profile routes
│   ├── dm/                # Direct message routes
│   ├── calendar/          # Calendar routes
│   └── _layout.tsx        # Root layout with error boundary
├── src/                   # Source code
│   ├── lib/               # Core business logic (54 files)
│   ├── ui/                # Design system & components
│   └── data/              # Static data (exercises, ranks)
├── hooks/                 # Platform hooks
├── components/            # Shared components
├── assets/                # Images, fonts
└── constants/             # App constants
```

### `/app/` - Routes & Screens (38 files)

#### Main Tabs (`app/(tabs)/`)
- `index.tsx` - Home/Dashboard
- `feed.tsx` - Social feed with friend workouts
- `workout.tsx` - Workout hub/start screen
- `body.tsx` - Body tracking
- `profile.tsx` - User profile
- `_layout.tsx` - Tab navigation configuration

#### Core Screens
- **`live-workout.tsx`** - **MAIN WORKOUT LOGGING EXPERIENCE** (most complex screen)
- `history.tsx` - Workout history list
- `calendar.tsx` - Calendar view of workouts

#### Workout Routes (`app/workout/`)
- `start.tsx` - Workout start options
- `browse-plans.tsx` - Browse premade plans
- `[sessionId].tsx` - Workout detail view
- `plan-detail/[id].tsx` - Plan details

#### Routine Routes (`app/routines/`)
- `index.tsx` - Routines list
- `create.tsx` - Create new routine
- `[routineId].tsx` - Routine detail
- `[routineId]/add-exercise.tsx` - Add exercises to routine

#### Social Routes
- `post/[id].tsx` - Post detail with comments
- `u/[id].tsx` - User profile
- `friends.tsx` - Friends list
- `dm/[id].tsx` - Direct message thread
- `chat.tsx` - Chat list
- `new-message.tsx` - Start new message

### `/src/lib/` - Core Business Logic (54 files)

#### Workout Domain
| File | Purpose |
|------|---------|
| `workoutModel.ts` | Core types: `WorkoutSet`, `WorkoutSession` |
| `workoutStore.ts` | Workout history storage with persistence |
| `currentSessionStore.ts` | Active workout state (persisted to AsyncStorage) |
| `loggerTypes.ts` | Logger-specific types: `LoggedSet`, `SetType` |
| `workoutPlanModel.ts` | Workout plan types |
| `workoutPlanStore.ts` | Active plan state |

#### Scoring & Ranking
| File | Purpose |
|------|---------|
| **`forgerankScoring.ts`** | **CORE SCORING ALGORITHM** (deterministic, 0-1000 score) |
| `ranks.ts` | Rank thresholds, ladder generation |
| `e1rm.ts` | Epley 1RM estimation |
| `perSetCue.ts` | Per-set PR detection & cue generation |
| `cues.ts` | Cue types and helpers |
| `simpleSession.ts` | Session recap cues |

#### Data Management
| File | Purpose |
|------|---------|
| `routinesModel.ts` | Routine types |
| `routinesStore.ts` | Routines storage with persistence |
| `socialModel.ts` | Social types (posts, reactions, comments) |
| `socialStore.ts` | Social feed storage |
| `friendsStore.ts` | Friends management |
| `chatStore.ts` | Chat/DM storage |
| `feedStore.ts` | Feed management |

#### Utilities
| File | Purpose |
|------|---------|
| `units.ts` | lb/kg conversions |
| `buckets.ts` | Weight bucketing for PR tracking |
| `settings.ts` | App settings with persistence |
| `validators/workout.ts` | Input validation (weight, reps, bodyweight) |

#### Hooks (`src/lib/hooks/`)
| File | Purpose |
|------|---------|
| **`useLiveWorkoutSession.ts`** | **Main workout session hook** (weight/reps state, set management) |
| `useWorkoutOrchestrator.ts` | Workout flow orchestration |
| `useWorkoutTimer.ts` | Timer with pace estimation |

#### Premade Plans (`src/lib/premadePlans/`)
| File | Purpose |
|------|---------|
| `types.ts` | Plan types |
| `samplePlans.ts` | Sample workout plans |
| `store.ts` | Plan state management |
| `progressStore.ts` | Plan progress tracking |
| `categories.ts` | Plan categories |
| `planToRoutine.ts` | Convert plans to routines |

### `/src/ui/` - Design System & Components

#### Design System
| File | Purpose |
|------|---------|
| `theme.ts` | Theme colors (light/dark) with `useThemeColors()` hook |
| **`designSystem.ts`** | **COMPREHENSIVE DESIGN TOKENS** (spacing, typography, colors, motion) |
| **`forgerankStyle.ts`** | **Brand-specific style helpers** (`FR` namespace) |

#### Components (`src/ui/components/LiveWorkout/`)
| Component | Purpose |
|-----------|---------|
| `ExerciseBlocksCard.tsx` | Exercise list during workout |
| `QuickAddSetCard.tsx` | Quick add set interface |
| `ExercisePicker.tsx` | Exercise selection modal |
| `InstantCueToast.tsx` | PR feedback toast |
| `PlanHeaderCard.tsx` | Plan info display |
| `WorkoutLiveCard.tsx` | Live workout summary |
| `WorkoutTimerBar.tsx` | Compact timer bar |
| `WorkoutTimerDetails.tsx` | Detailed timer view |
| `RestTimerOverlay.tsx` | Rest timer modal |

### `/src/data/` - Static Data
- `exercises.ts` - Exercise database (`EXERCISES_V1` array)
- `rankTops.ts` - Verified top lifts for rank calibration

---

## 3. Core Features

### 1. Live Workout Logging (`app/live-workout.tsx`)

**Key Capabilities:**
- Real-time set logging with weight/reps
- Per-set PR detection with instant feedback
- Exercise blocks organization
- Plan mode vs free mode
- Auto-save to AsyncStorage (persists across app restarts)
- Rest timer with haptic/audio feedback
- E1RM calculation per set

**Main Flow:**
```typescript
1. User taps "Start Workout"
2. Navigate to /live-workout
3. Add exercises from picker
4. Log sets with weight/reps
5. System detects PRs automatically
6. Toast notification shows PR type
7. Continue logging
8. Finish workout → Convert to WorkoutSession
9. Clear current session
```

### 2. Forgerank Scoring System

**Algorithm:** `src/lib/forgerankScoring.ts`

**Key Features:**
- Deterministic 0-1000 scoring
- Based on e1RM/bodyweight ratio with curve
- Tier system: Iron → Bronze → Silver → Gold → Platinum → Diamond → Mythic
- Explainable breakdown with reasons
- Anti-cheat heuristics (implausible jumps, sets)
- Works without backend

**Scoring Factors:**
```typescript
{
  e1rm: number,           // Estimated 1 rep max
  bodyweightKg: number,   // User bodyweight
  exerciseName: string,   // Exercise type
  reps: number,           // Reps performed
  setType: 'warmup' | 'working'
}
```

### 3. Rank Ladder

**Structure:**
- 20-rank system per exercise
- Fixed to verified top lifts (not user-submitted)
- Curved progression (easier early, harder late)
- Score thresholds: 0..1 normalized
- Progress tracking to next rank

**Implementation:** `src/lib/ranks.ts`

### 4. PR Detection & Cues

**Three Types of PRs:**
1. **Weight PR** - New max weight at any rep count
2. **Rep PR** - More reps at same weight bucket
3. **E1RM PR** - New estimated 1RM

**Cue Intensity Levels:**
- `low` - Minor achievement
- `med` - Notable achievement
- `high` - Major achievement

**Implementation:** `src/lib/perSetCue.ts`

### 5. Workout History

**Storage:** `workoutStore.ts`

**Features:**
- All workouts stored in AsyncStorage
- Calendar view by day
- Session detail with set-by-set breakdown
- Duration, completion %, exercise count
- Never deleted (append-only)

### 6. Routines & Plans

**Routines:**
- User-created workout templates
- List of exercises with set/rep targets
- Can be started as workout

**Plans:**
- Multi-week structured programs
- Categories: Strength, Hypertrophy, Athletic
- Progress tracking
- Can be converted to routines

**Storage:** `routinesStore.ts`, `premadePlans/store.ts`

### 7. Social Features

**Posts:**
- Workout snapshots shared to feed
- Privacy: public or friends-only
- Reactions (emotes): like, fire, skull, crown, bolt, clap
- Comments with threading (future)
- Sorted by recency

**Friends:**
- Friend list management
- Friend requests
- Friend-only content visibility

**Storage:** `socialStore.ts`, `friendsStore.ts`

---

## 4. Data Management

### State Management Pattern

**Core Pattern: Module-level stores with subscriptions**

Every store follows this structure:

```typescript
// Module-level state
let state: SomeType = initialValue;
let hydrated = false;
const listeners = new Set<() => void>();

// Notify subscribers
function notify() {
  for (const fn of listeners) fn();
}

// Persist to AsyncStorage
async function persist() {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}

// Hydrate from AsyncStorage
export async function hydrate(): Promise<void> {
  if (hydrated) return;
  hydrated = true;
  const raw = await AsyncStorage.getItem(KEY);
  if (raw) state = JSON.parse(raw);
  notify();
}

// Getters
export function getState(): SomeType {
  return state;
}

// Mutations
export function updateState(newState: SomeType) {
  state = newState;
  persist();
  notify();
}

// Subscription
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// React Hook
export function useState(): SomeType {
  const [data, setData] = useState(getState());

  useEffect(() => {
    hydrate().catch(console.error);
    return subscribe(() => setData(getState()));
  }, []);

  return data;
}
```

### Key Stores

| Store | Storage Key | Hook | Purpose |
|-------|-------------|------|---------|
| `workoutStore.ts` | `workoutSessions.v1` | `useWorkoutSessions()` | Completed workouts |
| `currentSessionStore.ts` | `currentSession.v1` | `useCurrentSession()` | Active workout |
| `routinesStore.ts` | `routines.v1` | `useRoutines()` | User routines |
| `socialStore.ts` | `social.v1` | `useFeedAll()` | Social data |
| `settings.ts` | `forgerank.settings.v1` | `useSettings()` | App settings |

### Persistence Strategy

**AsyncStorage Keys:**
```typescript
const KEYS = {
  WORKOUTS: 'workoutSessions.v1',
  CURRENT: 'currentSession.v1',
  ROUTINES: 'routines.v1',
  SOCIAL: 'social.v1',
  SETTINGS: 'forgerank.settings.v1',
};
```

**Sequential Persistence Queue** (prevents race conditions):
```typescript
let persistQueue: Promise<void> = Promise.resolve();

async function persist() {
  persistQueue = persistQueue.then(async () => {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  });
  return persistQueue;
}
```

### Data Flow Examples

**Workout Flow:**
```
User logs set
  → updateCurrentSession()
  → persist to AsyncStorage
  → Notify listeners
  → UI updates

User finishes
  → Convert LoggedSet[] to WorkoutSet[]
  → addWorkoutSession()
  → clearCurrentSession()
```

**Feed Flow:**
```
User reacts
  → toggleReaction()
  → Update local state
  → Increment post.likeCount
  → Persist & Notify
```

---

## 5. Routing & Navigation

### File-Based Routing (expo-router)

Expo Router uses the file system to create routes. File names become URLs.

### Route Patterns

**Static Routes:**
```typescript
/app/history.tsx        → /history
/app/settings.tsx       → /settings
/app/live-workout.tsx   → /live-workout
```

**Dynamic Routes:**
```typescript
/app/post/[id].tsx              → /post/123
/app/u/[id].tsx                 → /u/user123
/app/workout/[sessionId].tsx    → /workout/abc-123
```

**Nested Routes:**
```typescript
/app/calendar/day/[dayMs].tsx                  → /calendar/day/1234567890
/app/routines/[routineId]/add-exercise.tsx     → /routines/r1/add-exercise
```

**Tab Routes (Special):**
```typescript
/app/(tabs)/index.tsx    → /      (Home tab)
/app/(tabs)/feed.tsx     → /feed  (Feed tab)
// Parentheses () hide segment from URL
```

### Navigation

**Link Component:**
```typescript
import { Link } from 'expo-router';

<Link href="/post/123" asChild>
  <Pressable>{/* ... */}</Pressable>
</Link>
```

**Programmatic Navigation:**
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/live-workout');
router.back();
router.replace('/home');
```

**Route Parameters:**
```typescript
// In /app/post/[id].tsx
import { useLocalSearchParams } from 'expo-router';

const { id } = useLocalSearchParams<{ id: string }>();
```

### Layout Hierarchy

```
app/_layout.tsx (Root - Error Boundary, Theme)
  └── app/(tabs)/_layout.tsx (Tabs Navigator)
        ├── app/(tabs)/index.tsx
        ├── app/(tabs)/feed.tsx
        ├── app/(tabs)/workout.tsx
        ├── app/(tabs)/body.tsx
        └── app/(tabs)/profile.tsx
```

### Screen Options

```typescript
// In _layout.tsx
<Stack.Screen
  name="live-workout"
  options={{
    headerShown: false,
    presentation: 'modal'
  }}
/>
```

---

## 6. UI & Styling

### Design System Structure

**Three-Layer System:**

1. **Base Theme** (`src/ui/theme.ts`)
   - Color palette (light/dark)
   - Hook: `useThemeColors()`

2. **Design System** (`src/ui/designSystem.ts`)
   - Comprehensive tokens
   - Function: `makeDesignSystem(mode, accent)`
   - Spacing, typography, radii, motion, shadows

3. **Brand Style** (`src/ui/forgerankStyle.ts`)
   - Quick access via `FR` namespace
   - Component recipes

### Using the Design System

**Import:**
```typescript
import { useThemeColors } from "../../src/ui/theme";
import { FR } from "../../src/ui/forgerankStyle";
```

**Colors:**
```typescript
const c = useThemeColors();

// Background colors
c.bg       // Screen background
c.card     // Card background
c.border   // Border color

// Text colors
c.text     // Primary text
c.muted    // Secondary text

// Semantic colors
c.primary  // Primary actions
c.success  // Success states
c.danger   // Errors/destructive
c.warning  // Warnings
```

**Spacing:**
```typescript
FR.space.x1  // 6px
FR.space.x2  // 8px
FR.space.x3  // 12px
FR.space.x4  // 16px
FR.space.x5  // 20px
FR.space.x6  // 24px
```

**Typography:**
```typescript
FR.type.h1    // { fontSize: 22, fontWeight: '900', letterSpacing: 0.2 }
FR.type.h2    // { fontSize: 18, fontWeight: '900', letterSpacing: 0.2 }
FR.type.h3    // { fontSize: 16, fontWeight: '800', letterSpacing: 0.15 }
FR.type.body  // { fontSize: 14, fontWeight: '700', letterSpacing: 0.1 }
FR.type.sub   // { fontSize: 13, fontWeight: '700', letterSpacing: 0.1 }
FR.type.mono  // { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 }
```

**⚠️ IMPORTANT:** React Native only supports `fontWeight` values from `"100"` to `"900"`. Never use `"950"` or higher.

**Radii:**
```typescript
FR.radius.card  // 16
FR.radius.pill  // 999
FR.radius.soft  // 12
```

### Component Recipes

**Card:**
```typescript
<View style={FR.card(c)}>
  <Text style={{ ...FR.type.h2, color: c.text }}>Title</Text>
  <Text style={{ ...FR.type.body, color: c.muted }}>Body</Text>
</View>
```

**Pill Button:**
```typescript
<Pressable
  onPress={handleAction}
  style={FR.pillButton(c)}
>
  <Text style={{ ...FR.type.body, color: c.text }}>Action</Text>
</Pressable>
```

**Standard Layout:**
```typescript
<View style={{ flex: 1, backgroundColor: c.bg }}>
  <ScrollView style={{ flex: 1, padding: FR.space.x4 }}>
    {/* Content cards */}
  </ScrollView>
</View>
```

### Styling Conventions

**1. Inline Styles (Preferred):**
```typescript
<View style={{
  padding: FR.space.x4,
  gap: FR.space.x3,
  borderRadius: FR.radius.card,
  backgroundColor: c.card
}}>
```

**2. StyleSheet (For Complex):**
```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  }
});
```

**3. Platform-Specific:**
```typescript
import { Platform } from 'react-native';

style={{
  ...Platform.select({
    ios: { shadowOpacity: 0.3 },
    android: { elevation: 4 },
  })
}}
```

### Design Aesthetic ("Forgerank" Visual Identity)

- **Dark-first** (bg: `#0A0A0D`)
- **High contrast**
- **Heavy font weights** (700-900)
- **Minimal borders** (hairline: 1px)
- **Neon accents** ("toxic" green: `#A6FF00`)
- **Sharp corners** (not too rounded)
- **Fast animations** (120-180ms)
- **Haptic feedback** on interactions

---

## 7. Development Workflows

### Getting Started

**Install Dependencies:**
```bash
npm install
```

**Start Development Server:**
```bash
npm start              # Start with tunnel
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web
```

**Linting:**
```bash
npm run lint
```

### Git Workflow

**Branch Naming:**
- Feature: `feature/description`
- Fix: `fix/description`
- Auto-generated: `claude/add-feature-XYZ`

**Commit Messages:**
- Present tense: "Add validation", not "Added validation"
- Include session link at end

**Current Branch:**
```bash
git branch --show-current
# claude/add-claude-documentation-JSw9o
```

### Environment

**Platform:** Linux 4.4.0
**Node:** Check with `node --version`
**Package Manager:** npm

### Configuration Files

**`/package.json`:**
- Dependencies and scripts
- Key: `expo-router`, `@react-native-async-storage/async-storage`, `expo-haptics`

**`/app.json`:**
- Expo configuration
- `newArchEnabled: true` (React Native New Architecture)
- `experiments.typedRoutes: true` (Type-safe routing)
- `experiments.reactCompiler: true` (React Compiler enabled)

**`/tsconfig.json`:**
- TypeScript configuration
- `strict: true`
- Path alias: `@/*` → `./*`

**`/eslint.config.js`:**
- ESLint configuration
- Based on `eslint-config-expo/flat`

---

## 8. Testing

### Current State

**Testing Infrastructure:**
- Jest configured
- `@testing-library/react-native` installed
- `@testing-library/jest-native` installed

**Existing Tests:**
- `__tests__/lib/perSetCue.test.ts` - PR detection tests (comprehensive)

**Test Pattern:**
```typescript
import { detectCueForWorkingSet, makeEmptyExerciseState } from '../../src/lib/perSetCue';

describe('perSetCue - PR Detection', () => {
  it('detects weight PR on first working set', () => {
    const prev = makeEmptyExerciseState();

    const result = detectCueForWorkingSet({
      weightKg: 100,
      reps: 5,
      unit: 'kg',
      exerciseName: 'Bench Press',
      prev,
    });

    expect(result.cue).toBeDefined();
    expect(result.cue?.message).toContain('weight PR');
  });
});
```

### Running Tests

```bash
npm test                # Run all tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report
```

### Areas Needing Tests

**Critical:**
- Scoring algorithm (`forgerankScoring.ts`)
- E1RM calculation (`e1rm.ts`)
- Rank thresholds (`ranks.ts`)
- Input validation (`validators/workout.ts`)

**Important:**
- Store hydration/persistence
- Unit conversions
- Workout session management

---

## 9. Key Conventions

### Naming Conventions

**Files:**
- Components: PascalCase (`QuickAddSetCard.tsx`)
- Utilities: camelCase (`forgerankScoring.ts`)
- Models: camelCase with suffix (`workoutModel.ts`, `socialModel.ts`)
- Stores: camelCase with suffix (`workoutStore.ts`)

**Functions:**
- Actions: verb prefix (`addWorkoutSession`, `updateCurrentSession`)
- Getters: `get` prefix (`getSettings`, `getRoutines`)
- Hooks: `use` prefix (`useWorkoutSessions`, `useThemeColors`)
- Queries: `is`/`has` prefix (`isDone`, `hasCurrentSession`)

**Types:**
- PascalCase (`WorkoutSession`, `LoggedSet`)
- Suffix for type variants (`SetType`, `NotificationType`)

### Code Patterns

**1. UID Generation:**
```typescript
function uid(): string {
  return Math.random().toString(16).slice(2) + "-" +
         Math.random().toString(16).slice(2);
}
```

**2. Immutable Updates:**
```typescript
// Array prepend (newest first)
sessions = [newSession, ...sessions];

// Object update
state = { ...state, posts: updatedPosts };

// Record update
doneBySetId = { ...doneBySetId, [setId]: true };
```

**3. Timestamp Pattern:**
```typescript
// Always use milliseconds
const now = Date.now();  // Not new Date()
createdAtMs: now
```

**4. Optional Chaining:**
```typescript
Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light).catch?.(() => {});
```

**5. Error Handling:**
```typescript
try {
  await AsyncStorage.setItem(KEY, data);
} catch (err) {
  console.error('Failed to persist:', err);
  // Continue - app works in-memory
}
```

**6. Conditional Imports:**
```typescript
let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}
```

### Type Patterns

**1. Discriminated Unions:**
```typescript
type SetType = "warmup" | "working";
type PrivacyLevel = "public" | "friends";
```

**2. Optional Fields:**
```typescript
type WorkoutSession = {
  id: string;
  sets: WorkoutSet[];
  // Optional linkage
  routineId?: string;
  routineName?: string;
};
```

**3. Record Types:**
```typescript
doneBySetId: Record<string, boolean>
bestRepsAtWeight: Record<string, number>
```

**4. Function Types:**
```typescript
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
```

### Import Patterns

**Relative Imports (Preferred):**
```typescript
import { useThemeColors } from "../../src/ui/theme";
import { EXERCISES_V1 } from "../../src/data/exercises";
```

**Path Alias (Available):**
```typescript
import { useThemeColors } from "@/src/ui/theme";
```

**Type Imports:**
```typescript
import type { WorkoutSession } from "./workoutModel";
```

### Comment Patterns

**File Headers:**
```typescript
// src/lib/forgerankScoring.ts
/**
 * Forgerank scoring (v1 foundation)
 *
 * Goals:
 * - Deterministic
 * - Plausible without backend
 * - Explainable breakdown
 */
```

**Section Markers:**
```typescript
// ---------- Public API ----------
// ---------- Selectors ----------
// ---------- Mutations ----------
// ---------- Internal pieces ----------
```

**TODOs:**
```typescript
// TODO: Show toast notification to user
// future: threading
```

---

## 10. Common Gotchas

### 1. Race Conditions in Persistence

**Problem:** Rapid updates can corrupt AsyncStorage

**Solution:** Sequential persistence queue
```typescript
let persistQueue: Promise<void> = Promise.resolve();
persistQueue = persistQueue.then(async () => { /* persist */ });
```

### 2. Font Weight Limits

**Problem:** React Native only supports `fontWeight` `"100"` to `"900"`

**Wrong:** `fontWeight: "950"`
**Right:** `fontWeight: "900"`

### 3. Hydration Timing

**Problem:** Using store before hydration returns empty data

**Solution:** Hydrate in `useEffect`, not during render:
```typescript
useEffect(() => {
  hydrateStore().catch(console.error);
}, []);
```

### 4. Type vs Model Files

**Distinction:**
- `loggerTypes.ts` → Logger domain types (`LoggedSet`)
- `workoutModel.ts` → Workout domain types (`WorkoutSet`)
- Don't mix: `LoggedSet` (logger) ≠ `WorkoutSet` (model)

### 5. Time Units

**Always:**
- Use **milliseconds** for timestamps (`Date.now()`)
- Use **seconds** for durations
- Never mix `Date` objects with numbers

### 6. Expo Router Params

**Type safety:**
```typescript
// Right
const params = useLocalSearchParams<{ id: string }>();

// Wrong
const { id } = useLocalSearchParams();
```

### 7. AsyncStorage Can Fail

**Always wrap in try/catch:**
```typescript
try {
  await AsyncStorage.setItem(KEY, data);
} catch (err) {
  console.error('Storage failed:', err);
  // App continues to work in-memory
}
```

### 8. Haptics May Not Be Available

**Check before use:**
```typescript
if (Haptics?.impactAsync) {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
```

---

## Architectural Decisions

### Why No Zustand/Redux?

**Current:** Module-level stores with subscriptions
**Reason:** Simpler for v1, works well for local-first
**Future:** Will migrate to Zustand when backend is added

### Why AsyncStorage not SQLite?

**Reason:** Simpler, fast enough for v1 scale (<10k sessions)
**Future:** May add SQLite for complex queries (leaderboards)

### Why expo-router not React Navigation?

**Reason:** File-based routing is more maintainable, typed routes

### Why lb-first not kg-first?

**Reason:** Primary market is US/Canada (lb users)
**Conversion:** All internal storage is kg, display is configurable

### Why local-first not cloud-first?

**Reason:** V1 MVP, no backend infrastructure yet
**Future:** Will sync to backend for multi-device

---

## Quick Reference

### Project Metrics

- **Total Route Files:** 38
- **Total Source Files:** 54
- **Lines of Code:** ~15,000 (estimated)
- **Main Dependencies:** 25+
- **Target Platforms:** iOS, Android, Web
- **Min iOS:** 13.4+
- **Min Android:** 6.0+

### Essential Files to Know

| File | Purpose | Priority |
|------|---------|----------|
| `app/live-workout.tsx` | Main workout experience | **CRITICAL** |
| `src/lib/forgerankScoring.ts` | Core scoring algorithm | **CRITICAL** |
| `src/lib/currentSessionStore.ts` | Active workout state | **CRITICAL** |
| `src/lib/perSetCue.ts` | PR detection | **HIGH** |
| `src/ui/forgerankStyle.ts` | Design system | **HIGH** |
| `src/lib/workoutStore.ts` | Workout history | **HIGH** |
| `src/data/exercises.ts` | Exercise database | **MEDIUM** |

### Quick Commands

```bash
# Start development
npm start

# Run on device
npm run ios
npm run android

# Lint
npm run lint

# Test
npm test
```

---

## Next Steps for AI Assistants

When working on this codebase:

1. **Read existing patterns** - Follow the module-level store pattern
2. **Use design system** - Always use `FR.*` and `useThemeColors()`
3. **Type everything** - No `any` unless unavoidable
4. **Persist state** - New features need AsyncStorage integration
5. **Add tests** - Write tests for new business logic
6. **Follow conventions** - Match existing naming and structure
7. **Check performance** - Avoid expensive renders in live-workout
8. **Validate inputs** - Use `validators/workout.ts` patterns
9. **Handle errors** - Try/catch AsyncStorage, never crash
10. **Document changes** - Update this doc when adding major features

---

**This documentation is designed to help AI assistants understand the Forgerank codebase architecture, patterns, and conventions. Keep it updated as the project evolves.**
