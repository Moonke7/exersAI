const MUSCLE_DB_MAP: Partial<Record<string, string>> = {
  abs: "Abdominales",
  adductors: "Aductores",
  biceps: "Bíceps",
  calves: "Gemelos",
  chest: "Pecho",
  deltoids: "Hombros",
  forearm: "Antebrazos",
  gluteal: "Glúteos",
  hamstring: "Isquios",
  "lower-back": "Espalda Baja",
  obliques: "Core",
  quadriceps: "Cuádriceps",
  trapezius: "Trapecios",
  triceps: "Tríceps",
  "upper-back": "Espalda",
};

export const normalizeMuscles = (slugs: string[]): string[] => {
  const mappedMuscles = slugs
    .map((slug) => MUSCLE_DB_MAP[slug])
    .filter((muscle): muscle is string => muscle !== undefined);

  return Array.from(new Set(mappedMuscles));
};
