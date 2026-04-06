export function formatDuration(minutes: number): string {
  if (minutes === 0) return 'Rest';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function formatPace(secondsPer100m: number): string {
  const min = Math.floor(secondsPer100m / 60);
  const sec = Math.round(secondsPer100m % 60);
  return `${min}:${sec.toString().padStart(2, '0')}/100m`;
}

export function formatRunPace(secondsPerKm: number): string {
  const min = Math.floor(secondsPerKm / 60);
  const sec = Math.round(secondsPerKm % 60);
  return `${min}:${sec.toString().padStart(2, '0')}/km`;
}

export function formatDistance(meters: number, discipline: string): string {
  if (discipline === 'swim') {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)}km`;
    return `${meters}m`;
  }
  if (meters >= 1000) return `${(meters / 1000).toFixed(0)}km`;
  return `${meters}m`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatShortDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getDayName(dayOfWeek: number): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayOfWeek] ?? '';
}

export function getDayFullName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] ?? '';
}

export function disciplineIcon(discipline: string): string {
  switch (discipline) {
    case 'swim': return '🏊';
    case 'bike': return '🚴';
    case 'run': return '🏃';
    case 'brick': return '🔥';
    case 'rest': return '😴';
    default: return '💪';
  }
}

export function zoneColor(zone: number): string {
  switch (zone) {
    case 1: return '#4CAF50';
    case 2: return '#8BC34A';
    case 3: return '#FFC107';
    case 4: return '#FF5722';
    case 5: return '#F44336';
    default: return '#9E9E9E';
  }
}

export function phaseColor(phase: string): string {
  switch (phase) {
    case 'base': return '#2196F3';
    case 'build': return '#FF9800';
    case 'peak': return '#F44336';
    case 'taper': return '#9C27B0';
    case 'race': return '#FFD700';
    default: return '#9E9E9E';
  }
}

export function phaseBadgeLabel(phase: string): string {
  switch (phase) {
    case 'base': return 'BASE';
    case 'build': return 'BUILD';
    case 'peak': return 'PEAK';
    case 'taper': return 'TAPER';
    case 'race': return 'RACE';
    default: return phase.toUpperCase();
  }
}
