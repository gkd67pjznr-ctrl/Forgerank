/**
 * Exercise Database Integration Tests
 * Tests how exerciseMuscles integrates with exerciseDatabase
 */

import { getExerciseMuscles, getPrimaryMuscles, getSecondaryMuscles, getTertiaryMuscles, getExercisesForMuscleGroup } from '@/src/data/exerciseMuscles';

describe('Exercise Database Integration', () => {
  describe('Muscle Mapping Integration', () => {
    it('should provide detailed muscle info for popular exercises', () => {
      // Test that all popular exercises have muscle mappings
      const popularExercises = [
        'Barbell_Bench_Press_-_Medium_Grip',
        'Barbell_Full_Squat',
        'Barbell_Deadlift',
        'Standing_Military_Press',
        'Bent_Over_Barbell_Row',
        'Pullups',
        'Barbell_Incline_Bench_Press_-_Medium_Grip',
        'Romanian_Deadlift',
        'Leg_Press',
        'Wide-Grip_Lat_Pulldown'
      ];

      popularExercises.forEach(exerciseId => {
        const muscles = getExerciseMuscles(exerciseId);
        expect(muscles).toBeDefined();
        expect(muscles?.primary.length).toBeGreaterThan(0);
        expect(Array.isArray(muscles?.primary)).toBe(true);
        expect(Array.isArray(muscles?.secondary)).toBe(true);
        expect(Array.isArray(muscles?.tertiary)).toBe(true);
      });
    });

    it('should allow finding exercises by muscle group', () => {
      // Find all exercises that work chest
      const chestExercises = getExercisesForMuscleGroup('chest');
      expect(chestExercises.length).toBeGreaterThan(0);
      expect(chestExercises).toContain('Barbell_Bench_Press_-_Medium_Grip');
      expect(chestExercises).toContain('Barbell_Incline_Bench_Press_-_Medium_Grip');

      // Find all exercises that work legs
      const quadExercises = getExercisesForMuscleGroup('quadriceps');
      expect(quadExercises.length).toBeGreaterThan(0);
      expect(quadExercises).toContain('Barbell_Full_Squat');
      expect(quadExercises).toContain('Leg_Press');

      // Find all exercises that work back
      const backExercises = getExercisesForMuscleGroup('lats');
      expect(backExercises.length).toBeGreaterThan(0);
      expect(backExercises).toContain('Pullups');
      expect(backExercises).toContain('Bent_Over_Barbell_Row');
    });

    it('should provide comprehensive muscle breakdown for compound lifts', () => {
      // Bench press should work chest (primary), triceps (primary), shoulders (secondary)
      const benchMuscles = getExerciseMuscles('Barbell_Bench_Press_-_Medium_Grip');
      expect(benchMuscles?.primary).toContain('chest');
      expect(benchMuscles?.primary).toContain('triceps');
      expect(benchMuscles?.secondary).toContain('shoulders');

      // Squat should work quads and glutes (primary), hamstrings (secondary)
      const squatMuscles = getExerciseMuscles('Barbell_Full_Squat');
      expect(squatMuscles?.primary).toContain('quadriceps');
      expect(squatMuscles?.primary).toContain('glutes');
      expect(squatMuscles?.secondary).toContain('hamstrings');

      // Deadlift should work hamstrings and glutes (primary), lower back (secondary)
      const deadliftMuscles = getExerciseMuscles('Barbell_Deadlift');
      expect(deadliftMuscles?.primary).toContain('hamstrings');
      expect(deadliftMuscles?.primary).toContain('glutes');
      expect(deadliftMuscles?.secondary).toContain('lower back');
    });

    it('should handle edge cases gracefully', () => {
      // Non-existent exercise should return undefined
      expect(getExerciseMuscles('Non_Existent_Exercise')).toBeUndefined();

      // Non-existent muscle group should return empty array
      expect(getExercisesForMuscleGroup('non_existent' as any)).toEqual([]);

      // Getting muscles for non-existent exercise should return empty arrays
      expect(getPrimaryMuscles('Non_Existent_Exercise')).toEqual([]);
    });
  });

  describe('Use Case Examples', () => {
    it('should support workout planning by muscle group', () => {
      // Example: Find all exercises that work chest for a chest day
      const chestDayExercises = getExercisesForMuscleGroup('chest');
      expect(chestDayExercises.length).toBeGreaterThan(0);

      // Example: Find all exercises that work legs for a leg day
      const legDayExercises = [
        ...getExercisesForMuscleGroup('quadriceps'),
        ...getExercisesForMuscleGroup('hamstrings'),
        ...getExercisesForMuscleGroup('glutes'),
        ...getExercisesForMuscleGroup('calves')
      ];
      expect(legDayExercises.length).toBeGreaterThan(0);
    });

    it('should support muscle balance analysis', () => {
      // Example: Check if an exercise works both primary and secondary muscles
      const benchPressPrimary = getPrimaryMuscles('Barbell_Bench_Press_-_Medium_Grip');
      const benchPressSecondary = getSecondaryMuscles('Barbell_Bench_Press_-_Medium_Grip');

      expect(benchPressPrimary.length).toBeGreaterThan(0);
      expect(benchPressSecondary.length).toBeGreaterThan(0);

      // Example: Verify that compound lifts work multiple muscle groups
      const squatAllMuscles = [
        ...getPrimaryMuscles('Barbell_Full_Squat'),
        ...getSecondaryMuscles('Barbell_Full_Squat'),
        ...getTertiaryMuscles('Barbell_Full_Squat')
      ];
      expect(squatAllMuscles.length).toBeGreaterThan(2); // Should work multiple muscle groups
    });
  });
});