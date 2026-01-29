# FORGERANK FEATURE MASTER

**Last Updated:** 2026-01-29
**Version:** v0.1 (Pre-launch)

---

## Quick Summary

| Feature Group | Status | Progress | Details |
|---------------|--------|----------|---------|
| [Workout Core](#workout-core) | In Progress | 8/20 | [Details](features/feature-workouts.md) |
| [Workout Logging UX](#workout-logging-ux) | **Done** | 10/10 | [Details](features/feature-workout-logging-ux.md) |
| [Exercise Library](#exercise-library) | Done | 3/3 | [Details](features/feature-exercises.md) |
| [Scoring & Ranks](#scoring--ranks) | Done | 5/5 | [Details](features/feature-scoring.md) |
| [Cue System (Gym Buddy)](#cue-system-gym-buddy) | Planned | 1/10 | [Details](features/feature-cue-system.md) |
| [Body Model](#body-model) | Planned | 0/5 | [Details](features/feature-body-model.md) |
| [Authentication](#authentication) | In Progress | 7/10 | [Details](features/feature-auth.md) |
| [Social & Feed](#social--feed) | In Progress | 9/15 | [Details](features/feature-social.md) |
| [Leaderboards](#leaderboards) | Planned | 0/4 | [Details](features/feature-leaderboards.md) |
| [Gamification](#gamification) | **Done** | **12/12** | [Details](features/feature-gamification.md) |
| [Notifications](#notifications) | Planned | 0/5 | [Details](features/feature-notifications.md) |
| [UI & Design](#ui--design) | In Progress | 8/15 | [Details](features/feature-ui.md) |
| [Backend & Sync](#backend--sync) | In Progress | 9/10 | [Details](features/feature-backend.md) |
| [Integrations](#integrations) | Planned | 0/4 | [Details](features/feature-integrations.md) |
| [Onboarding](#onboarding) | In Progress | 3/5 | [Details](features/feature-onboarding.md) |

**Total:** 72/133 features (54%)

---

## Core Differentiators

These features set Forgerank apart from competitors:

1. **Forgerank Scoring** - Static, verified standards (not user-inflated)
2. **Cue System** - Gym buddy with personality (text + audio)
3. **Aesthetic** - Pure-inspired dark, mysterious UI
4. **Social Loop** - Built for lifters, not general fitness

---

## Workout Core
**Status:** In Progress | **Progress:** 8/20 features

The core workout logging and tracking experience.

- Live workout session with set logging
- Exercise selection from library
- Rest timer (basic)
- Workout history storage
- Session persistence (survives app close)
- Routine builder (basic)
- Premade plan browser
- Calendar view (basic)

**Next Up:** Routine-based workout flow, input polish, rest timer enhancements

---

## Workout Logging UX
**Status:** Done | **Progress:** 10/10 features

The visual interface for logging sets - complete redesign (Fitbod/Liftoff style).

**Completed:**
- ✅ Add Exercise button (prominent, with dashed border)
- ✅ Exercise cards with collapsible header
- ✅ Set lines with weight/reps inputs and checkmark
- ✅ Empty state component
- ✅ Smart defaults (auto-fill from previous set)
- ✅ Keyboard handling (number pad, focus management)
- ✅ Editing state management (workoutEditingStore)
- ✅ Exercise reordering (drag-to-reorder with DraggableExerciseList)
- ✅ PR detection integration
- ✅ Haptic feedback
- ✅ Set completion flow with logging
- ✅ Exercise removal with confirmation dialog
- ✅ Settings toggle (useNewWorkoutUX)
- ✅ NewWorkoutSection wrapper for integration
- ✅ Integration into live-workout.tsx with UXToggle button
- ✅ Rest timer integration

**Optional Enhancements (Future):**
- Swipe-to-remove gesture
- Smooth drag animations
- Additional polish/feedback

**Bugs Fixed:**
- BUG-LOG-001: Duplicate set logging flows ✅
- BUG-LOG-002: "Mark Done" is backwards ✅
- BUG-LOG-005: Auto-focus issues ✅
- BUG-LOG-007: No indication of current exercise ✅

---

## Exercise Library
**Status:** Done | **Progress:** 3/3 features

Static exercise database with metadata.

- 50+ exercises defined with IDs and display names
- Muscle group assignments
- Exercise categorization (compound/isolation)

---

## Scoring & Ranks
**Status:** Done | **Progress:** 5/5 features

The Forgerank scoring algorithm - core differentiator.

- 0-1000 score calculation (e1RM-based)
- 7 tiers: Iron, Bronze, Silver, Gold, Platinum, Diamond, Mythic
- 20 ranks per exercise
- Verified top standards (rankTops.ts)
- Anti-cheat heuristics

---

## Cue System (Gym Buddy)
**Status:** Planned | **Progress:** 1/10 features

The app's personality - what makes it feel alive.

- Basic PR detection cues (implemented)

**Planned:**
- Customizable gym buddy personalities (3-5 at launch)
- Text-based encouragement
- Audio voice packs (optional)
- Contextual cues (knows your state)
- PR celebration reactions
- Rank-up celebrations
- Streak milestone reactions
- Personality store integration

---

## Body Model
**Status:** Planned | **Progress:** 0/5 features

Visual muscle representation for engagement.

**Planned:**
- Detailed muscle subdivisions (upper chest, rear delts, etc.)
- Volume-based coloring (gradient based on sets)
- Primary/secondary/tertiary muscle mapping per exercise
- Default post image (if no photo uploaded)
- Interactive body stats screen

---

## Authentication
**Status:** In Progress | **Progress:** 7/10 features

User accounts and authentication.

**Completed:**
- Login screen UI with email/password
- Signup screen UI with email/password/name
- Supabase Auth integration (working)
- Auth state management (Zustand)
- Google OAuth flow (implemented)
- Deep link handling for OAuth callbacks
- Dev login for quick testing (DEV mode)
- User profile editing (display name, avatar)
- Avatar upload/remove functionality
- Keyboard-aware scroll views for auth screens

**Remaining:**
- Apple Sign In setup
- Password reset flow
- Email verification UI
- Protected routes implementation
- Account deletion flow

---

## Social & Feed
**Status:** In Progress | **Progress:** 9/15 features

Social features for community engagement.

**Completed:**
- Feed screen UI with pull-to-refresh
- Friends list screen UI
- Post creation screen
- Direct messaging screen
- Social data models (Post, Reaction, Comment, Friendship)
- Social stores (social, feed, friends, chat)
- Database schema designed (8 tables)
- Row Level Security policies
- Backend sync system (4-week rollout complete)
- Real-time subscriptions via Supabase
- Offline mutation queuing
- Conflict resolution strategies
- User discovery/search functionality
- Sync status indicators
- Feed and friends screens connected to sync data

**Planned:**
- Global + Friends feed tabs
- Workout posts with stats
- Optional photo upload
- Body model default image
- Rank badges on posts
- Reactions (quick emotes)
- Comments
- Friend request notifications
- User profile pages
- Content moderation (report + block)

---

## Leaderboards
**Status:** Planned | **Progress:** 0/4 features

Competition among friends.

**Planned:**
- Per-exercise leaderboard (among friends)
- Overall Forgerank leaderboard
- Volume/consistency leaderboard
- User level leaderboard

---

## Gamification
**Status:** Done | **Progress:** 12/12 features

XP, levels, streaks, currency, and cosmetics.

**Completed:**
- XP system (separate from Forgerank)
- User levels with visual XP bar
- Streak system (5-day break threshold)
- XP calculation from workouts
- Currency (forge tokens)
- Level-up modal with animation
- Stats and ranks card component
- Gamification store with sync integration
- Backend sync for gamification data
- Streak calendar (GitHub-style)
- Streak milestone celebrations with modal
- Cosmetic store UI (shop.tsx)
- Achievements/badges display component

**Planned:**
- Streak color progression
- Voice pack audio options
- Profile frame rendering on posts

---

## Notifications
**Status:** Planned | **Progress:** 0/5 features

Push notifications and reminders.

**Planned:**
- Rest timer finished (push notification)
- Streak warnings (before it breaks)
- Rest day reminders (configurable)
- iOS Live Activities widget (dynamic island)
- Minimal/opt-in approach (don't be annoying)

---

## UI & Design
**Status:** In Progress | **Progress:** 8/15 features

Visual design and polish - Pure-inspired aesthetic.

**Completed:**
- Dark theme foundation
- Design system tokens (colors, spacing, typography)
- Accent color themes (toxic, electric, ember, ice)
- Tab navigation
- Basic screen layouts
- Error boundaries
- PR celebration animations (4-tier system, 60 celebrations)
- Sound effects integration
- Haptic feedback patterns
- Sync status indicators
- Keyboard-aware scroll view component
- User profile editing screen

**Planned:**
- Rank-up animations with sound
- Dark gradients
- Bold typography refinement
- Minimal UI chrome
- Punchy animations throughout
- Skeleton screens
- Pull-to-refresh
- Empty states
- Onboarding screens

---

## Backend & Sync
**Status:** In Progress | **Progress:** 9/10 features

Supabase backend integration.

**Completed:**
- Supabase client configured
- Database schema designed (9 tables with user search)
- Row Level Security policies
- TypeScript types (100% coverage)
- Complete backend sync system (5 phases):
  - Phase 1: Core Infrastructure (SyncOrchestrator, NetworkMonitor, repositories)
  - Phase 2: Store Integration (workout, routines, plans)
  - Phase 3: Social Sync (friends, social, feed)
  - Phase 4: Chat Sync (typing indicators)
  - Phase 5: Utility Hooks (useSyncStatus, useSyncState)
- Offline mutation queuing
- Conflict resolution strategies
- Real-time subscriptions (feed, friends, chat)
- File storage (avatar uploads)

**Remaining:**
- Data migration script (local to cloud)
- Apply user search migration to production

---

## Integrations
**Status:** Planned | **Progress:** 0/4 features

Third-party app connections.

**Planned:**
- Apple Health (weight, BMI import)
- Fitbit (weight, BMI import)
- Spotify integration (workout music controls)
- Apple Music integration

---

## Onboarding
**Status:** Planned | **Progress:** 0/5 features

First-time user experience.

**Planned:**
- Quick profile setup (name, bodyweight, experience level)
- Personality picker (choose gym buddy)
- Personality preview
- Guided first workout
- Ranking system introduction

---

## Legend

| Status | Meaning |
|--------|---------|
| Done | Feature complete and working |
| In Progress | Actively being developed |
| Planned | Designed but not started |

---

## Development Phases

### Phase 0: Stabilization (Current - Near Complete)
- ✅ Fix existing bugs
- ✅ Complete Zustand migration
- ✅ Add error handling
- ✅ Implement authentication
- ✅ Build backend sync system

### Phase 1: Core Workout Polish (Month 1-2)
- Routine-based workout flow
- Set input improvements
- Rest timer enhancements
- Protected routes

### Phase 2: Social Features (Month 2-3)
- Full feed implementation
- Reactions system
- User profiles
- Content moderation

### Phase 3: Personality & Cosmetics (Month 3-4)
- Cue system with multiple personalities
- Cosmetic store
- Currency system
- Body model with muscle coloring

### Phase 4: Launch Polish
- Onboarding
- Visual polish
- Performance optimization
- Integrations

**v1 Launch Target:** 3+ months

---

## Business Model Summary

### Free Tier
- Full workout logging
- Forgerank scoring and ranks
- Social feed + friends + reactions
- Basic history/calendar
- Streak tracking
- Starter personalities
- CSV export

### Premium Tier (Yearly)
- Advanced analytics
- Body composition tracking
- Cloud sync + multi-device
- Web app access
- Early access to new features

### Cosmetic Store (No Pay-to-Win)
- Themes/color schemes
- Voice packs/personalities
- Card skins
- Profile customization

---

*See individual feature files in `docs/features/` for detailed breakdowns.*
*See `docs/MASTER_PLAN.md` for full vision and strategy.*
