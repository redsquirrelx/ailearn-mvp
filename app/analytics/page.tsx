"use client"

import { useState } from "react"
import { useUserStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock, Target, TrendingUp, Brain, ChevronLeft, CheckCircle2, Circle } from "lucide-react"
import { useRouter } from "next/navigation"

const topics = [
  {
    id: "python-basics",
    name: "Python Basics",
    total: 16,
    completed: 12,
    lessons: [
      { id: "1", name: "Variables y tipos de datos", completed: true },
      { id: "2", name: "Estructuras de control", completed: true },
      { id: "3", name: "Funciones", completed: true },
      { id: "4", name: "Listas y tuplas", completed: true },
      { id: "5", name: "Diccionarios", completed: true },
      { id: "6", name: "Manejo de errores", completed: true },
      { id: "7", name: "Módulos", completed: true },
      { id: "8", name: "POO básico", completed: true },
      { id: "9", name: "Herencia", completed: true },
      { id: "10", name: "Archivos", completed: true },
      { id: "11", name: "Expresiones regulares", completed: true },
      { id: "12", name: "Decoradores", completed: true },
      { id: "13", name: "Generadores", completed: false },
      { id: "14", name: "Context managers", completed: false },
      { id: "15", name: "Threading", completed: false },
      { id: "16", name: "Async/await", completed: false },
    ],
  },
  {
    id: "web-dev",
    name: "Desarrollo Web",
    total: 20,
    completed: 15,
    lessons: [
      { id: "1", name: "HTML básico", completed: true },
      { id: "2", name: "CSS Flexbox", completed: true },
      { id: "3", name: "CSS Grid", completed: true },
      { id: "4", name: "JavaScript ES6+", completed: true },
      { id: "5", name: "DOM Manipulation", completed: true },
      { id: "6", name: "Fetch API", completed: true },
      { id: "7", name: "React basics", completed: true },
      { id: "8", name: "React Hooks", completed: true },
      { id: "9", name: "State management", completed: true },
      { id: "10", name: "Routing", completed: true },
      { id: "11", name: "Forms", completed: true },
      { id: "12", name: "API integration", completed: true },
      { id: "13", name: "Authentication", completed: true },
      { id: "14", name: "Deployment", completed: true },
      { id: "15", name: "Performance", completed: true },
      { id: "16", name: "Testing", completed: false },
      { id: "17", name: "TypeScript", completed: false },
      { id: "18", name: "Next.js", completed: false },
      { id: "19", name: "Server Actions", completed: false },
      { id: "20", name: "Database", completed: false },
    ],
  },
  {
    id: "data-science",
    name: "Data Science",
    total: 12,
    completed: 8,
    lessons: [
      { id: "1", name: "NumPy basics", completed: true },
      { id: "2", name: "Pandas intro", completed: true },
      { id: "3", name: "Data cleaning", completed: true },
      { id: "4", name: "Visualization", completed: true },
      { id: "5", name: "Statistics", completed: true },
      { id: "6", name: "Linear regression", completed: true },
      { id: "7", name: "Classification", completed: true },
      { id: "8", name: "Clustering", completed: true },
      { id: "9", name: "Neural networks", completed: false },
      { id: "10", name: "Deep learning", completed: false },
      { id: "11", name: "NLP", completed: false },
      { id: "12", name: "Computer vision", completed: false },
    ],
  },
]

