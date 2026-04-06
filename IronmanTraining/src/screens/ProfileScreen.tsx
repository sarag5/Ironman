import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { formatPace, formatRunPace } from '../utils/formatters';
import { UserProfile } from '../types';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { state, setProfile, setCurrentWeek } = useApp();
  const navigation = useNavigation<any>();
  const profile = state.profile!;
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(profile?.name ?? '');
  const [swimPace, setSwimPace] = useState(String(profile?.swimPace ?? 105));
  const [ftp, setFtp] = useState(String(profile?.ftpWatts ?? 200));
  const [runPace, setRunPace] = useState(String(profile?.runPacePerKm ?? 320));
  const [maxHR, setMaxHR] = useState(String(profile?.maxHeartRate ?? 180));
  const [restingHR, setRestingHR] = useState(String(profile?.restingHeartRate ?? 55));
  const [raceDate, setRaceDate] = useState(profile?.raceDate ?? '');
  const [weeklyHours, setWeeklyHours] = useState(String(profile?.weeklyAvailableHours ?? 10));

  function save() {
    setProfile({
      ...profile,
      name,
      swimPace: parseInt(swimPace) || 105,
      ftpWatts: parseInt(ftp) || 200,
      runPacePerKm: parseInt(runPace) || 320,
      maxHeartRate: parseInt(maxHR) || 180,
      restingHeartRate: parseInt(restingHR) || 55,
      raceDate,
      weeklyAvailableHours: parseInt(weeklyHours) || 10,
    });
    setEditing(false);
  }

  const daysUntilRace = profile?.raceDate
    ? Math.max(0, Math.ceil((new Date(profile.raceDate).getTime() - Date.now()) / 86400000))
    : 0;

  const plan = state.profile?.raceType === 'ironman703' ? 16 : 20;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0D1B2A', '#0A2540']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase() || 'A'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileSub}>
                {profile?.raceType === 'ironman703' ? 'Ironman 70.3' : 'Full Ironman'} •{' '}
                {profile?.experienceLevel?.charAt(0).toUpperCase() + profile?.experienceLevel?.slice(1)}
              </Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(!editing)}>
              <Text style={styles.editBtnText}>{editing ? 'Cancel' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          {/* Race Info */}
          <View style={styles.raceCard}>
            <View style={styles.raceCardItem}>
              <Text style={styles.raceCardValue}>{daysUntilRace}</Text>
              <Text style={styles.raceCardLabel}>Days to Race</Text>
            </View>
            <View style={styles.raceCardDivider} />
            <View style={styles.raceCardItem}>
              <Text style={styles.raceCardValue}>{state.currentWeek}</Text>
              <Text style={styles.raceCardLabel}>Current Week</Text>
            </View>
            <View style={styles.raceCardDivider} />
            <View style={styles.raceCardItem}>
              <Text style={styles.raceCardValue}>{plan - state.currentWeek + 1}</Text>
              <Text style={styles.raceCardLabel}>Weeks Left</Text>
            </View>
          </View>

          {/* Training Zones quick link */}
          <TouchableOpacity style={styles.zonesBtn} onPress={() => navigation.navigate('Zones')}>
            <Text style={styles.zonesBtnIcon}>🎯</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.zonesBtnTitle}>My Training Zones</Text>
              <Text style={styles.zonesBtnSub}>View HR, power, and pace zones</Text>
            </View>
            <Text style={styles.zonesBtnArrow}>›</Text>
          </TouchableOpacity>

          {/* Performance Benchmarks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Benchmarks</Text>

            {editing ? (
              <View style={styles.editForm}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#5A6A7A" />

                <Text style={styles.inputLabel}>Race Date (YYYY-MM-DD)</Text>
                <TextInput style={styles.input} value={raceDate} onChangeText={setRaceDate} placeholderTextColor="#5A6A7A" />

                <Text style={styles.inputLabel}>Weekly Available Hours</Text>
                <TextInput style={styles.input} value={weeklyHours} onChangeText={setWeeklyHours} keyboardType="numeric" placeholderTextColor="#5A6A7A" />

                <Text style={styles.sectionDivider}>🏊 Swim CSS (sec/100m)</Text>
                <TextInput style={styles.input} value={swimPace} onChangeText={setSwimPace} keyboardType="numeric" placeholderTextColor="#5A6A7A" />

                <Text style={styles.sectionDivider}>🚴 FTP (watts)</Text>
                <TextInput style={styles.input} value={ftp} onChangeText={setFtp} keyboardType="numeric" placeholderTextColor="#5A6A7A" />

                <Text style={styles.sectionDivider}>🏃 Run Threshold Pace (sec/km)</Text>
                <TextInput style={styles.input} value={runPace} onChangeText={setRunPace} keyboardType="numeric" placeholderTextColor="#5A6A7A" />

                <Text style={styles.sectionDivider}>❤️ Max Heart Rate</Text>
                <TextInput style={styles.input} value={maxHR} onChangeText={setMaxHR} keyboardType="numeric" placeholderTextColor="#5A6A7A" />

                <Text style={styles.sectionDivider}>❤️ Resting Heart Rate</Text>
                <TextInput style={styles.input} value={restingHR} onChangeText={setRestingHR} keyboardType="numeric" placeholderTextColor="#5A6A7A" />

                <TouchableOpacity style={styles.saveBtn} onPress={save}>
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.benchmarkGrid}>
                {[
                  { icon: '🏊', label: 'CSS Pace', value: formatPace(profile?.swimPace ?? 105) },
                  { icon: '🚴', label: 'FTP', value: `${profile?.ftpWatts ?? 200}W` },
                  { icon: '🏃', label: 'Run Threshold', value: formatRunPace(profile?.runPacePerKm ?? 320) },
                  { icon: '❤️', label: 'Max HR', value: `${profile?.maxHeartRate ?? 180} bpm` },
                  { icon: '💤', label: 'Resting HR', value: `${profile?.restingHeartRate ?? 55} bpm` },
                  { icon: '⏰', label: 'Weekly Hours', value: `${profile?.weeklyAvailableHours ?? 10}h` },
                ].map(({ icon, label, value }) => (
                  <View key={label} style={styles.benchmarkItem}>
                    <Text style={styles.benchmarkIcon}>{icon}</Text>
                    <Text style={styles.benchmarkValue}>{value}</Text>
                    <Text style={styles.benchmarkLabel}>{label}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Week Navigator */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jump to Week</Text>
            <Text style={styles.weekSub}>Manually adjust your current training week</Text>
            <View style={styles.weekNavRow}>
              <TouchableOpacity
                style={[styles.weekNavBtn, state.currentWeek <= 1 && styles.weekNavBtnDisabled]}
                onPress={() => setCurrentWeek(Math.max(1, state.currentWeek - 1))}
                disabled={state.currentWeek <= 1}
              >
                <Text style={styles.weekNavBtnText}>‹ Prev</Text>
              </TouchableOpacity>
              <View style={styles.weekDisplay}>
                <Text style={styles.weekDisplayNum}>Week {state.currentWeek}</Text>
                <Text style={styles.weekDisplayPhase}>of {plan} total</Text>
              </View>
              <TouchableOpacity
                style={[styles.weekNavBtn, state.currentWeek >= plan && styles.weekNavBtnDisabled]}
                onPress={() => setCurrentWeek(Math.min(plan, state.currentWeek + 1))}
                disabled={state.currentWeek >= plan}
              >
                <Text style={styles.weekNavBtnText}>Next ›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>About Ironman Training App</Text>
            <Text style={styles.infoText}>Structured training plans for both Full Ironman (3.8km swim / 180km bike / 42.2km run) and Ironman 70.3 (1.9km swim / 90km bike / 21.1km run).</Text>
            <Text style={styles.infoText}>Training zones follow the Coggan power model (bike), CSS pacing (swim), and heart rate reserve method (all disciplines).</Text>
            <Text style={styles.infoVersion}>Version 1.0.0</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#0A84FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  profileName: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  profileSub: { color: '#5A6A7A', fontSize: 13, marginTop: 2 },
  editBtn: { backgroundColor: '#1E2A3A', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: '#2C3E50' },
  editBtnText: { color: '#8E9BAE', fontSize: 13, fontWeight: '600' },
  raceCard: { flexDirection: 'row', backgroundColor: '#0A84FF', borderRadius: 14, padding: 16, marginBottom: 16 },
  raceCardItem: { flex: 1, alignItems: 'center' },
  raceCardValue: { color: '#FFFFFF', fontSize: 28, fontWeight: '900' },
  raceCardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  raceCardDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  zonesBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1E2A3A', borderRadius: 12, padding: 14, marginBottom: 16 },
  zonesBtnIcon: { fontSize: 22 },
  zonesBtnTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  zonesBtnSub: { color: '#5A6A7A', fontSize: 12, marginTop: 2 },
  zonesBtnArrow: { color: '#5A6A7A', fontSize: 22 },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  benchmarkGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  benchmarkItem: { width: '30%', backgroundColor: '#1E2A3A', borderRadius: 12, padding: 12, alignItems: 'center', flexGrow: 1 },
  benchmarkIcon: { fontSize: 20, marginBottom: 4 },
  benchmarkValue: { color: '#0A84FF', fontSize: 15, fontWeight: '700' },
  benchmarkLabel: { color: '#5A6A7A', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 2, textAlign: 'center' },
  editForm: { gap: 4 },
  inputLabel: { color: '#8E9BAE', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 10, marginBottom: 4 },
  sectionDivider: { color: '#8E9BAE', fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: '#1E2A3A', borderRadius: 10, color: '#FFFFFF', fontSize: 15, padding: 12, borderWidth: 1, borderColor: '#2C3E50' },
  saveBtn: { backgroundColor: '#0A84FF', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  weekSub: { color: '#5A6A7A', fontSize: 12, marginBottom: 12 },
  weekNavRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  weekNavBtn: { backgroundColor: '#1E2A3A', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  weekNavBtnDisabled: { opacity: 0.4 },
  weekNavBtnText: { color: '#0A84FF', fontSize: 14, fontWeight: '600' },
  weekDisplay: { flex: 1, backgroundColor: '#1E2A3A', borderRadius: 10, padding: 10, alignItems: 'center' },
  weekDisplayNum: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  weekDisplayPhase: { color: '#5A6A7A', fontSize: 11, marginTop: 2 },
  infoBox: { backgroundColor: '#1E2A3A', borderRadius: 12, padding: 16, gap: 8 },
  infoTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  infoText: { color: '#5A6A7A', fontSize: 12, lineHeight: 18 },
  infoVersion: { color: '#2C3E50', fontSize: 11, marginTop: 4 },
});
