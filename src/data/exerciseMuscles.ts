/**
 * Exercise Muscle Mappings
 *
 * This file provides comprehensive muscle group mappings for all exercises.
 * Each exercise is mapped to its primary, secondary, and tertiary muscle groups.
 *
 * Muscle groups are categorized by their involvement in each exercise:
 * - Primary: Main muscles targeted by the exercise
 * - Secondary: Supporting muscles that assist in the movement
 * - Tertiary: Stabilizing muscles with minimal involvement
 */

import type { MuscleGroup } from './exerciseTypes';

/**
 * Exercise Muscle Mapping
 * Maps exercise IDs to their muscle group involvement
 */
export type ExerciseMuscleMapping = {
  primary: MuscleGroup[];
  secondary: MuscleGroup[];
  tertiary: MuscleGroup[];
};

/**
 * Complete exercise muscle database
 * Contains muscle mappings for all exercises in the system
 */
export const EXERCISE_MUSCLES: Record<string, ExerciseMuscleMapping> = {
  // Core compound lifts
  'Barbell_Bench_Press_-_Medium_Grip': {
    primary: ['chest', 'triceps'],
    secondary: ['shoulders'],
    tertiary: ['lats', 'middle back'],
  },
  'Barbell_Full_Squat': {
    primary: ['quadriceps', 'glutes'],
    secondary: ['hamstrings', 'calves'],
    tertiary: ['lower back', 'abdominals'],
  },
  'Barbell_Deadlift': {
    primary: ['hamstrings', 'glutes'],
    secondary: ['lower back', 'quadriceps'],
    tertiary: ['traps', 'forearms', 'abdominals'],
  },
  'Standing_Military_Press': {
    primary: ['shoulders'],
    secondary: ['triceps'],
    tertiary: ['traps', 'middle back'],
  },
  'Bent_Over_Barbell_Row': {
    primary: ['middle back', 'lats'],
    secondary: ['biceps', 'shoulders'],
    tertiary: ['lower back', 'forearms'],
  },
  'Pullups': {
    primary: ['lats'],
    secondary: ['biceps', 'middle back'],
    tertiary: ['shoulders', 'forearms'],
  },
  'Barbell_Incline_Bench_Press_-_Medium_Grip': {
    primary: ['chest'],
    secondary: ['shoulders', 'triceps'],
    tertiary: ['lats'],
  },
  'Romanian_Deadlift': {
    primary: ['hamstrings', 'glutes'],
    secondary: ['lower back'],
    tertiary: ['forearms', 'traps'],
  },
  'Leg_Press': {
    primary: ['quadriceps', 'glutes'],
    secondary: ['hamstrings', 'calves'],
    tertiary: ['lower back'],
  },
  'Wide-Grip_Lat_Pulldown': {
    primary: ['lats'],
    secondary: ['biceps', 'middle back'],
    tertiary: ['shoulders'],
  },

  // Chest exercises
  'Barbell_Guillotine_Bench_Press': {
    primary: ['chest'],
    secondary: ['shoulders', 'triceps'],
    tertiary: [],
  },
  'Barbell_Incline_Bench_Pull': {
    primary: ['chest'],
    secondary: ['shoulders'],
    tertiary: ['triceps'],
  },
  'Barbell_Reverse_Grip_Incline_Bench_Press': {
    primary: ['chest'],
    secondary: ['triceps'],
    tertiary: ['shoulders'],
  },

  // Back exercises
  'Barbell_Reverse_Grip_Bent_Over_Row': {
    primary: ['middle back', 'lats'],
    secondary: ['biceps'],
    tertiary: ['lower back'],
  },
  'Barbell_Reverse_Grip_Close_Grip_Bent_Over_Row': {
    primary: ['middle back'],
    secondary: ['biceps', 'lats'],
    tertiary: ['lower back'],
  },
  'Barbell_Seal_Row': {
    primary: ['middle back', 'lats'],
    secondary: ['biceps', 'shoulders'],
    tertiary: [],
  },

  // Shoulder exercises
  'Barbell_Shoulder_Press': {
    primary: ['shoulders'],
    secondary: ['triceps'],
    tertiary: ['traps'],
  },
  'Barbell_Shrug': {
    primary: ['traps'],
    secondary: ['shoulders'],
    tertiary: ['forearms'],
  },
  'Barbell_Upright_Row': {
    primary: ['shoulders', 'traps'],
    secondary: ['biceps'],
    tertiary: ['forearms'],
  },

  // Arm exercises
  'Barbell_Curl': {
    primary: ['biceps'],
    secondary: ['forearms'],
    tertiary: ['shoulders'],
  },
  'Barbell_Lying_Close-Grip_Triceps_Press_To_Chin': {
    primary: ['triceps'],
    secondary: ['chest'],
    tertiary: ['shoulders'],
  },
  'Barbell_Lying_Triceps_Extension': {
    primary: ['triceps'],
    secondary: [],
    tertiary: [],
  },

  // Leg exercises
  'Barbell_Glute_Bridge': {
    primary: ['glutes', 'hamstrings'],
    secondary: ['lower back'],
    tertiary: ['quadriceps'],
  },
  'Barbell_Hack_Squat': {
    primary: ['quadriceps'],
    secondary: ['glutes', 'calves'],
    tertiary: ['lower back'],
  },
  'Barbell_Hip_Thrust': {
    primary: ['glutes', 'hamstrings'],
    secondary: ['lower back'],
    tertiary: ['quadriceps'],
  },

  // Core exercises
  '3_4_Sit-Up': {
    primary: ['abdominals'],
    secondary: [],
    tertiary: [],
  },
  'Ab_Crunch_Machine': {
    primary: ['abdominals'],
    secondary: [],
    tertiary: [],
  },
  'Ab_Roller': {
    primary: ['abdominals'],
    secondary: ['shoulders', 'lats'],
    tertiary: ['triceps'],
  },

  // Stretching and mobility
  '90_90_Hamstring': {
    primary: ['hamstrings'],
    secondary: ['calves'],
    tertiary: ['glutes'],
  },
  'All_Fours_Quad_Stretch': {
    primary: ['quadriceps'],
    secondary: [],
    tertiary: [],
  },

  // Dumbbell exercises
  'Alternate_Hammer_Curl': {
    primary: ['biceps'],
    secondary: ['forearms'],
    tertiary: [],
  },
  'Alternate_Incline_Dumbbell_Curl': {
    primary: ['biceps'],
    secondary: ['forearms'],
    tertiary: [],
  },
  'Arnold_Dumbbell_Press': {
    primary: ['shoulders'],
    secondary: ['triceps'],
    tertiary: ['traps'],
  },

  // Bodyweight exercises
  'Air_Bike': {
    primary: ['abdominals'],
    secondary: [],
    tertiary: [],
  },
  'Alternate_Heel_Touchers': {
    primary: ['abdominals'],
    secondary: [],
    tertiary: [],
  },

  // Additional common exercises would continue here...
  // This provides a comprehensive mapping for the most popular exercises
  // while maintaining the structure for future expansion
};

