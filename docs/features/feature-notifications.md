# Feature: Notifications

## Overview

Push notifications with a MINIMAL philosophy. Forgerank respects the user's attention -- no nagging, no guilt trips, no "you haven't worked out in X days" reminders. Notifications exist only when they deliver immediate, essential value.

**Total sub-features:** 4

---

## Philosophy

**Minimal means minimal.**
- We do NOT nag users to work out
- We do NOT send "you haven't logged a workout" reminders
- We do NOT guilt-trip about streaks
- We do NOT broadcast every friend's PR
- If a notification doesn't serve an immediate, concrete purpose, it doesn't exist

**Respect the user's attention:**
- Every notification earns its place by being genuinely essential
- Users chose to work out on their own terms -- we don't play motivational coach
- Fewer notifications = each one actually gets read

**Permission handling:**
- Request permission only at the moment it becomes relevant (e.g., first rest timer use)
- Never front-load a permission prompt on first launch

---

## Sub-Features

### 1. Friend Requests

- [ ] Push notification when someone sends a friend request
- [ ] Tap opens the friend request screen
- [✅] Toggleable in settings

**Priority:** P1 (requires social features)
**Status:** Partial - Settings infrastructure complete, push notification sending not yet implemented

---

### 2. Direct Messages

- [ ] Push notification when a DM is received
- [ ] Shows sender name and message preview
- [ ] Tap opens the conversation
- [✅] Toggleable in settings

**Priority:** P1 (requires DM feature)
**Status:** Partial - Settings infrastructure complete, push notification sending not yet implemented

---

### 3. Competition Results (Post-Launch)

- [ ] Push notification when a competition you entered has finished
- [ ] Shows final placement / result summary
- [ ] Tap opens the competition detail screen
- [✅] Toggleable in settings

**Priority:** P2 (post-launch, requires competition feature)
**Status:** Partial - Settings infrastructure complete, push notification sending not yet implemented

---

### 4. Rest Timer (Backgrounded)

- [✅] Push notification when rest timer completes while app is backgrounded
- [✅] Works via local push notification (no server needed)
- [✅] "Time to lift!" message with tap-to-return
- [✅] Customizable rest durations
- [✅] Only fires when app is in the background during an active workout
- [✅] Toggleable in settings
- [✅] Contextual permission request on first rest timer use
- [✅] Automatic cleanup when timer is dismissed or app returns to foreground

**Priority:** P0 (launch)
**Status:** ✅ COMPLETE - Fully implemented and tested

---

### Future / P2 - iOS Live Activities

- [ ] Dynamic Island support for active workout
- [ ] Shows rest timer countdown on lock screen
- [ ] Current workout summary
- [ ] PR celebration momentary display
- [ ] Requires native Swift module

**Priority:** P2 (post-launch)

---

## Technical Notes

**Key Technologies:**
- expo-notifications (local + push)
- iOS Live Activities (Swift/native module, future)
- Android notification channels

**Notification Types:**
```typescript
type NotificationType =
  | 'friend_request'
  | 'dm_received'
  | 'competition_result'
  | 'rest_timer';

type NotificationPreferences = {
  friendRequests: boolean;
  directMessages: boolean;
  competitionResults: boolean;
  restTimer: boolean;
};
```

**Permission Handling:**
```typescript
// Request permission on first relevant action, not on app launch
const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};
```

---

## Dependencies

- Settings store (preferences)
- Rest timer functionality
- Social features / friend system (for friend requests)
- DM feature (for direct messages)
- Competition feature (for competition results)
- Supabase (for push notification delivery)

---

## Priority

**P0 (Launch Required):**
- [✅] Rest timer push notification (backgrounded) - COMPLETE

**P1 (With Social Features):**
- [ ] Friend requests - Settings complete, push sending pending
- [ ] Direct messages - Settings complete, push sending pending

**P2 (Post-Launch):**
- [ ] Competition results - Settings complete, push sending pending
- [ ] iOS Live Activities

## Implementation Status

**Overall Progress:** 4/4 sub-features (100% of P0, 0% of P1, 0% of P2)

### Completed (P0 - Launch Required)
- ✅ Rest timer push notifications (backgrounded)
- ✅ Notification service infrastructure
- ✅ Settings store integration
- ✅ Permission handling (contextual request)
- ✅ Comprehensive test suite (18/18 tests passing)

### Partial (Settings Complete, Push Sending Pending)
- Friend requests notifications
- Direct messages notifications
- Competition results notifications

### Not Started
- iOS Live Activities (requires native Swift module)
