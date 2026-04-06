import { TrainingPlan, TrainingWeek, Workout, DisciplineType } from '../types';

// ─── Workout Library ──────────────────────────────────────────────────────────

function workout(
  id: string,
  discipline: DisciplineType,
  title: string,
  description: string,
  duration: number,
  zone: 1 | 2 | 3 | 4 | 5,
  distance?: number,
  tss?: number,
): Workout {
  return { id, discipline, title, description, duration, zone, distance, tss };
}

// SWIM workouts
const SW_EASY = workout('sw-easy', 'swim', 'Easy Aerobic Swim', 'Warm up 400m, then steady Z2 swimming. Focus on form and breathing.', 45, 2, 2000, 40);
const SW_ENDURANCE = workout('sw-endur', 'swim', 'Endurance Swim', '600m warm up, 4x400m Z2 with 30s rest, 200m cool down.', 60, 2, 2800, 55);
const SW_LONG = workout('sw-long', 'swim', 'Long Aerobic Swim', '4000m continuous at Z2. Build feel for distance. Focus on sighting and pacing.', 80, 2, 4000, 72);
const SW_TEMPO = workout('sw-tempo', 'swim', 'Tempo Swim', '400m WU, 6x200m Z3 on 20s rest, 400m CD. Smooth, fast turnover.', 55, 3, 2800, 68);
const SW_THRESHOLD = workout('sw-thresh', 'swim', 'Threshold Intervals', '600m WU, 5x300m Z4 on 30s rest, 300m CD. Race-pace effort.', 60, 4, 3000, 85);
const SW_RACE_SIM = workout('sw-race', 'swim', 'Race Simulation Swim', 'Continuous 3800m (full IM distance). Steady Z2-Z3 throughout.', 75, 3, 3800, 80);
const SW_RACE_SIM_703 = workout('sw-race-703', 'swim', 'Race Sim Swim 70.3', 'Continuous 1900m (70.3 distance). Steady Z2-Z3, sight often.', 40, 3, 1900, 50);
const SW_TECHNIQUE = workout('sw-tech', 'swim', 'Technique & Drills', '200m WU, drill sets (catch-up, fingertip drag, kicking), 800m form swim, 200m CD.', 40, 2, 1600, 30);
const SW_INTERVALS = workout('sw-int', 'swim', 'Speed Intervals', '400m WU, 10x100m Z4-Z5 on 10s rest, 400m CD.', 50, 4, 2400, 75);

// BIKE workouts
const BK_EASY = workout('bk-easy', 'bike', 'Easy Recovery Ride', 'Easy spinning Z1-Z2. Keep HR low, cadence 85-95 rpm. Active recovery.', 60, 1, 25000, 35);
const BK_ENDURANCE = workout('bk-endur', 'bike', 'Aerobic Endurance Ride', 'Steady Z2 ride. Maintain cadence 85-90 rpm. Nutritional practice.', 120, 2, 50000, 80);
const BK_LONG = workout('bk-long', 'bike', 'Long Endurance Ride', '4-5hr Z2 ride with some Z3 surges. Practice nutrition every 30-45 min.', 240, 2, 100000, 160);
const BK_LONG_703 = workout('bk-long-703', 'bike', 'Long Ride 70.3', '2.5-3hr Z2 ride. Simulate 90km race effort. Nutrition practice.', 165, 2, 70000, 110);
const BK_TEMPO = workout('bk-tempo', 'bike', 'Tempo Intervals', 'WU 20min, 3x20min Z3 w/ 5min recovery, CD 20min. Smooth and controlled.', 105, 3, 45000, 100);
const BK_THRESHOLD = workout('bk-thresh', 'bike', 'Threshold Work', 'WU 20min, 2x20min Z4 w/ 5min rest, CD 20min. Sustainable hard effort.', 85, 4, 38000, 110);
const BK_SWEETSPOT = workout('bk-sweet', 'bike', 'Sweet Spot Intervals', 'WU 20min, 4x15min at 88-93% FTP w/ 5min rest, CD 20min.', 110, 3, 48000, 105);
const BK_VO2 = workout('bk-vo2', 'bike', 'VO2 Max Intervals', 'WU 20min, 6x3min Z5 w/ 3min easy, CD 20min. Top-end fitness.', 75, 5, 30000, 95);
const BK_RACE_SIM = workout('bk-race', 'bike', 'Race Simulation Ride', '180km effort at race pace (Z2-Z3). Nutrition every 20 min.', 300, 3, 180000, 210);
const BK_RACE_SIM_703 = workout('bk-race-703', 'bike', 'Race Sim Ride 70.3', '90km at race pace (Z3). Practice nutrition and pacing strategy.', 160, 3, 90000, 120);
const BK_HILLS = workout('bk-hills', 'bike', 'Hill Repeats', 'WU 20min, 6x5min climbs Z4 with easy descent, CD 20min. Build strength.', 90, 4, 35000, 105);
const BK_CADENCE = workout('bk-cad', 'bike', 'Cadence Drills', 'Z2 ride with cadence drills: 5min at 60rpm, 5min at 100rpm alternating.', 75, 2, 30000, 55);

