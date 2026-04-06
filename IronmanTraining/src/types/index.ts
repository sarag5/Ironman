export type RaceType = 'ironman' | 'ironman703';

export type DisciplineType = 'swim' | 'bike' | 'run' | 'rest' | 'brick';

export type IntensityZone = 1 | 2 | 3 | 4 | 5;

export type TrainingPhase = 'base' | 'build' | 'peak' | 'taper' | 'race';

export interface UserProfile {
  name: string;
  age: number;
  raceType: RaceType;
  raceDate: string; // ISO date string
  swimPace: number; // seconds per 100m
  ftpWatts: number; // Functional Threshold Power for cycling (watts)
  runPacePerKm: number; // seconds per km at threshold
  maxHeartRate: number;
  restingHeartRate: number;
  weeklyAvailableHours: number;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface TrainingZone {
  zone: IntensityZone;
  name: string;
  description: string;
  minPercent: number;
  maxPercent: number;
}

export interface WorkoutInterval {
  duration: number; // seconds
  zone: IntensityZone;
  description: string;
}

export interface Workout {
  id: string;
  discipline: DisciplineType;
  title: string;
  description: string;
  duration: number; // minutes
  distance?: number; // meters
  zone: IntensityZone;
  intervals?: WorkoutInterval[];
  tss?: number; // Training Stress Score
  notes?: string;
}

export interface TrainingDay {
  dayOfWeek: number; // 0=Sunday, 6=Saturday
  workouts: Workout[];
  totalDuration: number; // minutes
}

export interface TrainingWeek {
  weekNumber: number;
  phase: TrainingPhase;
  days: TrainingDay[];
  totalDuration: number; // minutes
  totalTSS: number;
  focus: string;
}

export interface TrainingPlan {
  raceType: RaceType;
  totalWeeks: number;
  weeks: TrainingWeek[];
}

export interface CompletedWorkout {
  id: string;
  workoutId: string;
  date: string; // ISO date string
  actualDuration: number; // minutes
  actualDistance?: number; // meters
  perceivedEffort: number; // 1-10
  heartRateAvg?: number;
  heartRateMax?: number;
  powerAvg?: number;
  notes?: string;
  completed: boolean;
}

export interface WeeklyStats {
  weekStart: string;
  swimDistance: number;
  bikeDistance: number;
  runDistance: number;
  totalTime: number;
  workoutsCompleted: number;
  workoutsPlanned: number;
  tss: number;
}
