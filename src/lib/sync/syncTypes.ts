// src/lib/sync/syncTypes.ts
// Core types for backend synchronization system

/**
 * Sync status for each store
 */
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

/**
 * Pending mutation queued for sync
 */
export type PendingMutation<T = unknown> = {
  id: string;
  storeName: string;
  operation: 'create' | 'update' | 'delete';
  data: T;
  timestamp: number;
  retryCount: number;
};

/**
 * Sync metadata attached to each store
 */
export type SyncMetadata = {
  lastSyncAt: number | null;
  lastSyncHash: string | null;
  syncStatus: SyncStatus;
  syncError: string | null;
  pendingMutations: number;
};

/**
 * Store configuration for sync middleware
 */
export type StoreConfig<T> = {
  storeName: string;
  tableName: string;
  syncEnabled: boolean;
  incrementalSync: boolean; // Use timestamp-based incremental sync
};

/**
 * Conflict resolution strategy
 */
export type ConflictStrategy =
  | 'last-write-wins'    // Use latest updatedAtMs
  | 'server-wins'        // Always use server version
  | 'client-wins'        // Always use local version
  | 'merge'              // Attempt smart merge
  | 'prompt';            // Ask user to choose

/**
 * Conflict detection result
 */
export type ConflictResult<T> = {
  hasConflict: boolean;
  strategy: ConflictStrategy;
  local?: T;
  remote?: T;
  merged?: T;
};

/**
 * Sync operation for the orchestrator queue
 */
export type SyncOperation = {
  storeName: string;
  priority: 'high' | 'normal' | 'low';
  action: () => Promise<void>;
};

/**
 * Sync statistics for monitoring
 */
export type SyncStats = {
  lastSyncAt: number | null;
  lastSyncDuration: number | null; // milliseconds
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  pendingMutations: number;
};

/**
 * Realtime event types
 */
export type RealtimeEventType = 'INSERT' | 'UPDATE' | 'DELETE';

/**
 * Realtime payload from Supabase
 */
export type RealtimePayload<T> = {
  eventType: RealtimeEventType;
  new: T | null;
  old: T | null;
  timestamp: string;
};

/**
 * Sync direction
 */
export type SyncDirection = 'pull' | 'push' | 'bidirectional';
