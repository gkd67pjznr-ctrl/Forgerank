// src/lib/stores/workoutStore.ts
// Zustand store for workout sessions with AsyncStorage persistence and Supabase sync
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createQueuedJSONStorage } from "./storage/createQueuedAsyncStorage";
import type { WorkoutSession } from "../workoutModel";
import type { SyncMetadata } from "../sync/syncTypes";
import { getUser } from "./authStore";
import { workoutRepository } from "../sync/repositories/workoutRepository";
import { networkMonitor } from "../sync/NetworkMonitor";
import { resolveWorkoutConflict } from "../sync/ConflictResolver";

const STORAGE_KEY = "workoutSessions.v2"; // New key for Zustand version

interface WorkoutState {
  sessions: WorkoutSession[];
  hydrated: boolean;
  _sync: SyncMetadata;

  // Actions
  addSession: (session: WorkoutSession) => void;
  updateSession: (id: string, updates: Partial<WorkoutSession>) => void;
  removeSession: (id: string) => void;
  clearSessions: () => void;
  getSessionById: (id: string) => WorkoutSession | undefined;
  setHydrated: (value: boolean) => void;

  // Sync actions
  pullFromServer: () => Promise<void>;
  pushToServer: () => Promise<void>;
  sync: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      sessions: [],
      hydrated: false,
      _sync: {
        lastSyncAt: null,
        lastSyncHash: null,
        syncStatus: 'idle',
        syncError: null,
        pendingMutations: 0,
      },

      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
        })),

      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      removeSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),

      clearSessions: () => set({ sessions: [] }),

      getSessionById: (id) => get().sessions.find((s) => s.id === id),

      setHydrated: (value) => set({ hydrated: value }),

      // Sync actions
      pullFromServer: async () => {
        const user = getUser();
        if (!user) {
          console.warn('[workoutStore] Cannot pull: no user signed in');
          return;
        }

        set({ _sync: { ...get()._sync, syncStatus: 'syncing', syncError: null } });

        try {
          const remoteSessions = await workoutRepository.fetchAll(user.id);

          // Merge with local sessions using conflict resolution
          const localSessions = get().sessions;
          const mergedSessions = mergeSessions(localSessions, remoteSessions);

          set({
            sessions: mergedSessions,
            _sync: {
              ...get()._sync,
              syncStatus: 'success',
              lastSyncAt: Date.now(),
            },
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          set({
            _sync: {
              ...get()._sync,
              syncStatus: 'error',
              syncError: errorMessage,
            },
          });
          throw error;
        }
      },

      pushToServer: async () => {
        const user = getUser();
        if (!user) {
          console.warn('[workoutStore] Cannot push: no user signed in');
          return;
        }

        if (!networkMonitor.isOnline()) {
          console.warn('[workoutStore] Cannot push: offline');
          return;
        }

        try {
          const sessions = get().sessions;
          await workoutRepository.syncUp(sessions, user.id);

          set({
            _sync: {
              ...get()._sync,
              pendingMutations: 0,
            },
          });
        } catch (error) {
          console.error('[workoutStore] Push failed:', error);
          throw error;
        }
      },

      sync: async () => {
        await get().pullFromServer();
        await get().pushToServer();
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createQueuedJSONStorage(),
      partialize: (state) => ({ sessions: state.sessions }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Convenience selectors
export const selectWorkoutSessions = (state: WorkoutState) => state.sessions;
export const selectIsHydrated = (state: WorkoutState) => state.hydrated;

// Hook for accessing sessions (matches old API)
export function useWorkoutSessions(): WorkoutSession[] {
  return useWorkoutStore(selectWorkoutSessions);
}

// Imperative getters for non-React code
export function getWorkoutSessions(): WorkoutSession[] {
  return useWorkoutStore.getState().sessions;
}

export function getWorkoutSessionById(id: string): WorkoutSession | undefined {
  return useWorkoutStore.getState().getSessionById(id);
}

// Imperative actions for non-React code
export function addWorkoutSession(session: WorkoutSession): void {
  useWorkoutStore.getState().addSession(session);
}

export function clearWorkoutSessions(): void {
  useWorkoutStore.getState().clearSessions();
}

// ============================================================================
// Sync Helpers
// ============================================================================

/**
 * Merge local and remote workout sessions with conflict resolution
 */
function mergeSessions(
  local: WorkoutSession[],
  remote: WorkoutSession[]
): WorkoutSession[] {
  const sessionMap = new Map<string, WorkoutSession>();

  // Add all remote sessions
  for (const session of remote) {
    sessionMap.set(session.id, session);
  }

  // Merge local sessions
  for (const localSession of local) {
    const remoteSession = sessionMap.get(localSession.id);

    if (!remoteSession) {
      // New local session - add it
      sessionMap.set(localSession.id, localSession);
    } else {
      // Conflict - resolve using conflict resolver
      const result = resolveWorkoutConflict(localSession, remoteSession);
      sessionMap.set(localSession.id, result.merged ?? remoteSession);
    }
  }

  // Return sorted by startedAtMs descending
  return Array.from(sessionMap.values()).sort(
    (a, b) => b.startedAtMs - a.startedAtMs
  );
}

/**
 * Get sync status for workout store
 */
export function getWorkoutSyncStatus(): SyncMetadata {
  return useWorkoutStore.getState()._sync;
}
