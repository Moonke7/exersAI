export const workoutJsonSchema = {
  type: "object",
  properties: {
    routine: {
      type: "array",
      description:
        "Lista de ejercicios de la rutina, usando el orden sugerido por el modelo",
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
          "orden",
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
