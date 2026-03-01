import type { APIRoute } from "astro";
import { createSupabaseClient } from "@exersai/shared/db/supabase";
import OpenAI from "openai";
import type { Ejercicio } from "@exersai/shared/services/types/Ejercicio";
import { cleanExerciseData } from "@exersai/shared/services/helpers/cleanExerciseData";
import { TRAINING_SCIENCE_CONTEXT } from "@exersai/shared/services/systemExtraData";
import { normalizeMuscles } from "@exersai/shared/services/functions/normalizeMuscles";
import { workoutJsonSchema } from "../../schemas/workoutJsonSchema";
import { env } from "cloudflare:workers";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { profile, equipment, muscles } = body;

    console.log(profile, equipment, muscles);

    if (!profile || !equipment || !muscles) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const normalizedMuscles = normalizeMuscles(muscles);
    const { name, weight, height, age, gender, goal, nivel } = profile;

    const supabaseUrl = await env.SUPABASE_URL.get();
    const supabaseKey = await env.SUPABASE_KEY.get();
    const deepseekKey = await env.DEEPSEEK_API_KEY.get();

    if (!supabaseUrl || !supabaseKey || !deepseekKey) {
      throw new Error("Missing environment variables.");
    }
    const supabase = createSupabaseClient({ supabaseUrl, supabaseKey });

    const query = supabase
      .from("ejercicios")
      .select("*")
      .overlaps("grupos_musculares", normalizedMuscles);

    const { data: rawCandidates, error } = await query;

    if (error) {
      console.error("Error fetching exercises:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch candidates",
          details: error.message,
        }),
        { status: 500 },
      );
    }

    const filteredCandidates = (rawCandidates || []).filter((ex) => {
      const exEquip = ex.equipamiento_ids;
      if (!exEquip || !Array.isArray(exEquip) || exEquip.length === 0)
        return true;

      return exEquip.some((eId: number) => equipment.includes(eId));
    });

    const groupedCandidates: Record<string, Ejercicio[]> = {};
    filteredCandidates.forEach((ex) => {
      const g = ex.grupo_principal || "Otros";
      if (!groupedCandidates[g]) groupedCandidates[g] = [];
      groupedCandidates[g].push(ex);
    });

    const optimizedCandidates = Object.entries(groupedCandidates).reduce(
      (acc, [group, exercises]) => {
        acc[group] = cleanExerciseData(exercises);
        return acc;
      },
      {} as Record<string, Partial<Ejercicio>[]>,
    );

    const client = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: deepseekKey,
    });

    const level = nivel || "Principiante/Intermedio";

    const systemPromptText = `Eres un entrenador personal experto (CSCS certified). Basas todas tus rutinas estrictamente en la siguiente evidencia científica:
          
          ${TRAINING_SCIENCE_CONTEXT}
          
          Aplica estas reglas para decidir los intervalos de descanso (descanso_segundos), series, repeticiones y selección de ejercicios según el nivel y objetivo del usuario. 
          IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin markdown, sin bloques de código, sin texto conversacional adicional.`;

    const userPromptText = `
    Crea una rutina para un usuario con las siguientes características:
    Perfil: Nombre: ${name}, Edad: ${age}, Altura: ${height}cm, Peso: ${weight}kg, Sexo: ${gender}
    - Nivel Estimado: ${level}
    - Objetivo Principal: ${goal}
    
    **Inventario de Ejercicios Disponibles:**
    ${JSON.stringify(optimizedCandidates)}

    **Instrucciones Estrictas de Selección:**
    1. Genera una estructura ÚNICAMENTE para los grupos musculares provistos.
    2. Selecciona entre 2 y 4 ejercicios por grupo muscular de tu inventario.
    3. NO inventes ejercicios. Usa SOLO los IDs y Nombres del inventario.
    4. Prioriza ejercicios donde 'is_highlighted' sea true si se alinean con la ciencia del entrenamiento.
    5. Ajusta series/reps según el objetivo "${goal}".
    6. Asegúrate de que la rutina tenga un volumen adecuado para el nivel del usuario.
    7. NO repitas ejercicios en la rutina y procura variar los patrones de movimiento. Idealmente, cada ejercicio debe hacer un patrón diferente.
    
    **Formato de Salida:**
    El JSON de respuesta debe cumplir estrictamente con el siguiente schema:
    ${JSON.stringify(workoutJsonSchema, null, 2)}
    `;

    const result = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPromptText },
        { role: "user", content: userPromptText },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const responseText = result.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No se recibió respuesta de DeepSeek");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No se pudo extraer JSON de la respuesta de DeepSeek");
      }
      parsedResponse = JSON.parse(jsonMatch[0]);
    }

    console.log(parsedResponse);

    return new Response(
      JSON.stringify({
        rutina: parsedResponse,
        candidatos: groupedCandidates,
        prompts: {
          systemPrompt: systemPromptText,
          userPrompt: userPromptText,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Routine generation error:", error);
    return new Response(
      JSON.stringify({
        error: "Generation failed",
        details: error.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
