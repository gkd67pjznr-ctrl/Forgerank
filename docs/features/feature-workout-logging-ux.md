# Feature: Workout Logging UX

## Overview
The core workout logging interface - where users record their sets, weight, and reps. This is the most-used screen in the app and needs to be fast, intuitive, and visually appealing.

**Current Status:** UGLY, needs complete redesign

**Inspiration:** Fitbod, Liftoff - clean list-based logging with exercise cards and inline set entry

---

## Current Problems

1. **Cluttered UI** - Too many cards, confusing layout
2. **Confusing "Quick Add" vs "Exercise Blocks"** - Two different ways to add sets
3. **No clear "Add Exercise" button** - Users can't easily add exercises to their workout
4. **Set entry is clunky** - Need to tap multiple times to log a set
5. **"Mark Done" flow is awkward** - Sets are logged immediately, then marked done later
6. **Missing clear visual hierarchy** - Hard to tell what's editable vs completed

---

## Target Design (Fitbod/Liftoff Style)

### Main Screen Structure
```
┌─────────────────────────────────────────┐
│  [Workout Timer]         [Finish] [•••] │  <- Top bar
├─────────────────────────────────────────┤
│                                         │
│  [+ Add Exercise]                       │  <- Prominent button
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Bench Press                  [↓] │ │  <- Exercise card (collapsible)
│  │                                  │ │
│  │  Set 1  [____] lb  [____] reps  [✓]│  <- Set line with inputs + checkmark
│  │  Set 2  [____] lb  [____] reps  [✓]│
│  │  Set 3  [____] lb  [____] reps  [✓]│
│  │                                  │ │
│  │  [+ Add Set]                     │ │  <- Add another set to this exercise
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Squat                        [↓] │ │
│  │                                  │ │
│  │  Set 1  [____] lb  [____] reps  [✓]│
│  │  Set 2  [____] lb  [____] reps  [✓]│
│  │                                  │ │
│  │  [+ Add Set]                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [+ Add Exercise]                       │  <- Also at bottom
└─────────────────────────────────────────┘
```

### Key Interaction Flow

1. **User taps [+ Add Exercise]**
   - Opens exercise picker modal
   - Selected exercise is added as a new card

2. **Exercise card shows set lines**
   - Each line has: weight input | reps input | [✓] button
   - Tapping [✓] logs the set (triggers PR check, rest timer, etc.)
   - Completed sets show values (not editable)

3. **User can add more sets**
   - Tap [+ Add Set] in the exercise card
   - Adds a new empty line below

4. **Exercises can be reordered/removed**
   - Long press to drag reorder
   - Swipe to remove

---

## Sub-Features

### 1. Add Exercise Button
- [ ] Prominent [+ Add Exercise] button at top of list
- [ ] Also at bottom for easy access
- [ ] Opens exercise picker modal
- [ ] Selected exercise added as new card
- [ ] Scroll to newly added exercise

**Status:** Planned

---

### 2. Exercise Card Component
- [ ] Exercise name header (tap to collapse/expand)
- [ ] Remove button (X) on card
- [ ] Drag handle for reordering
- [ ] Show set count (e.g., "3 sets")
- [ ] Collapse/expand state
- [ ] Visual distinction between collapsed/expanded

**Status:** Planned

---

### 3. Set Line Component
- [ ] Weight input box (lb/kg based on settings)
- [ ] Reps input box
- [ ] Checkmark/Done button on right
- [ ] Set number indicator ("Set 1", "Set 2", etc.)
- [ ] Empty state vs completed state styling
- [ ] Auto-focus next line after completing? (maybe)

**Status:** Planned

---

### 4. Add Set Button (per exercise)
- [ ] [+ Add Set] button at bottom of exercise card
- [ ] Adds new empty set line
- [ ] Auto-fill from previous set (smart defaults)
- [ ] Scroll to new set

**Status:** Planned

---

### 5. Set Completion Flow
- [ ] Tapping [✓] logs the set
- [ ] Triggers PR detection
- [ ] Shows celebration toast if PR
- [ ] Starts rest timer
- [ ] Haptic feedback
- [ ] Line becomes non-editable after completion

**Status:** Planned

---

### 6. Exercise Reordering
- [ ] Long press drag to reorder exercises
- [ ] Visual feedback during drag
- [ ] Drop indicator
- [ ] Save new order to session

**Status:** Planned

---

### 7. Exercise Removal
- [ ] Swipe to remove exercise card
- [ ] Or tap (X) button on card
- [ ] Confirmation dialog
- [ ] Also removes all associated sets

