import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, Platform, KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { UserProfile, RaceType } from '../types';

const STEPS = ['welcome', 'race', 'dates', 'fitness', 'zones', 'done'] as const;
type Step = typeof STEPS[number];

export default function OnboardingScreen() {
  const { setProfile, completeOnboarding } = useApp();
  const [step, setStep] = useState<Step>('welcome');

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [raceType, setRaceType] = useState<RaceType>('ironman703');
  const [raceDate, setRaceDate] = useState('');
  const [swimPace, setSwimPace] = useState('105'); // 1:45/100m default
  const [ftp, setFtp] = useState('200');
  const [runPace, setRunPace] = useState('320'); // 5:20/km default
  const [maxHR, setMaxHR] = useState('180');
  const [restingHR, setRestingHR] = useState('55');
  const [hours, setHours] = useState('10');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  function next() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }

  function back() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  function finish() {
    const profile: UserProfile = {
      name: name || 'Athlete',
      age: parseInt(age) || 30,
      raceType,
      raceDate: raceDate || new Date(Date.now() + 20 * 7 * 24 * 60 * 60 * 1000).toISOString(),
      swimPace: parseInt(swimPace) || 105,
      ftpWatts: parseInt(ftp) || 200,
      runPacePerKm: parseInt(runPace) || 320,
      maxHeartRate: parseInt(maxHR) || 180,
      restingHeartRate: parseInt(restingHR) || 55,
      weeklyAvailableHours: parseInt(hours) || 10,
      experienceLevel: level,
    };
    setProfile(profile);
    completeOnboarding();
  }

  const stepIndex = STEPS.indexOf(step);
  const progress = stepIndex / (STEPS.length - 1);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0D1B2A', '#0A2540']} style={styles.gradient}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {step === 'welcome' && (
              <View style={styles.centerContent}>
                <Text style={styles.bigEmoji}>🏊🚴🏃</Text>
                <Text style={styles.heroTitle}>IRONMAN{'\n'}TRAINING</Text>
                <Text style={styles.heroSub}>Your complete training companion for{'\n'}Ironman & Ironman 70.3</Text>
                <View style={styles.featureList}>
                  {[
                    ['📅', '20-week structured training plans'],
                    ['🎯', 'Personalized training zones'],
                    ['📊', 'Progress tracking & analytics'],
                    ['💪', 'Swim, bike, run & brick workouts'],
                    ['🏁', 'Race countdown & simulation'],
                  ].map(([icon, text]) => (
                    <View key={text as string} style={styles.featureRow}>
                      <Text style={styles.featureIcon}>{icon}</Text>
                      <Text style={styles.featureText}>{text}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#5A6A7A"
                  />
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={setAge}
                    placeholder="30"
                    keyboardType="numeric"
                    placeholderTextColor="#5A6A7A"
                  />
                </View>
              </View>
            )}

            {step === 'race' && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Choose Your Race</Text>
                <Text style={styles.stepSub}>Which distance are you training for?</Text>

                <TouchableOpacity
                  style={[styles.raceCard, raceType === 'ironman703' && styles.raceCardSelected]}
                  onPress={() => setRaceType('ironman703')}
                >
                  <Text style={styles.raceEmoji}>🥈</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.raceName}>IRONMAN 70.3</Text>
                    <Text style={styles.raceDistance}>1.9km swim • 90km bike • 21.1km run</Text>
                    <Text style={styles.racePlan}>16-week training plan</Text>
                  </View>
                  {raceType === 'ironman703' && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.raceCard, raceType === 'ironman' && styles.raceCardSelected]}
                  onPress={() => setRaceType('ironman')}
                >
                  <Text style={styles.raceEmoji}>🥇</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.raceName}>FULL IRONMAN</Text>
                    <Text style={styles.raceDistance}>3.8km swim • 180km bike • 42.2km run</Text>
                    <Text style={styles.racePlan}>20-week training plan</Text>
                  </View>
                  {raceType === 'ironman' && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>

                <Text style={[styles.stepTitle, { marginTop: 24 }]}>Experience Level</Text>
                <View style={styles.levelRow}>
                  {(['beginner', 'intermediate', 'advanced'] as const).map(l => (
                    <TouchableOpacity
                      key={l}
                      style={[styles.levelBtn, level === l && styles.levelBtnActive]}
                      onPress={() => setLevel(l)}
                    >
                      <Text style={[styles.levelBtnText, level === l && styles.levelBtnTextActive]}>
                        {l.charAt(0).toUpperCase() + l.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {step === 'dates' && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Race Date</Text>
                <Text style={styles.stepSub}>When is your race? (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.input}
                  value={raceDate}
                  onChangeText={setRaceDate}
                  placeholder="2026-09-15"
                  placeholderTextColor="#5A6A7A"
                  maxLength={10}
                />
                <Text style={styles.tip}>
                  💡 The app will automatically align your training plan to peak on race day.
                  You'll have {raceType === 'ironman703' ? 16 : 20} weeks of progressive training.
                </Text>
                <Text style={styles.inputLabel}>Weekly Available Hours</Text>
                <TextInput
                  style={styles.input}
                  value={hours}
                  onChangeText={setHours}
                  placeholder="10"
                  keyboardType="numeric"
                  placeholderTextColor="#5A6A7A"
                />
                <Text style={styles.tip}>
                  💡 Recommended: Beginners 8-10h, Intermediate 10-14h, Advanced 14-18h per week.
                </Text>
              </View>
            )}

            {step === 'fitness' && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Fitness Benchmarks</Text>
                <Text style={styles.stepSub}>Help us personalize your training zones. Don't worry—you can update these anytime.</Text>

                <Text style={styles.sectionHeader}>🏊 Swim</Text>
                <Text style={styles.inputLabel}>CSS Pace (sec per 100m) — e.g. 1:45 = 105</Text>
                <TextInput
                  style={styles.input}
                  value={swimPace}
                  onChangeText={setSwimPace}
                  placeholder="105"
                  keyboardType="numeric"
                  placeholderTextColor="#5A6A7A"
                />

                <Text style={styles.sectionHeader}>🚴 Bike</Text>
                <Text style={styles.inputLabel}>FTP – Functional Threshold Power (watts)</Text>
                <TextInput
                  style={styles.input}
                  value={ftp}
                  onChangeText={setFtp}
                  placeholder="200"
                  keyboardType="numeric"
                  placeholderTextColor="#5A6A7A"
                />

                <Text style={styles.sectionHeader}>🏃 Run</Text>
                <Text style={styles.inputLabel}>Threshold Pace (sec per km) — e.g. 5:20 = 320</Text>
                <TextInput
                  style={styles.input}
                  value={runPace}
                  onChangeText={setRunPace}
                  placeholder="320"
                  keyboardType="numeric"
                  placeholderTextColor="#5A6A7A"
                />
              </View>
            )}

            {step === 'zones' && (
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Heart Rate Zones</Text>
                <Text style={styles.stepSub}>Used to set intensity across all disciplines.</Text>

                <Text style={styles.inputLabel}>Max Heart Rate (bpm)</Text>
                <TextInput
                  style={styles.input}
                  value={maxHR}
                  onChangeText={setMaxHR}
                  placeholder="180"
                  keyboardType="numeric"
                  placeholderTextColor="#5A6A7A"
                />
                <Text style={styles.tip}>💡 Estimate: 220 - your age = {220 - (parseInt(age) || 30)} bpm</Text>

                <Text style={styles.inputLabel}>Resting Heart Rate (bpm)</Text>
                <TextInput
                  style={styles.input}
                  value={restingHR}
                  onChangeText={setRestingHR}
                  placeholder="55"
                  keyboardType="numeric"
                  placeholderTextColor="#5A6A7A"
                />

                <View style={styles.zonePreview}>
                  <Text style={styles.zonePreviewTitle}>Your Training Zones</Text>
                  {[
                    { z: 1, name: 'Recovery', color: '#4CAF50', pct: '50-60%' },
                    { z: 2, name: 'Aerobic', color: '#8BC34A', pct: '60-70%' },
                    { z: 3, name: 'Tempo', color: '#FFC107', pct: '70-80%' },
                    { z: 4, name: 'Threshold', color: '#FF5722', pct: '80-90%' },
                    { z: 5, name: 'VO2 Max', color: '#F44336', pct: '90-100%' },
                  ].map(({ z, name, color, pct }) => {
                    const maxH = parseInt(maxHR) || 180;
                    const restH = parseInt(restingHR) || 55;
                    const reserve = maxH - restH;
                    const percents = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
                    const min = Math.round(restH + reserve * percents[z - 1]);
                    const max = Math.round(restH + reserve * percents[z]);
                    return (
                      <View key={z} style={styles.zoneRow}>
                        <View style={[styles.zoneColorDot, { backgroundColor: color }]} />
                        <Text style={styles.zoneLabel}>Z{z} {name}</Text>
                        <Text style={styles.zoneRange}>{min}–{max} bpm</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {step === 'done' && (
              <View style={styles.centerContent}>
                <Text style={styles.bigEmoji}>🎉</Text>
                <Text style={styles.heroTitle}>YOU'RE{'\n'}READY!</Text>
                <Text style={styles.heroSub}>
                  Your personalized {raceType === 'ironman703' ? 'Ironman 70.3' : 'Full Ironman'} training plan is set.{'\n\n'}
                  Training starts today. Stay consistent, trust the process, and cross that finish line!
                </Text>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryTitle}>Training Summary</Text>
                  <Text style={styles.summaryLine}>👤 {name || 'Athlete'}, {age || '30'} years old</Text>
                  <Text style={styles.summaryLine}>🏁 {raceType === 'ironman703' ? 'Ironman 70.3' : 'Full Ironman'}</Text>
                  <Text style={styles.summaryLine}>📅 {raceDate || 'Date TBD'}</Text>
                  <Text style={styles.summaryLine}>⏱ {hours}h available per week</Text>
                  <Text style={styles.summaryLine}>📈 {level.charAt(0).toUpperCase() + level.slice(1)} athlete</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Navigation buttons */}
          <View style={styles.navRow}>
            {stepIndex > 0 && step !== 'done' && (
              <TouchableOpacity style={styles.backBtn} onPress={back}>
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextBtn, { marginLeft: stepIndex === 0 || step === 'done' ? 0 : 12 }]}
              onPress={step === 'done' ? finish : next}
            >
              <Text style={styles.nextBtnText}>
                {step === 'welcome' ? 'Get Started' : step === 'done' ? 'Start Training!' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1B2A' },
  gradient: { flex: 1 },
  progressBar: { height: 3, backgroundColor: '#1E2A3A', marginHorizontal: 20, marginTop: 8, borderRadius: 99 },
  progressFill: { height: 3, backgroundColor: '#0A84FF', borderRadius: 99 },
  scroll: { flexGrow: 1, padding: 24 },
  centerContent: { alignItems: 'center', paddingTop: 20 },
  stepContent: { paddingTop: 10 },
  bigEmoji: { fontSize: 60, marginBottom: 16 },
  heroTitle: { fontSize: 42, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 48 },
  heroSub: { fontSize: 15, color: '#8E9BAE', textAlign: 'center', marginTop: 12, lineHeight: 22 },
  featureList: { width: '100%', marginTop: 28, gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { fontSize: 20, width: 30 },
  featureText: { color: '#C0CDD9', fontSize: 15 },
  inputGroup: { width: '100%', marginTop: 24, gap: 4 },
  inputLabel: { color: '#8E9BAE', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: '#1E2A3A', borderRadius: 10, color: '#FFFFFF', fontSize: 16, padding: 14, borderWidth: 1, borderColor: '#2C3E50' },
  stepTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  stepSub: { color: '#8E9BAE', fontSize: 14, marginBottom: 20, lineHeight: 20 },
  raceCard: { flexDirection: 'row', backgroundColor: '#1E2A3A', borderRadius: 14, padding: 16, marginBottom: 12, alignItems: 'center', gap: 12, borderWidth: 2, borderColor: 'transparent' },
  raceCardSelected: { borderColor: '#0A84FF', backgroundColor: '#0A84FF15' },
  raceEmoji: { fontSize: 30 },
  raceName: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  raceDistance: { color: '#8E9BAE', fontSize: 12, marginTop: 2 },
  racePlan: { color: '#0A84FF', fontSize: 11, marginTop: 4, fontWeight: '600' },
  checkmark: { color: '#0A84FF', fontSize: 22, fontWeight: '700' },
  levelRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  levelBtn: { flex: 1, backgroundColor: '#1E2A3A', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  levelBtnActive: { borderColor: '#0A84FF', backgroundColor: '#0A84FF20' },
  levelBtnText: { color: '#8E9BAE', fontSize: 13, fontWeight: '600' },
  levelBtnTextActive: { color: '#0A84FF' },
  tip: { color: '#5A6A7A', fontSize: 12, marginTop: 6, marginBottom: 8, lineHeight: 18, fontStyle: 'italic' },
  sectionHeader: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 4 },
  zonePreview: { backgroundColor: '#1E2A3A', borderRadius: 12, padding: 16, marginTop: 16 },
  zonePreviewTitle: { color: '#FFFFFF', fontWeight: '700', marginBottom: 12, fontSize: 14 },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  zoneColorDot: { width: 10, height: 10, borderRadius: 5 },
  zoneLabel: { color: '#C0CDD9', fontSize: 13, flex: 1 },
  zoneRange: { color: '#8E9BAE', fontSize: 12 },
  summaryBox: { backgroundColor: '#1E2A3A', borderRadius: 14, padding: 18, width: '100%', marginTop: 24, gap: 8 },
  summaryTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  summaryLine: { color: '#C0CDD9', fontSize: 14 },
  navRow: { flexDirection: 'row', padding: 20, paddingTop: 8 },
  backBtn: { flex: 0.4, backgroundColor: '#1E2A3A', borderRadius: 12, padding: 16, alignItems: 'center' },
  backBtnText: { color: '#8E9BAE', fontSize: 16, fontWeight: '600' },
  nextBtn: { flex: 1, backgroundColor: '#0A84FF', borderRadius: 12, padding: 16, alignItems: 'center' },
  nextBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
