import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { formatDuration } from '../utils/formatters';
import { IRONMAN_PLAN, IRONMAN_703_PLAN } from '../data/trainingPlans';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const { state, getTrainingPlan } = useApp();
  const plan = getTrainingPlan();

  // Build weekly stats for all completed weeks
  const weeklyData = plan.weeks.slice(0, state.currentWeek).map((week, idx) => {
    const allIds = week.days.flatMap(d => d.workouts.map(w => w.id));
    const completed = state.completedWorkouts.filter(c => allIds.includes(c.workoutId) && c.completed).length;
    return {
      weekNum: idx + 1,
      phase: week.phase,
      planned: allIds.filter(id => id !== 'rest' && id !== 'active-rest').length,
      completed,
      tss: week.totalTSS,
      volume: week.totalDuration,
    };
  });

  const totalCompleted = state.completedWorkouts.filter(c => c.completed).length;
  const totalPlanned = plan.weeks.slice(0, state.currentWeek).flatMap(w => w.days.flatMap(d => d.workouts)).filter(w => w.discipline !== 'rest').length;
  const planProgress = (state.currentWeek - 1) / plan.totalWeeks;

  const swimCompleted = state.completedWorkouts.filter(c => {
    const workout = plan.weeks.flatMap(w => w.days.flatMap(d => d.workouts)).find(w => w.id === c.workoutId);
    return c.completed && workout?.discipline === 'swim';
  }).length;

  const bikeCompleted = state.completedWorkouts.filter(c => {
    const workout = plan.weeks.flatMap(w => w.days.flatMap(d => d.workouts)).find(w => w.id === c.workoutId);
    return c.completed && workout?.discipline === 'bike';
  }).length;

  const runCompleted = state.completedWorkouts.filter(c => {
    const workout = plan.weeks.flatMap(w => w.days.flatMap(d => d.workouts)).find(w => w.id === c.workoutId);
    return c.completed && workout?.discipline === 'run';
  }).length;

  const maxVolume = Math.max(...weeklyData.map(w => w.volume), 1);
  const maxCompleted = Math.max(...weeklyData.map(w => w.completed), 1);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0D1B2A', '#0A2540']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.sub}>Week {state.currentWeek} of {plan.totalWeeks}</Text>

          {/* Plan Progress */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Plan Completion</Text>
            <View style={styles.bigCircle}>
              <Text style={styles.bigPct}>{Math.round(planProgress * 100)}%</Text>
              <Text style={styles.bigPctLabel}>Complete</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${planProgress * 100}%` }]} />
            </View>
            <Text style={styles.progressSub}>{state.currentWeek - 1} of {plan.totalWeeks} weeks done</Text>
          </View>

          {/* Overall Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalCompleted}</Text>
              <Text style={styles.statLabel}>Workouts Done</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>{totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0}%</Text>
              <Text style={styles.statLabel}>Adherence</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#FF9800' }]}>{state.currentWeek}</Text>
              <Text style={styles.statLabel}>Current Week</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#2196F3' }]}>{plan.totalWeeks - state.currentWeek + 1}</Text>
              <Text style={styles.statLabel}>Weeks Left</Text>
            </View>
          </View>

          {/* Discipline Breakdown */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Discipline Breakdown</Text>
            {[
              { label: 'Swim', count: swimCompleted, icon: '🏊', color: '#2196F3' },
              { label: 'Bike', count: bikeCompleted, icon: '🚴', color: '#FF9800' },
              { label: 'Run', count: runCompleted, icon: '🏃', color: '#4CAF50' },
            ].map(({ label, count, icon, color }) => {
              const pct = totalCompleted > 0 ? count / totalCompleted : 0;
              return (
                <View key={label} style={styles.disciplineRow}>
                  <Text style={styles.disciplineIcon}>{icon}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={styles.disciplineHeader}>
                      <Text style={styles.disciplineLabel}>{label}</Text>
                      <Text style={[styles.disciplineCount, { color }]}>{count} sessions</Text>
                    </View>
                    <View style={styles.disciplineTrack}>
                      <View style={[styles.disciplineFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Weekly Volume Chart */}
          {weeklyData.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Weekly Volume (minutes)</Text>
              <View style={styles.barChart}>
                {weeklyData.map(w => {
                  const barH = (w.volume / maxVolume) * 120;
                  const phasePalette: Record<string, string> = {
                    base: '#2196F3', build: '#FF9800', peak: '#F44336', taper: '#9C27B0', race: '#FFD700',
                  };
                  const color = phasePalette[w.phase] ?? '#0A84FF';
                  return (
                    <View key={w.weekNum} style={styles.barWrapper}>
                      <Text style={styles.barValue}>{w.volume > 0 ? `${Math.round(w.volume / 60)}h` : ''}</Text>
                      <View style={[styles.bar, { height: barH || 4, backgroundColor: color }]} />
                      <Text style={styles.barLabel}>{w.weekNum}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.chartLegend}>
                {[
                  { phase: 'base', label: 'Base', color: '#2196F3' },
                  { phase: 'build', label: 'Build', color: '#FF9800' },
                  { phase: 'peak', label: 'Peak', color: '#F44336' },
                  { phase: 'taper', label: 'Taper', color: '#9C27B0' },
                ].map(({ label, color }) => (
                  <View key={label} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: color }]} />
                    <Text style={styles.legendLabel}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Workout Completion Chart */}
          {weeklyData.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Workouts Completed per Week</Text>
              <View style={styles.barChart}>
                {weeklyData.map(w => {
                  const plannedH = (w.planned / maxCompleted) * 100;
                  const completedH = (w.completed / maxCompleted) * 100;
                  return (
                    <View key={w.weekNum} style={styles.doubleBarWrapper}>
                      <View style={styles.doubleBar}>
                        <View style={[styles.barPlanned, { height: plannedH || 4 }]} />
                        <View style={[styles.barCompleted, { height: completedH || 0 }]} />
                      </View>
                      <Text style={styles.barLabel}>{w.weekNum}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2C3E50' }]} />
                  <Text style={styles.legendLabel}>Planned</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#0A84FF' }]} />
                  <Text style={styles.legendLabel}>Completed</Text>
                </View>
              </View>
            </View>
          )}

          {/* Training Load Phases */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Training Phases Breakdown</Text>
            {[
              { phase: 'base', label: 'Base Phase', desc: 'Build aerobic fitness and form', weeks: plan.weeks.filter(w => w.phase === 'base').length, color: '#2196F3' },
              { phase: 'build', label: 'Build Phase', desc: 'Increase intensity and volume', weeks: plan.weeks.filter(w => w.phase === 'build').length, color: '#FF9800' },
              { phase: 'peak', label: 'Peak Phase', desc: 'Race simulation and peak fitness', weeks: plan.weeks.filter(w => w.phase === 'peak').length, color: '#F44336' },
              { phase: 'taper', label: 'Taper Phase', desc: 'Reduce load and sharpen form', weeks: plan.weeks.filter(w => w.phase === 'taper').length, color: '#9C27B0' },
            ].map(({ label, desc, weeks, color }) => (
              <View key={label} style={styles.phaseRow}>
                <View style={[styles.phaseDot, { backgroundColor: color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.phaseLabel}>{label}</Text>
                  <Text style={styles.phaseDesc}>{desc}</Text>
                </View>
                <Text style={[styles.phaseWeeks, { color }]}>{weeks}w</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1B2A' },
  gradient: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 60 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', marginBottom: 2 },
  sub: { color: '#5A6A7A', fontSize: 13, marginBottom: 20 },
  card: { backgroundColor: '#1E2A3A', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  bigCircle: { alignItems: 'center', marginBottom: 14 },
  bigPct: { color: '#0A84FF', fontSize: 52, fontWeight: '900' },
  bigPctLabel: { color: '#8E9BAE', fontSize: 13 },
  progressTrack: { height: 10, backgroundColor: '#2C3E50', borderRadius: 99, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: 10, backgroundColor: '#0A84FF', borderRadius: 99 },
  progressSub: { color: '#5A6A7A', fontSize: 12, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, marginBottom: 16 },
  statBox: { width: '50%', padding: 12, backgroundColor: '#1E2A3A', borderWidth: 0.5, borderColor: '#0D1B2A', alignItems: 'center' },
  statValue: { color: '#0A84FF', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#5A6A7A', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  disciplineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  disciplineIcon: { fontSize: 20, width: 28 },
  disciplineHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  disciplineLabel: { color: '#C0CDD9', fontSize: 13, fontWeight: '600' },
  disciplineCount: { fontSize: 12, fontWeight: '600' },
  disciplineTrack: { height: 6, backgroundColor: '#2C3E50', borderRadius: 99, overflow: 'hidden' },
  disciplineFill: { height: 6, borderRadius: 99 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 140, gap: 2, marginBottom: 12 },
  barWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barValue: { color: '#5A6A7A', fontSize: 8, marginBottom: 2 },
  bar: { width: '80%', borderRadius: 2, minHeight: 4 },
  barLabel: { color: '#5A6A7A', fontSize: 8, marginTop: 4 },
  doubleBarWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  doubleBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 1 },
  barPlanned: { width: 6, backgroundColor: '#2C3E50', borderRadius: 2 },
  barCompleted: { width: 6, backgroundColor: '#0A84FF', borderRadius: 2 },
  chartLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: '#8E9BAE', fontSize: 11 },
  phaseRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  phaseDot: { width: 10, height: 10, borderRadius: 5 },
  phaseLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  phaseDesc: { color: '#5A6A7A', fontSize: 11, marginTop: 2 },
  phaseWeeks: { fontSize: 16, fontWeight: '700' },
});
