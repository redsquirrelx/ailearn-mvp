export type FeedbackContext = {
  step: "practice" | "comprehension" | "reflection" | "final"
  userAnswer: string
  topic?: string
  concept?: string
  timeSpent?: number
  performance?: string
  learningStyle?: string
  mentalState?: string
  recentErrors?: number
  recentSuccesses?: number
}

export function generateTutorFeedback(context: FeedbackContext): string {
  const { step, userAnswer, learningStyle, mentalState, recentErrors = 0, recentSuccesses = 0 } = context

  // Determine if answer quality is good based on length and keywords
  const isGoodAnswer = userAnswer.length > 50
  const hasEffort = userAnswer.length > 20

  // Base responses by step
  const responses = {
    practice: {
      excellent: [
        `¡Excelente trabajo! Tu ejemplo demuestra una comprensión sólida del concepto. Sigue así.`,
        `Muy bien pensado. Has aplicado el concepto de manera práctica y clara. Continúa con este nivel.`,
        `Perfecto. Tu respuesta muestra que has entendido cómo usar esto en situaciones reales.`,
      ],
      good: [
        `Buen intento. Veo que entiendes la idea principal. Intenta agregar más detalles en tu próxima práctica.`,
        `Vas por buen camino. Con un poco más de profundidad, tu respuesta sería excelente.`,
        `Bien hecho. Tu respuesta es correcta, aunque podrías expandir el ejemplo un poco más.`,
      ],
      needsWork: [
        `Veo tu esfuerzo. Intenta relacionar el concepto más directamente con un ejemplo específico.`,
        `Buen inicio, pero necesitas desarrollar más la idea. ¿Puedes pensar en un caso concreto?`,
        `Aprecio tu intento. Revisemos juntos: ¿cómo aplicarías esto paso a paso?`,
      ],
    },
    comprehension: {
      excellent: [
        `¡Exacto! Has capturado la esencia del concepto perfectamente.`,
        `Muy bien. Tu síntesis demuestra comprensión clara y precisa.`,
        `Perfecto. Has identificado lo más importante correctamente.`,
      ],
      good: [
        `Correcto. Has entendido el punto clave, aunque hay más matices que explorar.`,
        `Bien visto. Tu respuesta está en el camino correcto.`,
        `Sí, eso es importante. También considera otros aspectos que vimos.`,
      ],
      needsWork: [
        `Entiendo tu perspectiva. El concepto clave es un poco diferente, revisémoslo.`,
        `Buen intento. Hay un aspecto fundamental que quizás pasaste por alto.`,
        `Vamos a aclarar esto juntos. El punto principal es...`,
      ],
    },
    reflection: {
      excellent: [
        `Excelente reflexión. La metacognición es clave para el aprendizaje profundo. Sigue así.`,
        `Me gusta tu honestidad y análisis. Esta autoconciencia te ayudará a mejorar continuamente.`,
        `Muy bien expresado. Reconocer lo que fue difícil es el primer paso para dominarlo.`,
      ],
      good: [
        `Buena reflexión. Ser consciente de tu proceso de aprendizaje te hace más efectivo.`,
        `Aprecio tu sinceridad. Estas observaciones son valiosas para tu progreso.`,
        `Bien pensado. Tu reflexión muestra compromiso con tu aprendizaje.`,
      ],
      needsWork: [
        `Gracias por compartir. Intenta profundizar más en qué específicamente fue desafiante o fácil.`,
        `Buen inicio. ¿Podrías elaborar más sobre tu experiencia?`,
        `Valoro tu reflexión. Considera ser más específico sobre lo que aprendiste.`,
      ],
    },
    final: {
      excellent: [
        `¡Felicitaciones! Has completado esta micro-lección con excelencia. Tu dedicación es notable.`,
        `Trabajo excepcional. Has demostrado comprensión profunda y aplicación práctica del concepto.`,
        `¡Impresionante! Tu desempeño muestra que dominas este tema. Sigue con este momentum.`,
      ],
      good: [
        `¡Bien hecho! Has completado la lección satisfactoriamente. Cada sesión te acerca más al dominio.`,
        `Buen trabajo. Has progresado consistentemente y demuestras comprensión sólida.`,
        `¡Logrado! Tu esfuerzo ha dado frutos. Continúa practicando para consolidar el aprendizaje.`,
      ],
      needsWork: [
        `¡Completado! Aunque encontraste algunos desafíos, lo importante es que perseveraste. Sigue adelante.`,
        `Bien por terminar. Cada intento te acerca al dominio. Considera revisar los puntos difíciles.`,
        `¡Lo lograste! El aprendizaje es un proceso. Continúa practicando y verás mejoras rápidas.`,
      ],
    },
  }

  // Adaptive tone based on mental state
  const encouragement = {
    tired: [
      " Descansa cuando lo necesites.",
      " No te presiones demasiado hoy.",
      " Tu cerebro necesita tiempo para consolidar.",
    ],
    motivated: [" Tu energía es contagiosa.", " ¿Listo para otro desafío?", " Tu motivación te llevará lejos."],
    neutral: [" Vas bien.", " Continúa así.", " Paso a paso."],
  }

  // Performance-based response selection
  let responsePool: string[]

  if (step === "final") {
    const performance = context.performance || (recentSuccesses > recentErrors ? "excelente" : "bueno")
    responsePool =
      performance === "excelente"
        ? responses.final.excellent
        : performance === "bueno"
          ? responses.final.good
          : responses.final.needsWork
  } else {
    const stepResponses = responses[step]
    if (isGoodAnswer && recentSuccesses > recentErrors) {
      responsePool = stepResponses.excellent
    } else if (hasEffort || recentSuccesses >= recentErrors) {
      responsePool = stepResponses.good
    } else {
      responsePool = stepResponses.needsWork
    }
  }

  // Select random response from pool
  const baseResponse = responsePool[Math.floor(Math.random() * responsePool.length)]

  // Add encouraging suffix based on mental state
  const stateEncouragement = encouragement[mentalState as keyof typeof encouragement] || encouragement.neutral
  const suffix = stateEncouragement[Math.floor(Math.random() * stateEncouragement.length)]

  return baseResponse + suffix
}

