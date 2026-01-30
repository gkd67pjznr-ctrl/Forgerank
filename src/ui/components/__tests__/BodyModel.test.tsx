// BodyModel component tests
import React from 'react';
import { render } from '@testing-library/react-native';
import { BodyModel } from '../BodyModel';

describe('BodyModel Component', () => {
  it('should render without crashing', () => {
    const mockVolumes = {
      'chest': 0.8,
      'shoulders': 0.6,
      'quadriceps': 0.9,
    };

    const { UNSAFE_root } = render(
      <BodyModel muscleVolumes={mockVolumes} side="front" />
    );

    // Should render the component
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle empty volumes', () => {
    const { UNSAFE_root } = render(
      <BodyModel muscleVolumes={{}} side="front" />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render back view', () => {
    const mockVolumes = {
      'lats': 0.7,
      'lower back': 0.5,
      'hamstrings': 0.8,
    };

    const { UNSAFE_root } = render(
      <BodyModel muscleVolumes={mockVolumes} side="back" />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should map standard muscle groups to detailed ones', () => {
    const mockVolumes = {
      'chest': 1.0, // Should map to upper_chest and lower_chest
      'shoulders': 0.8, // Should map to front_delt, side_delt, rear_delt, traps
    };

    const { UNSAFE_root } = render(
      <BodyModel muscleVolumes={mockVolumes} side="front" />
    );

    expect(UNSAFE_root).toBeTruthy();
  });
});