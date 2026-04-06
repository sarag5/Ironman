import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import {
  calculateSwimPaceZones,
  calculateBikePowerZones,
  calculateRunPaceZones,
  calculateHeartRateZones,
} from '../data/trainingZones';
import { useNavigation } from '@react-navigation/native';

type Tab = 'swim' | 'bike' | 'run' | 'hr';

const ZONE_COLORS = ['#4CAF50', '#8BC34A', '#FFC107', '#FF5722', '#F44336'];
const ZONE_NAMES = ['Recovery / Z1', 'Aerobic / Z2', 'Tempo / Z3', 'Threshold / Z4', 'VO2 Max / Z5'];

function fmtPace100(sec: number) {
  const min = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${min}:${s.toString().padStart(2, '0')}`;
}

function fmtPaceKm(sec: number) {
  const min = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${min}:${s.toString().padStart(2, '0')}`;
}

export default function ZonesScreen() {
  const { state } = useApp();
  const navigation = useNavigation();
  const profile = state.profile!;
  const [tab, setTab] = useState<Tab>('swim');

  const swimZones = calculateSwimPaceZones(profile.swimPace);
  const bikeZones = calculateBikePowerZones(profile.ftpWatts);
  const runZones = calculateRunPaceZones(profile.runPacePerKm);
  const hrZones = calculateHeartRateZones(profile.maxHeartRate, profile.restingHeartRate);

  const tabs: { key: Tab; icon: string; label: string }[] = [
    { key: 'swim', icon: '🏊', label: 'Swim' },
    { key: 'bike', icon: '🚴', label: 'Bike' },
    { key: 'run', icon: '🏃', label: 'Run' },
    { key: 'hr', icon: '❤️', label: 'HR' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0D1B2A', '#0A2540']} style={styles.gradient}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>My Training Zones</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {tabs.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={styles.tabIcon}>{t.icon}</Text>
              <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Benchmark info */}
          <View style={styles.benchmarkInfo}>
            {tab === 'swim' && (
              <>
                <Text style={styles.benchmarkTitle}>Based on CSS: {fmtPace100(profile.swimPace)}/100m</Text>
                <Text style={styles.benchmarkSub}>Critical Swim Speed — your threshold swim pace. Zones are calculated relative to CSS.</Text>
              </>
            )}
            {tab === 'bike' && (
              <>
                <Text style={styles.benchmarkTitle}>Based on FTP: {profile.ftpWatts}W</Text>
                <Text style={styles.benchmarkSub}>Functional Threshold Power — the max power you can sustain for 1hr. Uses Coggan 5-zone model.</Text>
              </>
            )}
            {tab === 'run' && (
              <>
                <Text style={styles.benchmarkTitle}>Based on Threshold Pace: {fmtPaceKm(profile.runPacePerKm)}/km</Text>
                <Text style={styles.benchmarkSub}>Your lactate threshold run pace. All run zones calculated from this benchmark.</Text>
              </>
            )}
            {tab === 'hr' && (
              <>
                <Text style={styles.benchmarkTitle}>Max HR: {profile.maxHeartRate} bpm · Resting HR: {profile.restingHeartRate} bpm</Text>
                <Text style={styles.benchmarkSub}>Zones use the Karvonen Heart Rate Reserve method for precision across all disciplines.</Text>
              </>
            )}
          </View>

          {/* Zone table */}
          <View style={styles.zonesCard}>
            {[1, 2, 3, 4, 5].map((z) => {
              const idx = z - 1;
              const color = ZONE_COLORS[idx];
              const name = ZONE_NAMES[idx];

              let rangeStr = '';
              if (tab === 'swim') {
                const r = swimZones[z as 1|2|3|4|5];
                rangeStr = `${fmtPace100(r[0])} – ${fmtPace100(r[1])}/100m`;
              } else if (tab === 'bike') {
                const r = bikeZones[z as 1|2|3|4|5];
                rangeStr = `${Math.round(r[0])} – ${Math.round(r[1])} watts`;
              } else if (tab === 'run') {
                const r = runZones[z as 1|2|3|4|5];
                rangeStr = `${fmtPaceKm(r[0])} – ${fmtPaceKm(r[1])}/km`;
              } else {
                const r = hrZones[z as 1|2|3|4|5];
                rangeStr = `${Math.round(r[0])} – ${Math.round(r[1])} bpm`;
              }

              const descriptions: Record<Tab, string[]> = {
                swim: [
                  'Warm-up, drills, active recovery',
                  'Aerobic base building – bulk of training',
                  'Tempo – comfortably hard, race simulation',
                  'Threshold – anaerobic threshold sets',
                  'VO2 Max sprints – short, max effort',
                ],
                bike: [
                  '<55% FTP – Easy spinning, recovery',
                  '56-75% FTP – Long endurance rides',
                  '76-90% FTP – Tempo & sweet spot work',
                  '91-105% FTP – Threshold intervals',
                  '106-120% FTP – VO2 Max work',
                ],
                run: [
                  'Easy jogging – conversational pace',
                  'Aerobic pace – base building runs',
                  'Tempo – comfortably hard pace',
                  'Threshold – 10K-HM race effort',
                  'Interval – short, very high intensity',
                ],
                hr: [
                  '50-60% HRR – Very easy, recovery',
                  '60-70% HRR – Aerobic base zone',
                  '70-80% HRR – Aerobic threshold',
                  '80-90% HRR – Lactate threshold',
                  '90-100% HRR – VO2 Max & above',
                ],
              };

              return (
                <View key={z} style={[styles.zoneRow, { borderLeftColor: color }]}>
                  <View style={[styles.zoneBadge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.zoneBadgeText, { color }]}>Z{z}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.zoneName}>{name}</Text>
                    <Text style={[styles.zoneRange, { color }]}>{rangeStr}</Text>
                    <Text style={styles.zoneDesc}>{descriptions[tab][idx]}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Training Zone Tips</Text>
            {tab === 'swim' && [
              '80% of swim volume should be Z1-Z2 (aerobic)',
              'CSS pace is best tested with a 400m + 200m time trial',
              'Use Z4-Z5 intervals sparingly — 1-2 sessions per week max',
              'Focus on stroke efficiency in all zones',
            ].map((tip, i) => <Text key={i} style={styles.tipText}>• {tip}</Text>)}
            {tab === 'bike' && [
              '70-80% of bike training should be Z2 endurance',
              'Sweet spot (Z3) is 88-93% FTP — highly effective',
              'FTP test: 20-min all-out effort × 0.95',
              'Ironman race pace is approximately Z2 (56-70% FTP)',
              'Train with power if possible for precision',
            ].map((tip, i) => <Text key={i} style={styles.tipText}>• {tip}</Text>)}
            {tab === 'run' && [
              'Run mostly at Z2 — easy, aerobic pace',
              'Threshold pace = roughly 10K race pace',
              'Ironman run target: Z2 for first half, Z3 if possible',
              'Brick runs help your body adapt bike-to-run transition',
            ].map((tip, i) => <Text key={i} style={styles.tipText}>• {tip}</Text>)}
            {tab === 'hr' && [
              'Heart rate lags effort — allow 2-3 min to stabilize',
              'Use HR as a guide, not absolute truth',
              'Heat, fatigue & caffeine all raise HR',
              'Track resting HR daily — rising trend = fatigue/illness',
            ].map((tip, i) => <Text key={i} style={styles.tipText}>• {tip}</Text>)}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1B2A' },
  gradient: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backBtn: { padding: 4 },
  backBtnText: { color: '#0A84FF', fontSize: 16, fontWeight: '600' },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4 },
  tab: { flex: 1, alignItems: 'center', backgroundColor: '#1E2A3A', borderRadius: 10, paddingVertical: 8, borderWidth: 1.5, borderColor: 'transparent' },
  tabActive: { borderColor: '#0A84FF', backgroundColor: '#0A84FF15' },
  tabIcon: { fontSize: 16, marginBottom: 2 },
  tabLabel: { color: '#5A6A7A', fontSize: 11, fontWeight: '600' },
  tabLabelActive: { color: '#0A84FF' },
  scroll: { padding: 16, paddingBottom: 60 },
  benchmarkInfo: { backgroundColor: '#1E2A3A', borderRadius: 12, padding: 14, marginBottom: 14 },
  benchmarkTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  benchmarkSub: { color: '#5A6A7A', fontSize: 12, lineHeight: 18 },
  zonesCard: { backgroundColor: '#1E2A3A', borderRadius: 16, overflow: 'hidden', marginBottom: 14 },
  zoneRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: '#2C3E50', borderLeftWidth: 4 },
  zoneBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, minWidth: 32, alignItems: 'center' },
  zoneBadgeText: { fontWeight: '800', fontSize: 12 },
  zoneName: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  zoneRange: { fontSize: 15, fontWeight: '800', marginBottom: 3 },
  zoneDesc: { color: '#5A6A7A', fontSize: 11, lineHeight: 16 },
  tipsCard: { backgroundColor: '#1E2A3A', borderRadius: 12, padding: 16, gap: 8 },
  tipsTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  tipText: { color: '#8E9BAE', fontSize: 12, lineHeight: 18 },
});
