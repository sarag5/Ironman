import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { formatDuration, formatDistance, disciplineIcon, zoneColor, phaseColor } from '../utils/formatters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Workout } from '../types';

export default function WorkoutDetailScreen() {
  const { state, getTrainingPlan, logWorkout } = useApp();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { workoutId, weekNumber } = route.params as { workoutId: string; weekNumber: number };

  const plan = getTrainingPlan();
  const week = plan.weeks[weekNumber - 1];
  const workout = week?.days.flatMap(d => d.workouts).find(w => w.id === workoutId);

  const [logModalVisible, setLogModalVisible] = useState(false);
  const [effort, setEffort] = useState('7');
  const [notes, setNotes] = useState('');
  const [hrAvg, setHrAvg] = useState('');
  const [powerAvg, setPowerAvg] = useState('');

  const isCompleted = state.completedWorkouts.some(c => c.workoutId === workoutId && c.completed);

  if (!workout) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#FFFFFF' }}>Workout not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const color = zoneColor(workout.zone);

  function submitLog() {
    logWorkout({
      id: `${workoutId}-${Date.now()}`,
      workoutId,
      date: new Date().toISOString(),
      actualDuration: workout!.duration,
      perceivedEffort: parseInt(effort) || 7,
      heartRateAvg: hrAvg ? parseInt(hrAvg) : undefined,
      powerAvg: powerAvg ? parseInt(powerAvg) : undefined,
      notes: notes || undefined,
      completed: true,
    });
    setLogModalVisible(false);
    navigation.goBack();
  }

  const warmupCooldown = getStructuredWorkout(workout);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0D1B2A', '#0A2540']} style={styles.gradient}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Workout Detail</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={[styles.hero, { borderLeftColor: color }]}>
            <Text style={styles.heroIcon}>{disciplineIcon(workout.discipline)}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{workout.title}</Text>
              <View style={styles.heroMeta}>
                <View style={[styles.zoneBadge, { backgroundColor: color + '20', borderColor: color }]}>
                  <Text style={[styles.zoneBadgeText, { color }]}>Zone {workout.zone}</Text>
                </View>
                <Text style={styles.heroDuration}>{formatDuration(workout.duration)}</Text>
                {workout.distance != null && workout.distance > 0 && (
                  <Text style={styles.heroDistance}>{formatDistance(workout.distance, workout.discipline)}</Text>
                )}
              </View>
            </View>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>✓ Done</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.description}>{workout.description}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color }]}>{formatDuration(workout.duration)}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            {workout.distance != null && workout.distance > 0 && (
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#2196F3' }]}>{formatDistance(workout.distance, workout.discipline)}</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
            )}
            {workout.tss != null && workout.tss > 0 && (
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#FF9800' }]}>{workout.tss}</Text>
                <Text style={styles.statLabel}>TSS</Text>
              </View>
            )}
          </View>

          {/* Workout Structure */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Workout Structure</Text>
            {warmupCooldown.map((segment, i) => (
              <View key={i} style={styles.segment}>
                <View style={[styles.segmentDot, { backgroundColor: zoneColor(segment.zone) }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.segmentTitle}>{segment.label}</Text>
                  <Text style={styles.segmentDesc}>{segment.desc}</Text>
                </View>
                <Text style={[styles.segmentZone, { color: zoneColor(segment.zone) }]}>Z{segment.zone}</Text>
              </View>
            ))}
          </View>

          {/* Intensity Zone Info */}
          <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: color }]}>
            <Text style={styles.cardTitle}>Zone {workout.zone} — {getZoneName(workout.zone)}</Text>
            <Text style={styles.zoneDescription}>{getZoneDescription(workout.zone, workout.discipline)}</Text>
            <View style={styles.zoneBarFull}>
              <View style={[styles.zoneBarFill, {
                marginLeft: `${(workout.zone - 1) * 20}%` as any,
                width: '20%',
                backgroundColor: color,
              }]} />
            </View>
            <View style={styles.zoneBarLabels}>
              {[1,2,3,4,5].map(z => (
                <Text key={z} style={[styles.zoneBarLabel, z === workout.zone && { color }]}>Z{z}</Text>
              ))}
            </View>
          </View>

          {/* Week context */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Training Context</Text>
            <View style={styles.contextRow}>
              <Text style={styles.contextLabel}>Week</Text>
              <Text style={styles.contextValue}>Week {weekNumber} of {plan.totalWeeks}</Text>
            </View>
            <View style={styles.contextRow}>
              <Text style={styles.contextLabel}>Phase</Text>
              <Text style={[styles.contextValue, { color: phaseColor(week.phase) }]}>{week.phase.charAt(0).toUpperCase() + week.phase.slice(1)}</Text>
            </View>
            <View style={styles.contextRow}>
              <Text style={styles.contextLabel}>Focus</Text>
              <Text style={styles.contextValue}>{week.focus}</Text>
            </View>
          </View>

          {/* Previous logs */}
          {state.completedWorkouts.filter(c => c.workoutId === workoutId).length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Workout History</Text>
              {state.completedWorkouts
                .filter(c => c.workoutId === workoutId)
                .slice(-5)
                .reverse()
                .map(log => (
                  <View key={log.id} style={styles.logRow}>
                    <Text style={styles.logDate}>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                    <Text style={styles.logEffort}>RPE {log.perceivedEffort}/10</Text>
                    {log.heartRateAvg && <Text style={styles.logHR}>❤️ {log.heartRateAvg} bpm</Text>}
                    {log.powerAvg && <Text style={styles.logPower}>⚡ {log.powerAvg}W</Text>}
                  </View>
                ))}
            </View>
          )}

          {/* Action button */}
          {!isCompleted ? (
            <TouchableOpacity style={styles.logBtn} onPress={() => setLogModalVisible(true)}>
              <Text style={styles.logBtnText}>✓ Mark as Complete</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.doneBox}>
              <Text style={styles.doneText}>✓ Workout Completed!</Text>
            </View>
          )}
        </ScrollView>

        {/* Log Modal */}
        <Modal visible={logModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Log Workout</Text>
              <Text style={styles.modalSubtitle}>{disciplineIcon(workout.discipline)} {workout.title}</Text>

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

              {workout.discipline === 'bike' && (
                <>
                  <Text style={styles.modalLabel}>Avg Power (watts)</Text>
                  <TextInput style={styles.modalInput} value={powerAvg} onChangeText={setPowerAvg} keyboardType="numeric" placeholder="Optional" placeholderTextColor="#5A6A7A" />
                </>
              )}

              <Text style={styles.modalLabel}>Avg Heart Rate (bpm)</Text>
              <TextInput style={styles.modalInput} value={hrAvg} onChangeText={setHrAvg} keyboardType="numeric" placeholder="Optional" placeholderTextColor="#5A6A7A" />

              <Text style={styles.modalLabel}>Notes</Text>
              <TextInput style={[styles.modalInput, { height: 72, textAlignVertical: 'top' }]} value={notes} onChangeText={setNotes} placeholder="How did it feel?" placeholderTextColor="#5A6A7A" multiline />

              <View style={styles.modalBtns}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setLogModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={submitLog}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

function getZoneName(zone: number): string {
  return ['Recovery', 'Aerobic', 'Tempo', 'Threshold', 'VO2 Max'][zone - 1] ?? 'Unknown';
}

function getZoneDescription(zone: number, discipline: string): string {
  const swimDesc = [
    'Easy, technically focused swimming. Use for warm-up, cool-down and recovery sets.',
    'Comfortable aerobic swimming. You can speak in short sentences. Most of your training volume.',
    'Moderately hard effort. You can speak a few words. Good for race pace development.',
    'Hard — this is your CSS (Critical Swim Speed). Race-specific intervals.',
    'Maximal sprinting effort. Very short sets only. High fast-twitch recruitment.',
  ];
  const bikeDesc = [
    '<55% FTP. Easy spinning. Active recovery, warm-up, cool-down.',
    '56-75% FTP. Endurance zone. Bulk of your long rides.',
    '76-90% FTP. Sustained effort. Sweet spot training for efficiency gains.',
    '91-105% FTP. Lactate threshold. Core fitness-building intervals.',
    '106-120% FTP. VO2 Max. Short, intense intervals for top-end power.',
  ];
  const runDesc = [
    'Very easy jog. Full conversation possible. Used for recovery and warm-up.',
    'Easy aerobic run. Conversational. Base of your running volume.',
    'Comfortably hard. Short sentences only. Tempo runs, good race efficiency.',
    'Hard — lactate threshold pace. Race pace for 10K-Half Marathon.',
    'Very hard intervals. Near max effort. Short reps for top-end speed.',
  ];
  const descriptions = discipline === 'swim' ? swimDesc : discipline === 'bike' ? bikeDesc : runDesc;
  return descriptions[zone - 1] ?? '';
}

function getStructuredWorkout(workout: Workout) {
  const d = workout.discipline;
  const isRest = d === 'rest';
  if (isRest) return [{ label: 'Full Rest', desc: 'Complete recovery. Sleep, hydrate, eat well.', zone: 1 as 1|2|3|4|5 }];

  const base = [
    { label: 'Warm-Up', desc: d === 'swim' ? '400m easy swimming + drills' : d === 'bike' ? '15-20min easy spinning, gradually increase cadence' : '10-15min easy jog, dynamic stretching', zone: 1 as 1|2|3|4|5 },
    { label: 'Main Set', desc: workout.description, zone: workout.zone as 1|2|3|4|5 },
    { label: 'Cool-Down', desc: d === 'swim' ? '200m easy backstroke or freestyle' : d === 'bike' ? '10-15min easy spinning' : '10min easy jog + stretching', zone: 1 as 1|2|3|4|5 },
  ];

  return base;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1B2A' },
  gradient: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backBtn: { padding: 4 },
  backBtnText: { color: '#0A84FF', fontSize: 16, fontWeight: '600' },
  topBarTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  scroll: { padding: 16, paddingBottom: 60 },
  hero: { backgroundColor: '#1E2A3A', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12, borderLeftWidth: 4 },
  heroIcon: { fontSize: 32, marginTop: 2 },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  zoneBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  zoneBadgeText: { fontSize: 11, fontWeight: '700' },
  heroDuration: { color: '#8E9BAE', fontSize: 13, fontWeight: '600' },
  heroDistance: { color: '#8E9BAE', fontSize: 13 },
  completedBadge: { backgroundColor: '#4CAF5020', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#4CAF50' },
  completedBadgeText: { color: '#4CAF50', fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: '#1E2A3A', borderRadius: 14, padding: 14, marginBottom: 12 },
  cardTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  description: { color: '#8E9BAE', fontSize: 14, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statBox: { flex: 1, backgroundColor: '#1E2A3A', borderRadius: 12, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#5A6A7A', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },
  segment: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#2C3E50' },
  segmentDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  segmentTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  segmentDesc: { color: '#5A6A7A', fontSize: 12, marginTop: 2 },
  segmentZone: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  zoneDescription: { color: '#8E9BAE', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  zoneBarFull: { height: 8, backgroundColor: '#2C3E50', borderRadius: 99, overflow: 'hidden', marginBottom: 4 },
  zoneBarFill: { height: 8, borderRadius: 99 },
  zoneBarLabels: { flexDirection: 'row', justifyContent: 'space-around' },
  zoneBarLabel: { color: '#5A6A7A', fontSize: 10, fontWeight: '600' },
  contextRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#2C3E50' },
  contextLabel: { color: '#5A6A7A', fontSize: 13 },
  contextValue: { color: '#C0CDD9', fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#2C3E50' },
  logDate: { color: '#8E9BAE', fontSize: 12, width: 70 },
  logEffort: { color: '#0A84FF', fontSize: 12, fontWeight: '600' },
  logHR: { color: '#F44336', fontSize: 12 },
  logPower: { color: '#FF9800', fontSize: 12 },
  logBtn: { backgroundColor: '#0A84FF', borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 12 },
  logBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  doneBox: { backgroundColor: '#4CAF5020', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#4CAF50' },
  doneText: { color: '#4CAF50', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#1E2A3A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  modalSubtitle: { color: '#8E9BAE', fontSize: 14, marginBottom: 14 },
  modalLabel: { color: '#8E9BAE', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12, marginBottom: 6 },
  effortRow: { flexDirection: 'row', gap: 4 },
  effortBtn: { flex: 1, height: 36, borderRadius: 6, backgroundColor: '#2C3E50', alignItems: 'center', justifyContent: 'center' },
  effortBtnActive: { backgroundColor: '#0A84FF' },
  effortBtnText: { color: '#8E9BAE', fontSize: 11, fontWeight: '700' },
  effortBtnTextActive: { color: '#FFFFFF' },
  modalInput: { backgroundColor: '#0D1B2A', borderRadius: 10, color: '#FFFFFF', fontSize: 15, padding: 12, borderWidth: 1, borderColor: '#2C3E50' },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn: { flex: 1, backgroundColor: '#2C3E50', borderRadius: 12, padding: 14, alignItems: 'center' },
  cancelBtnText: { color: '#8E9BAE', fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 2, backgroundColor: '#0A84FF', borderRadius: 12, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