export function generateDetailedFinalFeedback(context: {
  topic: string
  timeSpent: number
  finalScore: number
  recentSuccesses: number
  recentErrors: number
  learningStyle: string
  mentalState: string
}): {
  mainMessage: string
  strengths: string[]
  areasToImprove: string[]
  nextSteps: string
  motivationalQuote: string
} {
  const { topic, timeSpent, finalScore, recentSuccesses, recentErrors, learningStyle, mentalState } = context

  // Determine performance level
  const performanceLevel = finalScore >= 85 ? "excelente" : finalScore >= 70 ? "bueno" : "en progreso"

  // Main message templates
  const mainMessages = {
    excelente: [
      `¡Felicitaciones! Has demostrado un dominio excepcional del tema "${topic}". Tu capacidad para aplicar conceptos y reflexionar sobre tu aprendizaje es sobresaliente.`,
      `¡Trabajo extraordinario! Tu comprensión de "${topic}" está a un nivel avanzado. Has conectado las ideas de manera efectiva y demostrado pensamiento crítico.`,
      `¡Impresionante desempeño! No solo has comprendido "${topic}", sino que has demostrado la capacidad de aplicarlo creativamente. Tu dedicación es inspiradora.`,
    ],
    bueno: [
      `¡Muy buen trabajo! Has logrado una comprensión sólida de "${topic}". Tus respuestas muestran esfuerzo genuino y capacidad de análisis.`,
      `¡Bien hecho! Has avanzado significativamente en tu comprensión de "${topic}". Tu progreso es notable y consistente.`,
      `¡Excelente progreso! Has demostrado buena comprensión de "${topic}". Con un poco más de práctica, alcanzarás la maestría.`,
    ],
    "en progreso": [
      `¡Has completado la lección! Aunque "${topic}" presentó algunos desafíos, tu perseverancia es admirable. Cada intento fortalece tu comprensión.`,
      `¡Bien por terminar! "${topic}" puede ser complejo, pero has dado los primeros pasos importantes. El aprendizaje es un viaje, no un destino.`,
      `¡Logrado! Has enfrentado los desafíos de "${topic}" con determinación. Recuerda que el error es parte esencial del proceso de aprendizaje.`,
    ],
  }

  // Strengths based on performance
  const strengthsPool = {
    excelente: [
      "Aplicaste los conceptos de manera práctica y relevante",
      "Demostraste pensamiento crítico en tus respuestas",
      "Tu reflexión metacognitiva fue profunda y honesta",
      "Conectaste las ideas nuevas con conocimientos previos",
      "Mantuviste un alto nivel de compromiso durante toda la lección",
    ],
    bueno: [
      "Mostraste esfuerzo consistente en todas las actividades",
      "Tus ejemplos fueron claros y relevantes",
      "Identificaste correctamente los conceptos principales",
      "Mantuviste una buena actitud de aprendizaje",
      "Tu reflexión final mostró autoconciencia valiosa",
    ],
    "en progreso": [
      "Completaste todas las actividades con perseverancia",
      "Mostraste disposición para enfrentar desafíos",
      "Tu honestidad en las reflexiones es un activo valioso",
      "Mantuviste el compromiso hasta el final",
      "Demostraste apertura para aprender de los errores",
    ],
  }

  // Areas to improve
  const improvementAreas = {
    excelente: [
      "Podrías explorar aplicaciones aún más avanzadas del concepto",
      "Considera enseñar estos conceptos a otros para profundizar tu comprensión",
      "Experimenta con casos de uso más complejos y multidimensionales",
    ],
    bueno: [
      "Intenta profundizar más en los ejemplos prácticos",
      "Dedica más tiempo a conectar conceptos con tu experiencia personal",
      "Busca oportunidades adicionales de práctica para consolidar el aprendizaje",
    ],
    "en progreso": [
      "Revisa los conceptos fundamentales que presentaron mayor dificultad",
      "Practica con ejercicios similares para fortalecer la comprensión",
      "No dudes en volver a repasar el material cuando lo necesites",
      "Considera dividir el tema en partes más pequeñas para facilitar la asimilación",
    ],
  }

  // Next steps based on learning style
  const nextStepsTemplates = {
    visual: `Para continuar tu progreso, te recomiendo explorar diagramas y mapas conceptuales sobre este tema. Tu estilo visual se beneficiará de representaciones gráficas.`,
    auditory: `Sigue adelante grabando tus propias explicaciones del tema o discutiéndolo con otros. Tu estilo auditivo se fortalece con el diálogo.`,
    kinesthetic: `Da el siguiente paso con proyectos prácticos donde puedas aplicar estos conceptos. Tu estilo kinestésico necesita experiencia directa.`,
    reading: `Continúa tu camino leyendo artículos avanzados y documentación sobre el tema. Tu estilo lector se beneficia de recursos textuales profundos.`,
  }

  // Motivational quotes
  const motivationalQuotes = [
    '"El aprendizaje es un tesoro que seguirá a su dueño a todas partes." - Proverbio chino',
    '"La educación es el arma más poderosa que puedes usar para cambiar el mundo." - Nelson Mandela',
    '"El conocimiento es poder. La información es liberadora." - Kofi Annan',
    '"Aprende como si fueras a vivir para siempre." - Mahatma Gandhi',
    '"La inversión en conocimiento paga el mejor interés." - Benjamin Franklin',
    '"El que abre una puerta de una escuela, cierra una prisión." - Victor Hugo',
  ]

  // Select appropriate messages
  const mainMessage = mainMessages[performanceLevel][Math.floor(Math.random() * mainMessages[performanceLevel].length)]

  const strengths = strengthsPool[performanceLevel].sort(() => Math.random() - 0.5).slice(0, 3)

  const areasToImprove = improvementAreas[performanceLevel]
    .sort(() => Math.random() - 0.5)
    .slice(0, performanceLevel === "excelente" ? 1 : 2)

  const nextSteps = nextStepsTemplates[learningStyle as keyof typeof nextStepsTemplates] || nextStepsTemplates.visual

  const motivationalQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  return {
    mainMessage,
    strengths,
    areasToImprove,
    nextSteps,
    motivationalQuote,
  }
}
