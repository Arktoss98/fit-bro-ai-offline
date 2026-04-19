import { create } from 'zustand';
import type {
  UserProfile,
  ChatMessage,
  WorkoutSession,
  TimerConfig,
  TrainerPersonality,
} from '../models/types';
import * as storage from './storage';

interface AppState {
  // Profil użytkownika
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Chat z trenerem AI
  chatMessages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearChat: () => void;

  // Sesja treningowa
  currentSession: WorkoutSession | null;
  startSession: (session: WorkoutSession) => void;
  endSession: () => void;

  // Historia treningów
  workoutHistory: WorkoutSession[];
  addToHistory: (session: WorkoutSession) => void;

  // Timer
  timerConfig: TimerConfig;
  setTimerConfig: (config: TimerConfig) => void;

  // Osobowość trenera
  trainerPersonality: TrainerPersonality;
  setTrainerPersonality: (personality: TrainerPersonality) => void;

  // AI status
  isModelLoaded: boolean;
  setModelLoaded: (loaded: boolean) => void;
  isGenerating: boolean;
  setGenerating: (generating: boolean) => void;

  // Inicjalizacja z persystencji
  isHydrated: boolean;
  hydrate: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Profil
  profile: null,
  setProfile: (profile) => {
    set({ profile });
    storage.saveProfile(profile);
  },
  updateProfile: (updates) => {
    const current = get().profile;
    if (current) {
      const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
      set({ profile: updated });
      storage.saveProfile(updated);
    }
  },

  // Chat
  chatMessages: [],
  addMessage: (message) => {
    const updated = [...get().chatMessages, message];
    set({ chatMessages: updated });
    storage.saveChatMessages(updated);
  },
  clearChat: () => {
    set({ chatMessages: [] });
    storage.saveChatMessages([]);
  },

  // Sesja
  currentSession: null,
  startSession: (session) => set({ currentSession: session }),
  endSession: () => {
    const session = get().currentSession;
    if (session) {
      const history = [...get().workoutHistory, session];
      set({ currentSession: null, workoutHistory: history });
      storage.saveWorkoutHistory(history);
    } else {
      set({ currentSession: null });
    }
  },

  // Historia
  workoutHistory: [],
  addToHistory: (session) => {
    const history = [...get().workoutHistory, session];
    set({ workoutHistory: history });
    storage.saveWorkoutHistory(history);
  },

  // Timer
  timerConfig: { workSeconds: 45, restSeconds: 15, rounds: 8 },
  setTimerConfig: (config) => {
    set({ timerConfig: config });
    storage.saveTimerConfig(config);
  },

  // Osobowość trenera
  trainerPersonality: 'schwarzenegger',
  setTrainerPersonality: (personality) => {
    set({ trainerPersonality: personality });
    storage.saveTrainerPersonality(personality);
  },

  // AI
  isModelLoaded: false,
  setModelLoaded: (loaded) => set({ isModelLoaded: loaded }),
  isGenerating: false,
  setGenerating: (generating) => set({ isGenerating: generating }),

  // Hydratacja — załaduj zapisany stan z AsyncStorage
  isHydrated: false,
  hydrate: async () => {
    const persisted = await storage.loadAllState();
    set({
      profile: persisted.profile,
      workoutHistory: persisted.workoutHistory,
      chatMessages: persisted.chatMessages,
      timerConfig: persisted.timerConfig ?? { workSeconds: 45, restSeconds: 15, rounds: 8 },
      trainerPersonality: persisted.trainerPersonality ?? 'schwarzenegger',
      isHydrated: true,
    });
  },
}));
