import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import WorkoutCard from '../components/WorkoutCard';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { formatDuration, disciplineIcon, phaseColor, phaseBadgeLabel } from '../utils/formatters';
import { RACE_DISTANCES } from '../data/trainingPlans';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const { state, getTrainingPlan, getWeeklyStats, getDaysUntilRace, logWorkout } = useApp();
  const navigation = useNavigation<any>();
  const plan = getTrainingPlan();
  const week = plan.weeks[state.currentWeek - 1];
  const stats = getWeeklyStats(state.currentWeek);
  const daysUntilRace = getDaysUntilRace();
  const today = new Date().getDay();

  const todayWorkouts = week?.days.find(d => d.dayOfWeek === today)?.workouts ?? [];
  const raceInfo = RACE_DISTANCES[state.profile?.raceType ?? 'ironman703'];

  const weekCompletion = stats.planned > 0 ? stats.completed / stats.planned : 0;
  const planProgress = (state.currentWeek - 1) / plan.totalWeeks;

  function handleComplete(workoutId: string) {
    logWorkout({
      id: `${workoutId}-${Date.now()}`,
      workoutId,
      date: new Date().toISOString(),
      actualDuration: todayWorkouts.find(w => w.id === workoutId)?.duration ?? 0,
      perceivedEffort: 7,
      completed: true,
    });
  }

  const completedToday = state.completedWorkouts
    .filter(c => {
      const d = new Date(c.date);
      const t = new Date();
      return d.toDateString() === t.toDateString() && c.completed;
    })
    .map(c => c.workoutId);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0D1B2A', '#0A2540']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good {getGreeting()}, {state.profile?.name?.split(' ')[0] ?? 'Athlete'} 👋</Text>
              <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
            </View>
          </View>

          {/* Race Countdown */}
          <LinearGradient colors={['#0A84FF', '#0055CC']} style={styles.countdownCard}>
            <View style={styles.countdownLeft}>
              <Text style={styles.countdownDays}>{daysUntilRace}</Text>
              <Text style={styles.countdownLabel}>Days to race</Text>
            </View>
            <View style={styles.countdownDivider} />
            <View style={styles.countdownRight}>
              <Text style={styles.raceName}>{raceInfo.label}</Text>
              <Text style={styles.raceDistance}>{raceInfo.description}</Text>
              {state.profile?.raceDate && (
                <Text style={styles.raceDateText}>
                  {new Date(state.profile.raceDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Text>
              )}
            </View>
          </LinearGradient>

          {/* Week Overview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Week {state.currentWeek} of {plan.totalWeeks}</Text>
              <View style={[styles.phaseBadge, { backgroundColor: phaseColor(week?.phase ?? 'base') + '30', borderColor: phaseColor(week?.phase ?? 'base') }]}>
                <Text style={[styles.phaseBadgeText, { color: phaseColor(week?.phase ?? 'base') }]}>
                  {phaseBadgeLabel(week?.phase ?? 'base')}
                </Text>
              </View>
            </View>
            <Text style={styles.weekFocus}>{week?.focus}</Text>
            <ProgressBar progress={planProgress} color="#0A84FF" height={6} label="Plan Progress" showPercent />
          </View>

          {/* Weekly Stats */}
          <View style={styles.statsRow}>
            <StatCard
              label="Workouts"
              value={`${stats.completed}/${stats.planned}`}
              sub="this week"
              color="#0A84FF"
              icon="📋"
            />
            <StatCard
              label="Total Time"
              value={formatDuration(stats.totalTime)}
              sub="completed"
              color="#4CAF50"
              icon="⏱"
            />
            <StatCard
              label="TSS"
              value={`${week?.totalTSS ?? 0}`}
              sub="planned"
              color="#FF9800"
              icon="📈"
            />
          </View>

          {/* Week Completion */}
          <View style={styles.section}>
            <ProgressBar
              progress={weekCompletion}
              color="#4CAF50"
              height={10}
              label={`Week Completion — ${stats.completed} of ${stats.planned} workouts`}
              showPercent
            />
          </View>

          {/* Discipline Breakdown */}
          <View style={styles.disciplineRow}>
            {[
              { icon: '🏊', label: 'Swim', time: stats.swimTime, color: '#2196F3' },
              { icon: '🚴', label: 'Bike', time: stats.bikeTime, color: '#FF9800' },
              { icon: '🏃', label: 'Run', time: stats.runTime, color: '#4CAF50' },
            ].map(({ icon, label, time, color }) => (
              <View key={label} style={styles.disciplineCard}>
                <Text style={styles.disciplineIcon}>{icon}</Text>
                <Text style={[styles.disciplineTime, { color }]}>{formatDuration(time)}</Text>
                <Text style={styles.disciplineLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Today's Workouts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Workouts</Text>
            {todayWorkouts.length === 0 ? (
              <View style={styles.restDay}>
                <Text style={styles.restEmoji}>😴</Text>
                <Text style={styles.restText}>Rest Day — Recovery is part of training!</Text>
                <Text style={styles.restSub}>Use this time to hydrate, sleep, and let your body adapt.</Text>
              </View>
            ) : (
              todayWorkouts.map(w => (
                <WorkoutCard
                  key={w.id}
                  workout={w}
                  isCompleted={completedToday.includes(w.id)}
                  onPress={() => navigation.navigate('WorkoutDetail', { workoutId: w.id, weekNumber: state.currentWeek })}
                  onComplete={() => handleComplete(w.id)}
                />
              ))
            )}
          </View>

          {/* Upcoming week days */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.weekGrid}>
              {week?.days.map(day => {
                const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                const isToday = day.dayOfWeek === today;
                const isPast = day.dayOfWeek < today;
                const icons = day.workouts.filter(w => w.discipline !== 'rest').map(w => disciplineIcon(w.discipline)).join('');
                return (
                  <View key={day.dayOfWeek} style={[styles.dayCell, isToday && styles.dayCellToday, isPast && styles.dayCellPast]}>
                    <Text style={[styles.dayCellName, isToday && styles.dayCellNameToday]}>{dayNames[day.dayOfWeek]}</Text>
                    <Text style={styles.dayCellIcons}>{icons || '—'}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Plan')}>
              <Text style={styles.quickBtnIcon}>📅</Text>
              <Text style={styles.quickBtnText}>Full Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Zones')}>
              <Text style={styles.quickBtnIcon}>🎯</Text>
              <Text style={styles.quickBtnText}>My Zones</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Progress')}>
              <Text style={styles.quickBtnIcon}>📊</Text>
              <Text style={styles.quickBtnText}>Progress</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1B2A' },
  gradient: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  date: { color: '#5A6A7A', fontSize: 13, marginTop: 2 },
  countdownCard: { borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  countdownLeft: { alignItems: 'center', marginRight: 16 },
  countdownDays: { color: '#FFFFFF', fontSize: 48, fontWeight: '900', lineHeight: 52 },
  countdownLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  countdownDivider: { width: 1, height: 60, backgroundColor: 'rgba(255,255,255,0.3)', marginRight: 16 },
  countdownRight: { flex: 1 },
  raceName: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  raceDistance: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  raceDateText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  weekFocus: { color: '#8E9BAE', fontSize: 13, marginBottom: 12, lineHeight: 18 },
  phaseBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  phaseBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', marginBottom: 16, marginHorizontal: -4 },
  disciplineRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  disciplineCard: { flex: 1, backgroundColor: '#1E2A3A', borderRadius: 12, padding: 12, alignItems: 'center' },
  disciplineIcon: { fontSize: 22, marginBottom: 4 },
  disciplineTime: { fontSize: 14, fontWeight: '700' },
  disciplineLabel: { color: '#5A6A7A', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 2 },
  restDay: { backgroundColor: '#1E2A3A', borderRadius: 12, padding: 20, alignItems: 'center' },
  restEmoji: { fontSize: 36, marginBottom: 8 },
  restText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', textAlign: 'center' },
  restSub: { color: '#5A6A7A', fontSize: 12, textAlign: 'center', marginTop: 4 },
  weekGrid: { flexDirection: 'row', gap: 4 },
  dayCell: { flex: 1, backgroundColor: '#1E2A3A', borderRadius: 8, padding: 6, alignItems: 'center' },
  dayCellToday: { backgroundColor: '#0A84FF20', borderWidth: 1.5, borderColor: '#0A84FF' },
  dayCellPast: { opacity: 0.5 },
  dayCellName: { color: '#8E9BAE', fontSize: 10, fontWeight: '600', marginBottom: 2 },
  dayCellNameToday: { color: '#0A84FF' },
  dayCellIcons: { fontSize: 11 },
  quickActions: { flexDirection: 'row', gap: 8 },
  quickBtn: { flex: 1, backgroundColor: '#1E2A3A', borderRadius: 12, padding: 14, alignItems: 'center' },
  quickBtnIcon: { fontSize: 20, marginBottom: 4 },
  quickBtnText: { color: '#8E9BAE', fontSize: 11, fontWeight: '600' },
});
