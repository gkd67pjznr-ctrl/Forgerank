/**
 * Volume Calculator Usage Examples
 *
 * This file demonstrates how to use the volume calculator with real workout data.
 */

import {
  calculateVolumeForSessions,
  calculateWeeklyVolumeAverages,
  getTopMuscleGroups,
  calculateVolumeDistribution,
  calculateNormalizedVolumes,
} from './volumeCalculator';
import type { WorkoutSession } from './workoutModel';

// Example workout sessions
const sessions: WorkoutSession[] = [
  {
    id: 'session-1',
    userId: 'user-123',
    startedAtMs: Date.now() - 86400000, // Yesterday
    endedAtMs: Date.now() - 86400000 + 3600000, // 1 hour later
    sets: [
      { id: 'set-1', exerciseId: 'bench', weightKg: 100, reps: 5, timestampMs: Date.now() - 86400000 },
      { id: 'set-2', exerciseId: 'bench', weightKg: 95, reps: 6, timestampMs: Date.now() - 86400000 + 1000 },
      { id: 'set-3', exerciseId: 'squat', weightKg: 120, reps: 5, timestampMs: Date.now() - 86400000 + 2000 },
      { id: 'set-4', exerciseId: 'squat', weightKg: 115, reps: 6, timestampMs: Date.now() - 86400000 + 3000 },
    ],
  },
  {
    id: 'session-2',
    userId: 'user-123',
    startedAtMs: Date.now() - 172800000, // 2 days ago
    endedAtMs: Date.now() - 172800000 + 3600000, // 1 hour later
    sets: [
      { id: 'set-5', exerciseId: 'deadlift', weightKg: 140, reps: 3, timestampMs: Date.now() - 172800000 },
      { id: 'set-6', exerciseId: 'deadlift', weightKg: 135, reps: 4, timestampMs: Date.now() - 172800000 + 1000 },
      { id: 'set-7', exerciseId: 'pullup', weightKg: 20, reps: 8, timestampMs: Date.now() - 172800000 + 2000 },
      { id: 'set-8', exerciseId: 'pullup', weightKg: 20, reps: 8, timestampMs: Date.now() - 172800000 + 3000 },
    ],
  },
];

// Example 1: Calculate total volume for all sessions
console.log('=== Total Volume Calculation ===');
const totalVolumeResult = calculateVolumeForSessions(sessions);
console.log('Total Volume:', totalVolumeResult.totalVolumeKg, 'kg');
console.log('Sessions:', totalVolumeResult.sessionCount);
console.log('Volume by Exercise:', totalVolumeResult.volumeByExercise);
console.log('Volume by Muscle Group:', totalVolumeResult.volumeByMuscleGroup);

// Example 2: Get top muscle groups
console.log('\n=== Top Muscle Groups ===');
const topMuscles = getTopMuscleGroups(totalVolumeResult, 3);
console.log('Top 3 Muscle Groups:');
topMuscles.forEach((muscle, index) => {
  console.log(`${index + 1}. ${muscle.muscle}: ${muscle.volume.toFixed(0)} kg`);
});

// Example 3: Calculate weekly averages
console.log('\n=== Weekly Volume Averages ===');
const weeklyAverages = calculateWeeklyVolumeAverages(sessions);
console.log('Average Weekly Volume:', weeklyAverages.totalVolumeKg.toFixed(0), 'kg');
console.log('Average Weekly Volume by Muscle Group:', weeklyAverages.volumeByMuscleGroup);

// Example 4: Calculate normalized volumes for visualization
console.log('\n=== Normalized Volumes (0-1) ===');
const normalizedVolumes = calculateNormalizedVolumes(totalVolumeResult);
console.log('Normalized Volumes:', normalizedVolumes);

// Example 5: Calculate volume distribution percentages
console.log('\n=== Volume Distribution (%) ===');
const distribution = calculateVolumeDistribution(totalVolumeResult);
console.log('Volume Distribution:', distribution);

// Example 6: Filter by time range (last 7 days)
console.log('\n=== Volume Last 7 Days ===');
const last7DaysResult = calculateVolumeForSessions(sessions, {
  timeRangeMs: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});
console.log('Volume Last 7 Days:', last7DaysResult.totalVolumeKg, 'kg');
console.log('Sessions Last 7 Days:', last7DaysResult.sessionCount);