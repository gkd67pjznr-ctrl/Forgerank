// app/feed.tsx
import { Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
    canUserInteractWithPost,
    toggleLike,
    useVisibleFeed,
    type FeedPost,
} from "../src/lib/feedStore";
import type { ID } from "../src/lib/socialModel";
import { useThemeColors } from "../src/ui/theme";

const ME: ID = "u_demo_me";

function timeAgo(ms: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ms) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function visibilityLabel(v: FeedPost["visibility"]): string {
  return v === "public" ? "public" : "friends";
}

export default function FeedScreen() {
  const c = useThemeColors();
  const router = useRouter();

  const { posts, likeCount, liked } = useVisibleFeed(ME);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Feed",
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
              <Pressable onPress={() => router.push(("/create-post" as any) as any)} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: c.text, fontWeight: "900" }}>+ Post</Text>
              </Pressable>

              <Pressable onPress={() => router.push(("/friends" as any) as any)} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: c.text, fontWeight: "900" }}>Friends</Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}>
          {posts.map((p) => {
            const isLiked = liked(p.id);
            const nLikes = likeCount(p.id);

            const canInteract = canUserInteractWithPost(p, ME);

            return (
              <View
                key={p.id}
                style={{
                  borderWidth: 1,
                  borderColor: c.border,
                  backgroundColor: c.card,
                  borderRadius: 18,
                  padding: 14,
                  gap: 10,
                }}
              >
                {/* Header */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <Pressable
                    onPress={() => router.push((`/u/${p.authorUserId}` as any) as any)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, flexShrink: 1 })}
                  >
                    <Text style={{ color: c.text, fontWeight: "900", fontSize: 14 }}>
                      User {String(p.authorUserId).replace("u_demo_", "")}
                    </Text>
                  </Pressable>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View
                      style={{
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: c.border,
                        backgroundColor: c.bg,
                      }}
                    >
                      <Text style={{ color: c.muted, fontWeight: "900", fontSize: 11 }}>
                        {visibilityLabel(p.visibility)}
                      </Text>
                    </View>

                    <Text style={{ color: c.muted, fontWeight: "800", fontSize: 12 }}>{timeAgo(p.createdAtMs)}</Text>
                  </View>
                </View>

                {/* Body */}
                <Text style={{ color: c.text, fontWeight: "700", lineHeight: 20 }}>{p.text}</Text>

                {/* Actions */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <Text style={{ color: c.muted, fontWeight: "800", fontSize: 12 }}>{nLikes} likes</Text>

                  <Pressable
                    onPress={() => {
                      if (!canInteract) return;
                      toggleLike(p.id, ME);
                    }}
                    disabled={!canInteract}
                    style={({ pressed }) => ({
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: c.border,
                      backgroundColor: c.bg,
                      opacity: !canInteract ? 0.45 : pressed ? 0.7 : 1,
                    })}
                  >
                    <Text style={{ color: c.text, fontWeight: "900", fontSize: 12 }}>
                      {isLiked ? "Liked" : "Like"}
                    </Text>
                  </Pressable>
                </View>

                {!canInteract ? (
                  <Text style={{ color: c.muted, fontWeight: "800", fontSize: 12 }}>
                    Friends-only interaction. View profile to add friend.
                  </Text>
                ) : null}
              </View>
            );
          })}

          {posts.length === 0 ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: c.border,
                backgroundColor: c.card,
                borderRadius: 18,
                padding: 16,
                gap: 6,
              }}
            >
              <Text style={{ color: c.text, fontWeight: "900" }}>No posts yet</Text>
              <Text style={{ color: c.muted, fontWeight: "700" }}>Tap “+ Post” to create one.</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </>
  );
}
