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

interface ParqScreenProps {
  onComplete: (hasRisk: boolean) => void;
}

const QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const;

export default function ParqScreen({ onComplete }: ParqScreenProps) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(
    Object.fromEntries(QUESTIONS.map((q) => [q, null]))
  );

  const toggleAnswer = (question: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const allAnswered = Object.values(answers).every((a) => a !== null);
  const hasRisk = Object.values(answers).some((a) => a === true);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('parq.title')}</Text>
        <Text style={styles.subtitle}>{t('parq.subtitle')}</Text>

        {QUESTIONS.map((q, index) => (
          <View key={q} style={styles.questionCard}>
            <Text style={styles.questionNumber}>{index + 1}.</Text>
            <Text style={styles.questionText}>{t(`parq.${q}`)}</Text>
            <View style={styles.answerRow}>
              <TouchableOpacity
                style={[
                  styles.answerButton,
                  answers[q] === true && styles.answerYes,
                ]}
                onPress={() => toggleAnswer(q, true)}
              >
                <Text
                  style={[
                    styles.answerText,
                    answers[q] === true && styles.answerTextActive,
                  ]}
                >
                  {t('common.yes')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.answerButton,
                  answers[q] === false && styles.answerNo,
                ]}
                onPress={() => toggleAnswer(q, false)}
              >
                <Text
                  style={[
                    styles.answerText,
                    answers[q] === false && styles.answerTextActive,
                  ]}
                >
                  {t('common.no')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {allAnswered && (
          <View
            style={[
              styles.resultBox,
              hasRisk ? styles.resultWarning : styles.resultOk,
            ]}
          >
            <Text style={styles.resultText}>
              {hasRisk ? t('parq.warning') : t('parq.allClear')}
            </Text>
          </View>
        )}
      </ScrollView>

      {allAnswered && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => onComplete(hasRisk)}
        >
          <Text style={styles.buttonText}>{t('common.next')}</Text>
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
  content: {
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  questionNumber: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  questionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  answerRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  answerButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  answerYes: {
    backgroundColor: COLORS.error + '20',
    borderColor: COLORS.error,
  },
  answerNo: {
    backgroundColor: COLORS.success + '20',
    borderColor: COLORS.success,
  },
  answerText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  answerTextActive: {
    color: COLORS.text,
  },
  resultBox: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  resultWarning: {
    backgroundColor: COLORS.warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  resultOk: {
    backgroundColor: COLORS.success + '20',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  resultText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
});
