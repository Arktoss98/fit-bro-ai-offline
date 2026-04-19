export type Gender = 'male' | 'female' | 'other';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type TrainingGoal = 'loseWeight' | 'gainMuscle' | 'getFit' | 'flexibility';
export type TrainerPersonality = 'schwarzenegger' | 'rocky' | 'drill' | 'zen' | 'custom';

export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'stretching';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  fitnessLevel: FitnessLevel;
  goal: TrainingGoal;
  trainerPersonality: TrainerPersonality;
  parqCompleted: boolean;
  disclaimerAccepted: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: Record<string, string>; // { pl, de, en }
  description: Record<string, string>;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  muscleGroups: string[];
  equipment: string[];
  instructions: Record<string, string[]>;
  durationSeconds?: number;
  reps?: number;
  sets?: number;
  restSeconds?: number;
  caloriesPerMinute: number;
  animationUrl?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  totalDurationMinutes: number;
  difficulty: ExerciseDifficulty;
  createdAt: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface WorkoutSession {
  id: string;
  planId?: string;
  startedAt: string;
  completedAt?: string;
  exercises: CompletedExercise[];
  totalCalories: number;
  durationMinutes: number;
}

export interface CompletedExercise {
  exerciseId: string;
  sets: CompletedSet[];
}

export interface CompletedSet {
  reps?: number;
  weight?: number;
  durationSeconds?: number;
  completedAt: string;
}

export interface TimerConfig {
  workSeconds: number;
  restSeconds: number;
  rounds: number;
}
