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

interface DisclaimerScreenProps {
  onAccept: () => void;
}

export default function DisclaimerScreen({ onAccept }: DisclaimerScreenProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.warningIcon}>⚕️</Text>
        <Text style={styles.title}>{t('disclaimer.title')}</Text>
        <View style={styles.textBox}>
          <Text style={styles.disclaimerText}>{t('disclaimer.text')}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={onAccept}>
        <Text style={styles.buttonText}>{t('disclaimer.accept')}</Text>
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
    alignItems: 'center',
    paddingTop: SPACING.xxl * 2,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  warningIcon: {
    fontSize: 60,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  textBox: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  disclaimerText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 26,
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
