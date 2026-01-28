// src/lib/sync/RealtimeManager.ts
// Manages Supabase realtime subscriptions for all stores

import { supabase } from '../supabase/client';
import type { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js';
import type { RealtimePayload } from './syncTypes';

/**
 * Presence state for typing indicators and other ephemeral data
 */
export type PresenceState = {
  typing?: Record<string, boolean>; // threadId -> userId -> isTyping
};

/**
 * Subscription callback types
 */
export type RealtimeCallbacks<T> = {
  onInsert?: (record: T) => void;
  onUpdate?: (record: T) => void;
  onDelete?: (record: T | string) => void; // record or ID
};

/**
 * RealtimeManager - Centralized manager for Supabase realtime subscriptions
 *
 * Handles:
 * - Table change subscriptions (INSERT, UPDATE, DELETE)
 * - Presence channels (typing indicators)
 * - Broadcast channels (ephemeral messages)
 */
class RealtimeManagerClass {
  private channels: Map<string, RealtimeChannel> = new Map();
  private subscriptions: Map<string, () => void> = new Map();

  /**
   * Subscribe to table changes
   *
   * @param channelName Unique name for this subscription
   * @param table Database table name
   * @param filter Supabase filter (e.g., 'user_id=eq.123')
   * @param callbacks Event handlers
   * @returns Unsubscribe function
   */
  subscribeToTable<T>(
    channelName: string,
    table: string,
    filter: string,
    callbacks: RealtimeCallbacks<T>
  ): () => void {
    // If already subscribed, unsubscribe first
    this.unsubscribe(channelName);

    const channel = supabase.channel(channelName);

    // Subscribe to INSERT events
    if (callbacks.onInsert) {
      channel.on(
        'postgres_changes' as const,
        {
          event: 'INSERT',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          if (payload.new) {
            callbacks.onInsert?.(payload.new as T);
          }
        }
      );
    }

    // Subscribe to UPDATE events
    if (callbacks.onUpdate) {
      channel.on(
        'postgres_changes' as const,
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          if (payload.new) {
            callbacks.onUpdate?.(payload.new as T);
          }
        }
      );
    }

    // Subscribe to DELETE events
    if (callbacks.onDelete) {
      channel.on(
        'postgres_changes' as const,
        {
          event: 'DELETE',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          if (payload.old) {
            callbacks.onDelete?.(payload.old as T);
          } else {
            // If only ID is available
            callbacks.onDelete?.((payload as any).old?.id ?? '');
          }
        }
      );
    }

    channel.subscribe((status) => {
      if (__DEV__) {
        console.log(`[RealtimeManager] Channel ${channelName} status:`, status);
      }
    });

    this.channels.set(channelName, channel);

    // Return unsubscribe function
    const unsubscribe = () => this.unsubscribe(channelName);
    this.subscriptions.set(channelName, unsubscribe);

    return unsubscribe;
  }

  /**
   * Subscribe to presence channel
   *
   * @param channelName Channel name
   * @param callbacks Presence event handlers
   * @returns Unsubscribe function
   */
  subscribeToPresence(
    channelName: string,
    callbacks: {
      onSync?: (state: RealtimePresenceState<any>) => void;
      onJoin?: (key: string, current: string[], presences: any) => void;
      onLeave?: (key: string, current: string[], presences: any) => void;
    }
  ): () => void {
    // If already subscribed, unsubscribe first
    this.unsubscribe(channelName);

    const channel = supabase.channel(channelName, {
      config: { presence: { key: '' } },
    });

    if (callbacks.onSync) {
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceState>();
        callbacks.onSync?.(state);
      });
    }

    if (callbacks.onJoin) {
      channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const state = channel.presenceState<PresenceState>();
        callbacks.onJoin?.(key, this.getPresenceKeys(state, key), newPresences);
      });
    }

    if (callbacks.onLeave) {
      channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        const state = channel.presenceState<PresenceState>();
        callbacks.onLeave?.(key, this.getPresenceKeys(state, key), leftPresences);
      });
    }

    channel.subscribe((status) => {
      if (__DEV__) {
        console.log(`[RealtimeManager] Presence channel ${channelName} status:`, status);
      }
    });

    this.channels.set(channelName, channel);

    const unsubscribe = () => this.unsubscribe(channelName);
    this.subscriptions.set(channelName, unsubscribe);

    return unsubscribe;
  }

  /**
   * Track presence state for this client
   *
   * @param channelName Channel name
   * @param key Presence key (usually user ID)
   * @param state Presence state to track
   */
  async trackPresence(channelName: string, key: string, state: PresenceState): Promise<void> {
    const channel = this.channels.get(channelName);

    if (!channel) {
      console.warn(`[RealtimeManager] Channel not found: ${channelName}`);
      return;
    }

    // First ensure we're subscribed
    await channel.track({
      key,
      ...state,
    });
  }

  /**
   * Untrack presence state
   *
   * @param channelName Channel name
   */
  async untrackPresence(channelName: string): Promise<void> {
    const channel = this.channels.get(channelName);

    if (!channel) {
      return;
    }

    await channel.untrack();
  }

  /**
   * Send broadcast message to channel
   *
   * @param channelName Channel name
   * @param event Event name
   * @param payload Payload data
   */
  async broadcast(channelName: string, event: string, payload: unknown): Promise<void> {
    const channel = this.channels.get(channelName);

    if (!channel) {
      console.warn(`[RealtimeManager] Channel not found: ${channelName}`);
      return;
    }

    await channel.send({
      type: 'broadcast',
      event,
      payload,
    });
  }

  /**
   * Subscribe to broadcast events
   *
   * @param channelName Channel name
   * @param event Event name
   * @param callback Handler function
   * @returns Unsubscribe function
   */
  subscribeToBroadcast(
    channelName: string,
    event: string,
    callback: (payload: unknown) => void
  ): () => void {
    // If already subscribed, get existing channel
    let channel = this.channels.get(channelName);

    // Create if doesn't exist
    if (!channel) {
      channel = supabase.channel(channelName);
      channel.subscribe();
      this.channels.set(channelName, channel);
    }

    channel.on('broadcast', { event }, ({ payload }) => {
      callback(payload);
    });

    const unsubscribe = () => {
      // Note: This doesn't fully unsubscribe from broadcast,
      // just removes the listener in a real implementation
      this.unsubscribe(channelName);
    };

    this.subscriptions.set(`${channelName}:${event}`, unsubscribe);

    return unsubscribe;
  }

  /**
   * Get current presence state for a channel
   *
   * @param channelName Channel name
   * @returns Presence state
   */
  getPresenceState(channelName: string): RealtimePresenceState<PresenceState> | null {
    const channel = this.channels.get(channelName);

    if (!channel) {
      return null;
    }

    return channel.presenceState<PresenceState>();
  }

  /**
   * Unsubscribe from a channel
   *
   * @param channelName Channel name or channelName:event pattern
   */
  private unsubscribe(channelName: string): void {
    // Check if it's a broadcast subscription
    if (channelName.includes(':')) {
      const unsubscribe = this.subscriptions.get(channelName);
      if (unsubscribe) {
        unsubscribe();
        this.subscriptions.delete(channelName);
      }
      return;
    }

    // Regular channel subscription
    const channel = this.channels.get(channelName);

    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }

    const unsubscribe = this.subscriptions.get(channelName);
    if (unsubscribe) {
      this.subscriptions.delete(channelName);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    for (const channelName of this.channels.keys()) {
      this.unsubscribe(channelName);
    }
    this.channels.clear();
    this.subscriptions.clear();
  }

  /**
   * Helper to get presence keys for a given presence key
   */
  private getPresenceKeys(state: RealtimePresenceState<PresenceState>, key: string): string[] {
    const presence = state[key];
    if (!presence) return [];
    return presence.map(p => p.key ?? key);
  }
}

