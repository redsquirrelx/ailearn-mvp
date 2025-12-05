"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUserStore } from "@/lib/store"
import { X } from "lucide-react"

interface TopicLevelQuizProps {
  topic: string
  topicName: string
  onComplete: () => void
  onSkip: () => void
}

export function TopicLevelQuiz({ topic, topicName, onComplete, onSkip }: TopicLevelQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const { setTopicLevel } = useUserStore()

  const getQuizQuestions = (topicId: string) => {
    const quizzes: Record<string, any[]> = {
      python: [
        {
          question: "¿Qué es una variable en Python?",
          options: ["Un tipo de bucle", "Un contenedor para almacenar datos", "Una función", "No lo sé"],
        },
        {
          question: "¿Entiendes este código: for i in range(10)?",
          options: ["Sí, es un bucle que itera 10 veces", "Más o menos", "No mucho", "No lo entiendo"],
        },
        {
          question: "¿Has trabajado con listas o diccionarios?",
          options: ["Sí, frecuentemente", "Un poco", "Solo he oído hablar", "No sé qué son"],
        },
      ],
      linux: [
        {
          question: "¿Qué hace el comando 'ls'?",
          options: ["Lista archivos", "Cambia de directorio", "Borra archivos", "No lo sé"],
        },
        {
          question: "¿Has usado la terminal/consola?",
          options: ["Sí, frecuentemente", "Algunas veces", "Muy poco", "Nunca"],
        },
        {
          question: "¿Sabes qué son los permisos de archivos?",
          options: ["Sí, los uso regularmente", "Tengo una idea", "He oído del tema", "No lo sé"],
        },
      ],
      excel: [
        {
          question: "¿Qué hace la fórmula =SUMA()?",
          options: ["Suma valores", "Promedia valores", "Cuenta celdas", "No lo sé"],
        },
        {
          question: "¿Has usado tablas dinámicas?",
          options: ["Sí, las domino", "Las he usado un poco", "He oído de ellas", "No sé qué son"],
        },
        {
          question: "¿Sabes usar funciones como BUSCARV o SI?",
          options: ["Sí, las uso frecuentemente", "Más o menos", "He oído de ellas", "No las conozco"],
        },
      ],
      default: [
        {
          question: `¿Cuánta experiencia tienes con ${topicName}?`,
          options: ["Experto", "Intermedio", "Principiante", "Ninguna"],
        },
        {
          question: `¿Has usado ${topicName} en proyectos reales?`,
          options: ["Sí, muchas veces", "Algunas veces", "Una vez", "Nunca"],
        },
        {
          question: `¿Cómo calificarías tu nivel?`,
          options: ["Avanzado", "Intermedio", "Básico", "Principiante"],
        },
      ],
    }

    return quizzes[topicId] || quizzes.default
  }

  const questions = getQuizQuestions(topic)

  const handleAnswer = (answerIdx: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIdx
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    } else {
      // Calculate level based on answers
      const avgScore = newAnswers.reduce((a, b) => a + b, 0) / newAnswers.length

      let level: "beginner" | "intermediate" | "advanced"
      if (avgScore <= 1) {
        level = "advanced"
      } else if (avgScore <= 2.5) {
        level = "intermediate"
      } else {
        level = "beginner"
      }

      setTopicLevel(topic, level)
      setTimeout(() => {
        onComplete()
      }, 500)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <Card className="bg-slate-800 border-purple-500/30 p-8 max-w-2xl w-full relative">
        <button onClick={onSkip} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Evaluación rápida: {topicName}</h2>
            <p className="text-slate-400">
              Pregunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>

          {currentQuestion < questions.length ? (
            <div className="space-y-4">
              <h3 className="text-xl text-white font-semibold mb-4">{questions[currentQuestion].question}</h3>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      answers[currentQuestion] === idx
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
              <p className="text-white text-lg">Evaluación completada</p>
            </div>
          )}

          <div className="pt-4">
            <Button onClick={onSkip} variant="outline" className="w-full bg-slate-700 border-slate-600 text-white">
              Omitir evaluación (se asignará nivel intermedio)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