// RUN workouts
const RN_EASY = workout('rn-easy', 'run', 'Easy Recovery Run', 'Easy Z1-Z2 pace. Completely conversational. Focus on relaxed form.', 40, 1, 6000, 35);
const RN_AEROBIC = workout('rn-aerob', 'run', 'Aerobic Base Run', 'Steady Z2 run. Relaxed breathing, easy conversation possible.', 60, 2, 10000, 55);
const RN_LONG = workout('rn-long', 'run', 'Long Run', 'Long Z2 run. Build endurance. Walk/run if needed. Hydrate well.', 120, 2, 20000, 110);
const RN_LONG_703 = workout('rn-long-703', 'run', 'Long Run 70.3', 'Z2 long run simulating 70.3 effort. 90-100min. Controlled breathing.', 95, 2, 16000, 88);
const RN_TEMPO = workout('rn-tempo', 'run', 'Tempo Run', 'WU 15min easy, 20min Z3 tempo, CD 15min easy. Comfortably hard pace.', 50, 3, 9000, 72);
const RN_THRESHOLD = workout('rn-thresh', 'run', 'Threshold Intervals', 'WU 15min, 4x8min Z4 w/ 2min jog, CD 15min. Race-pace effort.', 65, 4, 11000, 88);
const RN_INTERVALS = workout('rn-int', 'run', 'Speed Intervals', 'WU 15min, 8x400m Z4-5 w/ 400m jog, CD 15min. Fast leg turnover.', 60, 4, 10000, 85);
const RN_BRICK = workout('rn-brick', 'run', 'Brick Run (off bike)', 'Run immediately after bike. 20-30min easy Z2 to feel the brick legs.', 25, 2, 4000, 30);
const RN_BRICK_LONG = workout('rn-brick-long', 'run', 'Long Brick Run', 'Run 60min Z2 immediately after long bike. Simulate race fatigue.', 60, 2, 10000, 65);
const RN_HILLS = workout('rn-hills', 'run', 'Hill Repeats', 'WU 15min, 8x90sec hill Z4-5 w/ easy jog down, CD 15min.', 55, 4, 9000, 80);
const RN_RACE_SIM = workout('rn-race', 'run', 'Marathon Race Sim', 'Long run at Z2-Z3. 3hr progressive effort. Nutrition practice.', 180, 3, 30000, 160);
const RN_RACE_SIM_703 = workout('rn-race-703', 'run', 'Half Marathon Sim', '21km at race pace. Practice nutrition and pacing.', 110, 3, 21000, 100);

// BRICK workouts
const BRICK_SHORT = workout('brick-short', 'brick', 'Short Brick', '60min bike Z2 + 20min run Z2. Adapt to bike-to-run transition.', 80, 2, 46000, 75);
const BRICK_MEDIUM = workout('brick-med', 'brick', 'Medium Brick', '90min bike Z2-Z3 + 30min run Z2. Build transition fitness.', 120, 2, 60000, 110);
const BRICK_LONG = workout('brick-long-w', 'brick', 'Long Brick', '3hr bike Z2 + 60min run Z2. Simulate race day fatigue.', 240, 2, 130000, 185);

