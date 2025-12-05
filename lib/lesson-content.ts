export interface LessonContent {
  id: string
  introduction: string
  explanation: string
  codeExample: string
  exercise: {
    title: string
    description: string
    placeholder: string
    keywords: string[]
  }
  summary: string
}

export const lessonContentDatabase: Record<string, LessonContent> = {
  "py-variables-1": {
    id: "py-variables-1",
    introduction:
      "Las variables son contenedores que almacenan datos en tu programa. Piensa en ellas como cajas etiquetadas donde guardas información que puedes usar y modificar más tarde.",
    explanation:
      "En Python, crear una variable es muy simple. Solo necesitas un nombre y un valor. Por ejemplo:\n\nPython usa tipado dinámico, lo que significa que no necesitas declarar el tipo de dato. Python lo detecta automáticamente.",
    codeExample: `# Crear variables en Python
nombre = "Juan"
edad = 25
altura = 1.75
es_estudiante = True

# Mostrar los valores
print(nombre)
print(edad)`,
    exercise: {
      title: "Crea tus primeras variables",
      description: "Crea 3 variables: tu nombre, tu edad y tu ciudad. Luego imprímelas usando print().",
      placeholder: 'nombre = "Tu nombre"\nedad = \nciudad = \n\nprint(nombre)\nprint(edad)\nprint(ciudad)',
      keywords: ["nombre", "edad", "ciudad", "print", "="],
    },
    summary:
      "Las variables son la base de la programación. Usa nombres descriptivos, puedes guardar diferentes tipos de datos (texto, números, booleanos), y Python detecta el tipo automáticamente.",
  },

  "py-variables-2": {
    id: "py-variables-2",
    introduction:
      "Ahora que sabes crear variables, aprenderás sobre los diferentes tipos de datos y cómo convertir entre ellos. Esto es crucial para manipular información correctamente.",
    explanation:
      "Python tiene varios tipos de datos principales: str (texto), int (enteros), float (decimales), bool (verdadero/falso). Puedes convertir entre tipos usando funciones de conversión.",
    codeExample: `# Tipos de datos
texto = "123"
numero = int(texto)  # Convierte texto a número
decimal = float(numero)  # Convierte a decimal

# Ver el tipo
print(type(texto))   # <class 'str'>
print(type(numero))  # <class 'int'>

# Conversiones útiles
edad_texto = "25"
edad_numero = int(edad_texto)
print(edad_numero + 5)  # 30`,
    exercise: {
      title: "Practica conversiones de tipos",
      description: 'Crea una variable con el texto "100", conviértela a número, súmale 50, y muestra el resultado.',
      placeholder: 'texto_numero = "100"\n# Convierte a int y suma 50\n# Imprime el resultado',
      keywords: ["int", "+", "print", "="],
    },
    summary:
      "Los tipos de datos definen qué puedes hacer con una variable. Usa int() para enteros, float() para decimales, str() para texto. Las conversiones son esenciales para evitar errores.",
  },

  "py-functions-1": {
    id: "py-functions-1",
    introduction:
      "Las funciones son bloques de código reutilizables que realizan una tarea específica. Son como recetas que puedes seguir una y otra vez sin reescribir todo.",
    explanation:
      "Una función se define con la palabra 'def', seguida del nombre y paréntesis. El código dentro se ejecuta cada vez que llamas la función.",
    codeExample: `# Definir una función
def saludar():
    print("¡Hola!")
    print("Bienvenido al curso")

# Llamar la función
saludar()  # Ejecuta el código dentro

# Función con parámetros
def saludar_persona(nombre):
    print(f"Hola {nombre}")
    
saludar_persona("Ana")  # Hola Ana`,
    exercise: {
      title: "Crea tu primera función",
      description: "Define una función llamada 'presentarse' que imprima tu nombre y tu edad. Luego llámala.",
      placeholder: "def presentarse():\n    # Tu código aquí\n    print(...)\n\n# Llama tu función\npresentarse()",
      keywords: ["def", "presentarse", "print", "()"],
    },
    summary:
      "Las funciones organizan tu código y lo hacen reutilizable. Usa 'def' para definir, indenta el código interno, y llama la función con paréntesis.",
  },

  "linux-intro-1": {
    id: "linux-intro-1",
    introduction:
      "Linux es un sistema operativo poderoso usado en servidores, desarrollo y más. Aprenderás a navegar usando la terminal, que es más rápida y potente que interfaces gráficas.",
    explanation:
      "La terminal usa comandos de texto para interactuar con el sistema. Los comandos más básicos te permiten ver archivos, cambiar de carpeta y crear directorios.",
    codeExample: `# Comandos básicos de Linux
pwd           # Muestra tu ubicación actual
ls            # Lista archivos y carpetas
cd carpeta    # Cambia a una carpeta
cd ..         # Sube un nivel
mkdir nueva   # Crea carpeta
touch archivo.txt  # Crea archivo vacío`,
    exercise: {
      title: "Practica comandos básicos",
      description:
        "Escribe los comandos para: 1) Ver dónde estás (pwd), 2) Listar archivos (ls), 3) Crear una carpeta llamada 'proyecto'",
      placeholder: "pwd\n# Agrega los otros comandos aquí",
      keywords: ["pwd", "ls", "mkdir", "proyecto"],
    },
    summary:
      "La terminal de Linux es tu herramienta principal. pwd muestra ubicación, ls lista archivos, cd cambia carpetas, mkdir crea directorios. Practica estos comandos hasta que sean naturales.",
  },

  "js-basics-1": {
    id: "js-basics-1",
    introduction:
      "JavaScript es el lenguaje de la web. Permite crear páginas interactivas y aplicaciones completas. Empezarás con variables y tipos de datos, similares a Python pero con algunas diferencias.",
    explanation:
      "En JavaScript, declaras variables con let (cambiables) o const (constantes). A diferencia de Python, necesitas usar punto y coma al final de cada línea (opcional pero recomendado).",
    codeExample: `// Variables en JavaScript
let nombre = "María";
let edad = 28;
const PI = 3.14159;  // Constante, no cambia

// Tipos de datos
let texto = "Hola";
let numero = 42;
let decimal = 3.14;
let activo = true;

// Mostrar en consola
console.log(nombre);
console.log("Edad:", edad);`,
    exercise: {
      title: "Variables en JavaScript",
      description: "Crea 2 variables con let (tu nombre y edad) y 1 constante (tu país). Imprímelas con console.log",
      placeholder:
        'let nombre = "Tu nombre";\n// Crea las otras variables\n\nconsole.log(nombre);\n// Imprime las demás',
      keywords: ["let", "const", "console.log", "=", ";"],
    },
    summary:
      "JavaScript usa let para variables que cambian y const para constantes. Usa console.log() para ver valores. Los punto y coma son opcionales pero buena práctica.",
  },

  "excel-intro-1": {
    id: "excel-intro-1",
    introduction:
      "Excel es la herramienta de hojas de cálculo más usada en el mundo. Aprenderás a organizar datos, hacer cálculos básicos y dar formato profesional.",
    explanation:
      "Excel organiza datos en filas (numeradas) y columnas (letras). Cada celda tiene una dirección como A1, B2, etc. Las fórmulas siempre empiezan con el signo =",
    codeExample: `Conceptos básicos de Excel:

Celdas: A1, B3, C5 (columna + fila)
Filas: 1, 2, 3, 4... (horizontales)
Columnas: A, B, C, D... (verticales)

Fórmulas básicas:
=A1+B1     (Suma dos celdas)
=SUMA(A1:A10)  (Suma rango)
=PROMEDIO(B1:B5)  (Calcula promedio)`,
    exercise: {
      title: "Conceptos de Excel",
      description: "Escribe la fórmula que sumaría las celdas A1, A2 y A3. Recuerda: las fórmulas empiezan con =",
      placeholder: "=",
      keywords: ["=", "SUMA", "A1", "A2", "A3", "+"],
    },
    summary:
      "Excel usa celdas identificadas por columna y fila. Las fórmulas empiezan con =. Usa SUMA() para sumar rangos y operadores básicos (+, -, *, /) para cálculos simples.",
  },

  "fin-budget-1": {
    id: "fin-budget-1",
    introduction:
      "Un presupuesto personal es la base de la salud financiera. Aprenderás a rastrear ingresos, gastos y encontrar oportunidades para ahorrar.",
    explanation:
      "Un presupuesto tiene tres partes: Ingresos (dinero que entra), Gastos fijos (renta, servicios) y Gastos variables (comida, entretenimiento). La regla 50/30/20 es un buen punto de partida.",
    codeExample: `Regla del 50/30/20:

50% - Necesidades (renta, comida, transporte)
30% - Deseos (entretenimiento, hobbies)
20% - Ahorros e inversión

Ejemplo con $2000 mensuales:
$1000 - Necesidades
$600  - Deseos
$400  - Ahorros`,
    exercise: {
      title: "Calcula tu presupuesto",
      description: "Si ganas $3000 al mes, calcula cuánto deberías destinar a cada categoría según la regla 50/30/20.",
      placeholder: "Necesidades (50%): $\nDeseos (30%): $\nAhorros (20%): $",
      keywords: ["1500", "900", "600", "50", "30", "20"],
    },
    summary:
      "La regla 50/30/20 divide tu ingreso en necesidades, deseos y ahorros. Rastrea tus gastos durante un mes para saber dónde va tu dinero. El ahorro debe ser automático, no lo que sobra.",
  },

  "mkt-intro-1": {
    id: "mkt-intro-1",
    introduction:
      "El marketing digital usa canales online para llegar a clientes. Aprenderás los fundamentos: contenido, redes sociales, email y publicidad pagada.",
    explanation:
      "El marketing digital tiene 4 pilares principales: SEO (aparecer en Google), redes sociales (engagement), email marketing (comunicación directa) y ads pagados (alcance rápido).",
    codeExample: `Los 4 pilares del Marketing Digital:

1. SEO (Search Engine Optimization)
   - Aparecer en resultados de Google
   - Contenido optimizado con palabras clave
   
2. Redes Sociales
   - Instagram, Facebook, TikTok, LinkedIn
   - Engagement y comunidad
   
3. Email Marketing
   - Comunicación directa con clientes
   - Alta conversión
   
4. Publicidad Pagada (Ads)
   - Google Ads, Facebook Ads
   - Resultados rápidos`,
    exercise: {
      title: "Identifica el canal correcto",
      description:
        "Si tienes un negocio B2B (empresa a empresa), ¿qué red social sería mejor: Instagram, TikTok o LinkedIn? Explica por qué.",
      placeholder: "Respuesta: \nRazón: ",
      keywords: ["LinkedIn", "profesional", "empresas", "B2B"],
    },
    summary:
      "El marketing digital combina múltiples canales. SEO es largo plazo pero gratis, redes sociales crean comunidad, email tiene alta conversión, y ads dan resultados inmediatos pero cuestan dinero.",
  },
}

export function getLessonContent(lessonId: string): LessonContent | null {
  return lessonContentDatabase[lessonId] || null
}