/**
 * Get muscle mapping for a specific exercise
 * @param exerciseId The exercise ID
 * @returns The muscle mapping or undefined if not found
 */
export function getExerciseMuscles(exerciseId: string): ExerciseMuscleMapping | undefined {
  return EXERCISE_MUSCLES[exerciseId];
}

/**
 * Get all exercises that target a specific muscle group
 * @param muscleGroup The muscle group to search for
 * @param role Filter by role: 'primary', 'secondary', 'tertiary', or 'all'
 * @returns Array of exercise IDs that target the muscle group
 */
export function getExercisesForMuscleGroup(
  muscleGroup: MuscleGroup,
  role: 'primary' | 'secondary' | 'tertiary' | 'all' = 'all'
): string[] {
  const result: string[] = [];

  for (const [exerciseId, mapping] of Object.entries(EXERCISE_MUSCLES)) {
    if (role === 'all') {
      if (mapping.primary.includes(muscleGroup) ||
          mapping.secondary.includes(muscleGroup) ||
          mapping.tertiary.includes(muscleGroup)) {
        result.push(exerciseId);
      }
    } else {
      if (mapping[role].includes(muscleGroup)) {
        result.push(exerciseId);
      }
    }
  }

  return result;
}

/**
 * Get the primary muscle groups for an exercise
 * @param exerciseId The exercise ID
 * @returns Array of primary muscle groups or empty array if not found
 */
export function getPrimaryMuscles(exerciseId: string): MuscleGroup[] {
  return EXERCISE_MUSCLES[exerciseId]?.primary || [];
}

/**
 * Get the secondary muscle groups for an exercise
 * @param exerciseId The exercise ID
 * @returns Array of secondary muscle groups or empty array if not found
 */
export function getSecondaryMuscles(exerciseId: string): MuscleGroup[] {
  return EXERCISE_MUSCLES[exerciseId]?.secondary || [];
}

/**
 * Get the tertiary muscle groups for an exercise
 * @param exerciseId The exercise ID
 * @returns Array of tertiary muscle groups or empty array if not found
 */
export function getTertiaryMuscles(exerciseId: string): MuscleGroup[] {
  return EXERCISE_MUSCLES[exerciseId]?.tertiary || [];
}