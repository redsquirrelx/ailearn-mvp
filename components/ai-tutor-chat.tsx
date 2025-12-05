"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/store"

interface Message {
  role: "user" | "tutor"
  content: string
  timestamp: Date
}

export function AITutorChat({ currentLessonId }: { currentLessonId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { learningStyle, technicalLevel, mentalState } = useUserStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateTutorResponse = (userMessage: string, conversationHistory: Message[]): string => {
    const lowerMsg = userMessage.toLowerCase()

    // Get lesson topic from ID
    const lessonTopic = currentLessonId?.split("-")[1] || ""

    // Direct answer requests
    if (
      lowerMsg.includes("dame la respuesta") ||
      lowerMsg.includes("cuál es la solución") ||
      lowerMsg.includes("hazlo por mí")
    ) {
      return "🚫 Mi rol es guiarte, no darte la respuesta. El aprendizaje real viene cuando tú resuelves el problema. ¿Qué has intentado hasta ahora?"
    }

    // Topic-specific responses for variables
    if (lowerMsg.includes("variable")) {
      if (lowerMsg.includes("qué es") || lowerMsg.includes("que es") || lowerMsg.includes("definición")) {
        return `💡 Una variable es como una caja etiquetada donde guardas información. Por ejemplo:\n\nnombre = "Ana"\nedad = 25\n\nLa etiqueta es el nombre (nombre, edad) y el contenido es el valor ("Ana", 25).\n\n¿Qué variable necesitas crear para tu ejercicio?`
      }
      if (lowerMsg.includes("cómo") || lowerMsg.includes("como") || lowerMsg.includes("crear")) {
        return `📝 Para crear una variable:\n\n1. Escribe el nombre\n2. Usa = (signo igual)\n3. Pon el valor\n\nEjemplo: ciudad = "Lima"\n\n¿Ya probaste crear una? Muéstrame qué escribiste.`
      }
      if (lowerMsg.includes("tipo")) {
        return `🔢 Los tipos de datos más comunes:\n\n• str (texto): nombre = "Juan"\n• int (entero): edad = 30\n• float (decimal): altura = 1.75\n• bool (verdadero/falso): activo = True\n\nPython detecta el tipo automáticamente. ¿Qué tipo necesitas para tu ejercicio?`
      }
      return "Las variables son fundamentales. ¿Qué específicamente te confunde? ¿Cómo crearlas, qué tipos hay, o cómo usarlas?"
    }

    // Functions
    if (lowerMsg.includes("función") || lowerMsg.includes("funcion") || lowerMsg.includes("def")) {
      if (lowerMsg.includes("qué es") || lowerMsg.includes("que es")) {
        return `🎯 Una función es código reutilizable. Como una receta:\n\ndef saludar(nombre):\n    print(f"Hola {nombre}")\n\nsaludar("María")  # Salida: Hola María\n\n¿Qué tarea repetitiva podrías convertir en función?`
      }
      if (lowerMsg.includes("parámetro") || lowerMsg.includes("parametro")) {
        return `📥 Los parámetros son datos que entran a la función:\n\ndef suma(a, b):  # a y b son parámetros\n    return a + b\n\nresultado = suma(5, 3)  # 5 y 3 son argumentos\n\n¿Qué datos necesita recibir tu función?`
      }
      if (lowerMsg.includes("return")) {
        return `↩️ return devuelve un valor de la función:\n\ndef calcular_doble(numero):\n    return numero * 2\n\nresultado = calcular_doble(5)  # resultado = 10\n\nSin return, la función no devuelve nada (None). ¿Tu función debe devolver algo?`
      }
      return "Las funciones organizan tu código. ¿Qué parte te genera duda? ¿Sintaxis, parámetros o el return?"
    }

    // Lists/Arrays
    if (lowerMsg.includes("lista") || lowerMsg.includes("array")) {
      if (lowerMsg.includes("crear")) {
        return `📋 Para crear listas:\n\nfrutas = ["manzana", "pera", "uva"]\nnumeros = [1, 2, 3, 4, 5]\nmixta = ["texto", 42, True]\n\nUsa corchetes [] y separa elementos con comas. Intenta crear una lista para tu ejercicio.`
      }
      if (lowerMsg.includes("acceder") || lowerMsg.includes("índice") || lowerMsg.includes("posición")) {
        return `🎯 Para acceder a elementos:\n\nfrutas = ["manzana", "pera", "uva"]\n\nfrutas[0]  # "manzana" (primer elemento)\nfrutas[1]  # "pera"\nfrutas[-1]  # "uva" (último elemento)\n\nRecuerda: los índices empiezan en 0. ¿Qué elemento necesitas obtener?`
      }
      return "Las listas guardan múltiples valores. ¿Necesitas crearlas, acceder a elementos o modificarlas?"
    }

    // Loops
    if (
      lowerMsg.includes("bucle") ||
      lowerMsg.includes("for") ||
      lowerMsg.includes("while") ||
      lowerMsg.includes("ciclo")
    ) {
      if (lowerMsg.includes("diferencia") || lowerMsg.includes("cuándo") || lowerMsg.includes("cuando")) {
        return `🔄 for vs while:\n\n• for: sabes cuántas veces repetir\nfor i in range(5):  # Repite 5 veces\n\n• while: repites hasta que algo cambie\nwhile edad < 18:  # Hasta que edad sea 18+\n\n¿Tu tarea tiene un número fijo de repeticiones?`
      }
      if (lowerMsg.includes("range")) {
        return `🔢 range() genera números:\n\nrange(5)  # 0, 1, 2, 3, 4\nrange(1, 6)  # 1, 2, 3, 4, 5\nrange(0, 10, 2)  # 0, 2, 4, 6, 8\n\nSiempre para ANTES del último número. ¿Qué rango necesitas?`
      }
      return "Los bucles repiten código. ¿Sabes cuántas veces repetir (usa for) o es hasta que algo cambie (usa while)?"
    }

    // Conditionals
    if (lowerMsg.includes("if") || lowerMsg.includes("else") || lowerMsg.includes("condicional")) {
      if (lowerMsg.includes("sintaxis") || lowerMsg.includes("cómo") || lowerMsg.includes("como")) {
        return `🤔 Sintaxis de condicionales:\n\nif edad >= 18:\n    print("Adulto")\nelif edad >= 13:\n    print("Adolescente")\nelse:\n    print("Niño")\n\nNota los dos puntos : y la indentación. ¿Qué decisión debe tomar tu código?`
      }
      if (lowerMsg.includes("operador") || lowerMsg.includes("comparación")) {
        return `⚖️ Operadores de comparación:\n\n==  igual a\n!=  diferente de\n>   mayor que\n<   menor que\n>=  mayor o igual\n<=  menor o igual\n\nEjemplo: if edad >= 18:\n\n¿Qué condición necesitas verificar?`
      }
      return "Los condicionales son decisiones: if edad >= 18: haz esto. ¿Qué condición necesitas evaluar?"
    }

    // Errors and debugging
    if (lowerMsg.includes("error") || lowerMsg.includes("no funciona") || lowerMsg.includes("falla")) {
      return `🐛 Los errores son normales y útiles. Para ayudarte mejor:\n\n1. ¿Qué mensaje de error ves exactamente?\n2. ¿En qué línea ocurre?\n3. ¿Qué esperabas que pasara vs qué pasó realmente?\n\nCuéntame estos detalles y te guío.`
    }

    // Confusion
    if (lowerMsg.includes("no entiendo") || lowerMsg.includes("confundido") || lowerMsg.includes("difícil")) {
      return `🤝 Entiendo tu frustración. Vamos paso a paso:\n\n1. ¿Qué parte específica no entiendes?\n2. ¿Es la sintaxis, la lógica o no sabes por dónde empezar?\n3. ¿Ya intentaste algo?\n\nDime en qué paso te trabaste.`
    }

    // How/Why questions
    if (lowerMsg.includes("cómo") || lowerMsg.includes("como")) {
      return `💭 Antes de responderte, cuéntame:\n\n¿Qué has intentado hasta ahora? Comparte tu razonamiento y te guío desde ahí. Aprenderás más si construimos la solución juntos.`
    }

    if (lowerMsg.includes("por qué") || lowerMsg.includes("porque") || lowerMsg.includes("para qué")) {
      return `🎯 Excelente pregunta. Piensa en esto:\n\n¿Dónde usarías este concepto en un proyecto real? Eso te ayudará a entender el 'por qué'. Dame un ejemplo y exploramos juntos.`
    }

    // Example requests
    if (lowerMsg.includes("ejemplo") || lowerMsg.includes("muestra")) {
      return `📚 En vez de darte el ejemplo completo, construyámoslo juntos:\n\n1. ¿Qué es lo primero que escribirías?\n2. Comparte tu idea y yo te digo si vas bien\n\nEl mejor aprendizaje viene cuando TÚ lo construyes.`
    }

    // Verification
    if (lowerMsg.includes("está bien") || lowerMsg.includes("correcto") || lowerMsg.includes("funciona")) {
      return `✅ Antes de decirte sí o no, ayúdame a entender:\n\n¿Por qué crees que funciona? ¿Qué hace cada parte de tu código?\n\nExplicar tu razonamiento fortalece tu comprensión.`
    }

    // Lesson-specific guidance
    if (lessonTopic.includes("variable")) {
      return `Esta lección es sobre variables. Las claves son:\n\n1. Nombre descriptivo\n2. Asignar valor con =\n3. Usar la variable después\n\n¿En qué parte específica necesitas ayuda?`
    }

    if (lessonTopic.includes("function")) {
      return `Esta lección es sobre funciones. Recuerda:\n\n1. def nombre_funcion():\n2. Indenta el código interno\n3. Llama con nombre_funcion()\n\n¿Qué paso te está costando?`
    }

    // Context-aware responses
    const recentMessages = conversationHistory.slice(-3)
    const hasAskedBefore = recentMessages.length > 2

    if (hasAskedBefore) {
      return `📝 Veo que sigues trabajando en esto. ¿Ya probaste lo que te sugerí en el mensaje anterior?\n\nCuéntame qué resultado obtuviste o qué nueva duda surgió.`
    }

    // Default helpful responses
    const contextualResponses = [
      `🤔 Para ayudarte mejor, necesito saber: ¿en qué paso específico te trabaste?\n\nComparte tu código o describe el problema.`,
      `💡 Hagamos esto paso a paso:\n\n1. Muéstrame lo que has escrito hasta ahora\n2. Te doy feedback específico\n3. Avanzamos juntos\n\n¿Qué tienes hasta el momento?`,
      `🎯 Buena pregunta. Antes de responderte:\n\n¿Qué información ya tienes clara y qué te falta? Así puedo enfocarme en lo que realmente necesitas.`,
      `📖 Descompongamos esto juntos:\n\n¿Cuál es el objetivo final de lo que intentas hacer? A veces empezar por el 'qué quiero lograr' aclara el 'cómo hacerlo'.`,
    ]

    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)]
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userInput = input.trim()
    setInput("")

    const userMessage: Message = {
      role: "user",
      content: userInput,
      timestamp: new Date(),
    }

    // Add user message immediately
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage]

      // Generate tutor response with updated conversation history
      setIsTyping(true)
      setTimeout(
        () => {
          const tutorResponse = generateTutorResponse(userInput, updatedMessages)
          const tutorMessage: Message = {
            role: "tutor",
            content: tutorResponse,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, tutorMessage])
          setIsTyping(false)
        },
        1000 + Math.random() * 1000,
      )

      return updatedMessages
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg z-50"
      >
        <Bot className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-800 rounded-xl border border-slate-700 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Tutor IA</h3>
            <p className="text-xs text-slate-400">Aquí para guiarte</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-8">
            <Bot className="w-12 h-12 mx-auto mb-3 text-purple-500" />
            <p className="mb-2">Hola, soy tu tutor personal</p>
            <p className="text-xs">
              Pregúntame lo que necesites. Mi objetivo es guiarte, no darte respuestas directas. Aprenderás mejor así.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-700 text-slate-200 border border-slate-600"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm text-slate-400 italic">Escribiendo...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta algo..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button onClick={handleSendMessage} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">El tutor te guiará sin darte respuestas directas</p>
      </div>
    </div>
  )
}
