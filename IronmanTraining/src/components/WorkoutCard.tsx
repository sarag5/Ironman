import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Workout } from '../types';
import { formatDuration, formatDistance, disciplineIcon, zoneColor } from '../utils/formatters';

interface Props {
  workout: Workout;
  isCompleted?: boolean;
  onPress?: () => void;
  onComplete?: () => void;
  compact?: boolean;
}

export default function WorkoutCard({ workout, isCompleted, onPress, onComplete, compact }: Props) {
  const icon = disciplineIcon(workout.discipline);
  const color = zoneColor(workout.zone);

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.compact, isCompleted && styles.completedCompact]}>
        <Text style={styles.compactIcon}>{icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.compactTitle, isCompleted && styles.completedText]} numberOfLines={1}>
            {workout.title}
          </Text>
          <Text style={styles.compactMeta}>{formatDuration(workout.duration)}</Text>
        </View>
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, isCompleted && styles.completedCard]}>
      <View style={styles.header}>
        <View style={styles.iconRow}>
          <Text style={styles.icon}>{icon}</Text>
          <View style={[styles.zoneDot, { backgroundColor: color }]} />
          <Text style={[styles.zoneText, { color }]}>Zone {workout.zone}</Text>
        </View>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>DONE</Text>
          </View>
        )}
      </View>

      <Text style={[styles.title, isCompleted && styles.completedText]}>{workout.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{workout.description}</Text>

      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Duration</Text>
          <Text style={styles.metaValue}>{formatDuration(workout.duration)}</Text>
        </View>
        {workout.distance != null && workout.distance > 0 && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Distance</Text>
            <Text style={styles.metaValue}>{formatDistance(workout.distance, workout.discipline)}</Text>
          </View>
        )}
        {workout.tss != null && workout.tss > 0 && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>TSS</Text>
            <Text style={styles.metaValue}>{workout.tss}</Text>
          </View>
        )}
        {!isCompleted && onComplete && workout.discipline !== 'rest' && (
          <TouchableOpacity style={styles.completeBtn} onPress={onComplete}>
            <Text style={styles.completeBtnText}>Mark Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2A3A',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#0A84FF',
  },
  completedCard: {
    opacity: 0.7,
    borderLeftColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 18,
  },
  zoneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  zoneText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  completedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#8E9BAE',
  },
  description: {
    color: '#8E9BAE',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    color: '#5A6A7A',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    color: '#C0CDD9',
    fontSize: 13,
    fontWeight: '600',
  },
  completeBtn: {
    marginLeft: 'auto',
    backgroundColor: '#0A84FF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  completeBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2A3A',
    borderRadius: 8,
    padding: 10,
    marginVertical: 3,
    gap: 8,
  },
  completedCompact: {
    opacity: 0.6,
    backgroundColor: '#162030',
  },
  compactIcon: {
    fontSize: 16,
  },
  compactTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  compactMeta: {
    color: '#5A6A7A',
    fontSize: 11,
    marginTop: 1,
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '700',
  },
});
