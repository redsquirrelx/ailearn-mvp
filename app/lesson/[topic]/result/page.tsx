"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/lib/store"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Target, Flame, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import Confetti from "react-confetti"

export default function LessonResultPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const { totalPoints, currentStreak, completeLesson, addPoints, incrementStreak } = useUserStore()

  const topic = params.topic as string
  const topicName = topic.replace(/-/g, " ")
  const reflection = searchParams.get("reflection") || "Reflexión guardada"

  const [showConfetti, setShowConfetti] = useState(true)
  const [difficulty, setDifficulty] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    completeLesson(topic)
    addPoints(50)
    incrementStreak()
    showToast("¡Has ganado 50 puntos!", "success")
  }, [topic, completeLesson, addPoints, incrementStreak, showToast])

  const masteredConcepts = [
    { name: "Declaración", mastered: true },
    { name: "Tipos", mastered: true },
    { name: "Asignación", mastered: true },
    { name: "Nomenclatura", mastered: false },
  ]

  const handleDifficultySelect = (level: string) => {
    setDifficulty(level)
    showToast(`Registrado como: ${level}`, "info")
  }

  const handleNextLesson = () => {
    showToast("Cargando siguiente lección...", "info")
    router.push("/lesson/listas")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 overflow-auto">
      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1000}
          height={typeof window !== "undefined" ? window.innerHeight : 1000}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* ... existing hero card ... */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">¡Lección completada!</h1>
          <p className="text-xl text-purple-300 capitalize">{topicName}</p>
        </div>

        {/* ... existing stats grid ... */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
            <Clock className="w-8 h-8 text-blue-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">9:30</div>
            <div className="text-sm text-slate-400">de 10 min</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
            <Target className="w-8 h-8 text-purple-400 mb-3" />
            <div className="flex items-center gap-2 mb-1">
              <div className="text-3xl font-bold text-white">85%</div>
              <div className="w-12 h-12">
                <svg className="transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#334155" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3"
                    strokeDasharray={`${85 * 1.005}, 100.5`}
                  />
                </svg>
              </div>
            </div>
            <div className="text-sm text-slate-400">Precisión</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">⭐</span>
              <span className="text-sm text-green-400 font-semibold">+50 pts</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalPoints}</div>
            <div className="text-sm text-slate-400">Puntos totales</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
            <Flame className="w-8 h-8 text-orange-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{currentStreak}</div>
            <div className="text-sm text-slate-400">días de racha</div>
          </div>
        </div>

        {/* ... existing learning section ... */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Tu Aprendizaje
          </h2>

          <div className="flex flex-wrap gap-3 mb-6">
            {masteredConcepts.map((concept) => (
              <div
                key={concept.name}
                className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                  concept.mastered
                    ? "bg-green-500/20 border-green-500/50 text-green-300"
                    : "bg-yellow-500/20 border-yellow-500/50 text-yellow-300"
                }`}
              >
                {concept.mastered ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span className="font-medium">{concept.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 h-24 bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-end justify-between h-full gap-2">
              {[45, 60, 55, 70, 75, 85].map((value, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div
                    className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                    style={{ height: `${value}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ... existing reflection and difficulty sections ... */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold text-white mb-3">Reflexión Guardada</h2>
          <blockquote className="border-l-4 border-purple-500 pl-4 italic text-slate-300">"{reflection}"</blockquote>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold text-white mb-4 text-center">¿Cómo te pareció?</h2>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => handleDifficultySelect("difficult")}
              variant="outline"
              className={`flex-1 max-w-[150px] ${difficulty === "difficult" ? "border-red-500 bg-red-500/10" : ""}`}
            >
              😰 Difícil
            </Button>
            <Button
              onClick={() => handleDifficultySelect("good")}
              variant="outline"
              className={`flex-1 max-w-[150px] ${difficulty === "good" ? "border-green-500 bg-green-500/10" : ""}`}
            >
              😊 Bien
            </Button>
            <Button
              onClick={() => handleDifficultySelect("easy")}
              variant="outline"
              className={`flex-1 max-w-[150px] ${difficulty === "easy" ? "border-blue-500 bg-blue-500/10" : ""}`}
            >
              😴 Fácil
            </Button>
          </div>
        </div>

        {/* ... existing CTAs ... */}
        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Volver al dashboard
          </Button>
          <Button
            onClick={handleNextLesson}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
          >
            Siguiente lección: Listas en Python
          </Button>
        </div>
      </div>
    </div>
  )
}
