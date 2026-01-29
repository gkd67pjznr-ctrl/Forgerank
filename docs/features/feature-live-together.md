# Feature: Live Workout Together

## Overview
Real-time social workout experience — see friends working out, join shared sessions, or follow guided workouts led by a partner.

**Status:** Planned | **Progress:** 0/4 features
**Priority:** Post-launch v2
**Source:** 2026-01-29 brainstorm interview

---

## Sub-Features

### Planned - Passive Presence
- [ ] See which friends are currently working out
- [ ] Show what exercise they're on
- [ ] Send quick reactions/emotes mid-workout
- [ ] Presence indicator on friends list and hangout room
- [ ] Non-intrusive — just ambient awareness

---

### Planned - Shared Session
- [ ] Create a workout "room" that friends can join
- [ ] Everyone sees each other's sets in real-time
- [ ] Live feed of set completions
- [ ] Quick emote reactions to friends' sets
- [ ] Session summary for all participants at end

---

### Planned - Guided Partner Mode
- [ ] One person leads (picks exercises, sets, rest times)
- [ ] Others follow along with the leader's structure
- [ ] Leader sees followers' progress
- [ ] Like a virtual group class or personal training session
- [ ] Could enable online coaching delivery

---

### Planned - Quick Reactions
- [ ] Emote palette during live workout
- [ ] Reactions appear on workout screen (non-intrusive)
- [ ] Pre-set emotes: fire, flexing, clap, laugh, skull
- [ ] Disappear after a few seconds
- [ ] Haptic feedback on receive

---

## Technical Notes

**Real-Time Infrastructure:**
- Supabase Realtime channels for session state
- Presence tracking via Supabase Presence
- Optimize for low latency (sets appear within 1-2 seconds)

**Session Model:**
```typescript
type LiveSession = {
  id: string;
  hostId: string;
  mode: 'shared' | 'guided';
  participants: string[];
  startedAt: number;
  currentExercise?: string;
  isActive: boolean;
};

type LiveEvent = {
  sessionId: string;
  userId: string;
  type: 'set_completed' | 'exercise_changed' | 'reaction' | 'joined' | 'left';
  data: any;
  timestamp: number;
};
```

---

## Dependencies

- Backend real-time (Supabase Realtime)
- Friends system
- Active workout session (currentSessionStore)
- Notifications (invite to session)

---

## Priority

**P2 (Post-Launch v2):**
- Passive presence
- Quick reactions

**P3 (Future):**
- Shared session
- Guided partner mode
