import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, CompletedWorkout, RaceType } from '../types';
import { IRONMAN_PLAN, IRONMAN_703_PLAN } from '../data/trainingPlans';

const STORAGE_KEY = '@ironman_app_state';

interface AppState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  completedWorkouts: CompletedWorkout[];
  currentWeek: number;
}

type Action =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'LOG_WORKOUT'; payload: CompletedWorkout }
  | { type: 'UPDATE_WORKOUT'; payload: CompletedWorkout }
  | { type: 'SET_CURRENT_WEEK'; payload: number }
  | { type: 'HYDRATE'; payload: AppState };

const initialState: AppState = {
  profile: null,
  isOnboarded: false,
  completedWorkouts: [],
  currentWeek: 1,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'COMPLETE_ONBOARDING':
      return { ...state, isOnboarded: true };
    case 'LOG_WORKOUT':
      return { ...state, completedWorkouts: [...state.completedWorkouts, action.payload] };
    case 'UPDATE_WORKOUT':
      return {
        ...state,
        completedWorkouts: state.completedWorkouts.map(w =>
          w.id === action.payload.id ? action.payload : w,
        ),
      };
    case 'SET_CURRENT_WEEK':
      return { ...state, currentWeek: action.payload };
    case 'HYDRATE':
      return action.payload;
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  setProfile: (profile: UserProfile) => void;
  completeOnboarding: () => void;
  logWorkout: (workout: CompletedWorkout) => void;
  updateWorkout: (workout: CompletedWorkout) => void;
  setCurrentWeek: (week: number) => void;
  getTrainingPlan: () => typeof IRONMAN_PLAN;
  getWeeklyStats: (week: number) => {
    planned: number;
    completed: number;
    swimTime: number;
    bikeTime: number;
    runTime: number;
    totalTime: number;
  };
  getDaysUntilRace: () => number;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) });
        } catch {
          // ignore parse errors
        }
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setProfile = (profile: UserProfile) => dispatch({ type: 'SET_PROFILE', payload: profile });
  const completeOnboarding = () => dispatch({ type: 'COMPLETE_ONBOARDING' });
  const logWorkout = (workout: CompletedWorkout) => dispatch({ type: 'LOG_WORKOUT', payload: workout });
  const updateWorkout = (workout: CompletedWorkout) => dispatch({ type: 'UPDATE_WORKOUT', payload: workout });
  const setCurrentWeek = (week: number) => dispatch({ type: 'SET_CURRENT_WEEK', payload: week });

  const getTrainingPlan = () =>
    state.profile?.raceType === 'ironman703' ? IRONMAN_703_PLAN : IRONMAN_PLAN;

  const getWeeklyStats = (week: number) => {
    const plan = getTrainingPlan();
    const weekData = plan.weeks[week - 1];
    if (!weekData) return { planned: 0, completed: 0, swimTime: 0, bikeTime: 0, runTime: 0, totalTime: 0 };

    const allWorkoutIds = weekData.days.flatMap(d => d.workouts.map(w => w.id));
    const completedIds = state.completedWorkouts
      .filter(c => allWorkoutIds.includes(c.workoutId) && c.completed)
      .map(c => c.workoutId);

    const completedWorkoutObjects = weekData.days
      .flatMap(d => d.workouts)
      .filter(w => completedIds.includes(w.id));

    return {
      planned: allWorkoutIds.length,
      completed: completedIds.length,
      swimTime: completedWorkoutObjects.filter(w => w.discipline === 'swim').reduce((s, w) => s + w.duration, 0),
      bikeTime: completedWorkoutObjects.filter(w => w.discipline === 'bike').reduce((s, w) => s + w.duration, 0),
      runTime: completedWorkoutObjects.filter(w => w.discipline === 'run').reduce((s, w) => s + w.duration, 0),
      totalTime: completedWorkoutObjects.reduce((s, w) => s + w.duration, 0),
    };
  };

  const getDaysUntilRace = () => {
    if (!state.profile?.raceDate) return 0;
    const raceDate = new Date(state.profile.raceDate);
    const today = new Date();
    const diff = raceDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setProfile,
        completeOnboarding,
        logWorkout,
        updateWorkout,
        setCurrentWeek,
        getTrainingPlan,
        getWeeklyStats,
        getDaysUntilRace,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
