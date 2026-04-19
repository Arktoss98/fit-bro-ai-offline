import { create } from 'zustand';
import type {
  UserProfile,
  ChatMessage,
  WorkoutSession,
  TimerConfig,
  TrainerPersonality,
} from '../models/types';

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
}

export const useAppStore = create<AppState>((set) => ({
  // Profil
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates, updatedAt: new Date().toISOString() } : null,
    })),

  // Chat
  chatMessages: [],
  addMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearChat: () => set({ chatMessages: [] }),

  // Sesja
  currentSession: null,
  startSession: (session) => set({ currentSession: session }),
  endSession: () =>
    set((state) => {
      if (state.currentSession) {
        return {
          currentSession: null,
          workoutHistory: [...state.workoutHistory, state.currentSession],
        };
      }
      return { currentSession: null };
    }),

  // Historia
  workoutHistory: [],
  addToHistory: (session) =>
    set((state) => ({ workoutHistory: [...state.workoutHistory, session] })),

  // Timer
  timerConfig: { workSeconds: 45, restSeconds: 15, rounds: 8 },
  setTimerConfig: (config) => set({ timerConfig: config }),

  // Osobowość trenera
  trainerPersonality: 'schwarzenegger',
  setTrainerPersonality: (personality) => set({ trainerPersonality: personality }),

  // AI
  isModelLoaded: false,
  setModelLoaded: (loaded) => set({ isModelLoaded: loaded }),
  isGenerating: false,
  setGenerating: (generating) => set({ isGenerating: generating }),
}));
