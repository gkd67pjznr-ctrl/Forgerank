/**
 * Exercise Database - Backwards Compatibility Layer
 *
 * This file maintains backwards compatibility with existing code.
 * New code should import from './exerciseDatabase' directly.
 *
 * @deprecated Use exerciseDatabase.ts instead
 */

import {
  getAllExercises,
  getExerciseById,
  getPopularExercises,
  resolveExerciseId,
  type ForgerankExercise,
} from './exerciseDatabase';

// === Legacy Type (for backwards compatibility) ===
export type Exercise = {
  id: string;
  name: string;
};

// === Legacy Export ===
// Maps to popular exercises for backwards compat with existing UI
export const EXERCISES_V1: Exercise[] = getPopularExercises().map((ex) => ({
  id: ex.id,
  name: ex.name,
}));

// === Re-exports for migration ===
export {
  getAllExercises,
  getExerciseById,
  getPopularExercises,
  resolveExerciseId,
};

export type { ForgerankExercise };
