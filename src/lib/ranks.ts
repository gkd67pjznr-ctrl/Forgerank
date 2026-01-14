import type { VerifiedTop } from "../data/rankTops";

export type RankConfig = {
  ranksCount: number; // e.g. 20
  curve: number; // >1 makes early ranks easier, late ranks harder (recommended 1.6–2.0)
};

export const DEFAULT_RANK_CONFIG: RankConfig = {
  ranksCount: 20,
  curve: 1.75,
};

/**
 * Returns an array of thresholds in kg, length = ranksCount.
 * Index 0 = Rank 1 threshold (lowest)
 * Index ranksCount-1 = top rank threshold (highest) ~= topE1RMKg
 */
export function buildRankThresholdsKg(topE1RMKg: number, cfg: RankConfig = DEFAULT_RANK_CONFIG): number[] {
  const n = cfg.ranksCount;
  const gamma = cfg.curve;

  // Rank i (1..n) threshold:
  // top * (i/n)^gamma
  const out: number[] = [];
  for (let i = 1; i <= n; i++) {
    const t = topE1RMKg * Math.pow(i / n, gamma);
    out.push(t);
  }
  return out;
}

/**
 * Given an achieved e1RM (kg), returns:
 * - rankIndex: 0..n-1 (0 = Rank 1, n-1 = top rank)
 * - progressToNext: 0..1 (how close you are to next rank)
 */
export function getRankFromE1RMKg(e1rmKg: number, thresholdsKg: number[]) {
  const n = thresholdsKg.length;

  if (e1rmKg <= thresholdsKg[0]) {
    const prog = clamp01(e1rmKg / thresholdsKg[0]);
    return { rankIndex: 0, progressToNext: prog };
  }

  for (let i = 0; i < n; i++) {
    if (e1rmKg < thresholdsKg[i]) {
      const prev = thresholdsKg[i - 1];
      const next = thresholdsKg[i];
      const prog = clamp01((e1rmKg - prev) / (next - prev));
      return { rankIndex: i - 1, progressToNext: prog };
    }
  }

  // At or above top
  return { rankIndex: n - 1, progressToNext: 1 };
}

/**
 * Convenience: build thresholds for every verified top lift.
 */
export function buildAllThresholds(tops: VerifiedTop[], cfg: RankConfig = DEFAULT_RANK_CONFIG) {
  const map: Record<string, number[]> = {};
  for (const t of tops) map[t.liftId] = buildRankThresholdsKg(t.topE1RMKg, cfg);
  return map;
}

function clamp01(x: number) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
