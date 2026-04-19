import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  type ViewToken,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../config/theme';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface SlideData {
  key: string;
  icon: string;
  titleKey: string;
  descKey: string;
}

const slides: SlideData[] = [
  {
    key: '1',
    icon: '🏋️',
    titleKey: 'onboarding.feature1',
    descKey: 'onboarding.feature1desc',
  },
  {
    key: '2',
    icon: '🤖',
    titleKey: 'onboarding.feature2',
    descKey: 'onboarding.feature2desc',
  },
  {
    key: '3',
    icon: '🔒',
    titleKey: 'onboarding.feature3',
    descKey: 'onboarding.feature3desc',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const renderSlide = ({ item }: { item: SlideData }) => (
    <View style={styles.slide}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.title}>{t(item.titleKey)}</Text>
      <Text style={styles.description}>{t(item.descKey)}</Text>
    </View>
  );

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeTitle}>{t('onboarding.welcome')}</Text>
      <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.key}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.dotActive]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (isLastSlide) {
            onComplete();
          } else {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
          }
        }}
      >
        <Text style={styles.buttonText}>
          {isLastSlide ? t('onboarding.getStarted') : t('common.next')}
        </Text>
      </TouchableOpacity>

      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
          <Text style={styles.skipText}>{t('common.skip')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingTop: SPACING.xxl * 2,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.surfaceLight,
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 30,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    width: width - SPACING.xl * 2,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
  },
});
