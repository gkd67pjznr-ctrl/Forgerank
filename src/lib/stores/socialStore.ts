// src/lib/stores/socialStore.ts
// Zustand store for social posts, reactions, comments with AsyncStorage persistence
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createQueuedJSONStorage } from "./storage/createQueuedAsyncStorage";
import type { AppNotification, Comment, EmoteId, Reaction, WorkoutPost } from "../socialModel";
import { uid } from "../uid";
import { logError } from "../errorHandler";
import { safeJSONParse } from "../storage/safeJSONParse";

const STORAGE_KEY = "social.v2";

interface SocialState {
  posts: WorkoutPost[];
  reactions: Reaction[];
  comments: Comment[];
  notifications: AppNotification[];
  hydrated: boolean;

  // Actions
  createPost: (input: Omit<WorkoutPost, "id" | "likeCount" | "commentCount">) => WorkoutPost;
  toggleReaction: (postId: string, myUserId: string, emote: EmoteId) => void;
  addComment: (postId: string, myUserId: string, myDisplayName: string, text: string) => Comment | null;
  setHydrated: (value: boolean) => void;
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set, get) => ({
      posts: [],
      reactions: [],
      comments: [],
      notifications: [],
      hydrated: false,

      createPost: (input) => {
        const post: WorkoutPost = {
          ...input,
          id: uid(),
          likeCount: 0,
          commentCount: 0,
        };

        set((state) => ({
          posts: [post, ...state.posts],
        }));

        return post;
      },

      toggleReaction: (postId, myUserId, emote) => {
        const post = get().posts.find((p) => p.id === postId);
        if (!post) return;

        const existing = get().reactions.find((r) => r.postId === postId && r.userId === myUserId);

        // Remove reaction if same emote tapped again
        if (existing && existing.emote === emote) {
          set((state) => ({
            reactions: state.reactions.filter((r) => r.id !== existing.id),
            posts: state.posts.map((p) =>
              p.id === postId ? { ...p, likeCount: Math.max(0, p.likeCount - 1) } : p
            ),
          }));
          return;
        }

        // If different emote: replace
        if (existing) {
          set((state) => ({
            reactions: state.reactions.map((r) => (r.id === existing.id ? { ...r, emote } : r)),
          }));
          return;
        }

        // New reaction
        const r: Reaction = {
          id: uid(),
          postId,
          userId: myUserId,
          emote,
          createdAtMs: Date.now(),
        };

        set((state) => ({
          reactions: [r, ...state.reactions],
          posts: state.posts.map((p) => (p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p)),
        }));
      },

      addComment: (postId, myUserId, myDisplayName, text) => {
        const post = get().posts.find((p) => p.id === postId);
        if (!post) return null;

        const trimmed = text.trim();
        if (!trimmed) return null;

        const c: Comment = {
          id: uid(),
          postId,
          userId: myUserId,
          userDisplayName: myDisplayName,
          text: trimmed,
          createdAtMs: Date.now(),
        };

        set((state) => ({
          comments: [...state.comments, c],
          posts: state.posts.map((p) => (p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p)),
        }));

        return c;
      },

      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      storage: createQueuedJSONStorage(),
      partialize: (state) => ({
        posts: state.posts,
        reactions: state.reactions,
        comments: state.comments,
        notifications: state.notifications,
      }),
      onRehydrateStorage: () => (state) => {
        // V1 to V2 migration
        AsyncStorage.getItem("social.v1").then((v1Data) => {
          if (v1Data && state) {
            const parsed = safeJSONParse<{ posts: WorkoutPost[]; reactions: Reaction[]; comments: Comment[]; notifications: AppNotification[] }>(v1Data, null);
            if (parsed && parsed.posts && parsed.posts.length > 0 && state.posts.length === 0) {
              state.posts = parsed.posts;
              state.reactions = parsed.reactions ?? [];
              state.comments = parsed.comments ?? [];
              state.notifications = parsed.notifications ?? [];
              AsyncStorage.removeItem("social.v1").catch((err) => {
                logError({ context: 'SocialStore', error: err, userMessage: 'Failed to remove old social data' });
              });
            }
          }

          state?.setHydrated(true);
        }).catch((err) => {
          logError({ context: 'SocialStore', error: err, userMessage: 'Failed to load social data' });
          state?.setHydrated(true);
        });
      },
    }
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectFeedAll = (state: SocialState) =>
  state.posts.slice().sort((a, b) => b.createdAtMs - a.createdAtMs);

export const selectPostById = (id: string) => (state: SocialState) =>
  state.posts.find((p) => p.id === id);

export const selectCommentsForPost = (postId: string) => (state: SocialState) =>
  state.comments
    .filter((c) => c.postId === postId)
    .slice()
    .sort((a, b) => a.createdAtMs - b.createdAtMs);

export const selectReactionsForPost = (postId: string) => (state: SocialState) =>
  state.reactions
    .filter((r) => r.postId === postId)
    .slice()
    .sort((a, b) => b.createdAtMs - a.createdAtMs);

export const selectMyReactionForPost = (postId: string, myUserId: string) => (state: SocialState) =>
  state.reactions.find((r) => r.postId === postId && r.userId === myUserId);

// ============================================================================
// Hooks (match old API)
// ============================================================================

export function useFeedAll(): WorkoutPost[] {
  return useSocialStore(selectFeedAll);
}

export function usePost(postId: string): WorkoutPost | undefined {
  return useSocialStore(selectPostById(postId));
}

export function usePostComments(postId: string): Comment[] {
  return useSocialStore(selectCommentsForPost(postId));
}

export function usePostReactions(postId: string): Reaction[] {
  return useSocialStore(selectReactionsForPost(postId));
}

export function useMyReaction(postId: string, myUserId: string): Reaction | undefined {
  return useSocialStore(selectMyReactionForPost(postId, myUserId));
}

// ============================================================================
// Imperative getters for non-React code
// ============================================================================

export function getFeedAll(): WorkoutPost[] {
  return selectFeedAll(useSocialStore.getState());
}

export function getPostById(id: string): WorkoutPost | undefined {
  return selectPostById(id)(useSocialStore.getState());
}

export function getCommentsForPost(postId: string): Comment[] {
  return selectCommentsForPost(postId)(useSocialStore.getState());
}

export function getReactionsForPost(postId: string): Reaction[] {
  return selectReactionsForPost(postId)(useSocialStore.getState());
}

export function getMyReactionForPost(postId: string, myUserId: string): Reaction | undefined {
  return selectMyReactionForPost(postId, myUserId)(useSocialStore.getState());
}

// Legacy hydrate function (no-op with Zustand)
export async function hydrateSocialStore(): Promise<void> {
  // Zustand handles hydration automatically
}

// Legacy subscribe function (no-op with Zustand)
export function subscribeSocial(listener: () => void): () => void {
  return () => {};
}

// ============================================================================
// Imperative action wrappers for non-React code
// ============================================================================

export type CreatePostInput = Omit<WorkoutPost, "id" | "likeCount" | "commentCount">;

export function createPost(input: CreatePostInput): WorkoutPost {
  return useSocialStore.getState().createPost(input);
}

export function toggleReaction(postId: string, myUserId: string, emote: EmoteId): void {
  useSocialStore.getState().toggleReaction(postId, myUserId, emote);
}

export type AddCommentInput = {
  postId: string;
  myUserId: string;
  myDisplayName: string;
  text: string;
};

export function addComment(input: AddCommentInput): Comment | null {
  return useSocialStore.getState().addComment(
    input.postId,
    input.myUserId,
    input.myDisplayName,
    input.text
  );
}
