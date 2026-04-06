import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  progress: number; // 0-1
  color?: string;
  height?: number;
  label?: string;
  showPercent?: boolean;
}

export default function ProgressBar({ progress, color = '#0A84FF', height = 8, label, showPercent }: Props) {
  const pct = Math.min(1, Math.max(0, progress));
  return (
    <View style={styles.container}>
      {(label || showPercent) && (
        <View style={styles.row}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercent && <Text style={styles.percent}>{Math.round(pct * 100)}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color, height }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: '#8E9BAE',
    fontSize: 12,
  },
  percent: {
    color: '#8E9BAE',
    fontSize: 12,
  },
  track: {
    backgroundColor: '#2C3E50',
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 99,
  },
});
