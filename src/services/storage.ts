import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, WorkoutSession, ChatMessage, TimerConfig, TrainerPersonality } from '../models/types';

const KEYS = {
  PROFILE: '@fitbro/profile',
  WORKOUT_HISTORY: '@fitbro/workout_history',
  CHAT_MESSAGES: '@fitbro/chat_messages',
  TIMER_CONFIG: '@fitbro/timer_config',
  TRAINER_PERSONALITY: '@fitbro/trainer_personality',
  ONBOARDING_COMPLETED: '@fitbro/onboarding_completed',
} as const;

// === Profil użytkownika ===

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const data = await AsyncStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
}

// === Historia treningów ===

export async function saveWorkoutHistory(history: WorkoutSession[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.WORKOUT_HISTORY, JSON.stringify(history));
}

export async function loadWorkoutHistory(): Promise<WorkoutSession[]> {
  const data = await AsyncStorage.getItem(KEYS.WORKOUT_HISTORY);
  return data ? JSON.parse(data) : [];
}

export async function addWorkoutToHistory(session: WorkoutSession): Promise<void> {
  const history = await loadWorkoutHistory();
  history.push(session);
  await saveWorkoutHistory(history);
}

// === Wiadomości czatu ===

export async function saveChatMessages(messages: ChatMessage[]): Promise<void> {
  // Zapisujemy maksymalnie 500 ostatnich wiadomości
  const toSave = messages.slice(-500);
  await AsyncStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(toSave));
}

export async function loadChatMessages(): Promise<ChatMessage[]> {
  const data = await AsyncStorage.getItem(KEYS.CHAT_MESSAGES);
  return data ? JSON.parse(data) : [];
}

// === Konfiguracja timera ===

export async function saveTimerConfig(config: TimerConfig): Promise<void> {
  await AsyncStorage.setItem(KEYS.TIMER_CONFIG, JSON.stringify(config));
}

export async function loadTimerConfig(): Promise<TimerConfig | null> {
  const data = await AsyncStorage.getItem(KEYS.TIMER_CONFIG);
  return data ? JSON.parse(data) : null;
}

// === Osobowość trenera ===

export async function saveTrainerPersonality(personality: TrainerPersonality): Promise<void> {
  await AsyncStorage.setItem(KEYS.TRAINER_PERSONALITY, personality);
}

export async function loadTrainerPersonality(): Promise<TrainerPersonality | null> {
  const data = await AsyncStorage.getItem(KEYS.TRAINER_PERSONALITY);
  return data as TrainerPersonality | null;
}

// === Cały stan aplikacji — załaduj na starcie ===

export interface PersistedState {
  profile: UserProfile | null;
  workoutHistory: WorkoutSession[];
  chatMessages: ChatMessage[];
  timerConfig: TimerConfig | null;
  trainerPersonality: TrainerPersonality | null;
}

export async function loadAllState(): Promise<PersistedState> {
  const [profile, workoutHistory, chatMessages, timerConfig, trainerPersonality] =
    await Promise.all([
      loadProfile(),
      loadWorkoutHistory(),
      loadChatMessages(),
      loadTimerConfig(),
      loadTrainerPersonality(),
    ]);

  return { profile, workoutHistory, chatMessages, timerConfig, trainerPersonality };
}

// === Wyczyść dane (reset) ===

export async function clearAllData(): Promise<void> {
  const keys = Object.values(KEYS) as string[];
  await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
}
