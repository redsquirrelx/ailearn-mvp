"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/components/toast-provider"

export function handleStartLesson(lessonId: string, lessonTitle: string) {
  const router = useRouter()
  const { showToast } = useToast()

  showToast(`Iniciando: ${lessonTitle}`, "info")
  router.push(`/lesson/${lessonId}`)
}
