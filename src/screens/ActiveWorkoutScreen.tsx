import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../config/theme';
import { useAppStore } from '../services/store';
import { EXERCISES } from '../services/exerciseData';
import type { Exercise, WorkoutSession, CompletedExercise } from '../models/types';

interface ActiveWorkoutScreenProps {
  exercises: Exercise[];
  onComplete: (session: WorkoutSession) => void;
  onCancel: () => void;
}

type Phase = 'ready' | 'exercise' | 'rest' | 'complete';

export default function ActiveWorkoutScreen({ exercises, onComplete, onCancel }: ActiveWorkoutScreenProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'pl' | 'de' | 'en';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<Phase>('ready');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  const [startTime] = useState(new Date().toISOString());
  const [totalCalories, setTotalCalories] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentExercise = exercises[currentIndex];
  const totalSets = currentExercise?.sets ?? 3;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Timer główny
  useEffect(() => {
    if (phase === 'exercise') {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else if (phase === 'rest') {
      intervalRef.current = setInterval(() => {
        setRestSeconds((prev) => {
          if (prev <= 1) {
            Vibration.vibrate(500);
            setPhase('exercise');
            setSecondsElapsed(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [phase, clearTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCompleteSet = () => {
    Vibration.vibrate(200);

    // Dodaj kalorie
    const minutes = secondsElapsed / 60;
    setTotalCalories((prev) => prev + Math.round(currentExercise.caloriesPerMinute * minutes));

    if (currentSet < totalSets) {
      // Kolejna seria — odpoczynek
      setCurrentSet((prev) => prev + 1);
      setPhase('rest');
      setRestSeconds(currentExercise.restSeconds ?? 60);
      setSecondsElapsed(0);
    } else {
      // Ćwiczenie zakończone
      setCompletedExercises((prev) => [
        ...prev,
        {
          exerciseId: currentExercise.id,
          sets: Array.from({ length: totalSets }, () => ({
            reps: currentExercise.reps,
            durationSeconds: currentExercise.durationSeconds,
            completedAt: new Date().toISOString(),
          })),
        },
      ]);

      if (currentIndex < exercises.length - 1) {
        // Następne ćwiczenie
        setCurrentIndex((prev) => prev + 1);
        setCurrentSet(1);
        setPhase('rest');
        setRestSeconds(90); // dłuższy odpoczynek między ćwiczeniami
        setSecondsElapsed(0);
      } else {
        // Trening zakończony
        setPhase('complete');
        clearTimer();
      }
    }
  };

  const handleFinish = () => {
    const session: WorkoutSession = {
      id: Date.now().toString(),
      startedAt: startTime,
      completedAt: new Date().toISOString(),
      exercises: completedExercises,
      totalCalories,
      durationMinutes: Math.round(
        (Date.now() - new Date(startTime).getTime()) / 60000
      ),
    };
    onComplete(session);
  };

  const handleCancel = () => {
    Alert.alert(
      'Przerwać trening?',
      'Postęp zostanie utracony.',
      [
        { text: 'Kontynuuj', style: 'cancel' },
        { text: 'Przerwij', style: 'destructive', onPress: onCancel },
      ],
    );
  };

  if (phase === 'complete') {
    return (
      <View style={styles.container}>
        <View style={styles.completeScreen}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>Trening zakończony!</Text>
          <View style={styles.completeSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{exercises.length}</Text>
              <Text style={styles.summaryLabel}>Ćwiczeń</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalCalories}</Text>
              <Text style={styles.summaryLabel}>kcal</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Math.round((Date.now() - new Date(startTime).getTime()) / 60000)}
              </Text>
              <Text style={styles.summaryLabel}>min</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Zapisz trening</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (phase === 'ready') {
    return (
      <View style={styles.container}>
        <View style={styles.readyScreen}>
          <Text style={styles.readyTitle}>Przygotuj się!</Text>
          <Text style={styles.readyExercise}>
            {currentExercise.name[lang] ?? currentExercise.name.en}
          </Text>
          <Text style={styles.readySets}>
            {totalSets} serii × {currentExercise.reps ?? `${currentExercise.durationSeconds}s`}
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setPhase('exercise')}
          >
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelLink} onPress={handleCancel}>
            <Text style={styles.cancelText}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Nagłówek */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelHeaderText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>
          {currentIndex + 1} / {exercises.length}
        </Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Pasek postępu */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentIndex + (currentSet - 1) / totalSets) / exercises.length) * 100}%` },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Nazwa ćwiczenia */}
        <Text style={styles.exerciseName}>
          {currentExercise.name[lang] ?? currentExercise.name.en}
        </Text>

        {/* Timer / Status */}
        <View style={styles.timerContainer}>
          {phase === 'rest' ? (
            <>
              <Text style={styles.phaseLabel}>ODPOCZYNEK</Text>
              <Text style={[styles.timerText, { color: COLORS.secondary }]}>
                {formatTime(restSeconds)}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.phaseLabel}>
                SERIA {currentSet} / {totalSets}
              </Text>
              <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>
              <Text style={styles.targetText}>
                Cel: {currentExercise.reps
                  ? `${currentExercise.reps} powtórzeń`
                  : `${currentExercise.durationSeconds}s`}
              </Text>
            </>
          )}
        </View>

        {/* Instrukcje */}
        <View style={styles.instructionsCard}>
          {(currentExercise.instructions[lang] ?? currentExercise.instructions.en).map(
            (step, i) => (
              <Text key={i} style={styles.instructionText}>
                {i + 1}. {step}
              </Text>
            ),
          )}
        </View>
      </ScrollView>

      {/* Przycisk akcji */}
      {phase === 'exercise' && (
        <TouchableOpacity style={styles.completeSetButton} onPress={handleCompleteSet}>
          <Text style={styles.completeSetText}>
            {currentSet < totalSets
              ? `Zakończ serię ${currentSet}`
              : currentIndex < exercises.length - 1
                ? 'Następne ćwiczenie'
                : 'Zakończ trening'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  cancelHeaderText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textMuted,
  },
  progress: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  exerciseName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  phaseLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  timerText: {
    fontSize: 64,
    fontWeight: '800',
    color: COLORS.primary,
    fontVariant: ['tabular-nums'],
  },
  targetText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  instructionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
  },
  instructionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: SPACING.xs,
  },
  completeSetButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  completeSetText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  // Ready screen
  readyScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  readyTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  readyExercise: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  readySets: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl * 2,
    borderRadius: BORDER_RADIUS.xl,
  },
  startButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
  },
  cancelLink: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
  },
  cancelText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
  },
  // Complete screen
  completeScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  completeEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  completeTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  completeSummary: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: FONT_SIZE.title,
    fontWeight: '800',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  finishButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
  },
  finishButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
});
