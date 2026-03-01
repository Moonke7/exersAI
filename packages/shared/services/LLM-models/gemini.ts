import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
} from "@google/generative-ai";
import { cleanExerciseData } from "../helpers/CleanExerciseData.js";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

const genAI = new GoogleGenerativeAI(apiKey);

// 1. DEFINICIÓN DEL SCHEMA (La estructura exacta que quieres)
const workoutSchema: Schema = {
  description:
    "Una rutina de entrenamiento personalizada organizada por grupos musculares",
  type: SchemaType.OBJECT,
  properties: {
    routine: {
      type: SchemaType.ARRAY,
      description: "Lista de grupos musculares entrenados",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          group_name: {
            type: SchemaType.STRING,
            description: "Nombre del grupo muscular (ej: Pecho)",
          },
          exercises: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                exercise_id: { type: SchemaType.NUMBER },
                nombre: { type: SchemaType.STRING },
                series: { type: SchemaType.NUMBER },
                repeticiones: {
                  type: SchemaType.STRING,
                  description: "Rango de reps (ej: '8-12' o '5')",
                },
                descanso_segundos: { type: SchemaType.NUMBER },
                notas: { type: SchemaType.STRING },
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
    recomendaciones_generales: { type: SchemaType.STRING },
    nivel_detectado: { type: SchemaType.STRING },
  },
  required: ["routine", "recomendaciones_generales"],
};

export const generateGeminiRoutine = async (
  candidatos: Record<string, any[]>,
  level: string,
  goal: string,
) => {
  try {
    // 3. SELECCIÓN DE MODELO CORRECTO Y CONFIGURACIÓN JSON
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: workoutSchema,
        temperature: 0.7,
      },
    });

    // 4. PREPARACIÓN DE DATOS MÍNIMOS
    // Convertimos el objeto de candidatos a algo más ligero para el prompt
    const optimizedCandidates = Object.entries(candidatos).reduce(
      (acc, [group, exercises]) => {
        acc[group] = cleanExerciseData(exercises);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    const prompt = `
    Eres un entrenador experto (CSCS certified). Crea una rutina para un usuario:
    - Nivel: ${level}
    - Objetivo: ${goal}

    **Reglas Lógicas de Entrenamiento (Contexto):**
    - Fuerza: 1-6 reps, 3-6 series, descanso largo. Prioriza ejercicios compuestos.
    - Hipertrofia: 6-12 reps, 3-5 series, descanso medio.
    - Resistencia: 12-20+ reps, 2-4 series, descanso corto.
    
    **Inventario de Ejercicios Disponibles:**
    ${JSON.stringify(optimizedCandidates)}

    **Instrucciones Estrictas:**
    1. Genera una estructura para los grupos musculares provistos.
    2. Selecciona entre 3 y 5 ejercicios por grupo muscular.
    3. NO inventes ejercicios. Usa SOLO los IDs y Nombres del inventario.
    4. Ajusta series/reps según el objetivo "${goal}".
    5. Prioriza ejercicios donde 'is_highlighted' sea true.
    `;

    console.log("Prompt:", prompt);

    const result = await model.generateContent(prompt);

    // 5. RESPUESTA DIRECTA (Sin Regex)
    // Al usar responseSchema, el texto devuelto GARANTIZA ser JSON válido.
    const responseText = result.response.text();
    const parsedResponse = JSON.parse(responseText);

    return parsedResponse;
  } catch (error) {
    console.error("Error generating routine:", error);
    throw error;
  }
};
