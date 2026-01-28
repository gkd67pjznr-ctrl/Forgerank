// src/lib/stores/middleware/syncMiddleware.ts
// Zustand middleware for automatic backend synchronization

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';
import type {
  StoreConfig,
  SyncMetadata,
  PendingMutation,
  ConflictStrategy,
} from '../../sync/syncTypes';
import { syncOrchestrator } from '../../sync/SyncOrchestrator';
import { pendingOperationsQueue } from '../../sync/PendingOperationsQueue';
import { networkMonitor } from '../../sync/NetworkMonitor';
import { getUser } from '../authStore';

// Type for the middleware
type Write<T, U> = Omit<T, keyof U> & U;
type Cast<T, U> = T extends U ? T : U;

type SyncImpl = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StoreConfig<T>,
  conflictResolver?: (local: T, remote: T) => T
) => (
  f: StateCreator<T, Mps, []>
) => StateCreator<Write<T, SyncState>, Mcs, [['zustand/sync', never]]>;

type WithSync<S> = S extends { getState: () => infer T }
  ? T extends object
    ? Write<T, SyncState>
    : never
  : never;

interface SyncState {
  _sync: SyncMetadata;
}

declare module 'zustand' {
  interface StoreMutators<S, A> {
    'zustand/sync': WithSync<S>;
  }
}

type Sync = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StoreConfig<T>,
  conflictResolver?: (local: T, remote: T) => T
) => (
  f: StateCreator<T, [...Mps, ['zustand/sync', never]], []>
) => StateCreator<T, Mps, Mcs>;

/**
 * Create sync middleware for a Zustand store
 *
 * @param config Store configuration
 * @param conflictResolver Optional conflict resolution function
 * @returns Zustand middleware
 *
 * @example
 * ```ts
 * export const useWorkoutStore = create<WorkoutState>()(
 *   syncMiddleware({ storeName: 'workout', tableName: 'workouts' })(
 *     persist(
 *       (set, get) => ({
 *         sessions: [],
 *         addSession: (session) => set({ sessions: [session, ...get().sessions] }),
 *       }),
 *       { name: 'workouts.v2' }
 *     )
 *   )
 * );
 * ```
 */
export function createSyncMiddleware<T extends object>(
  config: StoreConfig<T>,
  conflictResolver?: (local: T, remote: T) => T
): (
  f: StateCreator<T, [], []>
) => StateCreator<Write<T, SyncState>, [], []> {
  return (configObj) => (set, get, api) => {
    // Initialize sync metadata
    const initialState: SyncState = {
      _sync: {
        lastSyncAt: null,
        lastSyncHash: null,
        syncStatus: 'idle',
        syncError: null,
        pendingMutations: 0,
      },
    };

    // Create the original store
    const store = configObj((partial, replace) => {
      // Intercept mutations to queue for sync
      const originalSet = set as (partial: unknown, replace?: boolean) => void;

      // Wrap set to track mutations
      const syncSet = (partial: unknown, replace?: boolean) => {
        // Apply the update
        originalSet(partial, replace);

        // Queue for sync if enabled and online
        if (config.syncEnabled && networkMonitor.isOnline()) {
          queueMutation(partial);
        }
      };

      // Call original set with wrapped version
      originalSet(partial, replace);
    }, get, api);

    // Initialize sync state
    set(initialState as never);

    // Register with sync orchestrator
    syncOrchestrator.registerStore({
      name: config.storeName,
      enabled: config.syncEnabled,
      requireAuth: true,
      syncOnSignIn: true,
      pull: async () => {
        await pullFromServer();
      },
      push: async () => {
        await pushToServer();
      },
    });

    // Return the store with sync methods
    return {
      ...store,
      ...createSyncMethods(config, conflictResolver),
    } as Write<T, SyncState>;
  };
}

/**
 * Create sync methods for the store
 */
function createSyncMethods<T extends object>(
  config: StoreConfig<T>,
  conflictResolver?: (local: T, remote: T) => T
) {
  return {
    /**
     * Pull latest data from server
     */
    async pull(): Promise<void> {
      if (!config.syncEnabled) return;

      const userId = getUser()?.id;
      if (!userId) {
        console.warn(`[${config.storeName}] Cannot pull: no user signed in`);
        return;
      }

      this._sync.syncStatus = 'syncing';
      this._sync.syncError = null;

      try {
        // Fetch from server using repository
        // This will be implemented by each specific store
        // The middleware provides the hook, store implements the actual fetch

        this._sync.lastSyncAt = Date.now();
        this._sync.syncStatus = 'success';
      } catch (error) {
        this._sync.syncStatus = 'error';
        this._sync.syncError = error instanceof Error ? error.message : String(error);
        throw error;
      }
    },

    /**
     * Push local changes to server
     */
    async push(): Promise<void> {
      if (!config.syncEnabled) return;

      const userId = getUser()?.id;
      if (!userId) {
        console.warn(`[${config.storeName}] Cannot push: no user signed in`);
        return;
      }

      try {
        // Push pending mutations to server
        // This will be implemented by each specific store

        this._sync.pendingMutations = 0;
      } catch (error) {
        console.error(`[${config.storeName}] Push failed:`, error);
        throw error;
      }
    },

    /**
     * Manual sync trigger
     */
    async sync(): Promise<void> {
      await this.pull();
      await this.push();
    },

    /**
     * Get sync status
     */
    getSyncStatus(): SyncMetadata {
      return this._sync;
    },
  };
}

/**
 * Queue a mutation for sync
 */
function queueMutation(partial: unknown): void {
  // This will be called automatically when state changes
  // The actual implementation will be store-specific
}

/**
 * Pull data from server (to be implemented by stores)
 */
async function pullFromServer(): Promise<void> {
  // Placeholder - each store will implement this
}

/**
 * Push data to server (to be implemented by stores)
 */
async function pushToServer(): Promise<void> {
  // Placeholder - each store will implement this
}

// Re-export types
export type { SyncMetadata, ConflictStrategy };
