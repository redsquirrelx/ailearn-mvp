import type { UserProfile } from "./adaptive-engine"

interface SimulatedLesson {
  objective: string
  content: string
  practice: string
  comprehension: string
  metacognition: string
  nextStep: string
}

export function generateSimulatedLesson(topic: string, concept: string, profile: UserProfile): SimulatedLesson {
  const { learningStyle, mentalState, technicalLevel, cognitiveLoad, recentErrors, recentSuccesses } = profile

  // Adapt objective based on mental state
  const objectiveTemplates = {
    tired: `🎯 Objetivo simple: Entender lo básico de ${concept}`,
    neutral: `🎯 Objetivo de hoy: Dominar ${concept} en ${topic}`,
    motivated: `🎯 Objetivo desafiante: Aplicar ${concept} de forma avanzada`,
  }

  const objective = objectiveTemplates[mentalState]

  // Adapt content format based on learning style
  let content = ""

  if (learningStyle === "visual") {
    content = `📚 **${concept}**

Observa este flujo:

\`\`\`
┌──────────────┐
│   Entrada    │
│   (Input)    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Proceso de  │
│  ${concept.padEnd(12)} │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Resultado  │
│   (Output)   │
└──────────────┘
\`\`\`

**Paso 1:** Define tu entrada
**Paso 2:** Aplica ${concept}
**Paso 3:** Obtén el resultado

${mentalState === "motivated" ? "\n🚀 **Tip avanzado:** Combina esto con conceptos previos para casos complejos." : ""}`
  } else if (learningStyle === "kinesthetic") {
    content = `📚 **${concept}** - Aprende haciendo

Empieza con este ejemplo práctico:

\`\`\`javascript
// Ejemplo real de ${concept}
function ejemplo() {
  // 1. Define tus datos
  const datos = "información inicial"
  
  // 2. Aplica ${concept}
  const resultado = datos.toUpperCase()
  
  // 3. Usa el resultado
  console.log(resultado)
  return resultado
}

ejemplo() // Prueba esto ahora
\`\`\`

**Por qué funciona:** ${concept} toma una entrada, la transforma, y devuelve un nuevo valor.

${mentalState === "motivated" ? "\n🚀 **Reto:** Modifica este código para agregar validación de errores." : ""}`
  } else if (learningStyle === "logical") {
    content = `📚 **${concept}** - Análisis lógico

**Definición:** ${concept} es un concepto clave en ${topic} que permite procesar información de forma estructurada.

**Ventajas vs Alternativas:**

✅ **${concept}:**
  • Eficiente y predecible
  • Fácil de mantener
  • Bien documentado

❌ **Enfoque tradicional:**
  • Más código repetitivo
  • Menos flexible
  • Mayor margen de error

**Cuándo usar ${concept}:**
  → Cuando necesitas transformar datos
  → Cuando buscas código limpio
  → Cuando importa la escalabilidad

${mentalState === "motivated" ? "\n🚀 **Consideración avanzada:** Evalúa el costo de performance vs simplicidad del código." : ""}`
  } else {
    // Default verbal style
    content = `📚 **${concept}**

${concept} es un concepto fundamental en ${topic}. Funciona de manera simple:

**En pocas palabras:** Toma una entrada, la procesa siguiendo reglas específicas, y devuelve un resultado.

**¿Por qué es importante?**
• Te permite escribir código más limpio
• Facilita el mantenimiento
• Es un estándar en la industria

**Ejemplo concreto:**
Imagina que tienes información que necesitas transformar. En vez de hacerlo manualmente, ${concept} lo hace automáticamente siguiendo los pasos que defines.

${mentalState === "motivated" ? "\n🚀 **Profundiza:** Una vez domines esto, podrás combinarlo con otros patrones avanzados." : ""}`
  }

  // Simplify if cognitive load is high
  if (cognitiveLoad === "high" || mentalState === "tired") {
    content = `📚 **${concept}** - Versión simple

**Lo esencial:** ${concept} toma algo, lo procesa, y te da un resultado.

**Un ejemplo:**
\`\`\`
entrada → [${concept}] → salida
\`\`\`

💡 **Eso es todo por hoy.** Descansa y vuelve cuando estés listo.`
  }

  // Add alternative explanation if recent errors
  if (recentErrors > 2) {
    content += `

---

💡 **Explicación alternativa** (detectamos dificultad):

Piensa en ${concept} como una máquina:
1. Le das algo
2. Ella lo transforma
3. Te devuelve el resultado

Es como una licuadora: le das frutas (entrada), las procesa (${concept}), y te da un smoothie (salida).`
  }

  // Adapt practice question
  const practiceTemplates = {
    tired: `✏️ **Mini Práctica**

Completa esta frase:
"${concept} sirve para ___________"

(Escribe 1-2 oraciones solamente)`,
    neutral: `✏️ **Mini Práctica**

Explica con tus propias palabras cómo aplicarías ${concept} en un proyecto real.

Ejemplo: "En mi proyecto de [X], usaría ${concept} para..."

(2-3 oraciones)`,
    motivated: `✏️ **Práctica con Reto**

**Nivel 1:** Explica cómo funciona ${concept}

**Nivel 2 (Reto):** Describe un caso complejo donde ${concept} se combina con otros conceptos de ${topic}.

Da ejemplos específicos y menciona beneficios.`,
  }

  const practice = practiceTemplates[mentalState]

  // Comprehension check
  const comprehensionTemplates = {
    tired: "❓ **Chequeo rápido:** En 3 palabras, ¿qué es ${concept}?",
    neutral: `❓ **Chequeo de Comprensión**

Responde: ¿Cuál es el propósito principal de ${concept}?

(Una frase clara es suficiente)`,
    motivated: `❓ **Chequeo de Comprensión**

Responde: ¿Cuál es el propósito principal de ${concept} y en qué se diferencia de otros enfoques?

Menciona al menos una ventaja clave.`,
  }

  const comprehension = comprehensionTemplates[mentalState].replace(/\$\{concept\}/g, concept)

  // Metacognition
  const metacognitionTemplates = {
    tired: `💭 **Reflexión breve**

Resume en 3 palabras lo que aprendiste hoy:
1. ___________
2. ___________
3. ___________`,
    neutral: `💭 **Reflexión Metacognitiva**

Responde brevemente:
• ¿Qué fue lo más claro de esta lección?
• ¿Qué necesitarías repasar?

(2-3 oraciones)`,
    motivated: `💭 **Reflexión Profunda**

Reflexiona sobre tu aprendizaje:
• ¿Cómo conecta ${concept} con lo que ya sabías?
• ¿Qué aplicación práctica le ves?
• ¿Qué pregunta te gustaría explorar más?

(3-4 oraciones)`,
  }

  const metacognition = metacognitionTemplates[mentalState].replace(/\$\{concept\}/g, concept)

  // Next step recommendation
  let nextStep = ""
  if (recentSuccesses > recentErrors && mentalState !== "tired") {
    nextStep = `➡️ **Siguiente Paso Recomendado**

¡Vas excelente! 🔥

**Sugerencia:** Avanza a conceptos más complejos de ${topic}. Estás listo para el siguiente nivel.`
  } else if (recentErrors > 2) {
    nextStep = `➡️ **Siguiente Paso Recomendado**

No te preocupes, el aprendizaje es un proceso. 💪

**Sugerencia:** Repasa ${concept} con un enfoque diferente. Prueba ejercicios prácticos simples antes de avanzar.`
  } else {
    nextStep = `➡️ **Siguiente Paso Recomendado**

¡Buen progreso! 👍

**Sugerencia:** Practica ${concept} con ejemplos reales, luego avanza al siguiente concepto de ${topic}.`
  }

  return {
    objective,
    content,
    practice,
    comprehension,
    metacognition,
    nextStep,
  }
}

// Format the lesson into a cohesive text
export function formatLessonContent(lesson: SimulatedLesson): string {
  return `${lesson.objective}

---

${lesson.content}

---

${lesson.practice}

---

${lesson.comprehension}

---

${lesson.metacognition}

---

${lesson.nextStep}`
}
