import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../config/theme';
import { useAppStore } from '../services/store';

import OnboardingScreen from '../screens/OnboardingScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import ParqScreen from '../screens/ParqScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import TimerScreen from '../screens/TimerScreen';

const Tab = createBottomTabNavigator();

type OnboardingStep = 'welcome' | 'disclaimer' | 'parq' | 'profile' | 'done';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Chat: '🤖',
    Exercises: '💪',
    Timer: '⏱️',
  };
  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.5 }}>
      {icons[label] ?? '📱'}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Start' }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: 'Trener AI' }} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} options={{ tabBarLabel: 'Ćwiczenia' }} />
      <Tab.Screen name="Timer" component={TimerScreen} options={{ tabBarLabel: 'Timer' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const profile = useAppStore((s) => s.profile);
  const [step, setStep] = useState<OnboardingStep>(profile ? 'done' : 'welcome');

  if (step === 'done' || profile) {
    return (
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    );
  }

  switch (step) {
    case 'welcome':
      return <OnboardingScreen onComplete={() => setStep('disclaimer')} />;
    case 'disclaimer':
      return <DisclaimerScreen onAccept={() => setStep('parq')} />;
    case 'parq':
      return <ParqScreen onComplete={() => setStep('profile')} />;
    case 'profile':
      return <ProfileSetupScreen onComplete={() => setStep('done')} />;
    default:
      return null;
  }
}
