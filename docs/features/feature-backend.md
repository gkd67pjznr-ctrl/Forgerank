# Feature: Backend & Sync

## Overview
Supabase backend integration for data persistence, cloud sync, and real-time features.

---

## Sub-Features

### Done - Supabase Client
- [x] Supabase JS client installed
- [x] Client initialization
- [x] Environment variables configured
- [x] Health check function

**Implementation:** `src/lib/supabase/client.ts`

### Done - Database Schema
- [x] Users table
- [x] Workouts table
- [x] Routines table
- [x] Friendships table
- [x] Posts table
- [x] Reactions table
- [x] Comments table
- [x] Notifications table
- [x] Appropriate indexes

**Implementation:** `supabase/migrations/001_initial_schema.sql`

### Done - Row Level Security
- [x] RLS enabled on all tables
- [x] User data isolation
- [x] Friend-based access control
- [x] Privacy level enforcement

**Implementation:** `supabase/migrations/002_enhanced_rls_policies.sql`

---

### Scaffolded - TypeScript Types
- [x] Database types generated
- [x] Mapper functions
- [x] Type tests (100% coverage)

**Implementation:** `src/lib/supabase/types.ts`

---

### Done - Cloud Sync Infrastructure
- [x] SyncOrchestrator - main coordinator for all sync operations
- [x] Workout repository with sync
- [x] Routine repository with sync
- [x] Post repository with sync
- [x] Friends repository with sync
- [x] Comments/reactions repositories
- [ ] Settings sync (not yet implemented)

**Implementation:** `src/lib/sync/SyncOrchestrator.ts`, `src/lib/sync/repositories/`

### Done - Offline Queue
- [x] PendingOperationsQueue for offline changes
- [x] Persist queue to AsyncStorage
- [x] Flush on reconnect
- [x] Retry logic with exponential backoff

**Implementation:** `src/lib/sync/PendingOperationsQueue.ts`

### Done - Conflict Resolution
- [x] ConflictResolver with strategies
- [x] Last-write-wins strategy
- [x] Timestamp comparison
- [x] Merge logic for complex data

**Implementation:** `src/lib/sync/ConflictResolver.ts`

### Done - Sync Status
- [x] useSyncStatus hook
- [x] Syncing indicator support
- [x] Sync error tracking
- [ ] Manual sync button UI
- [ ] Last synced timestamp display

**Implementation:** `src/lib/hooks/useSyncStatus.ts`

### Planned - Data Migration
- [ ] Local to cloud migration
- [ ] v1 to v2 data format
- [ ] Import from other apps

### Done - Real-time Subscriptions
- [x] RealtimeManager for subscriptions
- [x] Feed updates
- [x] Friend requests
- [x] Reactions
- [x] Comments
- [x] NetworkMonitor for connectivity

**Implementation:** `src/lib/sync/RealtimeManager.ts`, `src/lib/sync/NetworkMonitor.ts`

### Planned - File Storage
- [ ] Photo uploads for posts
- [ ] Avatar uploads
- [ ] Image optimization

---

## Technical Notes

**Key Files:**
- `src/lib/supabase/client.ts` - Supabase client
- `src/lib/supabase/types.ts` - TypeScript types
- `src/lib/sync/SyncOrchestrator.ts` - Main sync coordinator
- `src/lib/sync/PendingOperationsQueue.ts` - Offline queue
- `src/lib/sync/ConflictResolver.ts` - Conflict handling
- `src/lib/sync/RealtimeManager.ts` - Real-time subscriptions
- `src/lib/sync/NetworkMonitor.ts` - Connectivity detection
- `src/lib/sync/repositories/` - Entity-specific sync repos
- `supabase/migrations/` - SQL migrations
- `supabase/tests/` - RLS tests

**Environment Variables:**
```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Database Tables:**
| Table | Purpose | JSONB Columns |
|-------|---------|---------------|
| users | User profiles | - |
| workouts | Workout sessions | sets |
| routines | Saved routines | exercises |
| friendships | Friend relationships | - |
| posts | Social feed | workout_snapshot |
| reactions | Post reactions | - |
| comments | Post comments | - |
| notifications | User alerts | - |

**Sync Architecture (Planned):**
```
Local Store (Zustand)
    ↓
Sync Manager
    ↓
Offline Queue (AsyncStorage)
    ↓
Supabase (when online)
```

**Network Detection:**
```typescript
import NetInfo from '@react-native-community/netinfo';

NetInfo.addEventListener(state => {
  if (state.isConnected) {
    syncManager.flushQueue();
  }
});
```

---

## Documentation

- `docs/SUPABASE_SETUP.md` - Setup instructions
- `docs/OAUTH_SETUP.md` - OAuth configuration

---

## Dependencies

- Supabase project (created)
- Auth (for user identity)
- Network connectivity detection
