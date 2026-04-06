import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { formatDuration, phaseColor, phaseBadgeLabel, disciplineIcon } from '../utils/formatters';
import { TrainingWeek } from '../types';
import ProgressBar from '../components/ProgressBar';
import { useNavigation } from '@react-navigation/native';

export default function TrainingPlanScreen() {
  const { state, setCurrentWeek, getTrainingPlan } = useApp();
  const navigation = useNavigation<any>();
  const plan = getTrainingPlan();
  const [selectedWeek, setSelectedWeek] = useState(state.currentWeek);

  const week = plan.weeks[selectedWeek - 1];

  function selectWeek(wn: number) {
    setSelectedWeek(wn);
    setCurrentWeek(wn);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0D1B2A', '#0A2540']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Training Plan</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>
              {plan.raceType === 'ironman703' ? 'Ironman 70.3' : 'Full Ironman'}
            </Text>
          </View>
        </View>

        {/* Phase Legend */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.legendScroll} contentContainerStyle={styles.legendContainer}>
          {[
            { phase: 'base', label: 'Base' },
            { phase: 'build', label: 'Build' },
            { phase: 'peak', label: 'Peak' },
            { phase: 'taper', label: 'Taper' },
            { phase: 'race', label: 'Race' },
          ].map(({ phase, label }) => (
            <View key={phase} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: phaseColor(phase) }]} />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Week selector */}
        <View style={styles.weekSelectorWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={plan.weeks}
            keyExtractor={(item) => `w-${item.weekNumber}`}
            contentContainerStyle={styles.weekSelectorContent}
            renderItem={({ item }) => {
              const isSelected = item.weekNumber === selectedWeek;
              const isCurrent = item.weekNumber === state.currentWeek;
              const color = phaseColor(item.phase);
              return (
                <TouchableOpacity
                  style={[
                    styles.weekChip,
                    { borderColor: color },
                    isSelected && { backgroundColor: color },
                  ]}
                  onPress={() => selectWeek(item.weekNumber)}
                >
                  <Text style={[styles.weekChipNum, isSelected && styles.weekChipNumSelected]}>
                    {item.weekNumber}
                  </Text>
                  {isCurrent && !isSelected && <View style={[styles.weekCurrentDot, { backgroundColor: color }]} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Week detail */}
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {week && <WeekDetail week={week} currentWeekNum={state.currentWeek} navigation={navigation} />}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function WeekDetail({ week, currentWeekNum, navigation }: { week: TrainingWeek; currentWeekNum: number; navigation: any }) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <View style={styles.weekDetail}>
      {/* Week header */}
      <View style={styles.weekHeaderBox}>
        <View style={styles.weekTitleRow}>
          <Text style={styles.weekTitle}>Week {week.weekNumber}</Text>
          <View style={[styles.phaseBadge, { backgroundColor: phaseColor(week.phase) + '20', borderColor: phaseColor(week.phase) }]}>
            <Text style={[styles.phaseBadgeText, { color: phaseColor(week.phase) }]}>
              {phaseBadgeLabel(week.phase)}
            </Text>
          </View>
          {week.weekNumber === currentWeekNum && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>CURRENT</Text>
            </View>
          )}
        </View>
        <Text style={styles.weekFocus}>{week.focus}</Text>

        <View style={styles.weekStats}>
          <View style={styles.weekStatItem}>
            <Text style={styles.weekStatValue}>{formatDuration(week.totalDuration)}</Text>
            <Text style={styles.weekStatLabel}>Total Volume</Text>
          </View>
          <View style={styles.weekStatDivider} />
          <View style={styles.weekStatItem}>
            <Text style={styles.weekStatValue}>{week.totalTSS}</Text>
            <Text style={styles.weekStatLabel}>Total TSS</Text>
          </View>
          <View style={styles.weekStatDivider} />
          <View style={styles.weekStatItem}>
            <Text style={styles.weekStatValue}>{week.days.flatMap(d => d.workouts).filter(w => w.discipline !== 'rest').length}</Text>
            <Text style={styles.weekStatLabel}>Workouts</Text>
          </View>
        </View>

        {/* Discipline bar */}
        <View style={styles.disciplineBar}>
          {[
            { d: 'swim', color: '#2196F3', label: '🏊 Swim' },
            { d: 'bike', color: '#FF9800', label: '🚴 Bike' },
            { d: 'run', color: '#4CAF50', label: '🏃 Run' },
          ].map(({ d, color, label }) => {
            const time = week.days.flatMap(dy => dy.workouts)
              .filter(w => w.discipline === d)
              .reduce((s, w) => s + w.duration, 0);
            const total = week.totalDuration || 1;
            return (
              <View key={d} style={styles.disciplineBarItem}>
                <Text style={styles.disciplineBarLabel}>{label}</Text>
                <ProgressBar progress={time / total} color={color} height={5} />
                <Text style={[styles.disciplineBarTime, { color }]}>{formatDuration(time)}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Days */}
      {week.days.map(day => (
        <View key={day.dayOfWeek} style={styles.dayBlock}>
          <Text style={styles.dayName}>{dayNames[day.dayOfWeek]}</Text>
          {day.workouts.map(workout => {
            const isRest = workout.discipline === 'rest';
            return (
              <TouchableOpacity
                key={workout.id}
                style={[styles.workoutRow, isRest && styles.workoutRowRest]}
                onPress={!isRest ? () => navigation.navigate('WorkoutDetail', { workoutId: workout.id, weekNumber: week.weekNumber }) : undefined}
              >
                <Text style={styles.workoutRowIcon}>{disciplineIcon(workout.discipline)}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.workoutRowTitle, isRest && { color: '#5A6A7A' }]}>{workout.title}</Text>
                  <Text style={styles.workoutRowMeta}>{formatDuration(workout.duration)}{workout.tss ? ` · TSS ${workout.tss}` : ''}</Text>
                </View>
                {!isRest && <Text style={styles.chevron}>›</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1B2A' },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  planBadge: { backgroundColor: '#0A84FF20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#0A84FF' },
  planBadgeText: { color: '#0A84FF', fontSize: 11, fontWeight: '700' },
  legendScroll: { maxHeight: 36 },
  legendContainer: { paddingHorizontal: 20, gap: 16, flexDirection: 'row', alignItems: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#8E9BAE', fontSize: 11 },
  weekSelectorWrapper: { height: 56 },
  weekSelectorContent: { paddingHorizontal: 16, gap: 6, alignItems: 'center' },
  weekChip: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  weekChipNum: { color: '#8E9BAE', fontSize: 12, fontWeight: '700' },
  weekChipNumSelected: { color: '#FFFFFF' },
  weekCurrentDot: { width: 5, height: 5, borderRadius: 2.5, position: 'absolute', bottom: 2 },
  scroll: { padding: 16, paddingBottom: 60 },
  weekDetail: { gap: 12 },
  weekHeaderBox: { backgroundColor: '#1E2A3A', borderRadius: 16, padding: 16, marginBottom: 4 },
  weekTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  weekTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  phaseBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  phaseBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  currentBadge: { backgroundColor: '#4CAF5020', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: '#4CAF50' },
  currentBadgeText: { color: '#4CAF50', fontSize: 10, fontWeight: '700' },
  weekFocus: { color: '#8E9BAE', fontSize: 13, marginBottom: 14, lineHeight: 18 },
  weekStats: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  weekStatItem: { flex: 1, alignItems: 'center' },
  weekStatValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  weekStatLabel: { color: '#5A6A7A', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 2 },
  weekStatDivider: { width: 1, height: 30, backgroundColor: '#2C3E50' },
  disciplineBar: { gap: 6 },
  disciplineBarItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  disciplineBarLabel: { color: '#8E9BAE', fontSize: 11, width: 70 },
  disciplineBarTime: { fontSize: 11, fontWeight: '600', width: 50, textAlign: 'right' },
  dayBlock: { backgroundColor: '#1E2A3A', borderRadius: 12, padding: 12, marginBottom: 4 },
  dayName: { color: '#0A84FF', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  workoutRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#2C3E50' },
  workoutRowRest: { opacity: 0.5 },
  workoutRowIcon: { fontSize: 18 },
  workoutRowTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  workoutRowMeta: { color: '#5A6A7A', fontSize: 12, marginTop: 2 },
  chevron: { color: '#5A6A7A', fontSize: 20 },
});
