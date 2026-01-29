# Feature: Forge Milestones

## Overview
Non-repeatable lifetime achievements with tiered rarity. Prestige markers that show long-term dedication. Displayed as trophies on profile with special visual treatment by rarity.

**Status:** Planned | **Progress:** 0/5 features
**Priority:** Launch (v1)
**Source:** 2026-01-29 brainstorm interview

---

## Sub-Features

### Planned - Common Tier Milestones
- [ ] First workout completed
- [ ] 10 workouts logged
- [ ] First PR achieved
- [ ] First rank-up
- [ ] 7-day streak
- [ ] 5 different exercises logged
- [ ] First workout shared to feed

**Visual:** Standard badge, subtle border

---

### Planned - Rare Tier Milestones
- [ ] 100 workouts logged
- [ ] 30-day streak
- [ ] 5 exercises ranked (any tier)
- [ ] 50 PRs achieved
- [ ] 10 different exercises logged
- [ ] Level 10 reached
- [ ] 1,000 total sets logged

**Visual:** Blue/purple tint, slight glow

---

### Planned - Epic Tier Milestones
- [ ] 1000lb club (squat + bench + deadlift total)
- [ ] All exercises ranked Silver or above
- [ ] Year-long streak (365 days)
- [ ] 500 workouts logged
- [ ] 100 PRs achieved
- [ ] 3 exercises ranked Gold or above
- [ ] Level 25 reached
- [ ] 10,000 total sets logged

**Visual:** Gold/orange glow, animated border

---

### Planned - Legendary Tier Milestones
- [ ] All exercises ranked Gold or above
- [ ] 2-year streak
- [ ] 1,000 workouts logged
- [ ] Any exercise ranked Diamond
- [ ] Any exercise ranked Mythic
- [ ] 500 PRs achieved
- [ ] Level 50 reached

**Visual:** Prismatic/rainbow glow, particle effects, special animation on profile

**Design principle:** Legendary milestones should be genuinely hard. Top 1% of users. Seeing one on someone's profile should be impressive.

---

### Planned - Trophy Case on Profile
- [ ] Dedicated section on user profile
- [ ] Grid layout of earned milestones
- [ ] Rarity-based visual treatment (border color, glow, animation)
- [ ] Locked milestones shown as silhouettes with progress
- [ ] Tap milestone to see details + date earned
- [ ] Total milestone count displayed
- [ ] Rarity breakdown (X common, Y rare, Z epic, W legendary)

---

## Technical Notes

**Data Model:**
```typescript
type Milestone = {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  condition: MilestoneCondition;
};

type MilestoneCondition = {
  type: 'workouts' | 'streak' | 'prs' | 'rank' | 'level' | 'sets' | 'club' | 'custom';
  threshold: number;
  exerciseId?: string;  // For exercise-specific milestones
};

type EarnedMilestone = {
  milestoneId: string;
  userId: string;
  earnedAt: number;     // timestamp ms
};
```

**Checking Logic:**
- Check milestone conditions after each workout completion
- Batch check: don't check every milestone on every set
- Cache earned milestones locally
- Sync to backend for persistence

**Database:**
```sql
CREATE TABLE user_milestones (
  user_id UUID REFERENCES users(id),
  milestone_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, milestone_id)
);
```

---

## UI Design

**Trophy Case on Profile:**
- Section header: "Milestones" with count badge
- Grid of circular/square badges
- Earned: full color with rarity border
- Unearned: greyed out silhouette with progress bar
- Tap: detail modal with name, description, date earned, rarity

**Milestone Earned Toast:**
- Pop-up notification when milestone is achieved
- Rarity-appropriate animation (simple for common, epic for legendary)
- Sound effect per rarity tier
- "View" button to go to trophy case

**Rarity Colors:**
- Common: white/silver border
- Rare: blue/purple glow
- Epic: gold/orange animated glow
- Legendary: prismatic/rainbow with particle effects

---

## Dependencies

- Workout history (for checking conditions)
- Streak system (gamificationStore)
- Rank system (forgerankScoring)
- XP/level system (gamificationStore)
- Backend sync (persistence)

---

## Priority

**P0 (Launch):**
- Common + Rare milestones defined
- Basic trophy case on profile
- Milestone earned toast

**P1 (Launch Polish):**
- Epic + Legendary milestones
- Rarity-based visual effects
- Progress indicators on locked milestones

**P2 (Post-Launch):**
- Hidden/secret milestones
- Milestone sharing to feed
