import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../config/theme';
import { useAppStore } from '../services/store';
import type { Gender, FitnessLevel, TrainingGoal, UserProfile } from '../models/types';

interface ProfileSetupScreenProps {
  onComplete: () => void;
}

export default function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const { t } = useTranslation();
  const setProfile = useAppStore((s) => s.setProfile);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel | null>(null);
  const [goal, setGoal] = useState<TrainingGoal | null>(null);

  const isValid =
    name.trim().length > 0 &&
    Number(age) > 0 &&
    Number(weight) > 0 &&
    Number(height) > 0 &&
    gender !== null &&
    fitnessLevel !== null &&
    goal !== null;

  const handleSubmit = () => {
    if (!isValid || !gender || !fitnessLevel || !goal) return;

    const profile: UserProfile = {
      name: name.trim(),
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender,
      fitnessLevel,
      goal,
      trainerPersonality: 'schwarzenegger',
      parqCompleted: true,
      disclaimerAccepted: true,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProfile(profile);
    onComplete();
  };

  const renderSelector = <T extends string>(
    options: { value: T; label: string }[],
    selected: T | null,
    onSelect: (value: T) => void
  ) => (
    <View style={styles.selectorRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.selectorButton, selected === opt.value && styles.selectorActive]}
          onPress={() => onSelect(opt.value)}
        >
          <Text
            style={[styles.selectorText, selected === opt.value && styles.selectorTextActive]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('profile.title')}</Text>

        <Text style={styles.label}>{t('profile.name')}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor={COLORS.textMuted}
          placeholder={t('profile.name')}
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>{t('profile.age')}</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textMuted}
              placeholder="25"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>{t('profile.weight')}</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textMuted}
              placeholder="75"
            />
          </View>
        </View>

        <Text style={styles.label}>{t('profile.height')}</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          placeholderTextColor={COLORS.textMuted}
          placeholder="178"
        />

        <Text style={styles.label}>{t('profile.gender')}</Text>
        {renderSelector(
          [
            { value: 'male' as Gender, label: t('profile.male') },
            { value: 'female' as Gender, label: t('profile.female') },
            { value: 'other' as Gender, label: t('profile.other') },
          ],
          gender,
          setGender
        )}

        <Text style={styles.label}>{t('profile.fitnessLevel')}</Text>
        {renderSelector(
          [
            { value: 'beginner' as FitnessLevel, label: t('profile.beginner') },
            { value: 'intermediate' as FitnessLevel, label: t('profile.intermediate') },
            { value: 'advanced' as FitnessLevel, label: t('profile.advanced') },
          ],
          fitnessLevel,
          setFitnessLevel
        )}

        <Text style={styles.label}>{t('profile.goal')}</Text>
        {renderSelector(
          [
            { value: 'loseWeight' as TrainingGoal, label: t('profile.loseWeight') },
            { value: 'gainMuscle' as TrainingGoal, label: t('profile.gainMuscle') },
            { value: 'getFit' as TrainingGoal, label: t('profile.getFit') },
            { value: 'flexibility' as TrainingGoal, label: t('profile.flexibility') },
          ],
          goal,
          setGoal
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>{t('common.start')}</Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  selectorButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  selectorActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  selectorText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  selectorTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
});
