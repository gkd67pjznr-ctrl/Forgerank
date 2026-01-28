// app/chat.tsx
import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View, RefreshControl } from "react-native";
import { useUser } from "../src/lib/stores/authStore";
import { getMessagesForThread, useThreads, useChatStore } from "../src/lib/stores/chatStore";
import type { ID } from "../src/lib/socialModel";
import { displayName, ME_ID } from "../src/lib/userDirectory";
import { useThemeColors } from "../src/ui/theme";
import { timeAgo } from "../src/lib/units";
import { ProtectedRoute } from "../src/ui/components/ProtectedRoute";

const ME: ID = ME_ID;

function otherUserId(thread: { memberUserIds: ID[] }, myUserId: ID): ID {
  return thread.memberUserIds.find((id) => id !== myUserId) ?? thread.memberUserIds[0] ?? myUserId;
}

function unreadCountForThread(threadId: ID, myUserId: ID): number {
  const msgs = getMessagesForThread(threadId);
  let n = 0;
  for (const m of msgs) {
    if (m.senderUserId !== myUserId && !m.readAtMs) n += 1;
  }
  return n;
}

export default function ChatScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const user = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const { pullFromServer } = useChatStore();

  const userId = user?.id ?? ME;
  const threads = useThreads(userId);

  // Pull to refresh
  async function onRefresh() {
    setRefreshing(true);
    try {
      await pullFromServer();
    } catch (err) {
      console.error('[Chat] Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  }

  // Initial sync on mount
  useEffect(() => {
    if (user?.id) {
      pullFromServer().catch(err => {
        console.error('[Chat] Failed to sync:', err);
      });
    }
  }, [user?.id, pullFromServer]);

  return (
    <ProtectedRoute>
      <Stack.Screen options={{ title: "Chat" }} />

      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Top actions */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={() => router.push(("/new-message" as any) as any)}
              style={({ pressed }) => ({
                flex: 1,
                borderWidth: 1,
                borderColor: c.border,
                backgroundColor: c.card,
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 14,
                opacity: pressed ? 0.7 : 1,
                alignItems: "center",
              })}
            >
              <Text style={{ color: c.text, fontWeight: "900", fontSize: 14 }}>+ New Message</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push(("/friends" as any) as any)}
              style={({ pressed }) => ({
                borderWidth: 1,
                borderColor: c.border,
                backgroundColor: c.card,
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 14,
                opacity: pressed ? 0.7 : 1,
                alignItems: "center",
              })}
            >
              <Text style={{ color: c.text, fontWeight: "900", fontSize: 14 }}>Friends</Text>
            </Pressable>
          </View>

          {threads.length === 0 ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: c.border,
                backgroundColor: c.card,
                borderRadius: 16,
                padding: 16,
                gap: 6,
              }}
            >
              <Text style={{ color: c.text, fontWeight: "900", fontSize: 16 }}>No messages yet</Text>
              <Text style={{ color: c.muted }}>
                This is the Threads list. Tap "New Message" to start a DM.
              </Text>
            </View>
          ) : null}

          {threads.map((t) => {
            const otherId = otherUserId(t, userId);
            const name = displayName(otherId);

            const msgs = getMessagesForThread(t.id);
            const last = msgs[msgs.length - 1];
            const lastText = last?.text ?? "No messages";
            const lastAt = last?.createdAtMs ?? t.updatedAtMs ?? t.createdAtMs;
            const when = timeAgo(lastAt);

            const unread = unreadCountForThread(t.id, userId);

            return (
              <Link key={t.id} href={`/dm/${t.id}` as any} asChild>
                <Pressable
                  style={({ pressed }) => ({
                    borderWidth: 1,
                    borderColor: c.border,
                    backgroundColor: c.card,
                    borderRadius: 16,
                    padding: 14,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    {/* Name becomes a profile entrypoint */}
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation?.();
                        router.push((`/u/${otherId}` as any) as any);
                      }}
                      style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        flexShrink: 1,
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Text style={{ color: c.text, fontWeight: "900", fontSize: 16 }}>{name}</Text>

                      {unread > 0 ? (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: c.border,
                            backgroundColor: c.bg,
                          }}
                        >
                          <Text style={{ color: c.text, fontWeight: "900", fontSize: 12 }}>{unread}</Text>
                        </View>
                      ) : null}
                    </Pressable>

                    <Text style={{ color: c.muted, fontWeight: "800", fontSize: 12 }}>{when}</Text>
                  </View>

                  <Text
                    numberOfLines={1}
                    style={{
                      marginTop: 6,
                      color: c.muted,
                      fontWeight: unread > 0 ? "900" : "600",
                    }}
                  >
                    {lastText}
                  </Text>

                  <View style={{ marginTop: 10, flexDirection: "row", gap: 8, alignItems: "center" }}>
                    <View
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: c.border,
                        backgroundColor: c.bg,
                      }}
                    >
                      <Text style={{ color: c.text, fontWeight: "900", fontSize: 12 }}>DM</Text>
                    </View>

                    {t.canMessage === "friendsOnly" ? (
                      <Text style={{ color: c.muted, fontWeight: "700", fontSize: 12 }}>friends-only</Text>
                    ) : null}
                  </View>
                </Pressable>
              </Link>
            );
          })}
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}
