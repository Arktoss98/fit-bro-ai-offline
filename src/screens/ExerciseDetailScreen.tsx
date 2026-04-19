import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../config/theme';
import type { Exercise } from '../models/types';

interface ExerciseDetailScreenProps {
  exercise: Exercise;
  onClose: () => void;
}

export default function ExerciseDetailScreen({ exercise, onClose }: ExerciseDetailScreenProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'pl' | 'de' | 'en';

  const name = exercise.name[lang] ?? exercise.name.en;
  const description = exercise.description[lang] ?? exercise.description.en;
  const instructions = exercise.instructions[lang] ?? exercise.instructions.en;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backText}>{'< '}{t('common.back')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>{description}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Text style={styles.metaLabel}>{t(`exercises.categories.${exercise.category}`)}</Text>
          </View>
          <View style={[styles.metaChip, styles.difficultyChip]}>
            <Text style={styles.metaLabel}>{t(`exercises.difficulty.${exercise.difficulty}`)}</Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaLabel}>{exercise.caloriesPerMinute} kcal/min</Text>
          </View>
        </View>

        {/* Parametry */}
        <View style={styles.paramsCard}>
          {exercise.sets && (
            <View style={styles.paramRow}>
              <Text style={styles.paramLabel}>Serie</Text>
              <Text style={styles.paramValue}>{exercise.sets}</Text>
            </View>
          )}
          {exercise.reps && (
            <View style={styles.paramRow}>
              <Text style={styles.paramLabel}>Powtórzenia</Text>
              <Text style={styles.paramValue}>{exercise.reps}</Text>
            </View>
          )}
          {exercise.durationSeconds && (
            <View style={styles.paramRow}>
              <Text style={styles.paramLabel}>Czas</Text>
              <Text style={styles.paramValue}>{exercise.durationSeconds}s</Text>
            </View>
          )}
          {exercise.restSeconds && (
            <View style={styles.paramRow}>
              <Text style={styles.paramLabel}>Odpoczynek</Text>
              <Text style={styles.paramValue}>{exercise.restSeconds}s</Text>
            </View>
          )}
        </View>

        {/* Mięśnie */}
        <Text style={styles.sectionTitle}>Zaangażowane mięśnie</Text>
        <View style={styles.muscleRow}>
          {exercise.muscleGroups.map((m) => (
            <View key={m} style={styles.muscleTag}>
              <Text style={styles.muscleText}>{m}</Text>
            </View>
          ))}
        </View>

        {/* Sprzęt */}
        {exercise.equipment.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Wymagany sprzęt</Text>
            <View style={styles.muscleRow}>
              {exercise.equipment.map((e) => (
                <View key={e} style={styles.equipmentTag}>
                  <Text style={styles.equipmentText}>{e}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Instrukcje krok po kroku */}
        <Text style={styles.sectionTitle}>Instrukcje</Text>
        {instructions.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        {/* Placeholder na animację */}
        <View style={styles.animationPlaceholder}>
          <Text style={styles.animationEmoji}>🎬</Text>
          <Text style={styles.animationText}>
            Animacja ćwiczenia{'\n'}(w trakcie implementacji)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backButton: {
    paddingVertical: SPACING.sm,
  },
  backText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  metaChip: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  difficultyChip: {
    backgroundColor: COLORS.primary + '20',
  },
  metaLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  paramsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  paramLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  paramValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  muscleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  muscleTag: {
    backgroundColor: COLORS.primary + '20',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  muscleText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  equipmentTag: {
    backgroundColor: COLORS.secondary + '20',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  equipmentText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  animationPlaceholder: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  animationEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  animationText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
