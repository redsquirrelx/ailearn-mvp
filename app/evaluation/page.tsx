"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileText, Send, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/toast-provider"

interface Evaluation {
  concept: string
  score: number
  feedback: string
  status: "correct" | "partial" | "incorrect"
}

export default function EvaluationPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { selectedTopic, technicalLevel } = useUserStore()
  const [topic] = useState(selectedTopic)
  const [answer, setAnswer] = useState("")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation[] | null>(null)
  const [finalScore, setFinalScore] = useState<number | null>(null)

  const evaluateAnswer = (userAnswer: string): { evaluations: Evaluation[]; score: number } => {
    const lowerAnswer = userAnswer.toLowerCase()
    const evaluations: Evaluation[] = []

    // Evaluar conceptos clave según el tema
    if (topic === "python") {
      // Variables
      if (lowerAnswer.includes("variable") || lowerAnswer.includes("asigna")) {
        evaluations.push({
          concept: "Variables",
          score: lowerAnswer.includes("asigna") && lowerAnswer.includes("valor") ? 10 : 5,
          feedback:
            lowerAnswer.includes("asigna") && lowerAnswer.includes("valor")
              ? "Excelente: Entiendes que las variables almacenan valores mediante asignación."
              : "Parcial: Mencionas variables pero falta explicar cómo se asignan valores.",
          status: lowerAnswer.includes("asigna") && lowerAnswer.includes("valor") ? "correct" : ("partial" as const),
        })
      } else {
        evaluations.push({
          concept: "Variables",
          score: 0,
          feedback: "Incorrecto: No mencionaste cómo funcionan las variables.",
          status: "incorrect",
        })
      }

      // Tipos de datos
      if (
        lowerAnswer.includes("int") ||
        lowerAnswer.includes("str") ||
        lowerAnswer.includes("float") ||
        lowerAnswer.includes("tipo")
      ) {
        evaluations.push({
          concept: "Tipos de datos",
          score:
            (lowerAnswer.includes("int") ? 3 : 0) +
            (lowerAnswer.includes("str") ? 3 : 0) +
            (lowerAnswer.includes("float") ? 4 : 0),
          feedback:
            lowerAnswer.includes("int") && lowerAnswer.includes("str") && lowerAnswer.includes("float")
              ? "Excelente: Identificas correctamente int, str y float."
              : "Parcial: Conoces algunos tipos de datos pero no todos los fundamentales.",
          status:
            lowerAnswer.includes("int") && lowerAnswer.includes("str") && lowerAnswer.includes("float")
              ? "correct"
              : ("partial" as const),
        })
      } else {
        evaluations.push({
          concept: "Tipos de datos",
          score: 0,
          feedback: "Incorrecto: No mencionaste los tipos de datos básicos.",
          status: "incorrect",
        })
      }

      // Sintaxis
      if (lowerAnswer.includes("=") || lowerAnswer.includes("sintaxis")) {
        evaluations.push({
          concept: "Sintaxis",
          score: 10,
          feedback: "Correcto: Comprendes la sintaxis básica de asignación.",
          status: "correct",
        })
      } else {
        evaluations.push({
          concept: "Sintaxis",
          score: 0,
          feedback: "Incorrecto: No explicaste la sintaxis correctamente.",
          status: "incorrect",
        })
      }
    } else if (topic === "excel") {
      // Fórmulas
      if (lowerAnswer.includes("formula") || lowerAnswer.includes("=")) {
        evaluations.push({
          concept: "Fórmulas",
          score: 10,
          feedback: "Correcto: Entiendes que las fórmulas inician con =",
          status: "correct",
        })
      } else {
        evaluations.push({
          concept: "Fórmulas",
          score: 0,
          feedback: "Incorrecto: No explicaste cómo funcionan las fórmulas.",
          status: "incorrect",
        })
      }

      // Funciones
      if (lowerAnswer.includes("suma") || lowerAnswer.includes("promedio") || lowerAnswer.includes("max")) {
        evaluations.push({
          concept: "Funciones básicas",
          score: 10,
          feedback: "Correcto: Conoces funciones fundamentales como SUMA, PROMEDIO o MAX.",
          status: "correct",
        })
      } else {
        evaluations.push({
          concept: "Funciones básicas",
          score: 5,
          feedback: "Parcial: Deberías mencionar funciones como SUMA, PROMEDIO o MAX.",
          status: "partial",
        })
      }

      // Referencias
      if (lowerAnswer.includes("celda") || lowerAnswer.includes("referencia") || lowerAnswer.includes("a1")) {
        evaluations.push({
          concept: "Referencias de celdas",
          score: 10,
          feedback: "Correcto: Comprendes el sistema de referencias.",
          status: "correct",
        })
      } else {
        evaluations.push({
          concept: "Referencias de celdas",
          score: 0,
          feedback: "Incorrecto: No explicaste cómo referenciar celdas.",
          status: "incorrect",
        })
      }
    } else {
      // Evaluación genérica
      evaluations.push({
        concept: "Comprensión general",
        score: userAnswer.length > 100 ? 15 : userAnswer.length > 50 ? 10 : 5,
        feedback:
          userAnswer.length > 100
            ? "Bien: Respuesta detallada."
            : userAnswer.length > 50
              ? "Parcial: Respuesta algo breve."
              : "Insuficiente: Respuesta muy corta.",
        status: userAnswer.length > 100 ? "correct" : userAnswer.length > 50 ? ("partial" as const) : "incorrect",
      })
    }

    const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0)
    const maxScore = evaluations.length * 10
    const finalScore = Math.round((totalScore / maxScore) * 100)

    return { evaluations, score: finalScore }
  }

  const handleSubmit = () => {
    if (!answer.trim()) {
      showToast("Por favor escribe tu respuesta", "error")
      return
    }

    setIsEvaluating(true)

    setTimeout(() => {
      const result = evaluateAnswer(answer)
      setEvaluation(result.evaluations)
      setFinalScore(result.score)
      setIsEvaluating(false)
      showToast("Evaluación completada", "success")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Button>

        <Card className="bg-slate-800/90 backdrop-blur-xl border-purple-500/30 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Evaluación Escrita</h1>
              <p className="text-slate-400">La IA evaluará tu respuesta de forma estricta</p>
            </div>
          </div>

          {!evaluation ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Pregunta: Explica los conceptos fundamentales que has aprendido sobre {selectedTopic}
                </h3>
                <p className="text-slate-400 mb-4">
                  Escribe una respuesta detallada. La IA evaluará:
                  {topic === "python" && " variables, tipos de datos y sintaxis."}
                  {topic === "excel" && " fórmulas, funciones y referencias de celdas."}
                  {topic !== "python" && topic !== "excel" && " tu comprensión general del tema."}
                </p>

                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Escribe tu respuesta aquí... Sé lo más detallado posible."
                  className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <p className="text-sm text-slate-500 mt-2">{answer.length} caracteres</p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isEvaluating || !answer.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg font-semibold"
              >
                {isEvaluating ? (
                  <>
                    <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Evaluando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar para Evaluación
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center p-6 bg-slate-900/50 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-2">Calificación Final</h3>
                <div
                  className={`text-6xl font-bold mb-2 ${
                    finalScore! >= 80 ? "text-green-400" : finalScore! >= 60 ? "text-yellow-400" : "text-red-400"
                  }`}
                >
                  {finalScore}%
                </div>
                <p className="text-slate-400">
                  {finalScore! >= 80 && "Excelente dominio del tema"}
                  {finalScore! >= 60 && finalScore! < 80 && "Buen nivel, pero hay áreas de mejora"}
                  {finalScore! < 60 && "Necesitas repasar más el tema"}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Evaluación Detallada</h3>
                {evaluation.map((ev, idx) => (
                  <Card key={idx} className="bg-slate-900/50 border-slate-700 p-4">
                    <div className="flex items-start gap-3">
                      {ev.status === "correct" && (
                        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                      )}
                      {ev.status === "partial" && (
                        <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      )}
                      {ev.status === "incorrect" && <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-white">{ev.concept}</h4>
                          <span
                            className={`font-bold ${
                              ev.status === "correct"
                                ? "text-green-400"
                                : ev.status === "partial"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                            }`}
                          >
                            {ev.score}/10
                          </span>
                        </div>
                        <p className="text-slate-300">{ev.feedback}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setEvaluation(null)
                    setFinalScore(null)
                    setAnswer("")
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                >
                  Intentar de Nuevo
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Volver al Dashboard
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
