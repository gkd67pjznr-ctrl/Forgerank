# Feature: Forge DNA

## Overview
A visual fingerprint of your training identity — a single beautiful graphic that shows your muscle group balance, lift preferences, training style, and personality. Profile centerpiece and conversion driver for premium subscription.

**Status:** Planned | **Progress:** 0/4 features
**Priority:** Launch (v1) — must have
**Source:** 2026-01-29 brainstorm interview

---

## Sub-Features

### Planned - Training Identity Visualization
- [ ] Single graphic unique to each user
- [ ] Updates as training data accumulates
- [ ] Beautiful, shareable design (matches app aesthetic)
- [ ] Displayed prominently on user profile
- [ ] Minimum data threshold before DNA generates (e.g., 10+ workouts)

---

### Planned - Muscle Group Balance Display
- [ ] Radar/spider chart or organic shape showing volume distribution
- [ ] All major muscle groups represented
- [ ] Color-coded by relative strength
- [ ] Shows imbalances visually (e.g., heavy upper body, light legs)
- [ ] Historical comparison (how balance has shifted over time — premium)

---

### Planned - Training Style Analysis
- [ ] Categorize training tendency:
  - Strength-focused (heavy weight, low reps)
  - Volume-focused (moderate weight, high reps)
  - Endurance-focused (lighter weight, very high reps)
  - Balanced (mix of all)
- [ ] Show percentage breakdown of training style
- [ ] Compare against average Forgerank user (premium)

---

### Planned - Premium Blur Mechanic
- [ ] Free users see partial Forge DNA (basic shape + muscle balance)
- [ ] Interesting/detailed sections are blurred out
- [ ] Blurred sections have "Unlock with Pro" overlay
- [ ] Premium users see full unblurred DNA
- [ ] Effective conversion mechanic — shows what they're missing

**Premium-only sections:**
- Training style detailed breakdown
- Historical comparison
- Comparison against average user
- Detailed imbalance analysis
- Lift preference ranking

---

## Technical Notes

**Data Sources:**
```typescript
type ForgeDNAInput = {
  workoutHistory: WorkoutSession[];  // All workout data
  exerciseStats: {
    exerciseId: string;
    totalVolume: number;
    totalSets: number;
    bestE1RM: number;
    avgReps: number;
    frequency: number;    // sessions per week
  }[];
  muscleGroupVolume: Record<MuscleGroup, number>;
  trainingDays: number;   // Total unique workout days
};

type ForgeDNA = {
  userId: string;
  generatedAt: number;
  muscleBalance: Record<MuscleGroup, number>;  // 0-100 per group
  trainingStyle: {
    strength: number;     // 0-100
    volume: number;       // 0-100
    endurance: number;    // 0-100
  };
  topExercises: string[];     // Top 5 most-trained exercises
  liftPreferences: string[];  // "compound-heavy" | "isolation-focused" etc.
  totalDataPoints: number;    // Workouts used to generate
};
```

**Rendering:**
- SVG-based visualization for crisp scaling
- Animated transitions when data updates
- Export as PNG for sharing (if needed)
- Blur effect using native blur component for premium gating

**Generation:**
- Recalculated daily or on-demand
- Cached locally, synced to backend
- Requires minimum workout history to generate meaningful DNA

---

## UI Design

**DNA on Profile:**
- Large card taking prominent position on profile screen
- Animated on first view (draws itself)
- Tap to expand to full-screen detail view
- "Share DNA" button (shares to feed as image)

**Full DNA View:**
- Muscle balance visualization (radar chart or organic shape)
- Training style breakdown (strength/volume/endurance bars)
- Top exercises list
- Historical timeline (premium, blurred for free)
- "Unlock Full DNA" CTA for free users

**Blur UX:**
- Gaussian blur over premium sections
- Semi-transparent "PRO" badge overlay
- Tap blurred section → shows upgrade prompt
- Just enough visible to be enticing

---

## Dependencies

- Workout history data (workoutStore)
- Exercise-to-muscle-group mapping (exercises.ts)
- Subscription status (for blur gating)
- Backend sync (DNA stored server-side)

---

## Priority

**P0 (Launch):**
- Basic DNA visualization (muscle balance + training style)
- Profile display
- Premium blur mechanic

**P1 (Post-Launch):**
- Historical comparison
- User average comparison
- Share to feed