export default function AnalyticsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "topics" | "metacognition">("overview")
  const { completedLessons, currentStreak, totalPoints, totalHours, reflections, lessonHistory, learningStyle } =
    useUserStore()

  // Calculate progress
  const totalLessons = topics.reduce((sum, topic) => sum + topic.total, 0)
  const completedTotal = topics.reduce((sum, topic) => sum + topic.completed, 0)
  const progressPercentage = Math.round((completedTotal / totalLessons) * 100)

  // Generate chart data (last 30 days)
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      tiempo: Math.floor(Math.random() * 60) + 20,
      precision: Math.floor(Math.random() * 30) + 70,
    }
  })

  // Learning style distribution
  const styleData = [
    { name: "Visual", value: 45, color: "#8b5cf6" },
    { name: "Verbal", value: 25, color: "#ec4899" },
    { name: "Kinestético", value: 20, color: "#f97316" },
    { name: "Lógico", value: 10, color: "#3b82f6" },
  ]

  const formatHours = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="text-white/60 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Análisis de Progreso</h1>
                <p className="text-sm text-white/60">Visualiza tu evolución y patrones de aprendizaje</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 bg-black/10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-1">
            {[
              { id: "overview", label: "Visión General" },
              { id: "topics", label: "Por Tema" },
              { id: "metacognition", label: "Metacognición" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "border-b-2 border-purple-400 text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPIs Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Progreso</p>
                    <p className="text-3xl font-bold text-white">{progressPercentage}%</p>
                  </div>
                  <div className="relative h-16 w-16">
                    <svg className="h-16 w-16 -rotate-90 transform">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-white/10"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${progressPercentage * 1.76} 176`}
                        className="text-purple-400"
                      />
                    </svg>
                    <Target className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-purple-400" />
                  </div>
                </div>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-500/20 p-3">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Horas totales</p>
                    <p className="text-2xl font-bold text-white">{formatHours(24.25)}</p>
                  </div>
                </div>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-500/20 p-3">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Lecciones</p>
                    <p className="text-2xl font-bold text-white">{completedTotal}</p>
                  </div>
                </div>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-orange-500/20 p-3">
                    <TrendingUp className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Racha</p>
                    <p className="text-2xl font-bold text-white">🔥 {currentStreak} días</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Line Chart */}
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-semibold text-white">Evolución últimos 30 días</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="date" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e1e",
                      border: "1px solid #ffffff20",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="tiempo" stroke="#8b5cf6" strokeWidth={2} name="Tiempo (min)" />
                  <Line type="monotone" dataKey="precision" stroke="#ec4899" strokeWidth={2} name="Precisión (%)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Cognitive Metrics */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white/80">Reducción saturación</h4>
                  <span className="text-2xl font-bold text-green-400">72%</span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                    style={{ width: "72%" }}
                  />
                </div>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white/80">Claridad mental</h4>
                  <span className="text-2xl font-bold text-purple-400">8.5/10</span>
                </div>
                <Progress value={85} className="h-2" />
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white/80">Retención</h4>
                  <span className="text-2xl font-bold text-blue-400">78%</span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: "78%" }}
                  />
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "topics" && (
          <div className="space-y-6">
            <Accordion type="single" collapsible className="space-y-4">
              {topics.map((topic) => {
                const percentage = Math.round((topic.completed / topic.total) * 100)
                return (
                  <AccordionItem
                    key={topic.id}
                    value={topic.id}
                    className="overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex w-full items-center justify-between pr-4">
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-white">{topic.name}</h3>
                          <p className="text-sm text-white/60">
                            {topic.completed}/{topic.total} lecciones
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-400">{percentage}%</p>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="mb-4">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        {topic.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                            {lesson.completed ? (
                              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
                            ) : (
                              <Circle className="h-5 w-5 flex-shrink-0 text-white/20" />
                            )}
                            <span className={lesson.completed ? "text-white/80" : "text-white/40"}>{lesson.name}</span>
                            {lesson.completed && (
                              <span className="ml-auto rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
                                Visual
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        )}

        {activeTab === "metacognition" && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Reflexiones guardadas</h3>
              <div className="space-y-4">
                {[
                  {
                    date: "15 Dic 2024",
                    lesson: "Decoradores en Python",
                    text: "Me di cuenta de que necesito más práctica con closures antes de dominar decoradores.",
                  },
                  {
                    date: "14 Dic 2024",
                    lesson: "React Hooks",
                    text: "useEffect es más intuitivo cuando lo pienso como sincronización, no como ciclo de vida.",
                  },
                  {
                    date: "13 Dic 2024",
                    lesson: "Clustering",
                    text: "K-means tiene sentido visual. Debería aplicarlo a un dataset real para consolidar.",
                  },
                  {
                    date: "12 Dic 2024",
                    lesson: "CSS Grid",
                    text: "Las áreas nombradas hacen el código mucho más legible. Gran descubrimiento.",
                  },
                ].map((reflection, i) => (
                  <Card
                    key={i}
                    className="relative border-l-4 border-l-purple-400 border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-400">{reflection.lesson}</span>
                      <span className="text-xs text-white/40">{reflection.date}</span>
                    </div>
                    <p className="text-sm italic text-white/80">"{reflection.text}"</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Insights personalizados</h3>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/20 p-2">
                    <Clock className="h-5 w-5 text-green-400" />
                  </div>
                  <h4 className="font-semibold text-white">Mejor momento del día</h4>
                </div>
                <p className="text-2xl font-bold text-green-400">9-11 AM</p>
                <p className="mt-2 text-sm text-white/60">Tu precisión es 23% mayor en este horario</p>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-purple-500/20 p-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-white">Distribución de estilos</h4>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={styleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {styleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/20 p-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-white">Estrategias efectivas</h4>
                </div>
                <ul className="space-y-2">
                  {[
                    "Lecciones de 10-15 min",
                    "Reflexión inmediata post-lección",
                    "Contenido visual + código",
                    "Pausas cada 3 lecciones",
                  ].map((strategy, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {strategy}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
