import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserStore {
  // Onboarding data
  learningStyle: "visual" | "verbal" | "kinesthetic" | "logical" | null
  technicalLevel: "beginner" | "intermediate" | "advanced" | null
  mentalState: "tired" | "neutral" | "motivated"
  goal: string

  selectedTopic: string
  topicLevels: Record<string, "beginner" | "intermediate" | "advanced">

  // Progress tracking
  completedLessons: string[]
  currentStreak: number
  totalPoints: number

  // Metadata
  hasCompletedOnboarding: boolean

  // Analytics data
  totalHours: number
  reflections: Array<{ date: string; lessonId: string; text: string }>
  lessonHistory: Array<{ date: string; accuracy: number; timeSpent: number }>

  // Adaptive learning metrics
  cognitiveLoad: "low" | "medium" | "high"
  recentErrors: number
  recentSuccesses: number
  preferredDuration: number
  lastLessonDifficulty: string
  adaptationHistory: Array<{
    timestamp: string
    adaptationType: string
    reason: string
  }>

  // Mastery tracking per lesson
  lessonMastery: Record<string, number> // lessonId -> mastery percentage (0-100)

  // Actions
  setLearningStyle: (style: "visual" | "verbal" | "kinesthetic" | "logical") => void
  setTechnicalLevel: (level: "beginner" | "intermediate" | "advanced") => void
  setMentalState: (state: "tired" | "neutral" | "motivated") => void
  setGoal: (goal: string) => void
  completeLesson: (lessonId: string) => void
  addPoints: (points: number) => void
  incrementStreak: () => void
  completeOnboarding: () => void
  resetStore: () => void
  resetOnboarding: () => void
  addReflection: (lessonId: string, text: string) => void
  addLessonHistory: (accuracy: number, timeSpent: number) => void
  addHours: (hours: number) => void
  setSelectedTopic: (topic: string) => void
  setTopicLevel: (topic: string, level: "beginner" | "intermediate" | "advanced") => void

  // Actions for adaptive tracking
  setCognitiveLoad: (load: "low" | "medium" | "high") => void
  incrementErrors: () => void
  incrementSuccesses: () => void
  resetErrorSuccessCount: () => void
  setPreferredDuration: (duration: number) => void
  trackAdaptation: (adaptationType: string, reason: string) => void

  // Action to update lesson mastery
  updateLessonMastery: (lessonId: string, masteryPercentage: number) => void
}

const initialState = {
  learningStyle: null,
  technicalLevel: null,
  mentalState: "neutral" as const,
  goal: "",
  selectedTopic: "python",
  completedLessons: [],
  currentStreak: 0,
  totalPoints: 0,
  hasCompletedOnboarding: false,
  totalHours: 0,
  reflections: [],
  lessonHistory: [],
  topicLevels: {},

  cognitiveLoad: "medium" as const,
  recentErrors: 0,
  recentSuccesses: 0,
  preferredDuration: 3,
  lastLessonDifficulty: "normal",
  adaptationHistory: [],

  lessonMastery: {},
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      setLearningStyle: (style) => set({ learningStyle: style }),
      setTechnicalLevel: (level) => set({ technicalLevel: level }),
      setMentalState: (state) => set({ mentalState: state }),
      setGoal: (goal) => set({ goal }),

      completeLesson: (lessonId) =>
        set((state) => ({
          completedLessons: [...state.completedLessons, lessonId],
          totalPoints: state.totalPoints + 10,
        })),

      addPoints: (points) =>
        set((state) => ({
          totalPoints: state.totalPoints + points,
        })),

      incrementStreak: () =>
        set((state) => ({
          currentStreak: state.currentStreak + 1,
        })),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      resetStore: () => set(initialState),

      resetOnboarding: () =>
        set({
          learningStyle: null,
          technicalLevel: null,
          mentalState: "neutral",
          goal: "",
          selectedTopic: "python",
          topicLevels: {},
          hasCompletedOnboarding: false,
        }),

      addReflection: (lessonId, text) =>
        set((state) => ({
          reflections: [...state.reflections, { date: new Date().toISOString(), lessonId, text }],
        })),

      addLessonHistory: (accuracy, timeSpent) =>
        set((state) => ({
          lessonHistory: [...state.lessonHistory, { date: new Date().toISOString(), accuracy, timeSpent }],
        })),

      addHours: (hours) =>
        set((state) => ({
          totalHours: state.totalHours + hours,
        })),

      setSelectedTopic: (topic) => set({ selectedTopic: topic }),
      setTopicLevel: (topic, level) =>
        set((state) => ({
          topicLevels: { ...state.topicLevels, [topic]: level },
        })),

      setCognitiveLoad: (load) => set({ cognitiveLoad: load }),

      incrementErrors: () =>
        set((state) => ({
          recentErrors: state.recentErrors + 1,
          recentSuccesses: 0,
        })),

      incrementSuccesses: () =>
        set((state) => ({
          recentSuccesses: state.recentSuccesses + 1,
          recentErrors: 0,
        })),

      resetErrorSuccessCount: () =>
        set({
          recentErrors: 0,
          recentSuccesses: 0,
        }),

      setPreferredDuration: (duration) => set({ preferredDuration: duration }),

      trackAdaptation: (adaptationType, reason) =>
        set((state) => ({
          adaptationHistory: [
            ...state.adaptationHistory,
            {
              timestamp: new Date().toISOString(),
              adaptationType,
              reason,
            },
          ].slice(-20), // Keep only last 20 adaptations
        })),

      updateLessonMastery: (lessonId, masteryPercentage) =>
        set((state) => ({
          lessonMastery: {
            ...state.lessonMastery,
            [lessonId]: Math.max(state.lessonMastery[lessonId] || 0, masteryPercentage),
          },
        })),
    }),
    {
      name: "ailearn-storage",
    },
  ),
)
