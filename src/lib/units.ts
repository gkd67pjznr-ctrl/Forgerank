export const KG_PER_LB = 0.45359237;

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function roundToStep(value: number, step: number): number {
  if (step <= 0) throw new Error("step must be > 0");
  const scaled = value / step;
  const rounded = Math.round(scaled);
  return Math.round(rounded * step * 1e6) / 1e6;
}

/**
 * Format a timestamp as a relative time string (e.g., "5m ago", "2h ago")
 * @param timestampMs - Timestamp in milliseconds
 * @returns Formatted relative time string
 */
export function timeAgo(timestampMs: number): string {
  const s = Math.max(1, Math.floor((Date.now() - timestampMs) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
