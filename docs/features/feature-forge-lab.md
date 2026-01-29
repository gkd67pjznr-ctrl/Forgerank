# Feature: Forge Lab (Analytics)

## Overview
Premium analytics dashboard for serious lifters. Deep training insights, trends, and data visualization. Weight graph is free; everything else is behind Pro subscription.

**Status:** Planned | **Progress:** 0/6 features
**Priority:** Launch (v1)
**Source:** 2026-01-29 brainstorm interview

---

## Sub-Features

### Planned - Weight Graph (FREE)
- [ ] Bodyweight trend over time
- [ ] Manual entry or imported from Apple Health
- [ ] Line chart with date range selector
- [ ] Goal weight line (optional)
- [ ] Available to all users — not behind paywall

---

### Planned - Strength Curves (PREMIUM)
- [ ] e1RM trend per exercise over time
- [ ] Line chart with date selector
- [ ] Compare multiple exercises on same chart
- [ ] Highlight PR dates on the curve
- [ ] Show rank tier thresholds as horizontal lines

---

### Planned - Volume Trends (PREMIUM)
- [ ] Weekly/monthly total volume graphs
- [ ] Volume per muscle group breakdown
- [ ] Volume per exercise trend
- [ ] Compare periods (this week vs last week)
- [ ] Identify volume peaks and valleys

---

### Planned - Muscle Group Balance (PREMIUM)
- [ ] Heatmap or radar chart of volume distribution
- [ ] Identify undertrained muscle groups
- [ ] Recommended adjustments based on imbalances
- [ ] Tied to Forge DNA visualization
- [ ] Historical balance shifts over time

---

### Planned - Rank Progression Graphs (PREMIUM)
- [ ] Rank history per exercise (rank number over time)
- [ ] Score progression (0-1000 over time)
- [ ] Tier breakthrough markers
- [ ] Projected rank trajectory (based on recent trend)
- [ ] Multi-exercise rank comparison

---

### Planned - Integration Data Display (PREMIUM)
- [ ] Apple Health data (weight, BMI) displayed inline
- [ ] MyFitnessPal data (nutrition, macros) if integrated
- [ ] Whoop data (recovery, strain) if integrated
- [ ] Correlation insights (sleep vs performance, nutrition vs volume)
- [ ] Data import status and last sync time

---

## Technical Notes

**Data Sources:**
```typescript
type ForgeLabData = {
  weightHistory: { date: string; weightKg: number }[];
  exerciseStats: {
    exerciseId: string;
    e1rmHistory: { date: string; e1rm: number }[];
    volumeHistory: { week: string; volume: number }[];
    rankHistory: { date: string; rank: number; score: number }[];
  }[];
  muscleGroupVolume: {
    period: string;   // "2026-W04"
    groups: Record<MuscleGroup, number>;
  }[];
  integrationData?: {
    appleHealth?: { weight: number[]; sleep: number[] };
    whoop?: { recovery: number[]; strain: number[] };
    mfp?: { calories: number[]; protein: number[] };
  };
};
```

**Charting Library:**
- `react-native-chart-kit` or `victory-native` for charts
- Custom SVG for radar/heatmap visualizations
- Smooth animations on data load

**Premium Gating:**
- Weight graph: always visible, fully functional
- All other charts: show placeholder with blur + "Upgrade to Pro" CTA
- Demo data preview (show what the chart looks like with sample data)

---

## UI Design

**Forge Lab Screen:**
- Dashboard layout with scrollable cards
- Weight graph at top (always visible)
- Premium charts below with lock icons for free users
- Date range picker (1W, 1M, 3M, 6M, 1Y, ALL)
- Tab sections: Strength | Volume | Balance | Integrations

**Chart Cards:**
- Clean, minimal chart design (dark background, accent color lines)
- Tap to expand to full-screen detail view
- Swipe between exercises on strength curves
- Interactive tooltips on data points

---

## Dependencies

- Workout history (workoutStore)
- Rank/score data (forgerankScoring.ts)
- Settings (bodyweight for weight graph)
- Subscription status (premium gating)
- Integration APIs (Apple Health, MFP, Whoop — post-launch)

---

## Priority

**P0 (Launch):**
- Weight graph (free)
- Basic e1RM trends (premium)

**P1 (Launch Polish):**
- Volume trends
- Muscle group balance
- Rank progression

**P2 (Post-Launch):**
- Integration data display
- Correlation insights