// Singleton instance
export const realtimeManager = new RealtimeManagerClass();

/**
 * Convenience function to subscribe to user's posts
 */
export function subscribeToUserPosts(
  userId: string,
  callbacks: RealtimeCallbacks<any>
): () => void {
  return realtimeManager.subscribeToTable(
    `posts:user_${userId}`,
    'posts',
    `author_id=eq.${userId}`,
    callbacks
  );
}

/**
 * Convenience function to subscribe to user's friendships
 */
export function subscribeToUserFriendships(
  userId: string,
  callbacks: RealtimeCallbacks<any>
): () => void {
  // Subscribe to both sides of friendship (user_id and friend_id)
  const filter1 = `user_id=eq.${userId}`;
  const filter2 = `friend_id=eq.${userId}`;

  // Subscribe to first filter
  realtimeManager.subscribeToTable(
    `friendships:user_${userId}_1`,
    'friendships',
    filter1,
    callbacks
  );

  // Subscribe to second filter
  return realtimeManager.subscribeToTable(
    `friendships:user_${userId}_2`,
    'friendships',
    filter2,
    callbacks
  );
}

/**
 * Convenience function to subscribe to post reactions
 */
export function subscribeToPostReactions(
  postId: string,
  callbacks: RealtimeCallbacks<any>
): () => void {
  return realtimeManager.subscribeToTable(
    `reactions:post_${postId}`,
    'reactions',
    `post_id=eq.${postId}`,
    callbacks
  );
}

/**
 * Convenience function to subscribe to post comments
 */
export function subscribeToPostComments(
  postId: string,
  callbacks: RealtimeCallbacks<any>
): () => void {
  return realtimeManager.subscribeToTable(
    `comments:post_${postId}`,
    'comments',
    `post_id=eq.${postId}`,
    callbacks
  );
}

/**
 * Convenience function to subscribe to user notifications
 */
export function subscribeToUserNotifications(
  userId: string,
  callbacks: RealtimeCallbacks<any>
): () => void {
  return realtimeManager.subscribeToTable(
    `notifications:user_${userId}`,
    'notifications',
    `user_id=eq.${userId}`,
    callbacks
  );
}
