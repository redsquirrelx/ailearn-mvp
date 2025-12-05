"use client"

import { useUserStore } from "@/lib/store"
import { useToast } from "@/components/toast-provider"
import { useEffect, useState } from "react"
import { BookOpen, Target, Flame, Clock, Play, Sparkles, BarChart3, User, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { availableTopics, getAllLessonsForTopics } from "@/lib/lessons-data"

export default function DashboardPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const {
    learningStyle,
    mentalState,
    completedLessons,
    currentStreak,
    totalPoints,
    selectedTopic,
    setSelectedTopic,
    topicLevels,
    hasCompletedOnboarding,
    lessonMastery,
  } = useUserStore()

  const [showTopicSelector, setShowTopicSelector] = useState(!selectedTopic || !hasCompletedOnboarding)

  useEffect(() => {
    const interval = setInterval(() => {
      showToast("Progreso guardado automáticamente", "success")
    }, 30000)

    return () => clearInterval(interval)
  }, [showToast])

  const getDuration = () => {
    if (mentalState === "tired") return 5
    if (mentalState === "neutral") return 10
    return 15
  }

  const handleSelectTopic = (topicId: string) => {
    if (!hasCompletedOnboarding) {
      // First time selecting any topic, need full onboarding
      setSelectedTopic(topicId)
      router.push("/onboarding")
    } else {
      // Already onboarded, just switch topic
      setSelectedTopic(topicId)
      const topicName = availableTopics.find((t) => t.id === topicId)?.name
      showToast(`Tema cambiado a ${topicName}`, "success")
      setShowTopicSelector(false)
    }
  }

  const recommendedLessons = selectedTopic ? getAllLessonsForTopics([selectedTopic]).slice(0, 6) : []

  const nextLesson = recommendedLessons.find((lesson) => !completedLessons.includes(lesson.id)) || recommendedLessons[0]

  const handleStartLesson = (lessonId: string, lessonTitle: string) => {
    if (!hasCompletedOnboarding) {
      showToast("Primero completa el diagnóstico seleccionando un tema", "error")
      return
    }
    showToast(`Iniciando: ${lessonTitle}`, "info")
    router.push(`/lesson-adaptive/${lessonId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {!hasCompletedOnboarding || showTopicSelector ? (
          <div className="space-y-6">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl font-bold text-white">Bienvenido a AILearn</h1>
              <p className="text-xl text-slate-300">Selecciona un tema de estudio para comenzar</p>
              <p className="text-slate-400">
                Después de seleccionar, haremos un diagnóstico rápido para personalizar tu experiencia
              </p>
            </div>

            <Card className="bg-slate-800/90 backdrop-blur-xl border-purple-500/30 p-8 space-y-8">
              {/* Technology */}
              <div>
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Tecnología</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {availableTopics
                    .filter((t) => t.category === "tech")
                    .map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic.id)}
                        className="p-6 rounded-xl border-2 border-slate-700 bg-slate-800/50 hover:border-purple-500 hover:bg-purple-500/10 transition-all group"
                      >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{topic.icon}</div>
                        <div className="text-white font-medium">{topic.name}</div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Business */}
              <div>
                <h3 className="text-2xl font-semibold text-blue-400 mb-4">Negocios y Productividad</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {availableTopics
                    .filter((t) => t.category === "business")
                    .map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic.id)}
                        className="p-6 rounded-xl border-2 border-slate-700 bg-slate-800/50 hover:border-blue-500 hover:bg-blue-500/10 transition-all group"
                      >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{topic.icon}</div>
                        <div className="text-white font-medium">{topic.name}</div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Creative */}
              <div>
                <h3 className="text-2xl font-semibold text-pink-400 mb-4">Creatividad</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {availableTopics
                    .filter((t) => t.category === "creative")
                    .map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic.id)}
                        className="p-6 rounded-xl border-2 border-slate-700 bg-slate-800/50 hover:border-pink-500 hover:bg-pink-500/10 transition-all group"
                      >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{topic.icon}</div>
                        <div className="text-white font-medium">{topic.name}</div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-2xl font-semibold text-green-400 mb-4">Idiomas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {availableTopics
                    .filter((t) => t.category === "language")
                    .map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic.id)}
                        className="p-6 rounded-xl border-2 border-slate-700 bg-slate-800/50 hover:border-green-500 hover:bg-green-500/10 transition-all group"
                      >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{topic.icon}</div>
                        <div className="text-white font-medium">{topic.name}</div>
                      </button>
                    ))}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Mi Tema de Estudio</h2>
                <p className="text-slate-400">Enfócate en un tema a la vez para mejor aprendizaje</p>
              </div>
              <Button
                onClick={() => setShowTopicSelector(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                Cambiar Tema
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {(() => {
                const topic = availableTopics.find((t) => t.id === selectedTopic)
                if (!topic) return null
                return (
                  <div
                    key={selectedTopic}
                    className={`px-6 py-3 rounded-full bg-gradient-to-r ${topic.color} text-white font-medium flex items-center gap-3 text-lg`}
                  >
                    <span className="text-2xl">{topic.icon}</span>
                    <span>{topic.name}</span>
                  </div>
                )
              })()}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => router.push("/evaluation")}
                className="p-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl hover:border-green-500/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="text-white font-semibold">Evaluación Escrita</h3>
                    <p className="text-slate-400 text-sm">La IA evaluará tu respuesta</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push("/analytics")}
                className="p-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl hover:border-purple-500/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="text-white font-semibold">Ver Análisis Completo</h3>
                    <p className="text-slate-400 text-sm">Progreso, temas y metacognición</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => showToast("Próximamente: perfil personalizado", "info")}
                className="p-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl hover:border-pink-500/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="text-white font-semibold">Mi Perfil</h3>
                    <p className="text-slate-400 text-sm">Estilo: {learningStyle || "No definido"}</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Hero Card */}
            {nextLesson && (
              <Card className="bg-slate-800 border-purple-500/30 p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <p className="text-purple-400 font-medium text-sm md:text-base">Tu próxima micro-lección</p>
                    <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
                      <span className="text-4xl flex-shrink-0">
                        {learningStyle === "visual"
                          ? "🎨"
                          : learningStyle === "verbal"
                            ? "📖"
                            : learningStyle === "kinesthetic"
                              ? "🎯"
                              : learningStyle === "logical"
                                ? "🧠"
                                : "📚"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 break-words">
                          {nextLesson.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-slate-300">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm md:text-base">{nextLesson.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 flex-shrink-0" />
                            <span className="capitalize text-sm md:text-base">{learningStyle || "Adaptativo"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleStartLesson(nextLesson.id, nextLesson.title)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold rounded-xl w-full md:w-auto"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Comenzar ahora
                    </Button>
                  </div>
                  <div className="hidden md:block w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl opacity-20 blur-3xl flex-shrink-0" />
                </div>
              </Card>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-slate-400 font-medium">Lecciones</span>
                </div>
                <div className="text-4xl font-bold text-white">{completedLessons.length}</div>
                <p className="text-slate-500 text-sm mt-2">Completadas</p>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 p-6 hover:border-orange-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Flame className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="text-slate-400 font-medium">Racha</span>
                </div>
                <div className="text-4xl font-bold text-white">{currentStreak}</div>
                <p className="text-slate-500 text-sm mt-2">días consecutivos</p>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 p-6 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Sparkles className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-slate-400 font-medium">Puntos</span>
                </div>
                <div className="text-4xl font-bold text-white">{totalPoints}</div>
                <p className="text-slate-500 text-sm mt-2">puntos totales</p>
              </Card>
            </div>

            {/* Recommended Lessons */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Lecciones Recomendadas</h3>
              {recommendedLessons.length === 0 ? (
                <p className="text-slate-400">No hay lecciones disponibles para este tema.</p>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {recommendedLessons.map((lesson) => {
                    const mastery = lessonMastery[lesson.id] || 0
                    const isCompleted = completedLessons.includes(lesson.id)

                    return (
                      <Card
                        key={lesson.id}
                        className="bg-slate-800/50 backdrop-blur-xl border-slate-700 overflow-hidden hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group"
                      >
                        <div className="h-32 relative" style={{ background: lesson.thumbnail }}>
                          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
                            {lesson.duration} min
                          </div>
                          {isCompleted && (
                            <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-bold">
                              ✓ Completada
                            </div>
                          )}
                        </div>

                        <div className="p-6 space-y-4">
                          <h4 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {lesson.title}
                          </h4>
                          <p className="text-slate-400 text-sm">{lesson.description}</p>

                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-slate-400">Dominio</span>
                              <span
                                className={`font-bold ${
                                  mastery >= 80
                                    ? "text-green-400"
                                    : mastery >= 60
                                      ? "text-yellow-400"
                                      : mastery >= 40
                                        ? "text-orange-400"
                                        : "text-slate-400"
                                }`}
                              >
                                {mastery}%
                              </span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  mastery >= 80
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                    : mastery >= 60
                                      ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                                      : mastery >= 40
                                        ? "bg-gradient-to-r from-orange-500 to-red-500"
                                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                                }`}
                                style={{ width: `${mastery}%` }}
                              />
                            </div>
                          </div>

                          <Button
                            onClick={() => handleStartLesson(lesson.id, lesson.title)}
                            className="w-full bg-slate-700 hover:bg-purple-500 text-white transition-all"
                          >
                            {mastery > 0 ? "Continuar" : "Comenzar"}
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
