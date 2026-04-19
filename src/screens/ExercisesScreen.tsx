import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../config/theme';
import { EXERCISES } from '../services/exerciseData';
import type { ExerciseCategory } from '../models/types';

const CATEGORIES: (ExerciseCategory | 'all')[] = [
  'all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'stretching',
];

export default function ExercisesScreen() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const lang = i18n.language as 'pl' | 'de' | 'en';

  const filtered = EXERCISES.filter((ex) => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch =
      !search ||
      (ex.name[lang] ?? ex.name.en).toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('exercises.title')}</Text>

      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholder={t('exercises.search')}
        placeholderTextColor={COLORS.textMuted}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, selectedCategory === cat && styles.categoryActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {t(`exercises.categories.${cat}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.exerciseCard}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>
                {item.name[lang] ?? item.name.en}
              </Text>
              <Text style={styles.exerciseMeta}>
                {t(`exercises.categories.${item.category}`)} ·{' '}
                {t(`exercises.difficulty.${item.difficulty}`)}
              </Text>
              <View style={styles.muscleRow}>
                {item.muscleGroups.slice(0, 3).map((m) => (
                  <View key={m} style={styles.muscleTag}>
                    <Text style={styles.muscleText}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.chevron}>{'>'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Brak ćwiczeń</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  categoryScroll: {
    paddingLeft: SPACING.lg,
    marginBottom: SPACING.md,
    maxHeight: 44,
  },
  categoryChip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  categoryActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  exerciseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  exerciseMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  muscleRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  muscleTag: {
    backgroundColor: COLORS.primary + '20',
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  muscleText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
  chevron: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
  },
});
