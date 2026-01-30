// src/data/muscleGroups.ts
export interface MuscleGroup {
  id: string;
  name: string;
  region: 'upper' | 'lower' | 'core';
  side: 'front' | 'back';
  svgPath: string;
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  // Upper Body - Front
  {
    id: 'upper_chest',
    name: 'Upper Chest',
    region: 'upper',
    side: 'front',
    svgPath: 'M 38 42 L 50 38 L 62 42 L 62 48 L 38 48 Z'
  },
  {
    id: 'lower_chest',
    name: 'Lower Chest',
    region: 'upper',
    side: 'front',
    svgPath: 'M 38 48 L 62 48 L 58 55 L 42 55 Z'
  },
  {
    id: 'front_delt',
    name: 'Front Deltoid',
    region: 'upper',
    side: 'front',
    svgPath: 'M 40 30 L 35 38 L 42 40 Z M 60 30 L 65 38 L 58 40 Z'
  },
  {
    id: 'side_delt',
    name: 'Lateral Deltoid',
    region: 'upper',
    side: 'front',
    svgPath: 'M 35 38 L 32 45 L 38 45 Z M 65 38 L 68 45 L 62 45 Z'
  },
  {
    id: 'rear_delt',
    name: 'Posterior Deltoid',
    region: 'upper',
    side: 'front',
    svgPath: 'M 38 45 L 42 50 L 45 48 Z M 55 45 L 62 50 L 58 48 Z'
  },
  {
    id: 'traps',
    name: 'Trapezius',
    region: 'upper',
    side: 'front',
    svgPath: 'M 46 18 L 54 18 L 54 25 L 46 25 Z M 46 25 L 40 30 L 46 30 Z M 54 25 L 60 30 L 54 30 Z'
  },
  {
    id: 'biceps',
    name: 'Biceps',
    region: 'upper',
    side: 'front',
    svgPath: 'M 32 45 L 28 55 L 32 60 L 38 55 Z M 62 45 L 68 55 L 62 60 L 58 55 Z'
  },
  {
    id: 'forearms',
    name: 'Forearms',
    region: 'upper',
    side: 'front',
    svgPath: 'M 28 55 L 25 70 L 30 72 L 32 60 Z M 68 55 L 72 70 L 68 72 L 62 60 Z'
  },
  {
    id: 'upper_abs',
    name: 'Upper Abs',
    region: 'core',
    side: 'front',
    svgPath: 'M 42 55 L 58 55 L 56 62 L 44 62 Z'
  },
  {
    id: 'lower_abs',
    name: 'Lower Abs',
    region: 'core',
    side: 'front',
    svgPath: 'M 44 62 L 56 62 L 54 70 L 46 70 Z'
  },
  {
    id: 'obliques',
    name: 'Obliques',
    region: 'core',
    side: 'front',
    svgPath: 'M 42 55 L 38 70 L 44 70 Z M 58 55 L 62 70 L 56 70 Z'
  },

  // Upper Body - Back
  {
    id: 'lats',
    name: 'Latissimus Dorsi',
    region: 'upper',
    side: 'back',
    svgPath: 'M 40 30 L 35 45 L 45 55 L 55 45 L 60 30 L 55 35 Z'
  },
  {
    id: 'mid_back',
    name: 'Mid Back',
    region: 'upper',
    side: 'back',
    svgPath: 'M 45 35 L 55 35 L 55 45 L 45 45 Z'
  },
  {
    id: 'lower_back',
    name: 'Lower Back',
    region: 'core',
    side: 'back',
    svgPath: 'M 45 55 L 55 55 L 55 75 L 45 75 Z'
  },
  {
    id: 'triceps',
    name: 'Triceps',
    region: 'upper',
    side: 'back',
    svgPath: 'M 38 45 L 42 55 L 38 60 L 32 55 Z M 62 45 L 58 55 L 62 60 L 68 55 Z'
  },

  // Lower Body - Front
  {
    id: 'quads',
    name: 'Quadriceps',
    region: 'lower',
    side: 'front',
    svgPath: 'M 38 70 L 35 95 L 42 95 L 42 75 Z M 62 70 L 65 95 L 58 95 L 58 75 Z'
  },
  {
    id: 'adductors',
    name: 'Adductors',
    region: 'lower',
    side: 'front',
    svgPath: 'M 42 75 L 50 85 L 58 75 Z'
  },

  // Lower Body - Back
  {
    id: 'glutes',
    name: 'Glutes',
    region: 'lower',
    side: 'back',
    svgPath: 'M 42 95 L 50 100 L 58 95 L 58 105 L 50 110 L 42 105 Z'
  },
  {
    id: 'abductors',
    name: 'Abductors',
    region: 'lower',
    side: 'back',
    svgPath: 'M 38 95 L 42 105 L 45 100 Z M 55 95 L 62 105 L 58 100 Z'
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    region: 'lower',
    side: 'back',
    svgPath: 'M 42 75 L 42 95 L 40 110 L 35 95 L 35 75 Z M 58 75 L 58 95 L 60 110 L 65 95 L 65 75 Z'
  },
  {
    id: 'calves',
    name: 'Calves',
    region: 'lower',
    side: 'back',
    svgPath: 'M 38 110 L 36 130 L 42 130 L 42 110 Z M 62 110 L 64 130 L 58 130 L 58 110 Z'
  },
];