// REST
const REST = workout('rest', 'rest', 'Rest Day', 'Full rest or very gentle walk/yoga. Recovery is part of training.', 0, 1, 0, 0);
const ACTIVE_REST = workout('active-rest', 'rest', 'Active Recovery', 'Light yoga, stretching, or 20min easy walk. Keep moving, stay loose.', 30, 1, 0, 5);

// ─── 20-Week Full Ironman Plan ─────────────────────────────────────────────────

function buildIronmanWeek(weekNum: number): TrainingWeek {
  const phase =
    weekNum <= 6 ? 'base' :
    weekNum <= 12 ? 'build' :
    weekNum <= 16 ? 'peak' :
    weekNum <= 18 ? 'taper' : 'race';

  const isRecoveryWeek = weekNum % 4 === 0;

  interface DayPlan { dayOfWeek: number; workouts: Workout[] }
  let days: DayPlan[] = [];

  if (phase === 'base') {
    days = [
      { dayOfWeek: 1, workouts: [SW_TECHNIQUE, RN_EASY] },
      { dayOfWeek: 2, workouts: [BK_ENDURANCE] },
      { dayOfWeek: 3, workouts: [SW_EASY, RN_AEROBIC] },
      { dayOfWeek: 4, workouts: [BK_CADENCE] },
      { dayOfWeek: 5, workouts: [SW_EASY] },
      { dayOfWeek: 6, workouts: [BK_LONG, RN_BRICK] },
      { dayOfWeek: 0, workouts: [RN_LONG] },
    ];
  } else if (phase === 'build') {
    days = [
      { dayOfWeek: 1, workouts: [SW_THRESHOLD, RN_EASY] },
      { dayOfWeek: 2, workouts: [BK_SWEETSPOT] },
      { dayOfWeek: 3, workouts: [SW_TEMPO, RN_TEMPO] },
      { dayOfWeek: 4, workouts: [BK_TEMPO] },
      { dayOfWeek: 5, workouts: [SW_INTERVALS] },
      { dayOfWeek: 6, workouts: [BK_LONG, RN_BRICK_LONG] },
      { dayOfWeek: 0, workouts: [RN_LONG] },
    ];
  } else if (phase === 'peak') {
    days = [
      { dayOfWeek: 1, workouts: [SW_RACE_SIM, RN_EASY] },
      { dayOfWeek: 2, workouts: [BK_THRESHOLD] },
      { dayOfWeek: 3, workouts: [SW_THRESHOLD, RN_THRESHOLD] },
      { dayOfWeek: 4, workouts: [BK_HILLS] },
      { dayOfWeek: 5, workouts: [SW_ENDURANCE] },
      { dayOfWeek: 6, workouts: [BK_RACE_SIM, RN_BRICK_LONG] },
      { dayOfWeek: 0, workouts: [RN_RACE_SIM] },
    ];
  } else if (phase === 'taper') {
    days = [
      { dayOfWeek: 1, workouts: [SW_EASY] },
      { dayOfWeek: 2, workouts: [BK_EASY] },
      { dayOfWeek: 3, workouts: [SW_TECHNIQUE, RN_EASY] },
      { dayOfWeek: 4, workouts: [BK_CADENCE] },
      { dayOfWeek: 5, workouts: [SW_EASY] },
      { dayOfWeek: 6, workouts: [BRICK_SHORT] },
      { dayOfWeek: 0, workouts: [RN_EASY] },
    ];
  } else {
    // race week
    days = [
      { dayOfWeek: 1, workouts: [SW_EASY] },
      { dayOfWeek: 2, workouts: [BK_EASY] },
      { dayOfWeek: 3, workouts: [SW_TECHNIQUE] },
      { dayOfWeek: 4, workouts: [RN_EASY] },
      { dayOfWeek: 5, workouts: [ACTIVE_REST] },
      { dayOfWeek: 6, workouts: [REST] },
      { dayOfWeek: 0, workouts: [REST] }, // Race day
    ];
  }

  if (isRecoveryWeek) {
    days = [
      { dayOfWeek: 1, workouts: [SW_TECHNIQUE] },
      { dayOfWeek: 2, workouts: [BK_EASY] },
      { dayOfWeek: 3, workouts: [SW_EASY, RN_EASY] },
      { dayOfWeek: 4, workouts: [ACTIVE_REST] },
      { dayOfWeek: 5, workouts: [SW_EASY] },
      { dayOfWeek: 6, workouts: [BK_ENDURANCE] },
      { dayOfWeek: 0, workouts: [RN_AEROBIC] },
    ];
  }

  const phaseLabels: Record<string, string> = {
    base: 'Base Building – Aerobic Foundation',
    build: 'Build Phase – Increasing Intensity',
    peak: 'Peak Phase – Race Simulation',
    taper: 'Taper – Rest & Sharpen',
    race: 'Race Week',
  };

  const allWorkouts = days.flatMap(d => d.workouts);
  const totalDuration = allWorkouts.reduce((s, w) => s + w.duration, 0);
  const totalTSS = allWorkouts.reduce((s, w) => s + (w.tss || 0), 0);

  return {
    weekNumber: weekNum,
    phase: phase as any,
    days: days.map(d => ({
      dayOfWeek: d.dayOfWeek,
      workouts: d.workouts,
      totalDuration: d.workouts.reduce((s, w) => s + w.duration, 0),
    })),
    totalDuration: isRecoveryWeek ? Math.round(totalDuration * 0.65) : totalDuration,
    totalTSS: isRecoveryWeek ? Math.round(totalTSS * 0.65) : totalTSS,
    focus: isRecoveryWeek ? 'Recovery Week – Absorb Training Adaptations' : phaseLabels[phase],
  };
}

