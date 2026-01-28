// src/lib/celebration/types.ts
// Type definitions for PR celebration system
// Designed to support future AI-generated images and animations

import type { PRType } from '../perSetCueTypes';

/**
 * Content key for celebration assets
 *
 * These keys are used to look up images, animations, and other content.
 * In the future, AI-generated content will be mapped to these keys.
 *
 * Key format: "{prType}_tier_{tier}_{variant}"
 * Example: "weight_tier_1_var_a", "rep_tier_2_var_b"
 */
export type CelebrationContentKey = string;

/**
 * Tier of celebration based on PR magnitude
 *
 * Higher tiers = more impressive celebrations
 */
export type CelebrationTier = 1 | 2 | 3 | 4;

/**
 * Celebration variant for variety
 *
 * Allows multiple celebration styles for the same PR type/tier.
 * This enables personality themes and prevents visual repetition.
 */
export type CelebrationVariant = 'a' | 'b' | 'c' | 'd' | 'e';

/**
 * Content asset types for celebrations
 *
 * In v1: Uses placeholder emoji/icons
 * Future: AI-generated images, animations, video clips
 */
export type AssetType =
  | 'image'           // Static image (AI-generated)
  | 'animation'       // Lottie/animated GIF (AI-generated)
  | 'video'           // Short video clip (AI-generated)
  | 'emoji'           // Fallback emoji for v1
  | 'icon';           // Fallback icon for v1

/**
 * Single content asset definition
 *
 * Defines a visual element to show during celebration.
 * Content keys map to actual assets via the content registry.
 */
export interface ContentAsset {
  /** Type of asset */
  type: AssetType;
  /** URI or value for the asset */
  uri: string;
  /** Display dimensions (aspect ratio) */
  aspectRatio: number;
}

/**
 * Sound effect definition
 *
 * Maps to sound keys in the design system.
 */
export interface SoundEffect {
  /** Sound key from designSystem.sounds */
  key: 'spark' | 'stamp' | 'thud' | 'cheer' | 'triumph' | 'powerup';
  /** Volume multiplier (0-1) */
  volume: number;
}

/**
 * Haptic pattern for celebration
 *
 * Defines the vibration feedback pattern.
 */
export interface HapticPattern {
  /** Pattern type */
  type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy';
  /** Number of repetitions */
  repeats?: number;
  /** Delay between repetitions (ms) */
  delayMs?: number;
}

/**
 * Text template for celebration message
 *
 * Supports placeholders for dynamic content.
 * Placeholders: {exercise}, {weight}, {reps}, {delta}, {tier}
 */
export interface TextTemplate {
  /** Main headline text */
  headline: string;
  /** Optional subheadline */
  subheadline?: string;
  /** Optional detail text */
  detail?: string;
}

/**
 * Complete celebration definition
 *
 * Defines all aspects of a PR celebration moment.
 * These are stored in the content registry and selected based on PR type/tier.
 */
export interface Celebration {
  /** Unique identifier */
  id: string;
  /** PR type this celebration is for */
  prType: PRType;
  /** Tier level (based on delta magnitude) */
  tier: CelebrationTier;
  /** Variant for variety */
  variant: CelebrationVariant;
  /** Content key for looking up assets */
  contentKey: CelebrationContentKey;
  /** Visual assets to display */
  assets: ContentAsset[];
  /** Sound effect to play */
  sound: SoundEffect;
  /** Haptic feedback pattern */
  haptic: HapticPattern;
  /** Text templates */
  text: TextTemplate;
  /** Minimum delta (lb) required for this celebration */
  minDeltaLb: number;
  /** Maximum delta (lb) for this celebration (undefined = no max) */
  maxDeltaLb?: number;
}

/**
 * Parameters for selecting a celebration
 *
 * Input data used to select the appropriate celebration.
 */
export interface CelebrationSelectorParams {
  /** Type of PR achieved */
  prType: PRType;
  /** Delta in pounds (for tier selection) */
  deltaLb: number;
  /** Exercise name (for text templates) */
  exerciseName: string;
  /** Weight label (for text templates) */
  weightLabel: string;
  /** Reps achieved (for text templates) */
  reps: number;
  /** User's preferred theme/variant (optional) */
  preferredVariant?: CelebrationVariant;
}

/**
 * Selected celebration with resolved text
 *
 * Result of celebration selection with text templates resolved.
 */
export interface SelectedCelebration {
  /** The celebration definition */
  celebration: Celebration;
  /** Resolved headline text */
  headline: string;
  /** Resolved subheadline text */
  subheadline?: string;
  /** Resolved detail text */
  detail?: string;
}

/**
 * Celebration theme configuration
 *
 * Defines a set of celebration variants as a theme.
 * This enables swapping entire celebration sets for different personalities.
 */
export interface CelebrationTheme {
  /** Theme identifier (e.g., "default", "arnold", "motivator") */
  id: string;
  /** Display name */
  name: string;
  /** Variants to use (ordered by preference) */
  variants: CelebrationVariant[];
  /** Override content keys per PR type/tier (optional) */
  contentOverrides?: Partial<Record<CelebrationContentKey, CelebrationContentKey>>;
}

/**
 * Default theme (v1)
 *
 * Basic celebrations using emoji/icons as placeholders.
 * Future versions will swap in AI-generated content via content key overrides.
 */
export const DEFAULT_THEME: CelebrationTheme = {
  id: 'default',
  name: 'Default',
  variants: ['a', 'b', 'c', 'd', 'e'],
};
