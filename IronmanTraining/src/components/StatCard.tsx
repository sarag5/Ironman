import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: string;
}

export default function StatCard({ label, value, sub, color = '#0A84FF', icon }: Props) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sub && <Text style={styles.sub}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2A3A',
    borderRadius: 12,
    padding: 14,
    flex: 1,
    alignItems: 'center',
    borderTopWidth: 3,
    margin: 4,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  label: {
    color: '#8E9BAE',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
    textAlign: 'center',
  },
  sub: {
    color: '#5A6A7A',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
});
