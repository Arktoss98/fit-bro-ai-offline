import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../config/theme';
import { useAppStore } from '../services/store';
import { EXERCISES } from '../services/exerciseData';
import ActiveWorkoutScreen from './ActiveWorkoutScreen';
import type { Exercise, WorkoutSession } from '../models/types';

type QuickWorkoutType = 'cardio' | 'strength' | 'stretching' | 'hiit';

const QUICK_WORKOUTS: Record<QuickWorkoutType, { emoji: string; label: string; duration: string; categories: string[] }> = {
  cardio: { emoji: '🏃', label: 'Kardio', duration: '20 min', categories: ['cardio'] },
  strength: { emoji: '💪', label: 'Siła', duration: '30 min', categories: ['chest', 'back', 'legs', 'shoulders', 'arms'] },
  stretching: { emoji: '🧘', label: 'Stretching', duration: '15 min', categories: ['stretching'] },
  hiit: { emoji: '🔥', label: 'HIIT', duration: '25 min', categories: ['cardio', 'core', 'legs'] },
};

function getQuickWorkoutExercises(type: QuickWorkoutType): Exercise[] {
  const config = QUICK_WORKOUTS[type];
  const matching = EXERCISES.filter((e) => config.categories.includes(e.category));
  // Wybierz max 5 losowych ćwiczeń
  const shuffled = [...matching].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const profile = useAppStore((s) => s.profile);
  const workoutHistory = useAppStore((s) => s.workoutHistory);
  const addToHistory = useAppStore((s) => s.addToHistory);
  const [activeWorkout, setActiveWorkout] = useState<Exercise[] | null>(null);
  const lang = i18n.language as 'pl' | 'de' | 'en';

  // Kalkulacja streak (dni z rzędu z treningiem)
  const calculateStreak = (): number => {
    if (workoutHistory.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = new Date(today);

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasWorkout = workoutHistory.some(
        (w) => w.startedAt.split('T')[0] === dateStr
      );
      if (hasWorkout) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // Dziś jeszcze bez treningu — sprawdź od wczoraj
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();
  const totalCalories = workoutHistory.reduce((sum, w) => sum + w.totalCalories, 0);
  const totalMinutes = workoutHistory.reduce((sum, w) => sum + w.durationMinutes, 0);

  // Aktywny trening
  if (activeWorkout) {
    return (
      <ActiveWorkoutScreen
        exercises={activeWorkout}
        onComplete={(session: WorkoutSession) => {
          addToHistory(session);
          setActiveWorkout(null);
        }}
        onCancel={() => setActiveWorkout(null)}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>
        {t('home.greeting', { name: profile?.name ?? '' })}
      </Text>

      {/* Statystyki */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{workoutHistory.length}</Text>
          <Text style={styles.statLabel}>Treningi</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{streak}</Text>
          <Text style={styles.statLabel}>Seria dni</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCalories}</Text>
          <Text style={styles.statLabel}>kcal</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalMinutes}</Text>
          <Text style={styles.statLabel}>min</Text>
        </View>
      </View>

      {/* Ostatni trening */}
      {workoutHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ostatni trening</Text>
          <View style={styles.lastWorkout}>
            <Text style={styles.lastWorkoutDate}>
              {new Date(workoutHistory[workoutHistory.length - 1].startedAt).toLocaleDateString(lang)}
            </Text>
            <Text style={styles.lastWorkoutStats}>
              {workoutHistory[workoutHistory.length - 1].exercises.length} ćwiczeń ·{' '}
              {workoutHistory[workoutHistory.length - 1].totalCalories} kcal ·{' '}
              {workoutHistory[workoutHistory.length - 1].durationMinutes} min
            </Text>
          </View>
        </View>
      )}

      {/* Szybki start */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.quickStart')}</Text>
        <View style={styles.quickGrid}>
          {(Object.entries(QUICK_WORKOUTS) as [QuickWorkoutType, typeof QUICK_WORKOUTS[QuickWorkoutType]][]).map(
            ([type, config]) => (
              <TouchableOpacity
                key={type}
                style={styles.quickCard}
                onPress={() => {
                  const exercises = getQuickWorkoutExercises(type);
                  if (exercises.length > 0) {
                    setActiveWorkout(exercises);
                  }
                }}
              >
                <Text style={styles.quickEmoji}>{config.emoji}</Text>
                <Text style={styles.quickLabel}>{config.label}</Text>
                <Text style={styles.quickDuration}>{config.duration}</Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      </View>

      {/* Motywacja */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationText}>
          {workoutHistory.length === 0
            ? '💪 Rozpocznij swój pierwszy trening!'
            : streak >= 3
              ? `🔥 ${streak} dni z rzędu — nie przerywaj serii!`
              : '👊 Każdy trening się liczy. Dawaj!'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  greeting: {
    fontSize: FONT_SIZE.title,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  lastWorkout: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  lastWorkoutDate: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  lastWorkoutStats: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  quickCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  quickEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  quickLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  quickDuration: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  motivationCard: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  motivationText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
  },
});
