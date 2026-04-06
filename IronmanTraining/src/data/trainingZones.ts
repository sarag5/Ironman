import { IntensityZone } from '../types';

export function calculateSwimPaceZones(thresholdPace: number): Record<IntensityZone, [number, number]> {
  // thresholdPace in seconds per 100m (CSS — Critical Swim Speed)
  return {
    1: [thresholdPace * 1.25, thresholdPace * 1.4],
    2: [thresholdPace * 1.1, thresholdPace * 1.25],
    3: [thresholdPace * 1.02, thresholdPace * 1.1],
    4: [thresholdPace * 0.97, thresholdPace * 1.02],
    5: [thresholdPace * 0.9, thresholdPace * 0.97],
  };
}

export function calculateBikePowerZones(ftp: number): Record<IntensityZone, [number, number]> {
  // Returns watts — Coggan power zones
  return {
    1: [0, ftp * 0.55],
    2: [ftp * 0.56, ftp * 0.75],
    3: [ftp * 0.76, ftp * 0.90],
    4: [ftp * 0.91, ftp * 1.05],
    5: [ftp * 1.06, ftp * 1.20],
  };
}

export function calculateRunPaceZones(thresholdPace: number): Record<IntensityZone, [number, number]> {
  // thresholdPace in seconds per km
  return {
    1: [thresholdPace * 1.3, thresholdPace * 1.5],
    2: [thresholdPace * 1.15, thresholdPace * 1.3],
    3: [thresholdPace * 1.05, thresholdPace * 1.15],
    4: [thresholdPace * 0.98, thresholdPace * 1.05],
    5: [thresholdPace * 0.88, thresholdPace * 0.98],
  };
}

export function calculateHeartRateZones(maxHR: number, restingHR: number): Record<IntensityZone, [number, number]> {
  // Karvonen Heart Rate Reserve method
  const hrReserve = maxHR - restingHR;
  return {
    1: [restingHR + hrReserve * 0.50, restingHR + hrReserve * 0.60],
    2: [restingHR + hrReserve * 0.60, restingHR + hrReserve * 0.70],
    3: [restingHR + hrReserve * 0.70, restingHR + hrReserve * 0.80],
    4: [restingHR + hrReserve * 0.80, restingHR + hrReserve * 0.90],
    5: [restingHR + hrReserve * 0.90, maxHR],
  };
}
