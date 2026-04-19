import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../config/theme';
import { useAppStore } from '../services/store';
import * as storage from '../services/storage';
import type { TrainerPersonality } from '../models/types';

const PERSONALITIES: { key: TrainerPersonality; emoji: string }[] = [
  { key: 'schwarzenegger', emoji: '💪' },
  { key: 'rocky', emoji: '🥊' },
  { key: 'drill', emoji: '🎖️' },
  { key: 'zen', emoji: '🧘' },
  { key: 'custom', emoji: '⚙️' },
];

const LANGUAGES = [
  { code: 'pl', label: 'Polski' },
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
];

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const profile = useAppStore((s) => s.profile);
  const trainerPersonality = useAppStore((s) => s.trainerPersonality);
  const setTrainerPersonality = useAppStore((s) => s.setTrainerPersonality);
  const workoutHistory = useAppStore((s) => s.workoutHistory);
  const clearChat = useAppStore((s) => s.clearChat);

  const bmi = profile
    ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1)
    : '—';

  const handleClearChat = () => {
    Alert.alert(
      'Wyczyść czat',
      'Czy na pewno chcesz usunąć wszystkie wiadomości?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.yes'), style: 'destructive', onPress: () => clearChat() },
      ],
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset aplikacji',
      'Czy na pewno chcesz usunąć wszystkie dane? Ta operacja jest nieodwracalna.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Resetuj',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAllData();
            // Wymaga restartu aplikacji
            Alert.alert('Gotowe', 'Uruchom ponownie aplikację.');
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('profile.title')}</Text>

      {/* Karta profilu */}
      {profile && (
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.statValue}>{profile.age}</Text>
              <Text style={styles.statLabel}>{t('profile.age')}</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.statValue}>{profile.weight} kg</Text>
              <Text style={styles.statLabel}>{t('profile.weight')}</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.statValue}>{profile.height} cm</Text>
              <Text style={styles.statLabel}>{t('profile.height')}</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.statValue}>{bmi}</Text>
              <Text style={styles.statLabel}>BMI</Text>
            </View>
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.metaText}>
              {t(`profile.${profile.fitnessLevel}`)} · {t(`profile.${profile.goal}`)}
            </Text>
          </View>
        </View>
      )}

      {/* Statystyki */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.stats')}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.bigNumber}>{workoutHistory.length}</Text>
            <Text style={styles.cardLabel}>Treningi</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.bigNumber}>
              {workoutHistory.reduce((sum, w) => sum + w.totalCalories, 0)}
            </Text>
            <Text style={styles.cardLabel}>kcal spalonych</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.bigNumber}>
              {workoutHistory.reduce((sum, w) => sum + w.durationMinutes, 0)}
            </Text>
            <Text style={styles.cardLabel}>minut</Text>
          </View>
        </View>
      </View>

      {/* Osobowość trenera */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('trainer.selectPersonality')}</Text>
        {PERSONALITIES.map(({ key, emoji }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.personalityRow,
              trainerPersonality === key && styles.personalityActive,
            ]}
            onPress={() => setTrainerPersonality(key)}
          >
            <Text style={styles.personalityEmoji}>{emoji}</Text>
            <View style={styles.personalityInfo}>
              <Text style={styles.personalityName}>{t(`trainer.${key}`)}</Text>
              <Text style={styles.personalityDesc}>{t(`trainer.${key}Desc`)}</Text>
            </View>
            {trainerPersonality === key && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Język */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Język / Sprache / Language</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.langButton,
                i18n.language === lang.code && styles.langActive,
              ]}
              onPress={() => i18n.changeLanguage(lang.code)}
            >
              <Text
                style={[
                  styles.langText,
                  i18n.language === lang.code && styles.langTextActive,
                ]}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Akcje */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton} onPress={handleClearChat}>
          <Text style={styles.actionText}>Wyczyść historię czatu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleResetApp}
        >
          <Text style={[styles.actionText, styles.dangerText]}>Resetuj aplikację</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>FIT BRO AI OFFLINE v0.1.0 (MVP)</Text>
        <Text style={styles.footerText}>Model: Gemma 4 E4B (Q4_K_M)</Text>
        <Text style={styles.footerText}>
          Aplikacja fitness i wellness. NIE jest wyrobem medycznym.
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
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  profileName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  profileStat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileMeta: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  bigNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cardLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textTransform: 'uppercase',
  },
  personalityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  personalityActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  personalityEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  personalityInfo: {
    flex: 1,
  },
  personalityName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  personalityDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  checkmark: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.primary,
    fontWeight: '700',
  },
  langRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  langButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  langActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  langText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  langTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: COLORS.error + '40',
  },
  actionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  dangerText: {
    color: COLORS.error,
  },
  footer: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    gap: SPACING.xs,
  },
  footerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
