import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../config/theme';
import { useAppStore } from '../services/store';

type TimerPhase = 'idle' | 'work' | 'rest' | 'complete';

export default function TimerScreen() {
  const { t } = useTranslation();
  const timerConfig = useAppStore((s) => s.timerConfig);
  const setTimerConfig = useAppStore((s) => s.setTimerConfig);

  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(timerConfig.workSeconds);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          Vibration.vibrate(500);

          if (phase === 'work') {
            if (currentRound >= timerConfig.rounds) {
              setPhase('complete');
              setIsRunning(false);
              return 0;
            }
            setPhase('rest');
            return timerConfig.restSeconds;
          } else if (phase === 'rest') {
            setPhase('work');
            setCurrentRound((r) => r + 1);
            return timerConfig.workSeconds;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, phase, currentRound, timerConfig, clearTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setPhase('work');
    setSecondsLeft(timerConfig.workSeconds);
    setCurrentRound(1);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearTimer();
    setPhase('idle');
    setSecondsLeft(timerConfig.workSeconds);
    setCurrentRound(1);
    setIsRunning(false);
  };

  const adjustConfig = (field: 'workSeconds' | 'restSeconds' | 'rounds', delta: number) => {
    if (phase !== 'idle') return;
    const newValue = timerConfig[field] + delta;
    if (field === 'rounds' && newValue < 1) return;
    if (field !== 'rounds' && newValue < 5) return;
    setTimerConfig({ ...timerConfig, [field]: newValue });
    if (field === 'workSeconds') setSecondsLeft(newValue);
  };

  const phaseColor =
    phase === 'work' ? COLORS.primary :
    phase === 'rest' ? COLORS.secondary :
    phase === 'complete' ? COLORS.success :
    COLORS.textSecondary;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('timer.title')}</Text>

      {/* Konfiguracja */}
      <View style={styles.configRow}>
        {[
          { label: t('timer.work'), field: 'workSeconds' as const, value: timerConfig.workSeconds, unit: 's' },
          { label: t('timer.rest'), field: 'restSeconds' as const, value: timerConfig.restSeconds, unit: 's' },
          { label: t('timer.rounds'), field: 'rounds' as const, value: timerConfig.rounds, unit: '' },
        ].map((item) => (
          <View key={item.field} style={styles.configItem}>
            <Text style={styles.configLabel}>{item.label}</Text>
            <View style={styles.configControls}>
              <TouchableOpacity
                style={styles.configButton}
                onPress={() => adjustConfig(item.field, item.field === 'rounds' ? -1 : -5)}
              >
                <Text style={styles.configButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.configValue}>
                {item.value}{item.unit}
              </Text>
              <TouchableOpacity
                style={styles.configButton}
                onPress={() => adjustConfig(item.field, item.field === 'rounds' ? 1 : 5)}
              >
                <Text style={styles.configButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <View style={[styles.timerCircle, { borderColor: phaseColor }]}>
          <Text style={styles.phaseLabel}>
            {phase === 'idle' ? '' :
             phase === 'work' ? t('timer.work') :
             phase === 'rest' ? t('timer.rest') :
             t('timer.complete')}
          </Text>
          <Text style={[styles.timerText, { color: phaseColor }]}>
            {phase === 'complete' ? '00:00' : formatTime(secondsLeft)}
          </Text>
          <Text style={styles.roundText}>
            {phase !== 'idle' && phase !== 'complete'
              ? `${currentRound} / ${timerConfig.rounds}`
              : ''}
          </Text>
        </View>
      </View>

      {/* Przyciski sterowania */}
      <View style={styles.controlRow}>
        {phase === 'idle' ? (
          <TouchableOpacity style={[styles.controlButton, styles.startButton]} onPress={handleStart}>
            <Text style={styles.controlButtonText}>{t('timer.start')}</Text>
          </TouchableOpacity>
        ) : phase === 'complete' ? (
          <TouchableOpacity style={[styles.controlButton, styles.resetButton]} onPress={handleReset}>
            <Text style={styles.controlButtonText}>{t('timer.reset')}</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={[styles.controlButton, styles.resetButton]} onPress={handleReset}>
              <Text style={styles.controlButtonText}>{t('timer.reset')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, isRunning ? styles.pauseButton : styles.startButton]}
              onPress={handlePause}
            >
              <Text style={styles.controlButtonText}>
                {isRunning ? t('timer.pause') : t('timer.start')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  configItem: {
    alignItems: 'center',
  },
  configLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  configControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  configButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  configButtonText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.text,
    fontWeight: '600',
  },
  configValue: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'center',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  phaseLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  roundText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  controlButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: COLORS.primary,
  },
  pauseButton: {
    backgroundColor: COLORS.warning,
  },
  resetButton: {
    backgroundColor: COLORS.surfaceLight,
  },
  controlButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
});