// ─── 16-Week Ironman 70.3 Plan ─────────────────────────────────────────────────

function build703Week(weekNum: number): TrainingWeek {
  const phase =
    weekNum <= 4 ? 'base' :
    weekNum <= 9 ? 'build' :
    weekNum <= 13 ? 'peak' :
    weekNum <= 15 ? 'taper' : 'race';

  const isRecoveryWeek = weekNum === 4 || weekNum === 8 || weekNum === 12;

  interface DayPlan { dayOfWeek: number; workouts: Workout[] }
  let days: DayPlan[] = [];

  if (phase === 'base') {
    days = [
      { dayOfWeek: 1, workouts: [SW_TECHNIQUE, RN_EASY] },
      { dayOfWeek: 2, workouts: [BK_ENDURANCE] },
      { dayOfWeek: 3, workouts: [SW_EASY, RN_AEROBIC] },
      { dayOfWeek: 4, workouts: [BK_CADENCE] },
      { dayOfWeek: 5, workouts: [SW_EASY] },
      { dayOfWeek: 6, workouts: [BK_LONG_703, RN_BRICK] },
      { dayOfWeek: 0, workouts: [RN_LONG_703] },
    ];
  } else if (phase === 'build') {
    days = [
      { dayOfWeek: 1, workouts: [SW_THRESHOLD, RN_EASY] },
      { dayOfWeek: 2, workouts: [BK_TEMPO] },
      { dayOfWeek: 3, workouts: [SW_TEMPO, RN_TEMPO] },
      { dayOfWeek: 4, workouts: [BK_SWEETSPOT] },
      { dayOfWeek: 5, workouts: [SW_INTERVALS] },
      { dayOfWeek: 6, workouts: [BK_LONG_703, RN_BRICK_LONG] },
      { dayOfWeek: 0, workouts: [RN_LONG_703] },
    ];
  } else if (phase === 'peak') {
    days = [
      { dayOfWeek: 1, workouts: [SW_RACE_SIM_703, RN_EASY] },
      { dayOfWeek: 2, workouts: [BK_THRESHOLD] },
      { dayOfWeek: 3, workouts: [SW_THRESHOLD, RN_THRESHOLD] },
      { dayOfWeek: 4, workouts: [BK_HILLS] },
      { dayOfWeek: 5, workouts: [SW_ENDURANCE] },
      { dayOfWeek: 6, workouts: [BK_RACE_SIM_703, RN_BRICK_LONG] },
      { dayOfWeek: 0, workouts: [RN_RACE_SIM_703] },
    ];
  } else if (phase === 'taper') {
    days = [
      { dayOfWeek: 1, workouts: [SW_EASY] },
      { dayOfWeek: 2, workouts: [BK_EASY] },
      { dayOfWeek: 3, workouts: [SW_TECHNIQUE, RN_EASY] },
      { dayOfWeek: 4, workouts: [BK_CADENCE] },
      { dayOfWeek: 5, workouts: [SW_EASY] },
      { dayOfWeek: 6, workouts: [BRICK_SHORT] },
      { dayOfWeek: 0, workouts: [RN_EASY] },
    ];
  } else {
    days = [
      { dayOfWeek: 1, workouts: [SW_EASY] },
      { dayOfWeek: 2, workouts: [BK_EASY] },
      { dayOfWeek: 3, workouts: [SW_TECHNIQUE] },
      { dayOfWeek: 4, workouts: [RN_EASY] },
      { dayOfWeek: 5, workouts: [ACTIVE_REST] },
      { dayOfWeek: 6, workouts: [REST] },
      { dayOfWeek: 0, workouts: [REST] },
    ];
  }

  if (isRecoveryWeek) {
    days = [
      { dayOfWeek: 1, workouts: [SW_TECHNIQUE] },
      { dayOfWeek: 2, workouts: [BK_EASY] },
      { dayOfWeek: 3, workouts: [SW_EASY, RN_EASY] },
      { dayOfWeek: 4, workouts: [ACTIVE_REST] },
      { dayOfWeek: 5, workouts: [SW_EASY] },
      { dayOfWeek: 6, workouts: [BK_ENDURANCE] },
      { dayOfWeek: 0, workouts: [RN_AEROBIC] },
    ];
  }

  const phaseLabels: Record<string, string> = {
    base: 'Base Building – Aerobic Foundation',
    build: 'Build Phase – Increasing Intensity',
    peak: 'Peak Phase – Race Simulation',
    taper: 'Taper – Rest & Sharpen',
    race: 'Race Week',
  };

  const allWorkouts = days.flatMap(d => d.workouts);
  const totalDuration = allWorkouts.reduce((s, w) => s + w.duration, 0);
  const totalTSS = allWorkouts.reduce((s, w) => s + (w.tss || 0), 0);

  return {
    weekNumber: weekNum,
    phase: phase as any,
    days: days.map(d => ({
      dayOfWeek: d.dayOfWeek,
      workouts: d.workouts,
      totalDuration: d.workouts.reduce((s, w) => s + w.duration, 0),
    })),
    totalDuration: isRecoveryWeek ? Math.round(totalDuration * 0.65) : totalDuration,
    totalTSS: isRecoveryWeek ? Math.round(totalTSS * 0.65) : totalTSS,
    focus: isRecoveryWeek ? 'Recovery Week – Absorb Training Adaptations' : phaseLabels[phase],
  };
}

export const IRONMAN_PLAN: TrainingPlan = {
  raceType: 'ironman',
  totalWeeks: 20,
  weeks: Array.from({ length: 20 }, (_, i) => buildIronmanWeek(i + 1)),
};

export const IRONMAN_703_PLAN: TrainingPlan = {
  raceType: 'ironman703',
  totalWeeks: 16,
  weeks: Array.from({ length: 16 }, (_, i) => build703Week(i + 1)),
};

export const RACE_DISTANCES = {
  ironman: {
    swim: 3800,
    bike: 180000,
    run: 42195,
    label: 'Full Ironman',
    description: '3.8km swim • 180km bike • 42.2km run',
  },
  ironman703: {
    swim: 1900,
    bike: 90000,
    run: 21097,
    label: 'Ironman 70.3',
    description: '1.9km swim • 90km bike • 21.1km run',
  },
};
