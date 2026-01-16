// src/lib/friendsStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import type { FriendEdge, FriendStatus, ID } from "./socialModel";

const KEY = "friends.v1";

type FriendsState = {
  edges: FriendEdge[];
};

let state: FriendsState = { edges: [] };
let hydrated = false;

const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) fn();
}

function uid(): string {
  return Math.random().toString(16).slice(2) + "-" + Math.random().toString(16).slice(2);
}

async function persist() {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

async function load(): Promise<FriendsState | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FriendsState;
  } catch {
    return null;
  }
}

export async function hydrateFriends(): Promise<void> {
  if (hydrated) return;
  hydrated = true;

  const loaded = await load();
  if (loaded) state = loaded;
  else seedMockFriends();

  notify();
}

export function subscribeFriends(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---------- Selectors ----------
export function getFriendEdges(myUserId: ID): FriendEdge[] {
  return state.edges
    .filter((e) => e.userId === myUserId)
    .slice()
    .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
}

export function getFriendStatus(myUserId: ID, otherUserId: ID): FriendStatus {
  const e = state.edges.find((x) => x.userId === myUserId && x.otherUserId === otherUserId);
  return e?.status ?? "none";
}

export function areFriends(myUserId: ID, otherUserId: ID): boolean {
  return getFriendStatus(myUserId, otherUserId) === "friends";
}

function upsertEdge(edge: FriendEdge) {
  const idx = state.edges.findIndex((e) => e.userId === edge.userId && e.otherUserId === edge.otherUserId);
  if (idx >= 0) {
    const nextEdges = state.edges.slice();
    nextEdges[idx] = edge;
    state = { ...state, edges: nextEdges };
  } else {
    state = { ...state, edges: [edge, ...state.edges] };
  }
}

function removeEdge(myUserId: ID, otherUserId: ID) {
  state = { ...state, edges: state.edges.filter((e) => !(e.userId === myUserId && e.otherUserId === otherUserId)) };
}

// ---------- Mutations ----------
// v1 local model: we create "mirrored" edges so both sides look consistent.

export function sendFriendRequest(myUserId: ID, otherUserId: ID) {
  const now = Date.now();

  // If blocked either way, do nothing.
  if (getFriendStatus(myUserId, otherUserId) === "blocked") return;

  upsertEdge({ userId: myUserId, otherUserId, status: "requested", updatedAtMs: now });
  upsertEdge({ userId: otherUserId, otherUserId: myUserId, status: "pending", updatedAtMs: now });

  persist();
  notify();
}

export function acceptFriendRequest(myUserId: ID, otherUserId: ID) {
  const now = Date.now();

  upsertEdge({ userId: myUserId, otherUserId, status: "friends", updatedAtMs: now });
  upsertEdge({ userId: otherUserId, otherUserId: myUserId, status: "friends", updatedAtMs: now });

  persist();
  notify();
}

export function removeFriend(myUserId: ID, otherUserId: ID) {
  removeEdge(myUserId, otherUserId);
  removeEdge(otherUserId, myUserId);

  persist();
  notify();
}

export function blockUser(myUserId: ID, otherUserId: ID) {
  const now = Date.now();

  upsertEdge({ userId: myUserId, otherUserId, status: "blocked", updatedAtMs: now });
  // Optional: remove their edge to you
  removeEdge(otherUserId, myUserId);

  persist();
  notify();
}

// ---------- Hooks ----------
export function useFriendEdges(myUserId: ID): FriendEdge[] {
  const [edges, setEdges] = useState(getFriendEdges(myUserId));

  useEffect(() => {
    hydrateFriends().catch(() => {});
    return subscribeFriends(() => setEdges(getFriendEdges(myUserId)));
  }, [myUserId]);

  return edges;
}

export function useFriendStatus(myUserId: ID, otherUserId: ID): FriendStatus {
  const [s, setS] = useState<FriendStatus>(getFriendStatus(myUserId, otherUserId));

  useEffect(() => {
    hydrateFriends().catch(() => {});
    return subscribeFriends(() => setS(getFriendStatus(myUserId, otherUserId)));
  }, [myUserId, otherUserId]);

  return s;
}

// ---------- Mock seed ----------
function seedMockFriends() {
  const now = Date.now();
  const me: ID = "u_demo_me";

  // Pretend Sarah is a friend and Mark is pending
  state = {
    edges: [
      { userId: me, otherUserId: "u_demo_1", status: "friends", updatedAtMs: now - 1000 * 60 * 60 },
      { userId: "u_demo_1", otherUserId: me, status: "friends", updatedAtMs: now - 1000 * 60 * 60 },

      { userId: me, otherUserId: "u_demo_3", status: "requested", updatedAtMs: now - 1000 * 60 * 20 },
      { userId: "u_demo_3", otherUserId: me, status: "pending", updatedAtMs: now - 1000 * 60 * 20 },

      // Example block
      { userId: me, otherUserId: "u_demo_spam", status: "blocked", updatedAtMs: now - 1000 * 60 * 5 },
    ],
  };

  persist();
}
