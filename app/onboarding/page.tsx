"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useUserStore } from "@/lib/store"
import { Eye, FileText, Gamepad2, Brain, ChevronLeft, ChevronRight } from "lucide-react"
import { availableTopics } from "@/lib/lessons-data"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const {
    learningStyle,
    technicalLevel,
    mentalState,
    goal,
    selectedTopic,
    setLearningStyle,
    setTechnicalLevel,
    setMentalState,
    setGoal,
    completeOnboarding,
  } = useUserStore()

  const topicName = availableTopics.find((t) => t.id === selectedTopic)?.name || "este tema"

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)

  // Meta-learning questions
  const [whenStuck, setWhenStuck] = useState("")
  const [whatHelpsRemember, setWhatHelpsRemember] = useState("")

  const quizQuestions = [
    {
      question: `¿Tienes experiencia previa con ${topicName}?`,
      options: ["Sí, bastante experiencia", "He usado algo", "Solo he oído hablar de ello", "No, soy principiante"],
    },
    {
      question: `¿Has trabajado en proyectos relacionados con ${topicName}?`,
      options: ["Sí, varios proyectos", "Un par de proyectos", "Solo tutoriales", "Ninguno"],
    },
    {
      question: `¿Qué tan cómodo te sientes aprendiendo ${topicName}?`,
      options: [
        "Muy cómodo, conozco lo básico",
        "Un poco intimidado pero motivado",
        "Necesito mucha guía",
        "Completamente nuevo para mí",
      ],
    },
  ]

  const goalSuggestions = [
    `Quiero aprender ${topicName} desde cero`,
    `Necesito ${topicName} para mi trabajo`,
    `Busco mejorar mis habilidades en ${topicName}`,
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Determine technical level based on quiz
      const avgScore = quizAnswers.reduce((a, b) => a + b, 0) / quizAnswers.length
      if (avgScore <= 1) {
        setTechnicalLevel("advanced")
      } else if (avgScore <= 2.5) {
        setTechnicalLevel("intermediate")
      } else {
        setTechnicalLevel("beginner")
      }

      completeOnboarding()
      router.push("/dashboard")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return learningStyle !== null
      case 2:
        return quizAnswers.length === 3
      case 3:
        return mentalState !== null
      case 4:
        return goal.length > 0
      case 5:
        return whenStuck && whatHelpsRemember
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-xl border border-purple-500/30 rounded-full">
            <span className="text-2xl">{availableTopics.find((t) => t.id === selectedTopic)?.icon || "📚"}</span>
            <span className="text-white font-semibold">Diagnóstico para {topicName}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm font-medium">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="text-purple-300 text-sm">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 p-8">
          {/* Step 1: Learning Style */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">¿Cómo aprendes mejor?</h2>
                <p className="text-slate-400">Selecciona tu estilo de aprendizaje preferido</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "visual", icon: Eye, label: "Visual", desc: "Diagramas e imágenes" },
                  { id: "verbal", icon: FileText, label: "Verbal", desc: "Lectura y escritura" },
                  { id: "kinesthetic", icon: Gamepad2, label: "Kinestésico", desc: "Práctica hands-on" },
                  { id: "logical", icon: Brain, label: "Lógico", desc: "Razonamiento y análisis" },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setLearningStyle(style.id as any)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      learningStyle === style.id
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                    }`}
                  >
                    <style.icon className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                    <div className="text-white font-semibold mb-1">{style.label}</div>
                    <div className="text-slate-400 text-sm">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Quiz */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Evaluación rápida</h2>
                <p className="text-slate-400">Pregunta {currentQuizQuestion + 1} de 3</p>
              </div>

              {currentQuizQuestion < 3 ? (
                <div className="space-y-4">
                  <h3 className="text-xl text-white font-semibold mb-4">
                    {quizQuestions[currentQuizQuestion].question}
                  </h3>

                  <div className="space-y-3">
                    {quizQuestions[currentQuizQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const newAnswers = [...quizAnswers]
                          newAnswers[currentQuizQuestion] = idx
                          setQuizAnswers(newAnswers)
                          setTimeout(() => {
                            if (currentQuizQuestion < 2) {
                              setCurrentQuizQuestion(currentQuizQuestion + 1)
                            }
                          }, 300)
                        }}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          quizAnswers[currentQuizQuestion] === idx
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                        }`}
                      >
                        <span className="text-white">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✓</span>
                  </div>
                  <p className="text-white text-lg">Quiz completado</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Mental State */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">¿Cómo te sientes hoy?</h2>
                <p className="text-slate-400">Ajustaremos la duración de las lecciones</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "tired", emoji: "😴", label: "Cansado", time: "5 min" },
                  { id: "neutral", emoji: "😐", label: "Neutro", time: "10 min" },
                  { id: "motivated", emoji: "🚀", label: "Motivado", time: "15 min" },
                ].map((state) => (
                  <button
                    key={state.id}
                    onClick={() => setMentalState(state.id as any)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      mentalState === state.id
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-5xl mb-3">{state.emoji}</div>
                    <div className="text-white font-semibold mb-1">{state.label}</div>
                    <div className="text-slate-400 text-sm">{state.time}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Goal */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">¿Cuál es tu objetivo?</h2>
                <p className="text-slate-400">Cuéntanos qué quieres lograr con {topicName}</p>
              </div>

              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={`Quiero aprender ${topicName} para...`}
                className="min-h-32 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />

              <div className="space-y-2">
                <p className="text-slate-400 text-sm mb-2">Sugerencias:</p>
                {goalSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGoal(suggestion)}
                    className="w-full p-3 rounded-lg bg-slate-800/30 border border-slate-700 text-left text-slate-300 hover:border-purple-500 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Meta-learning */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Últimas preguntas</h2>
                <p className="text-slate-400">Esto nos ayuda a personalizar tu experiencia</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-white mb-3 block">Cuando no entiendes algo, ¿qué haces?</Label>
                  <RadioGroup value={whenStuck} onValueChange={setWhenStuck}>
                    <div className="space-y-2">
                      {[
                        "Busco ejemplos prácticos",
                        "Leo la teoría varias veces",
                        "Pregunto a otros",
                        "Intento experimentar por mi cuenta",
                      ].map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2 p-3 rounded-lg bg-slate-800/30 border border-slate-700"
                        >
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="text-slate-300 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-white mb-3 block">¿Qué te ayuda a recordar mejor?</Label>
                  <RadioGroup value={whatHelpsRemember} onValueChange={setWhatHelpsRemember}>
                    <div className="space-y-2">
                      {[
                        "Repetir y practicar",
                        "Crear resúmenes visuales",
                        "Explicárselo a alguien",
                        "Relacionarlo con algo que ya sé",
                      ].map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2 p-3 rounded-lg bg-slate-800/30 border border-slate-700"
                        >
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="text-slate-300 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {currentStep === totalSteps ? "Comenzar" : "Siguiente"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
