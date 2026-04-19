import React from 'react';
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

export default function HomeScreen() {
  const { t } = useTranslation();
  const profile = useAppStore((s) => s.profile);
  const workoutHistory = useAppStore((s) => s.workoutHistory);

  const streak = workoutHistory.length; // TODO: kalkulacja prawdziwego streak

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
          <Text style={styles.statNumber}>
            {workoutHistory.reduce((sum, w) => sum + w.totalCalories, 0)}
          </Text>
          <Text style={styles.statLabel}>kcal</Text>
        </View>
      </View>

      {/* Plan na dziś */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.todayPlan')}</Text>
        <View style={styles.planCard}>
          <Text style={styles.planEmoji}>💪</Text>
          <Text style={styles.planText}>{t('home.noWorkout')}</Text>
          <TouchableOpacity style={styles.planButton}>
            <Text style={styles.planButtonText}>{t('home.startWorkout')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Szybki start */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.quickStart')}</Text>
        <View style={styles.quickGrid}>
          {[
            { emoji: '🏃', label: 'Kardio', duration: '20 min' },
            { emoji: '💪', label: 'Siła', duration: '30 min' },
            { emoji: '🧘', label: 'Stretching', duration: '15 min' },
            { emoji: '🔥', label: 'HIIT', duration: '25 min' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.quickCard}>
              <Text style={styles.quickEmoji}>{item.emoji}</Text>
              <Text style={styles.quickLabel}>{item.label}</Text>
              <Text style={styles.quickDuration}>{item.duration}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: SPACING.xxl,
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
    padding: SPACING.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
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
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  planEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  planText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  planButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  planButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
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
});
