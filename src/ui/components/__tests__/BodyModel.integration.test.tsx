// BodyModel integration test
import React from 'react';
import { render } from '@testing-library/react-native';
import { BodyModel } from '../BodyModel';
import { calculateMuscleVolumes } from '@/src/lib/volumeCalculator';
import type { WorkoutSession } from '@/src/lib/workoutModel';

describe('BodyModel Integration', () => {
  it('should work with real workout data', () => {
    // Create mock workout sessions
    const mockSessions: WorkoutSession[] = [
      {
        id: 'session-1',
        startedAtMs: Date.now(),
        endedAtMs: Date.now() + 3600000,
        sets: [
          {
            id: 'set-1',
            exerciseId: 'bench',
            weightKg: 100,
            reps: 10,
            timestampMs: Date.now(),
          },
          {
            id: 'set-2',
            exerciseId: 'squat',
            weightKg: 120,
            reps: 8,
            timestampMs: Date.now() + 300000,
          },
        ],
      },
    ];

    // Calculate muscle volumes using the real function
    const muscleVolumes = calculateMuscleVolumes(mockSessions);

    // Render the BodyModel with the calculated volumes
    const { UNSAFE_root } = render(
      <BodyModel muscleVolumes={muscleVolumes} side="front" />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle multiple sessions', () => {
    const mockSessions: WorkoutSession[] = [
      {
        id: 'session-1',
        startedAtMs: Date.now() - 86400000, // Yesterday
        endedAtMs: Date.now() - 86400000 + 3600000,
        sets: [
          {
            id: 'set-1',
            exerciseId: 'bench',
            weightKg: 100,
            reps: 10,
            timestampMs: Date.now() - 86400000,
          },
        ],
      },
      {
        id: 'session-2',
        startedAtMs: Date.now(),
        endedAtMs: Date.now() + 3600000,
        sets: [
          {
            id: 'set-2',
            exerciseId: 'squat',
            weightKg: 120,
            reps: 8,
            timestampMs: Date.now(),
          },
        ],
      },
    ];

    const muscleVolumes = calculateMuscleVolumes(mockSessions);

    const { UNSAFE_root } = render(
      <BodyModel muscleVolumes={muscleVolumes} side="back" />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle empty sessions', () => {
    const muscleVolumes = calculateMuscleVolumes([]);

    const { UNSAFE_root } = render(
      <BodyModel muscleVolumes={muscleVolumes} side="front" />
    );

    expect(UNSAFE_root).toBeTruthy();
  });
});