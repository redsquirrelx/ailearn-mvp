"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useUserStore } from "@/lib/store"
import { AITutorChat } from "@/components/ai-tutor-chat"
import { useToast } from "@/components/toast-provider"
import { getLessonContent } from "@/lib/lesson-content"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function LessonPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { learningStyle, mentalState, technicalLevel, selectedTopic } = useUserStore()

  const [currentStep, setCurrentStep] = useState(1)
  const [diagnosticAnswer, setDiagnosticAnswer] = useState("")
  const [focusLevel, setFocusLevel] = useState<"bajo" | "medio" | "alto">("medio")
  const [adaptedDifficulty, setAdaptedDifficulty] = useState<"simple" | "normal" | "avanzado">("normal")
  const [lessonObjective, setLessonObjective] = useState("")
  const [exerciseCode, setExerciseCode] = useState("")
  const [exerciseAttempts, setExerciseAttempts] = useState(0)
  const [checkAnswer, setCheckAnswer] = useState("")
  const [checkPassed, setCheckPassed] = useState<boolean | null>(null)
  const [hasPassedCheck, setHasPassedCheck] = useState(false)
  const [reflectionAnswer, setReflectionAnswer] = useState("")
  const [missingConcept, setMissingConcept] = useState("")
  const [lessonStartTime] = useState(Date.now())

  const params = useParams()
  const topic = params.topic as string
  const lessonContent = getLessonContent(topic)

  const steps = [
    { id: 1, label: "Diagnóstico" },
    { id: 2, label: "Objetivo" },
    { id: 3, label: "Microlección" },
    { id: 4, label: "Práctica" },
    { id: 5, label: "Chequeo" },
    { id: 6, label: "Reflexión" },
    { id: 7, label: "Progreso" },
  ]

  useEffect(() => {
    if (currentStep === 2 && focusLevel) {
      if (focusLevel === "bajo" && mentalState === "Cansado") {
        setAdaptedDifficulty("simple")
      } else if (focusLevel === "alto" && mentalState === "Motivado") {
        setAdaptedDifficulty("avanzado")
      } else {
        setAdaptedDifficulty("normal")
      }

      const topicName =
        lessonContent?.id
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") || topic

      const timeEstimate =
        adaptedDifficulty === "simple" ? "3 minutos" : adaptedDifficulty === "avanzado" ? "5 minutos" : "4 minutos"
      setLessonObjective(`Hoy aprenderás ${topicName} en menos de ${timeEstimate}.`)
    }
  }, [currentStep, focusLevel, mentalState, adaptedDifficulty, topic, lessonContent])

  const handleVerifyExercise = () => {
    const newAttempts = exerciseAttempts + 1
    setExerciseAttempts(newAttempts)

    if (exerciseCode.trim().length < 10) {
      showToast("Escribe más código para verificar", "error")
      return
    }

    const hasKeywords = lessonContent?.exercise.keywords?.some((keyword) =>
      exerciseCode.toLowerCase().includes(keyword.toLowerCase()),
    )

    if (hasKeywords) {
      showToast("¡Ejercicio completado!", "success")
      setTimeout(() => setCurrentStep(5), 800)
    } else {
      showToast("Intenta de nuevo. Revisa el ejemplo.", "error")

      if (newAttempts >= 2) {
        setAdaptedDifficulty("simple")
        showToast("Simplificando la explicación...", "info")
      }
    }
  }

  const handleCheckAnswer = () => {
    if (!checkAnswer.trim()) return

    const lowerAnswer = checkAnswer.toLowerCase()
    const correctKeywords = lessonContent?.exercise.keywords || []
    const hasCorrect = correctKeywords.some((kw) => lowerAnswer.includes(kw.toLowerCase()))

    setCheckPassed(hasCorrect)
    setHasPassedCheck(true) // Permitir avanzar después de cualquier intento

    if (hasCorrect) {
      console.log("[v0] Setting hasPassedCheck to true")
    } else {
      setTimeout(() => setCurrentStep(3.5), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex">
      <aside className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700 p-6 flex flex-col gap-6">
        <div>
          <h3 className="text-slate-300 text-sm font-semibold mb-3">Flujo Adaptativo</h3>
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === step.id
                      ? "bg-purple-600 text-white"
                      : currentStep > step.id
                        ? "bg-green-600 text-white"
                        : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </div>
                <span className={`text-sm ${currentStep === step.id ? "text-white font-semibold" : "text-slate-400"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {currentStep > 1 && (
          <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Dificultad adaptada:</p>
            <p className="text-sm text-purple-300 font-semibold capitalize">{adaptedDifficulty}</p>
          </div>
        )}
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6 text-slate-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Diagnóstico Rápido</h1>
                  <p className="text-slate-400 text-sm mb-6">10-20 segundos • Detecta tu nivel y foco actual</p>
                </div>

                <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6 mb-6">
                  <p className="text-white font-semibold mb-4">¿Cómo te sientes para aprender hoy?</p>
                  <RadioGroup value={focusLevel} onValueChange={(value) => setFocusLevel(value as any)}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="bajo" id="bajo" />
                      <Label htmlFor="bajo" className="text-slate-300">
                        Cansado o distraído
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="medio" id="medio" />
                      <Label htmlFor="medio" className="text-slate-300">
                        Normal, con ganas de aprender
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="alto" id="alto" />
                      <Label htmlFor="alto" className="text-slate-300">
                        Muy motivado y concentrado
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <p className="text-white font-semibold mb-3">Mini-quiz: ¿Qué sabes sobre este tema?</p>
                  <p className="text-slate-300 text-sm mb-4">
                    {lessonContent?.introduction?.substring(0, 100) || `Pregunta sobre ${topic}`}...
                  </p>
                  <Textarea
                    value={diagnosticAnswer}
                    onChange={(e) => setDiagnosticAnswer(e.target.value)}
                    placeholder="Escribe lo que sabes o deja en blanco si no conoces el tema..."
                    className="bg-slate-900 border-slate-700 text-slate-200 min-h-[100px]"
                  />
                </div>

                <Button onClick={() => setCurrentStep(2)} className="w-full" size="lg">
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="inline-block p-4 bg-purple-600/20 rounded-full mb-6">
                    <CheckCircle className="w-16 h-16 text-purple-400" />
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">Objetivo Claro</h1>
                  <p className="text-2xl text-purple-300 font-semibold mb-2">{lessonObjective}</p>
                  <p className="text-slate-400 text-sm">Adaptado según tu nivel y estado mental actual</p>
                </div>

                <Button onClick={() => setCurrentStep(3)} className="w-full" size="lg">
                  Comenzar Microlección
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Microlección Personalizada</h1>
                  <p className="text-slate-400 text-sm mb-6">
                    1-3 minutos •{" "}
                    {adaptedDifficulty === "simple"
                      ? "Versión simplificada"
                      : adaptedDifficulty === "avanzado"
                        ? "Versión avanzada"
                        : "Versión estándar"}
                  </p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <p className="text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
                    {adaptedDifficulty === "simple"
                      ? lessonContent?.introduction || `Introducción simplificada sobre ${topic}`
                      : lessonContent?.explanation || `Explicación sobre ${topic}`}
                  </p>

                  {lessonContent?.codeExample && (
                    <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-2">Ejemplo de código:</p>
                      <pre className="text-purple-300 text-sm overflow-x-auto">
                        <code>{lessonContent.codeExample}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {learningStyle === "Visual" && (
                  <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
                    <p className="text-purple-300 text-sm">
                      💡 Adaptado para aprendizaje visual: Observa el ejemplo de código y visualiza cómo funciona.
                    </p>
                  </div>
                )}

                <Button onClick={() => setCurrentStep(4)} className="w-full" size="lg">
                  Ir a la Práctica
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {currentStep === 3.5 && (
              <div className="space-y-6">
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-bold text-white">Explicación Alternativa Más Simple</h2>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {lessonContent?.introduction || `Veamos ${topic} de una forma más sencilla...`}
                  </p>
                </div>

                <Button onClick={() => setCurrentStep(5)} className="w-full">
                  Entendido, continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {currentStep === 4 && lessonContent && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Mini Práctica Guiada</h1>
                  <p className="text-slate-400 text-sm mb-6">1-2 minutos • Aplica la idea clave</p>
                </div>

                <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                  <p className="text-white font-semibold mb-2">{lessonContent.exercise.title}</p>
                  <p className="text-slate-300 text-sm mb-4">{lessonContent.exercise.description}</p>
                </div>

                <Textarea
                  value={exerciseCode}
                  onChange={(e) => setExerciseCode(e.target.value)}
                  placeholder={lessonContent.exercise.placeholder}
                  className="font-mono min-h-[200px] bg-slate-800 border-slate-700 text-slate-200"
                />

                {exerciseAttempts > 0 && (
                  <div className="text-sm text-slate-400">
                    Intentos: {exerciseAttempts} {exerciseAttempts >= 2 && "• Ajustando dificultad..."}
                  </div>
                )}

                <Button onClick={handleVerifyExercise} className="w-full" size="lg">
                  Verificar Ejercicio
                </Button>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Chequeo Inmediato</h1>
                  <p className="text-slate-400 text-sm mb-6">10-20 segundos • Confirma tu comprensión</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <p className="text-white font-semibold mb-4">Micro-evaluación:</p>
                  <p className="text-slate-300 mb-4">Explica con tus propias palabras qué acabas de aprender</p>
                  <Textarea
                    value={checkAnswer}
                    onChange={(e) => setCheckAnswer(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="bg-slate-900 border-slate-700 text-slate-200 min-h-[120px]"
                  />
                </div>

                {checkPassed !== null && (
                  <div
                    className={`p-4 rounded-lg flex items-center gap-3 ${
                      checkPassed ? "bg-green-900/20 border-green-700" : "bg-red-900/20 border-red-700"
                    } border`}
                  >
                    {checkPassed ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <p className={checkPassed ? "text-green-300" : "text-red-300"}>
                      {checkPassed
                        ? "¡Excelente! Has comprendido el concepto."
                        : "Te mostraremos una explicación más simple."}
                    </p>
                  </div>
                )}

                {console.log("[v0] hasPassedCheck state:", hasPassedCheck)}

                <div className="flex gap-3">
                  <Button onClick={handleCheckAnswer} className="flex-1" size="lg" disabled={!checkAnswer.trim()}>
                    Verificar Comprensión
                  </Button>

                  {hasPassedCheck ? (
                    <Button onClick={() => setCurrentStep(6)} className="flex-1" size="lg" variant="outline">
                      Siguiente Paso →
                    </Button>
                  ) : (
                    <div className="text-slate-500 text-sm">(Botón aparecerá después de verificar correctamente)</div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Cierre Metacognitivo</h1>
                  <p className="text-slate-400 text-sm mb-6">20-30 segundos • Reflexión mínima</p>
                </div>

                <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6 mb-4">
                  <p className="text-white font-semibold mb-3">¿Qué entendiste?</p>
                  <Textarea
                    value={reflectionAnswer}
                    onChange={(e) => setReflectionAnswer(e.target.value)}
                    placeholder="Lo que más me quedó claro fue..."
                    className="bg-slate-800 border-slate-700 text-slate-200 min-h-[100px] mb-4"
                  />

                  <p className="text-white font-semibold mb-3">¿Qué te falta por entender?</p>
                  <Textarea
                    value={missingConcept}
                    onChange={(e) => setMissingConcept(e.target.value)}
                    placeholder="Todavía tengo dudas sobre..."
                    className="bg-slate-800 border-slate-700 text-slate-200 min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={() => {
                    if (reflectionAnswer.trim()) {
                      setCurrentStep(7)
                      showToast("Reflexión guardada", "success")
                    }
                  }}
                  className="w-full"
                  size="lg"
                  disabled={!reflectionAnswer.trim()}
                >
                  Continuar al Progreso
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="inline-block p-4 bg-green-600/20 rounded-full mb-6">
                    <CheckCircle className="w-20 h-20 text-green-400" />
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">¡Lección Completada!</h1>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Tu Progreso Micro:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <p className="text-slate-300">1 unidad dominada: {lessonContent?.id || topic}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                      <p className="text-slate-300">
                        Tiempo: {Math.floor((Date.now() - lessonStartTime) / 1000 / 60)} minutos
                      </p>
                    </div>
                    {missingConcept && (
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                        <p className="text-slate-300 text-sm">Repaso sugerido: {missingConcept.substring(0, 50)}...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                  <h3 className="text-purple-300 font-semibold mb-2">Siguiente Paso Sugerido:</h3>
                  <p className="text-slate-300 text-sm">
                    Continúa con la siguiente microlección de {selectedTopic} para seguir avanzando.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1">
                    Volver al Dashboard
                  </Button>
                  <Button onClick={() => router.push(`/lesson/${topic}/result`)} className="flex-1">
                    Ver Resultados Detallados
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <AITutorChat />
    </div>
  )
}
