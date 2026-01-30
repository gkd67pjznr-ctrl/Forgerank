import { describe, expect, it } from '@jest/globals';
import {
  calculateSetVolume,
  calculateSessionVolume,
  calculateVolumeForSessions,
  getVolumeForMuscleGroup,
  getTopMuscleGroups,
  calculateWeeklyVolumeAverages,
  calculateVolumePerSession,
  calculateNormalizedVolumes,
  calculateVolumeDistribution,
  calculateMuscleGroupRatio,
} from '../volumeCalculator';
import type { WorkoutSession, WorkoutSet } from '../workoutModel';

describe('Volume Calculator', () => {
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  const oneDayAgo = now - 86400000;
  const oneWeekAgo = now - 604800000;

  const benchSet: WorkoutSet = {
    id: 'set1',
    exerciseId: 'bench',
    weightKg: 100,
    reps: 5,
    timestampMs: now,
  };

  const squatSet: WorkoutSet = {
    id: 'set2',
    exerciseId: 'squat',
    weightKg: 120,
    reps: 3,
    timestampMs: now - 1000,
  };

  const deadliftSet: WorkoutSet = {
    id: 'set3',
    exerciseId: 'deadlift',
    weightKg: 150,
    reps: 2,
    timestampMs: now - 2000,
  };

  const session1: WorkoutSession = {
    id: 'session1',
    userId: 'user1',
    startedAtMs: now,
    endedAtMs: now + 3600000,
    sets: [benchSet, squatSet, deadliftSet],
  };

  const session2: WorkoutSession = {
    id: 'session2',
    userId: 'user1',
    startedAtMs: oneDayAgo,
    endedAtMs: oneDayAgo + 3600000,
    sets: [
      {
        id: 'set4',
        exerciseId: 'bench',
        weightKg: 90,
        reps: 8,
        timestampMs: oneDayAgo,
      },
      {
        id: 'set5',
        exerciseId: 'squat',
        weightKg: 110,
        reps: 5,
        timestampMs: oneDayAgo + 1000,
      },
    ],
  };

  const sessions = [session1, session2];

  describe('calculateSetVolume', () => {
    it('should calculate volume for a single set', () => {
      expect(calculateSetVolume(benchSet)).toBe(100 * 5); // 500
      expect(calculateSetVolume(squatSet)).toBe(120 * 3); // 360
      expect(calculateSetVolume(deadliftSet)).toBe(150 * 2); // 300
    });
  });

  describe('calculateSessionVolume', () => {
    it('should calculate volume for a session', () => {
      const result = calculateSessionVolume(session1);

      expect(result.totalVolumeKg).toBe(500 + 360 + 300); // 1160
      expect(result.sessionCount).toBe(1);
      expect(result.volumeByExercise['bench']).toBe(500);
      expect(result.volumeByExercise['squat']).toBe(360);
      expect(result.volumeByExercise['deadlift']).toBe(300);
    });

    it('should calculate muscle group volumes', () => {
      const result = calculateSessionVolume(session1);

      // Bench primarily works chest, secondarily shoulders and triceps
      expect(result.volumeByMuscleGroup['chest']).toBeGreaterThan(0);

      // Squat primarily works quads and glutes
      expect(result.volumeByMuscleGroup['quadriceps']).toBeGreaterThan(0);
      expect(result.volumeByMuscleGroup['glutes']).toBeGreaterThan(0);

      // Deadlift primarily works glutes, hamstrings, and lower back
      expect(result.volumeByMuscleGroup['hamstrings']).toBeGreaterThan(0);
      expect(result.volumeByMuscleGroup['lower back']).toBeGreaterThan(0);
    });
  });

  describe('calculateVolumeForSessions', () => {
    it('should calculate volume across multiple sessions', () => {
      const result = calculateVolumeForSessions(sessions);

      // Total volume: 500 + 360 + 300 + 720 + 550 = 2430
      expect(result.totalVolumeKg).toBe(2430);
      expect(result.sessionCount).toBe(2);
      expect(result.volumeByExercise['bench']).toBe(500 + 720); // 1220
      expect(result.volumeByExercise['squat']).toBe(360 + 550); // 910
      expect(result.volumeByExercise['deadlift']).toBe(300);
    });

    it('should filter by time range', () => {
      const result = calculateVolumeForSessions(sessions, {
        timeRangeMs: 24 * 60 * 60 * 1000, // Last 24 hours
      });

      // Should only include session1 (today)
      expect(result.totalVolumeKg).toBe(1160);
      expect(result.sessionCount).toBe(1);
    });

    it('should filter by date range', () => {
      const result = calculateVolumeForSessions(sessions, {
        startDateMs: oneDayAgo,
        endDateMs: now,
      });

      // Should include both sessions
      expect(result.totalVolumeKg).toBe(2430);
      expect(result.sessionCount).toBe(2);
    });
  });

  describe('getVolumeForMuscleGroup', () => {
    it('should get volume for a specific muscle group', () => {
      const result = calculateVolumeForSessions(sessions);

      const chestVolume = getVolumeForMuscleGroup(result, 'chest');
      expect(chestVolume).toBeGreaterThan(0);

      const quadsVolume = getVolumeForMuscleGroup(result, 'quadriceps');
      expect(quadsVolume).toBeGreaterThan(0);
    });

    it('should return 0 for untrained muscle groups', () => {
      const result = calculateVolumeForSessions(sessions);

      const neckVolume = getVolumeForMuscleGroup(result, 'neck');
      expect(neckVolume).toBe(0);
    });
  });

  describe('getTopMuscleGroups', () => {
    it('should get top muscle groups by volume', () => {
      const result = calculateVolumeForSessions(sessions);
      const topMuscles = getTopMuscleGroups(result, 3);

      expect(topMuscles.length).toBe(3);
      expect(topMuscles[0].volume).toBeGreaterThanOrEqual(topMuscles[1].volume);
      expect(topMuscles[1].volume).toBeGreaterThanOrEqual(topMuscles[2].volume);
    });
  });

  describe('calculateWeeklyVolumeAverages', () => {
    it('should calculate weekly averages', () => {
      const result = calculateWeeklyVolumeAverages(sessions);

      // With 2 sessions over ~1 day, weekly average should equal total (since duration < 1 week)
      expect(result.totalVolumeKg).toBe(2430);
      expect(result.sessionCount).toBe(2);
    });

    it('should handle empty sessions', () => {
      const result = calculateWeeklyVolumeAverages([], {});

      expect(result.totalVolumeKg).toBe(0);
      expect(result.sessionCount).toBe(0);
    });
  });

  describe('calculateVolumePerSession', () => {
    it('should calculate average volume per session', () => {
      const totalResult = calculateVolumeForSessions(sessions);
      const perSessionResult = calculateVolumePerSession(totalResult);

      expect(perSessionResult.totalVolumeKg).toBeCloseTo(2430 / 2); // ~1215
      expect(perSessionResult.sessionCount).toBe(1);
    });
  });

  describe('calculateNormalizedVolumes', () => {
    it('should normalize volumes to 0-1 range', () => {
      const result = calculateVolumeForSessions(sessions);
      const normalized = calculateNormalizedVolumes(result);

      const values = Object.values(normalized);
      if (values.length > 0) {
        const maxValue = Math.max(...values);
        expect(maxValue).toBeCloseTo(1, 2); // Should be ~1.0
      }
    });

    it('should handle empty results', () => {
      const emptyResult = {
        totalVolumeKg: 0,
        volumeByMuscleGroup: {},
        volumeByExercise: {},
        sessionCount: 0,
      };

      const normalized = calculateNormalizedVolumes(emptyResult);
      expect(Object.keys(normalized).length).toBe(0);
    });
  });

  describe('calculateVolumeDistribution', () => {
    it('should calculate percentage distribution', () => {
      const result = calculateVolumeForSessions(sessions);
      const distribution = calculateVolumeDistribution(result);

      // Note: Distribution percentages can sum to more than 100% because
      // exercises work multiple muscle groups and the same volume is counted
      // for multiple muscles (e.g., squat works both quads and glutes)
      const totalPercentage = Object.values(distribution).reduce((sum, val) => sum + val, 0);
      expect(totalPercentage).toBeGreaterThan(100); // Should be > 100% due to overlap
      expect(totalPercentage).toBeLessThan(500); // Should be reasonable
    });
  });

  describe('calculateMuscleGroupRatio', () => {
    it('should calculate ratio between muscle groups', () => {
      const result = calculateVolumeForSessions(sessions);

      const chestVolume = getVolumeForMuscleGroup(result, 'chest');
      const quadsVolume = getVolumeForMuscleGroup(result, 'quadriceps');

      if (quadsVolume > 0) {
        const ratio = calculateMuscleGroupRatio(result, 'chest', 'quadriceps');
        expect(ratio).toBe(chestVolume / quadsVolume);
      }
    });

    it('should handle zero volume in denominator', () => {
      const result = calculateVolumeForSessions(sessions);
      const ratio = calculateMuscleGroupRatio(result, 'chest', 'neck');

      // Should return Infinity when denominator is 0 but numerator > 0
      expect(ratio).toBe(Infinity);
    });
  });
});
