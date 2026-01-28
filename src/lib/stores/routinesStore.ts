// src/lib/stores/routinesStore.ts
// Zustand store for user routines with AsyncStorage persistence and Supabase sync
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createQueuedJSONStorage } from "./storage/createQueuedAsyncStorage";
import type { Routine } from "../routinesModel";
import type { SyncMetadata } from "../sync/syncTypes";
import { useMemo } from "react";
import { getUser } from "./authStore";
import { routineRepository } from "../sync/repositories/routineRepository";
import { networkMonitor } from "../sync/NetworkMonitor";
import { resolveRoutineConflict } from "../sync/ConflictResolver";

const STORAGE_KEY = "routines.v2"; // New key for Zustand version

interface RoutinesState {
  routines: Routine[];
  hydrated: boolean;
  _sync: SyncMetadata;

  // Actions
  upsertRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  clearRoutines: () => void;
  setHydrated: (value: boolean) => void;

  // Sync actions
  pullFromServer: () => Promise<void>;
  pushToServer: () => Promise<void>;
  sync: () => Promise<void>;
}

export const useRoutinesStore = create<RoutinesState>()(
  persist(
    (set, get) => ({
      routines: [],
      hydrated: false,
      _sync: {
        lastSyncAt: null,
        lastSyncHash: null,
        syncStatus: 'idle',
        syncError: null,
        pendingMutations: 0,
      },

      upsertRoutine: (routine) =>
        set((state) => {
          const idx = state.routines.findIndex((r) => r.id === routine.id);
          if (idx >= 0) {
            const updated = [...state.routines];
            updated[idx] = routine;
            return { routines: updated };
          }
          return { routines: [routine, ...state.routines] };
        }),

      deleteRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        })),

      clearRoutines: () => set({ routines: [] }),

      setHydrated: (value) => set({ hydrated: value }),

      // Sync actions
      pullFromServer: async () => {
        const user = getUser();
        if (!user) {
          console.warn('[routinesStore] Cannot pull: no user signed in');
          return;
        }

        set({ _sync: { ...get()._sync, syncStatus: 'syncing', syncError: null } });

        try {
          const remoteRoutines = await routineRepository.fetchAll(user.id);

          // Merge with local routines using conflict resolution
          const localRoutines = get().routines;
          const mergedRoutines = mergeRoutines(localRoutines, remoteRoutines);

          set({
            routines: mergedRoutines,
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
          console.warn('[routinesStore] Cannot push: no user signed in');
          return;
        }

        if (!networkMonitor.isOnline()) {
          console.warn('[routinesStore] Cannot push: offline');
          return;
        }

        try {
          const routines = get().routines;
          await routineRepository.syncUp(routines, user.id);

          set({
            _sync: {
              ...get()._sync,
              pendingMutations: 0,
            },
          });
        } catch (error) {
          console.error('[routinesStore] Push failed:', error);
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
      partialize: (state) => ({ routines: state.routines }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Convenience selectors
export const selectRoutines = (state: RoutinesState) =>
  state.routines.slice().sort((a, b) => b.updatedAtMs - a.updatedAtMs);

export const selectRoutineById = (id: string) => (state: RoutinesState) =>
  state.routines.find((r) => r.id === id);

// Hook for accessing routines (matches old API)
export function useRoutines(): Routine[] {
  const routines = useRoutinesStore((state) => state.routines);
  // Use useMemo to cache the sorted array and prevent infinite loop
  return useMemo(
    () => routines.slice().sort((a, b) => b.updatedAtMs - a.updatedAtMs),
    [routines]
  );
}

export function useRoutine(id: string): Routine | undefined {
  return useRoutinesStore(selectRoutineById(id));
}

// Imperative getters for non-React code
export function getRoutines(): Routine[] {
  return useRoutinesStore.getState().routines.slice().sort((a, b) => b.updatedAtMs - a.updatedAtMs);
}

export function getRoutineById(id: string): Routine | undefined {
  return useRoutinesStore.getState().routines.find((r) => r.id === id);
}

// Imperative actions for non-React code
export function upsertRoutine(routine: Routine): void {
  useRoutinesStore.getState().upsertRoutine(routine);
}

export function deleteRoutine(id: string): void {
  useRoutinesStore.getState().deleteRoutine(id);
}

export function clearRoutines(): void {
  useRoutinesStore.getState().clearRoutines();
}

// ============================================================================
// Sync Helpers
// ============================================================================

/**
 * Merge local and remote routines with conflict resolution
 */
function mergeRoutines(
  local: Routine[],
  remote: Routine[]
): Routine[] {
  const routineMap = new Map<string, Routine>();

  // Add all remote routines
  for (const routine of remote) {
    routineMap.set(routine.id, routine);
  }

  // Merge local routines
  for (const localRoutine of local) {
    const remoteRoutine = routineMap.get(localRoutine.id);

    if (!remoteRoutine) {
      // New local routine - add it
      routineMap.set(localRoutine.id, localRoutine);
    } else {
      // Conflict - resolve using conflict resolver
      const result = resolveRoutineConflict(localRoutine, remoteRoutine);
      routineMap.set(localRoutine.id, result.merged ?? remoteRoutine);
    }
  }

  // Return sorted by updatedAtMs descending
  return Array.from(routineMap.values()).sort(
    (a, b) => b.updatedAtMs - a.updatedAtMs
  );
}

/**
 * Get sync status for routines store
 */
export function getRoutinesSyncStatus(): SyncMetadata {
  return useRoutinesStore.getState()._sync;
}
