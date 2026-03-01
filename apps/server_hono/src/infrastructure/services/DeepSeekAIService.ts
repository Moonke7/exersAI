// ============================================================
// INFRASTRUCTURE — DeepSeek AI Service Adapter
// ============================================================
// TODO: Este archivo usa fetch nativo para ser compatible con Cloudflare Workers.
// El archivo original en @exersai/shared/services/LLM-models/deepseek.ts
// usa el SDK 'openai' que tiene dependencias de Node.js (node:fs, etc.).
// Si en el futuro se quiere unificar, se debe adaptar deepseek.ts del shared
// para que también use fetch nativo, o habilitarlo con polyfills en Workers.

import type {
  IAIService,
  GeneratedRoutine,
} from "../../domain/services/IAIService.js";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

const TRAINING_SCIENCE_CONTEXT = `
**BASES CIENTÍFICAS DEL ENTRENAMIENTO (LITERATURA ACTUAL):**

1. **Intervalos de Descanso (Rest Intervals):**
   - Individuos Entrenados: Se requieren intervalos de descanso largos (>2 minutos) para maximizar las ganancias de fuerza en individuos con experiencia en entrenamiento de resistencia. Sin embargo, estudios de 8 semanas muestran que descansos de 1 y 3 minutos pueden generar ganancias de fuerza similares en la práctica para ciertos ejercicios.
   - Individuos No Entrenados/Principiantes: Intervalos de descanso cortos a moderados (60 a 120 segundos) son suficientes para maximizar las ganancias de fuerza muscular.
   - Los ejercicios multiarticulares con cargas pesadas requieren mayor descanso fisiológico que los ejercicios de aislamiento.

2. **Selección y Ejecución de Ejercicios:**
   - Los ejercicios multiarticulares con peso libre pueden proporcionar una alternativa de entrenamiento superior para desarrollar características de fuerza-potencia en comparación con las máquinas de aislamiento.
   - Los ejercicios bilaterales ofrecen una mayor plataforma mecánica para mejorar la fuerza y potencia en comparación con los unilaterales, aunque estos últimos son excelentes para fases de preparación.

3. **Volumen, Intensidad y Fallo Muscular:**
   - Múltiples series (multiple sets) parecen producir beneficios de entrenamiento superiores en comparación con series únicas.
   - Entrenar al fallo muscular no es necesario para mejorar la fuerza muscular máxima, y probablemente tampoco lo sea para obtener las ganancias máximas de fuerza. Debe usarse con moderación.
   - Programas que combinan cargas pesadas y ligeras pueden mejorar la fuerza y respaldar otras características de fuerza-potencia.
`;

const workoutJsonSchema = {
  type: "object",
  properties: {
    routine: {
      type: "array",
      description: "Lista plana ordenada con todos los ejercicios de la rutina",
      items: {
        type: "object",
        properties: {
          exercise_id: { type: "number" },
          nombre: { type: "string" },
          orden: { type: "number" },
          series: { type: "number" },
          repeticiones: {
            type: "string",
            description: "Rango de reps (ej: '8-12' o '5')",
          },
          descanso_segundos: { type: "number" },
          notas: { type: "string" },
        },
        required: [
          "exercise_id",
          "nombre",
          "series",
          "repeticiones",
          "descanso_segundos",
        ],
      },
    },
    recomendaciones_generales: { type: "string" },
    nivel_detectado: { type: "string" },
  },
  required: ["routine", "recomendaciones_generales"],
};

/**
 * Limpia datos del ejercicio para enviar al LLM (reducir tokens).
 */
function cleanExerciseData(exercises: any[]): any[] {
  return exercises.map((ex) => ({
    id: ex.id,
    nombre: ex.nombre,
    grupo_principal: ex.grupoPrincipal,
    patron: ex.patron,
    dificultad: ex.dificultad,
    is_highlighted: ex.destacado ?? false,
  }));
}

export class DeepSeekAIService implements IAIService {
  constructor(private readonly apiKey: string) {}

  async generateRoutine(
    candidatos: Record<string, any[]>,
    level: string,
    goal: string,
  ): Promise<GeneratedRoutine> {
    // Preparación de datos mínimos
    const optimizedCandidates = Object.entries(candidatos).reduce(
      (acc, [group, exercises]) => {
        acc[group] = cleanExerciseData(exercises);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    const userPrompt = `
    Crea una rutina para un usuario con las siguientes características:
    - Nivel: ${level}
    - Objetivo principal: ${goal}
    
    **Inventario de Ejercicios Disponibles:**
    ${JSON.stringify(optimizedCandidates)}

    **Instrucciones Estrictas de Selección:**
    1. Genera una ESTRUCTURA PLANA para la rutina combinando todos los grupos musculares provistos.
    2. Selecciona MAXIMO 2 ejercicios por grupo muscular.
    3. NO inventes ejercicios. Usa SOLO los IDs y Nombres del inventario.
    4. Prioriza ejercicios donde 'is_highlighted' sea true si se alinean con la ciencia del entrenamiento.
    5. Ajusta series/reps según el objetivo "${goal}".
    6. Asegúrate de que la rutina tenga un volumen adecuado para el nivel del usuario, es por esto que no puedes seleccionar más de 2 ejercicios por grupo muscular.
    7. NO repitas ejercicios en la rutina y procura variar los patrones de movimiento. Idealmente, cada ejercicio debe hacer un patrón diferente.
    8. Da un orden sugerido que sea lo mas eficiente posible, asignando el número en el campo "orden" incrementando de 1 en adelante. Por ejemplo, los ejercicios compuestos suelen ir al inicio de la rutina.
    
    **Formato de Salida:**
    El JSON de respuesta debe cumplir estrictamente con el siguiente schema:
    ${JSON.stringify(workoutJsonSchema, null, 2)}
    `;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Eres un entrenador personal experto (CSCS certified). Basas todas tus rutinas estrictamente en la siguiente evidencia científica:
            
            ${TRAINING_SCIENCE_CONTEXT}
            
            Aplica estas reglas para decidir los intervalos de descanso (descanso_segundos), series, repeticiones y selección de ejercicios según el nivel y objetivo del usuario.
            IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin markdown, sin bloques de código, sin texto conversacional adicional.`,
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
    }

    const result = (await response.json()) as any;
    const responseText = result.choices?.[0]?.message?.content;

    if (!responseText) {
      throw new Error("No se recibió respuesta de DeepSeek");
    }

    // Intentar parsear directamente
    try {
      return JSON.parse(responseText);
    } catch {
      // Fallback: extraer JSON con regex
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No se pudo extraer JSON de la respuesta de DeepSeek");
      }
      return JSON.parse(jsonMatch[0]);
    }
  }
}
