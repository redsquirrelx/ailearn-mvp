"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store"
import { Home, BarChart3, User, RotateCcw } from "lucide-react"
import { useState } from "react"

export function SharedHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { learningStyle, totalPoints, currentStreak, hasCompletedOnboarding, resetOnboarding, technicalLevel } =
    useUserStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Don't show header on onboarding or home page
  if (pathname === "/onboarding" || pathname === "/") {
    return null
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/analytics", label: "Análisis", icon: BarChart3 },
  ]

  const handleRestartOnboarding = () => {
    if (confirm("¿Estás seguro de que quieres reiniciar el diagnóstico? Esto no afectará tu progreso de lecciones.")) {
      resetOnboarding()
      router.push("/onboarding")
      setShowUserMenu(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="font-bold text-white hidden sm:inline">AILearn</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive ? "bg-purple-500/20 text-purple-300" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User badges and menu */}
        {hasCompletedOnboarding && (
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/30 capitalize">
              {technicalLevel || "Principiante"}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-medium border border-pink-500/30">
              {totalPoints} pts
            </div>
            <div className="px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-medium border border-orange-500/30">
              {currentStreak} días
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <User className="w-5 h-5" />
              </button>

              {showUserMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />

                  {/* Menu dropdown */}
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    {/* User info */}
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm text-slate-400">Estilo de aprendizaje</p>
                      <p className="text-white font-medium capitalize">{learningStyle}</p>
                    </div>

                    {/* Menu options */}
                    <button
                      onClick={handleRestartOnboarding}
                      className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 transition-colors flex items-center gap-3"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reiniciar Diagnóstico
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
