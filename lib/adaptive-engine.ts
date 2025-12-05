// Adaptive Learning Engine - Generates personalized micro-lessons based on user profile

export interface UserProfile {
  learningStyle: "visual" | "verbal" | "kinesthetic" | "logical" | null
  mentalState: "tired" | "neutral" | "motivated"
  technicalLevel: "beginner" | "intermediate" | "advanced" | null
  recentErrors: number
  recentSuccesses: number
  preferredDuration: number // in minutes
  cognitiveLoad: "low" | "medium" | "high"
}

export interface AdaptiveLesson {
  objective: string
  contentType: "visual" | "text" | "example" | "comparison"
  content: {
    type: "diagram" | "text" | "code" | "steps" | "comparison"
    data: string | string[]
  }
  practice: {
    type: "quiz" | "debug" | "complete" | "build" | "reasoning"
    question: string
    options?: string[]
    correctAnswer?: string
  }
  comprehensionCheck: {
    question: string
    type: "scale" | "openended" | "choice"
  }
  metacognition: {
    question: string
    expectedLength: "short" | "medium" | "long"
  }
  nextStepRecommendation: string
  estimatedDuration: number // in minutes
  tone: "directive" | "conversational" | "technical"
}

// Strategy 1: Adapt content format based on learning style
export function adaptContentFormat(
  style: UserProfile["learningStyle"],
  topic: string,
  concept: string,
): AdaptiveLesson["content"] {
  if (style === "visual") {
    return {
      type: "diagram",
      data: [
        `📊 DIAGRAMA: ${concept}`,
        "",
        "┌─────────────┐",
        "│   Entrada   │",
        "└──────┬──────┘",
        "       │",
        "       ▼",
        "┌─────────────┐",
        "│  Proceso    │",
        "└──────┬──────┘",
        "       │",
        "       ▼",
        "┌─────────────┐",
        "│   Salida    │",
        "└─────────────┘",
      ],
    }
  } else if (style === "verbal") {
    return {
      type: "text",
      data: `${concept} es fundamental en ${topic}. Funciona mediante pasos claros: define, procesa, devuelve resultado.`,
    }
  } else if (style === "kinesthetic") {
    return {
      type: "code",
      data: [
        "// Aprende haciendo:",
        `function ejemplo${concept.replace(/\s/g, "")}() {`,
        "  // 1. Define tu entrada",
        "  const entrada = 'dato'",
        "  ",
        "  // 2. Procesa",
        "  const resultado = entrada.toUpperCase()",
        "  ",
        "  // 3. Devuelve",
        "  return resultado",
        "}",
      ],
    }
  } else {
    return {
      type: "comparison",
      data: [
        `${concept} vs Alternativas:`,
        "",
        `✅ ${concept}:`,
        "  - Ventaja 1: Eficiente",
        "  - Ventaja 2: Flexible",
        "",
        "❌ Alternativa clásica:",
        "  - Más lento",
        "  - Menos expresivo",
      ],
    }
  }
}

// Strategy 2: Adapt intensity based on cognitive load
export function adaptIntensity(profile: UserProfile, baseContent: string): { duration: number; content: string } {
  if (profile.mentalState === "tired" || profile.cognitiveLoad === "high") {
    // Ultra-simplified: 1 concept only, 30-60 seconds
    return {
      duration: 1,
      content: baseContent.split("\n")[0] + "\n\n💡 Un solo concepto hoy. Tómatelo con calma.",
    }
  } else if (profile.mentalState === "motivated" && profile.cognitiveLoad === "low") {
    // Extended: Add challenge
    return {
      duration: 3,
      content:
        baseContent +
        "\n\n🚀 Reto adicional: ¿Puedes aplicar esto en un caso más complejo?\n\nEjemplo avanzado: Combina este concepto con el anterior.",
    }
  }

  return { duration: 2, content: baseContent }
}

// Strategy 3: Adapt sensory channel (text, diagram, comparison)
export function adaptSensoryChannel(profile: UserProfile): "schematic" | "image" | "comparison" | "text" {
  if (profile.learningStyle === "visual") return "image"
  if (profile.learningStyle === "logical") return "schematic"
  if (profile.mentalState === "tired") return "comparison" // Easier to digest
  return "text"
}

// Strategy 4: Adapt content order
export function adaptContentOrder(profile: UserProfile): "topdown" | "examplefirst" | "conceptpractice" {
  if (profile.learningStyle === "kinesthetic") return "examplefirst"
  if (profile.technicalLevel === "advanced") return "conceptpractice"
  return "topdown"
}

// Strategy 5: Adapt tone
export function adaptTone(profile: UserProfile): AdaptiveLesson["tone"] {
  if (profile.mentalState === "tired" || profile.cognitiveLoad === "high") return "directive"
  if (profile.technicalLevel === "advanced") return "technical"
  return "conversational"
}

// Strategy 6: Adapt practice type
export function adaptPracticeType(profile: UserProfile): AdaptiveLesson["practice"]["type"] {
  if (profile.learningStyle === "logical") return "reasoning"
  if (profile.learningStyle === "kinesthetic") return "debug"
  if (profile.learningStyle === "visual") return "complete"
  if (profile.mentalState === "tired") return "quiz" // Simplest
  return "build"
}

