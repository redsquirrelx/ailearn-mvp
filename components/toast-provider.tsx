"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const Icon = toast.type === "success" ? CheckCircle2 : toast.type === "error" ? XCircle : Info
          const colors =
            toast.type === "success"
              ? "bg-green-500/20 border-green-500/30 text-green-300"
              : toast.type === "error"
                ? "bg-red-500/20 border-red-500/30 text-red-300"
                : "bg-blue-500/20 border-blue-500/30 text-blue-300"

          return (
            <div
              key={toast.id}
              className={`${colors} border backdrop-blur-xl rounded-lg px-4 py-3 flex items-center gap-3 shadow-xl animate-in slide-in-from-right pointer-events-auto min-w-[300px]`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="hover:bg-white/10 rounded p-1 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
