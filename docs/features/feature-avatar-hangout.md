# Feature: Avatar & Hangout Room

## Overview
A Finch-inspired virtual gym avatar that grows as the user works out, living in a shared hangout room with friends. The avatar represents the user's commitment to self-care and fitness journey — not just gamification, but emotional investment.

**Status:** Planned | **Progress:** 0/8 features
**Priority:** Launch (v1)
**Source:** 2026-01-29 brainstorm interview

---

## Sub-Features

### Planned - Avatar Creation
- [ ] Character creator with basic customization
- [ ] Multiple art styles available at launch
- [ ] Onboarding step (skippable, default assigned if skipped)
- [ ] Avatar stored in user profile

**Art Style Options:**
- Bitmoji-but-stylized (cute, approachable — wide appeal)
- Old school pixel art (Mega Man style — nostalgic, charming)
- Slightly newer retro (Street Fighter 2 style — iconic)
- 3D low-poly (Monument Valley / Crossy Road feel — premium)
- Eventually: fully customizable character creator

**Key Design Decision:** Different art styles mix together in the same hangout room. A pixel art avatar can stand next to a Bitmoji avatar — this is intentional and fun.

---

### Planned - Avatar Growth System
- [ ] Physical height/size growth over time
- [ ] Growth driven by: volume logged + sets completed + rank progression
- [ ] Growth is gradual (not instant) — feels like "growing up"
- [ ] Visual milestone markers (noticeable size changes at key thresholds)
- [ ] Muscles grow proportionally but aren't the main focus

**Growth Philosophy:**
Inspired by the **Finch** app. The avatar's growth represents the user sticking to their fitness journey and caring about themselves. It's inspirational and emotional — not just a game mechanic. Users should feel proud watching their avatar grow.

**Growth Formula (Draft):**
```typescript
type AvatarGrowth = {
  stage: number;         // 1-20 growth stages
  heightScale: number;   // 0.3 (baby) to 1.0 (full grown)
  volumeTotal: number;   // Lifetime volume logged
  setsTotal: number;     // Lifetime sets completed
  avgRank: number;       // Average rank across exercises
};
```

---

### Planned - Hangout Room
- [ ] Visual-only social space (no chat, no text)
- [ ] Lightly animated background (subtle movement, not distracting)
- [ ] Room displays all friends' avatars
- [ ] Status indicators for each avatar (resting / working out)
- [ ] When a friend is working out, their avatar leaves the room with a message

**Room Behavior:**
- Default room created for each user
- Friends' avatars appear automatically
- Avatar "walks out" when friend starts a workout (with status: "Bench pressing...")
- Avatar returns when friend finishes workout
- Room is always accessible from the main navigation

---

### Planned - Room Decorations
- [ ] Purchasable decorations with Forge Tokens / IAP
- [ ] All room members can contribute decorations
- [ ] Room creator has admin control over what's displayed
- [ ] Categories: furniture, posters, equipment, trophies, plants, etc.
- [ ] Seasonal decorations (tied to Forge Seasons)

**Monetization:** IAP + Forge Tokens for individual decoration items.

---

### Planned - Friends' Avatar Presence
- [ ] See all friends' avatars in your room
- [ ] Real-time status updates (working out / resting / offline)
- [ ] Avatar customization visible to friends
- [ ] Avatar size/growth visible to friends (can see progression)

---

### Planned - Avatar Cosmetics
- [ ] Gym clothes (shirts, shorts, shoes)
- [ ] Accessories (headbands, wrist wraps, belts, glasses)
- [ ] Equipment props (dumbbells, shaker bottles)
- [ ] Unlockable via Forge Tokens or IAP
- [ ] Art-style-specific cosmetics

**Monetization:** IAP for premium cosmetics, Forge Tokens for basic items.

---

### Planned - Room Admin Controls
- [ ] Room creator can approve/remove decorations
- [ ] Room creator can set room theme/background
- [ ] Option to make room invite-only vs open to all friends

---

### Planned - Art Style Packs (IAP)
- [ ] Additional art styles beyond the launch set
- [ ] Users can switch art style anytime
- [ ] Art style affects avatar appearance but not growth progress

---

## Technical Notes

**Data Model:**
```typescript
type Avatar = {
  userId: string;
  artStyleId: string;      // "bitmoji" | "pixel" | "retro" | "3d"
  growthStage: number;      // 1-20
  heightScale: number;      // 0.3 - 1.0
  equippedCosmetics: {
    top: string | null;
    bottom: string | null;
    shoes: string | null;
    accessory: string | null;
  };
  createdAt: number;
};

type HangoutRoom = {
  ownerId: string;
  decorations: Decoration[];
  members: string[];        // friend user IDs
  theme: string;
};

type Decoration = {
  id: string;
  itemId: string;
  position: { x: number; y: number };
  contributedBy: string;    // user ID who added it
  approved: boolean;        // admin approval status
};
```

**Rendering Approach:**
- 2D avatar rendering using React Native canvas or SVG
- Pre-rendered sprite sheets per art style per growth stage
- Room rendered as layered 2D scene
- Animations: idle breathing, walking in/out, light ambient motion

**Storage:**
- Avatar data synced to Supabase
- Room state synced in real-time via Supabase subscriptions
- Offline: show cached avatar, queue cosmetic changes

---

## UI Design

**Avatar Screen:**
- Full view of user's avatar with growth progress bar
- "Customize" button to edit cosmetics
- "Change Style" to switch art style
- Growth stage indicator (Stage 7/20)

**Hangout Room Screen:**
- Full-width room view with decorations
- Friends' avatars with name labels
- Status badges (working out / resting)
- "Add Decoration" floating button
- Tap avatar to see friend's profile summary

**Room in Navigation:**
- Accessible from profile tab or dedicated tab
- Badge notification when friend starts working out (optional)

---

## Dependencies

- Auth (user identity)
- Friends system (room membership)
- Backend sync (real-time avatar presence)
- Gamification store (Forge Tokens for purchases)
- Settings (equipped cosmetics)

---

## Priority

**P0 (Launch):**
- Avatar creation with 2-3 art styles
- Basic growth system
- Hangout room (visual only)

**P1 (Launch Polish):**
- Room decorations
- Avatar cosmetics (basic set)
- Friend presence indicators

**P2 (Post-Launch):**
- Additional art styles (IAP)
- Premium cosmetics
- Seasonal decorations
- Room admin controls