// Strategy 7: Adapt metacognition depth
export function adaptMetacognitionDepth(profile: UserProfile): "minimal" | "moderate" | "deep" {
  if (profile.mentalState === "tired") return "minimal"
  if (profile.technicalLevel === "advanced" && profile.cognitiveLoad === "low") return "deep"
  return "moderate"
}

// Strategy 8: Determine progression path
export function determineProgressionPath(profile: UserProfile, history: any[]): "depth" | "breadth" {
  const recentCompletions = history.slice(-5)
  const sameTopic = recentCompletions.filter((l) => l.topic === recentCompletions[0]?.topic).length

  if (sameTopic >= 3 && profile.mentalState !== "tired") return "depth"
  return "breadth"
}

// Strategy 9: Adapt session duration
export function adaptSessionDuration(profile: UserProfile, userBehavior: { avgSessionTime: number }): number {
  if (userBehavior.avgSessionTime < 2) return 1 // 1-minute lessons
  if (userBehavior.avgSessionTime > 5 && profile.mentalState === "motivated") return 5
  return 3
}

// Strategy 10: Real-time adaptation logic
export function getRealTimeAdaptation(
  currentDifficulty: number,
  userResponse: {
    correct: boolean
    timeToAnswer: number
    userInput?: string
  },
): {
  action: "reduce" | "increase" | "maintain" | "offerAlternative"
  message: string
} {
  if (!userResponse.correct && userResponse.timeToAnswer > 30) {
    return {
      action: "offerAlternative",
      message: "¿Quieres ver una explicación visual alternativa?",
    }
  }

  if (userResponse.correct && userResponse.timeToAnswer < 10) {
    return {
      action: "increase",
      message: "🎯 ¡Excelente! Activando modo desafío.",
    }
  }

  if (!userResponse.correct) {
    return {
      action: "reduce",
      message: "Simplifiquemos esto. Vamos paso a paso.",
    }
  }

  return {
    action: "maintain",
    message: "¡Bien! Continuemos.",
  }
}

// Main lesson generator
export async function generateAdaptiveLesson(
  topic: string,
  concept: string,
  profile: UserProfile,
  prompt: string,
): Promise<{ lesson: string; metadata: any }> {
  const tone = adaptTone(profile)
  const contentOrder = adaptContentOrder(profile)
  const practiceType = adaptPracticeType(profile)
  const metacognitionDepth = adaptMetacognitionDepth(profile)

  // Build the adaptive prompt for AI
  const systemPrompt = `Eres el motor de micro-lecciones adaptativas de AILearn.

PERFIL DEL USUARIO:
- Estilo de aprendizaje: ${profile.learningStyle || "desconocido"}
- Estado mental: ${profile.mentalState}
- Nivel técnico: ${profile.technicalLevel || "principiante"}
- Carga cognitiva: ${profile.cognitiveLoad}

ADAPTACIONES REQUERIDAS:
- Tono: ${tone === "directive" ? "Directo, paso a paso" : tone === "technical" ? "Técnico, preciso" : "Conversacional, amigable"}
- Formato: ${profile.learningStyle === "visual" ? "Usa diagramas ASCII, esquemas" : profile.learningStyle === "kinesthetic" ? "Comienza con ejemplo práctico" : "Texto claro y directo"}
- Duración objetivo: ${profile.preferredDuration} minutos
- Tipo de práctica: ${practiceType}
- Orden: ${contentOrder === "examplefirst" ? "Ejemplo → Teoría" : contentOrder === "topdown" ? "Concepto → Ejemplo → Aplicación" : "Concepto → Práctica → Síntesis"}

ESTRUCTURA OBLIGATORIA:
1. **Objetivo mini (1 frase)** → Qué aprenderá hoy
2. **Micro-contenido adaptado** → Formato según perfil
3. **Mini práctica adaptada** → Según tipo: ${practiceType}
4. **Chequeo de comprensión** → 1 pregunta simple
5. **Cierre metacognitivo** → ${metacognitionDepth === "minimal" ? "Muy breve (3 palabras)" : metacognitionDepth === "deep" ? "Reflexión profunda" : "Pregunta corta de reflexión"}
6. **Siguiente paso** → Personalizado

${profile.mentalState === "tired" ? "⚠️ Usuario saturado: Contenido ultra-simple, 1 solo concepto, máximo 1 minuto." : ""}
${profile.mentalState === "motivated" ? "🚀 Usuario motivado: Puedes añadir un mini-reto opcional." : ""}
${profile.recentErrors > 2 ? "⚠️ El usuario ha tenido errores recientes: Da explicación alternativa (más simple o más visual)." : ""}
${profile.recentSuccesses > 3 ? "✅ El usuario va bien: Incrementa levemente la dificultad." : ""}

TEMA: ${topic}
CONCEPTO ESPECÍFICO: ${concept}

Genera la micro-lección completa ahora.`

  return {
    lesson: systemPrompt,
    metadata: {
      tone,
      contentOrder,
      practiceType,
      metacognitionDepth,
      estimatedDuration: profile.preferredDuration,
    },
  }
}
