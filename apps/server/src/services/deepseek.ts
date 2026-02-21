import OpenAI from "openai";
import dotenv from "dotenv";
import { TRAINING_SCIENCE_CONTEXT } from "./systemExtraData.js";
import { cleanExerciseData } from "./helpers/cleanExerciseData.js";

dotenv.config();

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) throw new Error("Missing DEEPSEEK_API_KEY");

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey,
});

// JSON Schema para la respuesta (se inyecta en el prompt)
const workoutJsonSchema = {
  type: "object",
  properties: {
    routine: {
      type: "array",
      description: "Lista de grupos musculares entrenados",
      items: {
        type: "object",
        properties: {
          group_name: {
            type: "string",
            description: "Nombre del grupo muscular (ej: Pecho)",
          },
          exercises: {
            type: "array",
            items: {
              type: "object",
              properties: {
                exercise_id: { type: "number" },
                nombre: { type: "string" },
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
        },
        required: ["group_name", "exercises"],
      },
    },
    recomendaciones_generales: { type: "string" },
    nivel_detectado: { type: "string" },
  },
  required: ["routine", "recomendaciones_generales"],
};

export const generateRoutine = async (
  candidatos: Record<string, any[]>,
  level: string,
  goal: string,
) => {
  try {
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
    1. Genera una estructura ÚNICAMENTE para los grupos musculares provistos.
    2. Selecciona MAXIMO 2 ejercicios por grupo muscular.
    3. NO inventes ejercicios. Usa SOLO los IDs y Nombres del inventario.
    4. Prioriza ejercicios donde 'is_highlighted' sea true si se alinean con la ciencia del entrenamiento.
    5. Ajusta series/reps según el objetivo "${goal}".
    6. Asegúrate de que la rutina tenga un volumen adecuado para el nivel del usuario, es por esto que no puedes seleccionar más de 2 ejercicios por grupo muscular.
    7. NO repitas ejercicios en la rutina y procura variar los patrones de movimiento. Idealmente, cada ejercicio debe hacer un patrón diferente.
    
    **Formato de Salida:**
    El JSON de respuesta debe cumplir estrictamente con el siguiente schema:
    ${JSON.stringify(workoutJsonSchema, null, 2)}
    `;

    const result = await client.chat.completions.create({
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
    });

    const responseText = result.choices[0]?.message?.content;
    console.log("Response (DeepSeek):", responseText);
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
  } catch (error) {
    console.error("Error generating routine with DeepSeek:", error);
    throw error;
  }
};