**Status:** Planned

---

### 8. Smart Defaults
- [ ] Auto-fill weight from previous set
- [ ] Auto-fill reps from previous set
- [ ] Remember last weight for this exercise
- [ ] Suggest weight increment from last workout

**Status:** Planned

---

### 9. Keyboard Handling
- [ ] Number pad for weight
- [ ] Number pad for reps
- [ ] Dismiss keyboard on done
- [ ] Next field focus (weight → reps → done)

**Status:** Planned

---

### 10. Empty States
- [ ] "Add your first exercise to get started"
- [ ] Illustration or icon
- [ ] Call to action

**Status:** Planned

---

## Bugs / Issues to Fix

### BUG-LOG-001: Duplicate set logging flows
**Severity:** High
**Description:** QuickAddSetCard and ExerciseBlocksCard both add sets but in different ways. Confusing.

**Fix:** Consolidate to single set entry pattern using set lines in exercise cards.

---

### BUG-LOG-002: "Mark Done" is backwards
**Severity:** High
**Description:** Sets are logged immediately, then marked "done" later. This is backwards.

**Fix:** Set line should be empty, then tapping [✓] logs it. Completed sets show values.

---

### BUG-LOG-003: No way to remove exercises
**Severity:** Medium
**Description:** Once an exercise is added, it can't be removed from the workout.

**Fix:** Add swipe-to-remove or X button on exercise cards.

---

### BUG-LOG-004: Exercise cards can't be reordered
**Severity:** Medium
**Description:** Exercise order is fixed. Users often want to change order mid-workout.

**Fix:** Implement drag-to-reorder.

---

### BUG-LOG-005: Auto-focus issues
**Severity:** Medium
**Description:** After adding a set, focus doesn't go to the new set's inputs.

**Fix:** Auto-focus first input on new set line.

---

### BUG-LOG-006: Keyboard covers inputs
**Severity:** Medium
**Description:** When editing sets, keyboard covers the inputs.

**Fix:** Scroll to visible input on focus.

---

### BUG-LOG-007: No indication of current exercise
**Severity:** Low
**Description:** In free workout mode, no clear indication which exercise is "active".

**Fix:** Highlight current exercise card or first incomplete set.

---

## Technical Notes

**Key Files to Modify:**
- `app/live-workout.tsx` - Main screen (will be simplified)
- `src/ui/components/LiveWorkout/ExerciseBlocksCard.tsx` - Redesign as ExerciseCard
- `src/ui/components/LiveWorkout/QuickAddSetCard.tsx` - Remove (replaced by set lines)

**New Components:**
- `ExerciseCard.tsx` - Single exercise with set lines
- `SetLine.tsx` - Individual set input row
- `AddExerciseButton.tsx` - Prominent add button
- `EmptyWorkoutState.tsx` - Empty state illustration

**Data Model Changes:**
```typescript
// Current: Sets are in a flat array
type CurrentSession = {
  sets: LoggedSet[];
  selectedExerciseId: string;
  exerciseBlocks: string[];
}

// Proposed: Add exerciseOrder to track display order
type CurrentSession = {
  sets: LoggedSet[];
  exerciseOrder: string[]; // Ordered list of exercise IDs
  // Maybe also track which sets are "in progress" vs "completed"
}
```

**State Management:**
- Keep using `currentSessionStore` for persistence
- Add `exerciseOrder` field
- Consider adding `setStatus: 'editing' | 'completed'` to LoggedSet

---

## Implementation Phases

### Phase 1: Core Redesign
- [ ] Create new ExerciseCard component with set lines
- [ ] Implement AddExerciseButton
- [ ] Basic set line with weight/reps inputs
- [ ] Checkmark button to complete set

### Phase 2: Polish
- [ ] Exercise reordering
- [ ] Exercise removal
- [ ] Smart defaults (auto-fill)
- [ ] Keyboard handling

### Phase 3: Delight
- [ ] PR celebration on set complete
- [ ] Haptic feedback
- [ ] Smooth animations
- [ ] Empty states

---

## Dependencies

- Exercise Library (for picker)
- PR Detection (triggers on set complete)
- Rest Timer (starts on set complete)
- Settings Store (for lb/kg preference)

---

## Examples / References

**Fitbod:**
- Clean exercise cards with expand/collapse
- Inline set entry with weight/reps
- Green checkmark to complete sets
- Smooth animations

**Liftoff:**
- Similar card-based layout
- Drag-to-reorder exercises
- Swipe to remove
- Minimal UI chrome

---

*Last Updated: 2026-01-27*
*Status: Planning*
