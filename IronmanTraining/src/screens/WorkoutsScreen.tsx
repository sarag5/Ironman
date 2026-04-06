import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import WorkoutCard from '../components/WorkoutCard';
import { formatDuration, disciplineIcon } from '../utils/formatters';
import { useNavigation } from '@react-navigation/native';
import { Workout } from '../types';

export default function WorkoutsScreen() {
  const { state, getTrainingPlan, logWorkout } = useApp();
  const navigation = useNavigation<any>();
  const plan = getTrainingPlan();
  const week = plan.weeks[state.currentWeek - 1];
  const today = new Date().getDay();

  const [filter, setFilter] = useState<'all' | 'swim' | 'bike' | 'run' | 'brick'>('all');
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [effort, setEffort] = useState('7');
  const [notes, setNotes] = useState('');
  const [hrAvg, setHrAvg] = useState('');
  const [powerAvg, setPowerAvg] = useState('');

  const completedIds = state.completedWorkouts
    .filter(c => c.completed)
    .map(c => c.workoutId);

  const allWorkouts = week?.days.flatMap(d => d.workouts.map(w => ({ workout: w, day: d.dayOfWeek }))) ?? [];
  const filtered = filter === 'all' ? allWorkouts : allWorkouts.filter(({ workout }) => workout.discipline === filter);

  const todayWorkouts = allWorkouts.filter(({ day }) => day === today);

  function handleLogWorkout(workout: Workout) {
    setSelectedWorkout(workout);
    setLogModalVisible(true);
  }

  function submitLog() {
    if (!selectedWorkout) return;
    logWorkout({
      id: `${selectedWorkout.id}-${Date.now()}`,
      workoutId: selectedWorkout.id,
      date: new Date().toISOString(),
      actualDuration: selectedWorkout.duration,
      perceivedEffort: parseInt(effort) || 7,
      heartRateAvg: hrAvg ? parseInt(hrAvg) : undefined,
      powerAvg: powerAvg ? parseInt(powerAvg) : undefined,
      notes: notes || undefined,
      completed: true,
    });
    setLogModalVisible(false);
    setSelectedWorkout(null);
    setEffort('7');
    setNotes('');
    setHrAvg('');
    setPowerAvg('');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0D1B2A', '#0A2540']} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Workouts</Text>
          <Text style={styles.sub}>Week {state.currentWeek} • {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</Text>
        </View>

        {/* Today summary */}
        {todayWorkouts.length > 0 && (
          <View style={styles.todaySummary}>
            <Text style={styles.todaySummaryText}>
              {todayWorkouts.map(({ workout }) => disciplineIcon(workout.discipline)).join(' ')}{'  '}
              {todayWorkouts.map(({ workout }) => formatDuration(workout.duration)).join(' + ')}
              {' = '}
              {formatDuration(todayWorkouts.reduce((s, { workout }) => s + workout.duration, 0))}
            </Text>
          </View>
        )}

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {[
            { key: 'all', label: 'All', icon: '💪' },
            { key: 'swim', label: 'Swim', icon: '🏊' },
            { key: 'bike', label: 'Bike', icon: '🚴' },
            { key: 'run', label: 'Run', icon: '🏃' },
            { key: 'brick', label: 'Brick', icon: '🔥' },
          ].map(({ key, label, icon }) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterChip, filter === key && styles.filterChipActive]}
              onPress={() => setFilter(key as any)}
            >
              <Text style={styles.filterIcon}>{icon}</Text>
              <Text style={[styles.filterLabel, filter === key && styles.filterLabelActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No {filter === 'all' ? '' : filter} workouts this week</Text>
            </View>
          ) : (
            filtered.map(({ workout, day }) => {
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const isToday = day === today;
              return (
                <View key={`${workout.id}-${day}`}>
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                    {isToday ? '▶ Today' : dayNames[day]}
                  </Text>
                  <WorkoutCard
                    workout={workout}
                    isCompleted={completedIds.includes(workout.id)}
                    onPress={() => navigation.navigate('WorkoutDetail', { workoutId: workout.id, weekNumber: state.currentWeek })}
                    onComplete={() => handleLogWorkout(workout)}
                  />
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Log Workout Modal */}
        <Modal visible={logModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Log Workout</Text>
              {selectedWorkout && (
                <Text style={styles.modalWorkoutName}>
                  {disciplineIcon(selectedWorkout.discipline)} {selectedWorkout.title}
                </Text>
              )}

              <Text style={styles.modalLabel}>Perceived Effort (1-10)</Text>
              <View style={styles.effortRow}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.effortBtn, parseInt(effort) === n && styles.effortBtnActive]}
                    onPress={() => setEffort(String(n))}
                  >
                    <Text style={[styles.effortBtnText, parseInt(effort) === n && styles.effortBtnTextActive]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedWorkout?.discipline === 'bike' && (
                <>
                  <Text style={styles.modalLabel}>Avg Power (watts)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={powerAvg}
                    onChangeText={setPowerAvg}
                    keyboardType="numeric"
                    placeholder="Optional"
                    placeholderTextColor="#5A6A7A"
                  />
                </>
              )}

              <Text style={styles.modalLabel}>Avg Heart Rate (bpm)</Text>
              <TextInput
                style={styles.modalInput}
                value={hrAvg}
                onChangeText={setHrAvg}
                keyboardType="numeric"
                placeholder="Optional"
                placeholderTextColor="#5A6A7A"
              />

              <Text style={styles.modalLabel}>Notes</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextarea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="How did it go?"
                placeholderTextColor="#5A6A7A"
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalBtns}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setLogModalVisible(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveBtn} onPress={submitLog}>
                  <Text style={styles.modalSaveText}>Save Workout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1B2A' },
  gradient: { flex: 1 },
  header: { padding: 20, paddingBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  sub: { color: '#5A6A7A', fontSize: 13, marginTop: 2 },
  todaySummary: { marginHorizontal: 20, backgroundColor: '#1E2A3A', borderRadius: 10, padding: 12, marginBottom: 8 },
  todaySummaryText: { color: '#C0CDD9', fontSize: 13, fontWeight: '600' },
  filterScroll: { maxHeight: 50 },
  filterContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1E2A3A', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1.5, borderColor: 'transparent' },
  filterChipActive: { borderColor: '#0A84FF', backgroundColor: '#0A84FF15' },
  filterIcon: { fontSize: 14 },
  filterLabel: { color: '#8E9BAE', fontSize: 13, fontWeight: '600' },
  filterLabelActive: { color: '#0A84FF' },
  scroll: { padding: 16, paddingBottom: 60 },
  dayLabel: { color: '#5A6A7A', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, marginTop: 8 },
  dayLabelToday: { color: '#0A84FF' },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#5A6A7A', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#1E2A3A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  modalWorkoutName: { color: '#8E9BAE', fontSize: 14, marginBottom: 16 },
  modalLabel: { color: '#8E9BAE', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12, marginBottom: 6 },
  effortRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  effortBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#2C3E50', alignItems: 'center', justifyContent: 'center' },
  effortBtnActive: { backgroundColor: '#0A84FF' },
  effortBtnText: { color: '#8E9BAE', fontSize: 13, fontWeight: '600' },
  effortBtnTextActive: { color: '#FFFFFF' },
  modalInput: { backgroundColor: '#0D1B2A', borderRadius: 10, color: '#FFFFFF', fontSize: 15, padding: 12, borderWidth: 1, borderColor: '#2C3E50' },
  modalTextarea: { height: 80, textAlignVertical: 'top' },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 20 },
  modalCancelBtn: { flex: 1, backgroundColor: '#2C3E50', borderRadius: 12, padding: 14, alignItems: 'center' },
  modalCancelText: { color: '#8E9BAE', fontSize: 15, fontWeight: '600' },
  modalSaveBtn: { flex: 2, backgroundColor: '#0A84FF', borderRadius: 12, padding: 14, alignItems: 'center' },
  modalSaveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
