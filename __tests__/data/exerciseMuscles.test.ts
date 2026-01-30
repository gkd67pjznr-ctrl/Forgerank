/**
 * Exercise Muscle Mappings Tests
 */

import {
  getExerciseMuscles,
  getExercisesForMuscleGroup,
  getPrimaryMuscles,
  getSecondaryMuscles,
  getTertiaryMuscles,
  EXERCISE_MUSCLES
} from '@/src/data/exerciseMuscles';

describe('Exercise Muscle Mappings', () => {
  describe('getExerciseMuscles', () => {
    it('should return muscle mapping for bench press', () => {
      const result = getExerciseMuscles('Barbell_Bench_Press_-_Medium_Grip');
      expect(result).toBeDefined();
      expect(result?.primary).toContain('chest');
      expect(result?.primary).toContain('triceps');
      expect(result?.secondary).toContain('shoulders');
    });

    it('should return undefined for non-existent exercise', () => {
      const result = getExerciseMuscles('Non_Existent_Exercise');
      expect(result).toBeUndefined();
    });
  });

  describe('getExercisesForMuscleGroup', () => {
    it('should return exercises that target chest as primary muscle', () => {
      const result = getExercisesForMuscleGroup('chest', 'primary');
      expect(result).toContain('Barbell_Bench_Press_-_Medium_Grip');
      expect(result).toContain('Barbell_Incline_Bench_Press_-_Medium_Grip');
    });

    it('should return all exercises that target shoulders', () => {
      const result = getExercisesForMuscleGroup('shoulders');
      expect(result).toContain('Barbell_Bench_Press_-_Medium_Grip'); // secondary
      expect(result).toContain('Standing_Military_Press'); // primary
      expect(result).toContain('Bent_Over_Barbell_Row'); // secondary
    });

    it('should return empty array for non-existent muscle group', () => {
      const result = getExercisesForMuscleGroup('non_existent_muscle' as any);
      expect(result).toEqual([]);
    });
  });

  describe('getPrimaryMuscles', () => {
    it('should return primary muscles for squat', () => {
      const result = getPrimaryMuscles('Barbell_Full_Squat');
      expect(result).toContain('quadriceps');
      expect(result).toContain('glutes');
      expect(result.length).toBe(2);
    });

    it('should return empty array for non-existent exercise', () => {
      const result = getPrimaryMuscles('Non_Existent_Exercise');
      expect(result).toEqual([]);
    });
  });

  describe('getSecondaryMuscles', () => {
    it('should return secondary muscles for deadlift', () => {
      const result = getSecondaryMuscles('Barbell_Deadlift');
      expect(result).toContain('lower back');
      expect(result).toContain('quadriceps');
    });
  });

  describe('getTertiaryMuscles', () => {
    it('should return tertiary muscles for bench press', () => {
      const result = getTertiaryMuscles('Barbell_Bench_Press_-_Medium_Grip');
      expect(result).toContain('lats');
      expect(result).toContain('middle back');
    });

    it('should return empty array when no tertiary muscles', () => {
      const result = getTertiaryMuscles('3_4_Sit-Up');
      expect(result).toEqual([]);
    });
  });

  describe('EXERCISE_MUSCLES constant', () => {
    it('should contain bench press mapping', () => {
      expect(EXERCISE_MUSCLES['Barbell_Bench_Press_-_Medium_Grip']).toBeDefined();
    });

    it('should have correct structure', () => {
      const benchPress = EXERCISE_MUSCLES['Barbell_Bench_Press_-_Medium_Grip'];
      expect(benchPress).toHaveProperty('primary');
      expect(benchPress).toHaveProperty('secondary');
      expect(benchPress).toHaveProperty('tertiary');
      expect(Array.isArray(benchPress.primary)).toBe(true);
      expect(Array.isArray(benchPress.secondary)).toBe(true);
      expect(Array.isArray(benchPress.tertiary)).toBe(true);
    });
  });
});