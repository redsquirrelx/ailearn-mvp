"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useUserStore } from "@/lib/store"
import { useToast } from "@/components/toast-provider"
import { lessonsDatabase } from "@/lib/lessons-data"
import { generateTutorFeedback, generateDetailedFinalFeedback } from "@/lib/simulated-tutor"
import { generateSimulatedLesson, formatLessonContent } from "@/lib/simulated-lesson-generator"
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Sparkles,
  CheckCircle,
  Loader2,
  Lightbulb,
  Target,
  MessageCircle,
  TrendingUp,
  Quote,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function LessonAdaptivePage({ params }: { params: { lessonId: string } }) {
  const router = useRouter()
  const { showToast } = useToast()
  const lessonId = params.lessonId

  const {
    learningStyle,
    mentalState,
    technicalLevel,
    cognitiveLoad,
    recentErrors,
    recentSuccesses,
    preferredDuration,
    setCognitiveLoad,
    incrementErrors,
    incrementSuccesses,
    trackAdaptation,
    addReflection,
    completeLesson,
    addPoints,
    updateLessonMastery,
  } = useUserStore()

  const lesson = lessonsDatabase.find((l) => l.id === lessonId)

  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const [userFeeling, setUserFeeling] = useState<"tired" | "neutral" | "motivated">("neutral")
  const [practiceAnswer, setPracticeAnswer] = useState("")
  const [comprehensionAnswer, setComprehensionAnswer] = useState("")
  const [reflection, setReflection] = useState("")
  const [showAlternativeExplanation, setShowAlternativeExplanation] = useState(false)
  const [lessonStartTime] = useState(Date.now())
  const [tutorFeedback, setTutorFeedback] = useState<string>("")
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  const [generatedLesson, setGeneratedLesson] = useState<any | null>(null)
  const [detailedFinalFeedback, setDetailedFinalFeedback] = useState<{
    mainMessage: string
    strengths: string[]
    areasToImprove: string[]
    nextSteps: string
    motivationalQuote: string
  } | null>(null)

  const [hasVerifiedPractice, setHasVerifiedPractice] = useState(false)
  const [hasVerifiedComprehension, setHasVerifiedComprehension] = useState(false)

  const steps = [
    { id: 1, label: "Diagnóstico" },
    { id: 2, label: "Contenido IA" },
    { id: 3, label: "Práctica" },
    { id: 4, label: "Comprensión" },
    { id: 5, label: "Reflexión" },
    { id: 6, label: "Resultado" },
  ]

  useEffect(() => {
    if (currentStep === 2 && !generatedContent) {
      generateAdaptiveLesson()
    }
  }, [currentStep])

  const generateAdaptiveLesson = async () => {
    setIsGenerating(true)

    const calculatedLoad =
      userFeeling === "tired" ? "high" : userFeeling === "motivated" ? "low" : recentErrors > 2 ? "high" : "medium"
    setCognitiveLoad(calculatedLoad as any)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      const simulatedLesson = generateSimulatedLesson(
        lesson?.topic || "programación",
        lesson?.title || "concepto básico",
        {
          learningStyle: learningStyle || "verbal",
          mentalState: userFeeling,
          technicalLevel: technicalLevel || "beginner",
          recentErrors,
          recentSuccesses,
          preferredDuration,
          cognitiveLoad: calculatedLoad as any,
        },
      )

      const formattedContent = formatLessonContent(simulatedLesson)
      setGeneratedContent(formattedContent)
      setGeneratedLesson(simulatedLesson)

      trackAdaptation("content_generated", `Load: ${calculatedLoad}, Style: ${learningStyle}`)
      showToast("Lección personalizada generada", "success")
    } catch (error) {
      console.error("[v0] Error generating lesson:", error)
      showToast("Error al generar la lección", "error")
      setGeneratedContent("Error al generar contenido. Por favor, intenta nuevamente o regresa al dashboard.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getTutorFeedback = async (
    step: "practice" | "comprehension" | "reflection" | "final",
    answer: string,
    context: any,
  ) => {
    setIsLoadingFeedback(true)
    setTutorFeedback("")

    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800))

    const feedback = generateTutorFeedback({
      step,
      userAnswer: answer,
      topic: context.topic,
      concept: context.concept,
      timeSpent: context.timeSpent,
      performance: context.performance,
      learningStyle,
      mentalState: userFeeling,
      recentErrors,
      recentSuccesses,
    })

    setTutorFeedback(feedback)
    setIsLoadingFeedback(false)
  }

  const handlePracticeVerification = async () => {
    if (practiceAnswer.trim().length < 10) {
      incrementErrors()
      showToast("Por favor, escribe una respuesta más completa", "error")
      return
    }

    const keywords = lesson?.title.toLowerCase().split(" ") || []
    const hasKeyword = keywords.some((kw) => practiceAnswer.toLowerCase().includes(kw))

    if (hasKeyword || practiceAnswer.length > 50) {
      incrementSuccesses()
      showToast("¡Excelente práctica!", "success")
      await getTutorFeedback("practice", practiceAnswer, {
        topic: lesson?.topic,
        concept: lesson?.title,
      })
    } else {
      incrementErrors()
      showToast("Intenta relacionar tu respuesta con el tema", "error")

      if (recentErrors >= 2) {
        setShowAlternativeExplanation(true)
        trackAdaptation("alternative_explanation", "Multiple errors detected")
      }
      await getTutorFeedback("practice", practiceAnswer, {
        topic: lesson?.topic,
        concept: lesson?.title,
      })
    }
    setHasVerifiedPractice(true)
  }

  const handleComprehensionCheck = async () => {
    if (comprehensionAnswer.trim().length < 5) {
      showToast("Escribe una respuesta breve", "error")
      return
    }

    incrementSuccesses()
    showToast("Comprensión verificada", "success")
    await getTutorFeedback("comprehension", comprehensionAnswer, {
      concept: lesson?.title,
      topic: lesson?.topic,
    })
    setHasVerifiedComprehension(true)
  }

  const handleReflectionSubmit = async () => {
    if (reflection.trim().length === 0) {
      showToast("Escribe una breve reflexión", "error")
      return
    }
    await getTutorFeedback("reflection", reflection, {
      topic: lesson?.topic,
    })
  }

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (userFeeling === "") {
        showToast("Por favor, selecciona cómo te sientes", "error")
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (generatedContent === "") {
        showToast("Esperando contenido generado", "error")
        return
      }
      setCurrentStep(3)
    } else if (currentStep === 3) {
      if (practiceAnswer.trim().length === 0) {
        showToast("Por favor, escribe tu respuesta de práctica", "error")
        return
      }
      await handlePracticeVerification()
    } else if (currentStep === 4) {
      if (comprehensionAnswer.trim().length === 0) {
        showToast("Por favor, escribe tu respuesta de comprensión", "error")
        return
      }
      await handleComprehensionCheck()
    } else if (currentStep === 5) {
      if (reflection.trim().length === 0) {
        showToast("Por favor, escribe tu reflexión", "error")
        return
      }
      await handleReflectionSubmit()
    } else if (currentStep === 6) {
      const randomMastery = Math.floor(Math.random() * 41) + 60 // Random between 60-100
      const timeSpent = Math.floor((Date.now() - lessonStartTime) / 1000 / 60)

      console.log("[v0] Updating lesson mastery:", { lessonId, randomMastery })

      updateLessonMastery(lessonId, randomMastery)
      completeLesson(lessonId)

      console.log("[v0] Lesson mastery updated successfully to:", randomMastery)

      const feedback = generateTutorFeedback({
        step: "final",
        userAnswer: "",
        topic: generatedLesson?.title || "el tema",
        performance: randomMastery >= 85 ? "excelente" : randomMastery >= 70 ? "bueno" : "en progreso",
        learningStyle,
        mentalState,
        recentErrors,
        recentSuccesses,
      })

      const detailedFeedback = generateDetailedFinalFeedback({
        topic: generatedLesson?.title || "el tema",
        timeSpent,
        finalScore: randomMastery,
        recentSuccesses,
        recentErrors,
        learningStyle,
        mentalState,
      })

      setTutorFeedback(feedback)
      setDetailedFinalFeedback(detailedFeedback)
      setIsLoadingFeedback(false)
    }
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8 bg-slate-800/50 backdrop-blur-xl border-slate-700">
          <p className="text-white">Lección no encontrada</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Volver al Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700 p-6 flex flex-col gap-6">
        <div>
          <h3 className="text-slate-300 text-sm font-semibold mb-4">Progreso Adaptativo</h3>
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep === step.id
                      ? "bg-purple-600 text-white scale-110"
                      : currentStep > step.id
                        ? "bg-green-600 text-white"
                        : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </div>
                <span
                  className={`text-sm transition-colors ${currentStep === step.id ? "text-white font-semibold" : "text-slate-400"}`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptive Metrics */}
        <Card className="bg-purple-900/20 border-purple-700 p-4">
          <h4 className="text-purple-300 text-xs font-semibold mb-3">Adaptaciones Activas</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Carga cognitiva:</span>
              <span
                className={`font-semibold ${cognitiveLoad === "low" ? "text-green-400" : cognitiveLoad === "high" ? "text-red-400" : "text-yellow-400"}`}
              >
                {cognitiveLoad === "low" ? "Baja" : cognitiveLoad === "high" ? "Alta" : "Media"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Estilo:</span>
              <span className="text-purple-300 capitalize">{learningStyle || "Adaptativo"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Duración:</span>
              <span className="text-purple-300">{preferredDuration} min</span>
            </div>
          </div>
        </Card>

        {recentSuccesses > 0 && (
          <Card className="bg-green-900/20 border-green-700 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm font-semibold">Racha: {recentSuccesses} 🔥</span>
            </div>
          </Card>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6 text-slate-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          {/* Step 1: Quick Diagnosis */}
          {currentStep === 1 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 p-8">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-purple-600/20 rounded-full mb-4">
                  <Brain className="w-12 h-12 text-purple-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Diagnóstico Rápido</h1>
                <p className="text-slate-400">10 segundos • Detectamos tu estado actual</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-4">¿Cómo te sientes para aprender ahora?</h3>
                  <RadioGroup value={userFeeling} onValueChange={(v) => setUserFeeling(v as any)}>
                    <div className="space-y-3">
                      {[
                        { value: "tired", emoji: "😴", label: "Cansado / Saturado", desc: "Contenido ultra-simple" },
                        { value: "neutral", emoji: "😐", label: "Normal / Estable", desc: "Contenido estándar" },
                        {
                          value: "motivated",
                          emoji: "🚀",
                          label: "Fresco / Motivado",
                          desc: "Contenido con desafíos",
                        },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500 transition-all cursor-pointer"
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{option.emoji}</span>
                              <div>
                                <div className="text-white font-medium">{option.label}</div>
                                <div className="text-slate-400 text-sm">{option.desc}</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={() => setCurrentStep(2)} className="w-full" size="lg">
                  Generar Lección Personalizada
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: AI-Generated Content */}
          {currentStep === 2 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Tu Micro-Lección Adaptativa</h1>
                <p className="text-slate-400">Generada especialmente para ti con IA</p>
              </div>

              {isGenerating ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                  <p className="text-white font-semibold mb-2">Generando contenido personalizado...</p>
                  <p className="text-slate-400 text-sm">Adaptando a tu estilo: {learningStyle}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6">
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-line text-slate-200 leading-relaxed">{generatedContent}</div>
                    </div>
                  </div>

                  {showAlternativeExplanation && (
                    <Card className="bg-yellow-900/20 border-yellow-700 p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="text-yellow-300 font-semibold mb-2">Explicación Alternativa</h4>
                          <p className="text-slate-300 text-sm">
                            Hemos detectado dificultad. Aquí tienes una versión más simple del concepto...
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Button onClick={() => setCurrentStep(3)} className="w-full" size="lg">
                    Ir a la Práctica
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Step 3: Practice */}
          {currentStep === 3 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Mini Práctica Adaptada</h1>
                <p className="text-slate-400">Aplica lo que acabas de aprender</p>
              </div>

              <div className="space-y-6">
                <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                  <Target className="w-6 h-6 text-purple-400 mb-3" />
                  <p className="text-white font-semibold mb-2">Ejercicio práctico:</p>
                  <p className="text-slate-300">
                    Explica cómo aplicarías "<strong>{lesson.title}</strong>" en un proyecto real. Da un ejemplo
                    concreto.
                  </p>
                </div>

                <Textarea
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  placeholder="Escribe tu respuesta aquí... Intenta ser específico y dar ejemplos."
                  className="min-h-[200px] bg-slate-800 border-slate-700 text-slate-200"
                />

                {hasVerifiedPractice && tutorFeedback && (
                  <Card className="bg-blue-900/20 border-blue-700 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Tu Tutor de IA</h4>
                        <p className="text-slate-200 text-sm leading-relaxed">{tutorFeedback}</p>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handlePracticeVerification}
                    className="flex-1"
                    size="lg"
                    disabled={isLoadingFeedback}
                  >
                    {isLoadingFeedback ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Evaluando...
                      </>
                    ) : (
                      "Verificar Respuesta"
                    )}
                  </Button>

                  {hasVerifiedPractice && tutorFeedback && (
                    <Button onClick={() => setCurrentStep(4)} variant="outline" size="lg">
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Comprehension Check */}
          {currentStep === 4 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Chequeo de Comprensión</h1>
                <p className="text-slate-400">Una pregunta rápida para validar</p>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <p className="text-white font-semibold mb-4">
                    En una frase, ¿qué es lo más importante que aprendiste?
                  </p>
                  <Textarea
                    value={comprehensionAnswer}
                    onChange={(e) => setComprehensionAnswer(e.target.value)}
                    placeholder="Lo más importante es..."
                    className="bg-slate-900 border-slate-700 text-slate-200 min-h-[100px]"
                  />
                </div>

                {hasVerifiedComprehension && tutorFeedback && (
                  <Card className="bg-blue-900/20 border-blue-700 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Tu Tutor de IA</h4>
                        <p className="text-slate-200 text-sm leading-relaxed">{tutorFeedback}</p>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button onClick={handleComprehensionCheck} className="flex-1" size="lg" disabled={isLoadingFeedback}>
                    {isLoadingFeedback ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      "Verificar"
                    )}
                  </Button>

                  {hasVerifiedComprehension && tutorFeedback && (
                    <Button
                      onClick={() => {
                        setTutorFeedback("")
                        setCurrentStep(5)
                      }}
                      variant="outline"
                      size="lg"
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Step 5: Metacognitive Reflection */}
          {currentStep === 5 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Reflexión Final</h1>
                <p className="text-slate-400">
                  {userFeeling === "tired" ? "Muy breve - 3 palabras" : "Breve reflexión sobre tu aprendizaje"}
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                  <p className="text-white font-semibold mb-4">
                    {userFeeling === "tired"
                      ? "Resume en 3 palabras lo que aprendiste:"
                      : "¿Qué te resultó más difícil de entender?"}
                  </p>
                  <Textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder={userFeeling === "tired" ? "Palabra1, Palabra2, Palabra3" : "Lo más difícil fue..."}
                    className="bg-slate-800 border-slate-700 text-slate-200 min-h-[120px]"
                  />
                </div>

                {tutorFeedback && (
                  <Card className="bg-blue-900/20 border-blue-700 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-blue-300 font-semibold mb-2">Tu Tutor de IA</h4>
                        <p className="text-slate-200 text-sm leading-relaxed">{tutorFeedback}</p>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="flex gap-3">
                  {!tutorFeedback && (
                    <Button
                      onClick={handleReflectionSubmit}
                      className="flex-1"
                      size="lg"
                      disabled={!reflection.trim() || isLoadingFeedback}
                    >
                      {isLoadingFeedback ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        "Obtener Feedback"
                      )}
                    </Button>
                  )}

                  {tutorFeedback && (
                    <Button onClick={() => setCurrentStep(6)} className="flex-1" size="lg">
                      Completar Lección
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}

          {currentStep === 6 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 p-8">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-green-600/20 rounded-full mb-4">
                  <CheckCircle className="w-16 h-16 text-green-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">¡Lección Completada!</h1>
                <p className="text-slate-400">Excelente trabajo en tu micro-lección adaptativa</p>
              </div>

              {isLoadingFeedback ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
                  <p className="text-slate-300">Generando tu evaluación personalizada...</p>
                </div>
              ) : detailedFinalFeedback ? (
                <div className="space-y-6 mb-8">
                  <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-600/20 rounded-full shrink-0">
                        <Brain className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                          Mensaje de tu Tutor IA
                          <Sparkles className="w-4 h-4" />
                        </h3>
                        <p className="text-slate-200 leading-relaxed mb-4">{tutorFeedback}</p>
                        <div className="h-px bg-purple-500/20 my-4" />
                        <p className="text-slate-300 leading-relaxed">{detailedFinalFeedback.mainMessage}</p>
                      </div>
                    </div>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-slate-800/50 border-green-500/30 p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-600/20 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-green-300 font-semibold">Fortalezas Identificadas</h3>
                      </div>
                      <ul className="space-y-2">
                        {detailedFinalFeedback.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="bg-slate-800/50 border-blue-500/30 p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                          <Target className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-blue-300 font-semibold">Áreas de Mejora</h3>
                      </div>
                      <ul className="space-y-2">
                        {detailedFinalFeedback.areasToImprove.map((area, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                            <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/30 p-5">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                      <div>
                        <h3 className="text-indigo-300 font-semibold mb-2">Próximos Pasos Recomendados</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{detailedFinalFeedback.nextSteps}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-slate-800/30 border-slate-600/30 p-5">
                    <div className="flex items-start gap-3">
                      <Quote className="w-5 h-5 text-slate-400 mt-1 shrink-0" />
                      <p className="text-slate-400 italic text-sm leading-relaxed">
                        {detailedFinalFeedback.motivationalQuote}
                      </p>
                    </div>
                  </Card>
                </div>
              ) : null}

              <div className="space-y-4">
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-1">Calificación Final</p>
                      <p className="text-white text-3xl font-bold">
                        {Math.min(100, 50 + recentSuccesses * 10 - recentErrors * 5)}
                        <span className="text-lg text-slate-400">/100</span>
                      </p>
                      <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                          style={{
                            width: `${Math.min(100, 50 + recentSuccesses * 10 - recentErrors * 5)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-1">Tiempo invertido</p>
                      <p className="text-white text-3xl font-bold">
                        {Math.floor((Date.now() - lessonStartTime) / 1000 / 60)}
                        <span className="text-lg text-slate-400"> min</span>
                      </p>
                      <p className="text-slate-500 text-xs mt-2">Sesión enfocada</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-1">Puntos ganados</p>
                      <p className="text-green-400 text-3xl font-bold">
                        +{Math.min(100, 50 + recentSuccesses * 10 - recentErrors * 5)}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">XP acumulado</p>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button onClick={() => router.push("/dashboard")} className="flex-1" size="lg">
                    Volver al Dashboard
                  </Button>
                  <Button onClick={() => router.push("/analytics")} variant="outline" size="lg">
                    Ver Progreso
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
