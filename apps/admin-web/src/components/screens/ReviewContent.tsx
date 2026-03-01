import { useEffect, useState } from "react";
import type { EjercicioMinimal } from "@exersai/shared/services/types/Ejercicio";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTestSession } from "../../hooks/useTestSession";
import Header from "../Header";
import SuggestExerciseModal from "../SuggestExerciseModal";

// --- Types ---
interface RoutineExercise {
  id: string; // unique ID for the sortable item
  exercise_id: number;
  nombre: string;
  orden: number;
  series: number;
  repeticiones: string;
  descanso_segundos: number;
  notas?: string;
}

interface GeneratedData {
  rutina: {
    routine: RoutineExercise[];
    recomendaciones_generales?: string;
  };
  candidatos: Record<string, EjercicioMinimal[]>;
  prompts: { systemPrompt: string; userPrompt: string };
  profile: Record<string, unknown> & { nivel?: string; goal?: string };
}

// --- Sortable Component ---
function SortableExerciseCard({
  exercise,
  onRemove,
  onUpdate,
}: {
  exercise: RoutineExercise;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: string | number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: exercise.id,
    data: { type: "routine-exercise", exercise },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col rounded-xl border bg-white p-3 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900/80 ${
        isDragging ? "z-50 ring-2 ring-blue-500" : "border-zinc-200"
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </div>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {exercise.orden}
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {exercise.nombre}
          </span>
        </div>
        <button
          onClick={() => onRemove(exercise.id)}
          className="rounded p-1 text-zinc-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/20"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="mt-2 pl-9 grid grid-cols-3 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
        <label className="flex items-center gap-1.5 focus-within:text-blue-600 dark:focus-within:text-blue-400">
          <span className="font-medium text-zinc-800 dark:text-zinc-300">
            Series:
          </span>
          <input
            type="number"
            min="1"
            max="10"
            className="w-12 rounded border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-center focus:border-blue-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-blue-500 dark:focus:bg-zinc-900"
            value={exercise.series}
            onChange={(e) =>
              onUpdate(exercise.id, "series", Number(e.target.value))
            }
          />
        </label>
        <label className="flex items-center gap-1.5 focus-within:text-blue-600 dark:focus-within:text-blue-400">
          <span className="font-medium text-zinc-800 dark:text-zinc-300">
            Reps:
          </span>
          <input
            type="text"
            className="w-16 rounded border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-center focus:border-blue-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-blue-500 dark:focus:bg-zinc-900"
            value={exercise.repeticiones}
            onChange={(e) =>
              onUpdate(exercise.id, "repeticiones", e.target.value)
            }
          />
        </label>
        <label className="flex items-center gap-1.5 focus-within:text-blue-600 dark:focus-within:text-blue-400">
          <span className="font-medium text-zinc-800 dark:text-zinc-300">
            Desc:
          </span>
          <div className="flex items-center">
            <input
              type="number"
              min="0"
              step="5"
              className="w-12 rounded-l border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-center focus:border-blue-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-blue-500 dark:focus:bg-zinc-900"
              value={exercise.descanso_segundos}
              onChange={(e) =>
                onUpdate(
                  exercise.id,
                  "descanso_segundos",
                  Number(e.target.value),
                )
              }
            />
            <span className="rounded-r border border-l-0 border-zinc-200 bg-zinc-100 px-1 py-0.5 dark:border-zinc-700 dark:bg-zinc-800">
              s
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function ReviewContent() {
  const [data, setData] = useState<GeneratedData | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeExercise, setActiveExercise] = useState<RoutineExercise | null>(
    null,
  );
  const [hasSaved, setHasSaved] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSuggestExerciseOpen, setIsSuggestExerciseOpen] = useState(false);
  const { activeProfile, state } = useTestSession();

  // Flat list state for the draggable routine
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>(
    [],
  );

  useEffect(() => {
    // Load data from localStorage
    const saved = localStorage.getItem("exersai_generated_routine");
    if (!saved) {
      alert(
        "No hay rutina para revisar. Ve a la vista de seleccionar parámetros primero.",
      );
      window.location.href = "/model-input";
      return;
    }

    try {
      const parsed = JSON.parse(saved) as GeneratedData;
      setData(parsed);

      console.log(parsed);

      // The new schema returns a flat routine, no groups needed.
      // We assign a unique stable ID to each for the DnD and sort by order
      const initialExercises = parsed.rutina.routine
        .map((ex) => ({
          ...ex,
          id: `ex-${ex.exercise_id}-${crypto.randomUUID()}`,
        }))
        .sort((a, b) => a.orden - b.orden);

      setRoutineExercises(initialExercises);
    } catch (e) {
      console.error(e);
      window.location.href = "/model-input";
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-zinc-500 animate-pulse">Cargando revisión...</div>
      </div>
    );
  }

  // Helpers
  const isExerciseInRoutine = (exId: number) => {
    return routineExercises.some((ex) => ex.exercise_id === exId);
  };

  const handleAddFromLibrary = (exercise: EjercicioMinimal) => {
    setRoutineExercises((prev) => {
      const highestOrder =
        prev.length > 0 ? Math.max(...prev.map((e) => e.orden)) : 0;

      const newEx: RoutineExercise = {
        id: `lib-${exercise.id}-${crypto.randomUUID()}`,
        exercise_id: exercise.id as number,
        nombre: exercise.nombre,
        orden: highestOrder + 1,
        series: 3,
        repeticiones: "10-12",
        descanso_segundos: 60,
      };

      return [...prev, newEx];
    });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setRoutineExercises((prev) => {
      const filtered = prev.filter((ex) => ex.id !== exerciseId);
      // Re-assign order securely after removal
      return filtered.map((ex, idx) => ({ ...ex, orden: idx + 1 }));
    });
  };

  const handleUpdateExercise = (
    exerciseId: string,
    field: string,
    value: string | number,
  ) => {
    setRoutineExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, [field]: value } : ex)),
    );
  };

  // DnD Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveExercise(active.data.current?.exercise || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveExercise(null);

    if (!over) return;
    if (active.id === over.id) return;

    setRoutineExercises((prev) => {
      const oldIndex = prev.findIndex((e) => e.id === active.id);
      const newIndex = prev.findIndex((e) => e.id === over.id);

      const reordered = arrayMove(prev, oldIndex, newIndex);
      // Re-assign order securely
      return reordered.map((ex, idx) => ({ ...ex, orden: idx + 1 }));
    });
  };

  const handleConfirm = async () => {
    if (routineExercises.length === 0) {
      alert("No puedes guardar una rutina vacía.");
      return;
    }

    const finalRoutine = {
      ...data.rutina,
      routine: routineExercises.map((ex) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = ex;
        return rest;
      }), // remove internal ID keeping 'orden'
    };

    const payload = {
      systemPrompt: data.prompts.systemPrompt,
      userPrompt: data.prompts.userPrompt,
      respuestaOriginal: data.rutina, // Crudo IA
      respuestaCorregida: finalRoutine, // Corregido Humano
      nivelUsuario: activeProfile?.nivel || "Principiante",
      objetivo: activeProfile?.goal || "Objetivo no definido",
      estado: "aprobado",
    };

    setIsSaving(true);
    try {
      const response = await fetch("/api/rutina/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save final ticker");
      }

      alert(
        "Ticket de rutina validado y guardado correctamente en la DB para fine-tuning.",
      );
      setHasSaved(true);
    } catch (e) {
      console.error(e);
      alert("Hubo un error al guardar la validación en la DB.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!activeProfile) {
      alert("No se encontró perfil activo para regenerar la rutina.");
      return;
    }

    const payload = {
      profile: activeProfile,
      equipment: state.selectedEquipmentIds,
      muscles: state.selectedMuscles,
    };

    setIsRegenerating(true);
    try {
      const res = await fetch("/api/rutina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to regenerate routine");
      }

      const newData = await res.json();
      localStorage.setItem(
        "exersai_generated_routine",
        JSON.stringify(newData),
      );
      window.location.reload(); // Quick refresh to re-init states
    } catch (e) {
      console.error(e);
      alert("Hubo un error al generar la nueva rutina. Revisa la consola.");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-black font-sans overflow-hidden">
      <Header />

      <main className="flex flex-1 overflow-hidden p-6 max-w-[1600px] w-full mx-auto gap-6">
        {/* Left Library */}
        <div className="flex w-1/3 flex-col rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="border-b border-zinc-200 p-4 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold dark:text-white">
                📓 Biblioteca de Ejercicios
              </h2>
              <button
                onClick={() => setIsSuggestExerciseOpen(true)}
                className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                title="Sugerir ejercicio que no esté en la lista"
              >
                + Faltan Ejercicios
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Candidatos sugeridos agrupados por músculo objetivo. (Clickea
              &quot;+&quot; para añadir)
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {Object.entries(data.candidatos).map(([group, exercises]) => (
              <div key={group} className="mb-6 last:mb-0">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {group}
                </h3>
                <div className="space-y-2">
                  {exercises.map((ex) => {
                    const inRoutine = isExerciseInRoutine(ex.id as number);
                    return (
                      <div
                        key={ex.id}
                        className={`group flex items-center justify-between rounded-lg border p-3 text-sm transition-colors ${
                          inRoutine
                            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10"
                            : "border-zinc-200 bg-white hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {inRoutine ? (
                            <svg
                              className="h-4 w-4 text-emerald-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-zinc-300 dark:border-zinc-600" />
                          )}
                          <span
                            className={`font-medium ${
                              inRoutine
                                ? "text-emerald-900 dark:text-emerald-400"
                                : "text-zinc-700 dark:text-zinc-200"
                            }`}
                          >
                            {ex.nombre}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAddFromLibrary(ex)}
                          className="rounded-full p-1 text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-100 hover:text-zinc-900 group-hover:opacity-100 dark:hover:bg-zinc-800 dark:hover:text-white"
                          title="Añadir a la rutina"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sortable Routine */}
        <div className="flex flex-1 flex-col rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm overflow-hidden flex-shrink min-w-0">
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800 bg-blue-50/50 dark:bg-blue-900/10">
            <div>
              <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                ✨ Rutina Generada
              </h2>
              <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-1">
                Arrastra y suelta para reordenar ejercicios. Edita series, reps
                o descansos.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRegenerate}
                disabled={isSaving || isRegenerating}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:focus:ring-offset-black disabled:opacity-50 flex items-center gap-2"
              >
                {isRegenerating ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="2"
                        className="opacity-25"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Generando...
                  </>
                ) : (
                  "Generar otra rutina"
                )}
              </button>

              <button
                onClick={handleConfirm}
                disabled={isSaving || hasSaved || isRegenerating}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black disabled:opacity-50 disabled:bg-zinc-400 dark:disabled:bg-zinc-600"
              >
                {isSaving
                  ? "Guardando..."
                  : hasSaved
                  ? "Ticket Guardado ✓"
                  : "Validar y Guardar Ticket"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-black/20 custom-scrollbar">
            {data.rutina.recomendaciones_generales && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-200">
                <span className="font-semibold block mb-1">
                  Recomendaciones:
                </span>
                {data.rutina.recomendaciones_generales}
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-6">
                <SortableContext
                  id="routine-list"
                  items={routineExercises.map((e) => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[50px] p-2">
                    {routineExercises.length === 0 && (
                      <div className="flex items-center justify-center p-4 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-500">
                        Arrastra ejercicios aquí
                      </div>
                    )}
                    {routineExercises.map((ex) => (
                      <SortableExerciseCard
                        key={ex.id}
                        exercise={ex}
                        onRemove={(id) => handleRemoveExercise(id)}
                        onUpdate={handleUpdateExercise}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>

              {/* Drag overlay to show element while dragging */}
              <DragOverlay>
                {activeId && activeExercise ? (
                  <div className="rounded-xl border-2 border-blue-500 bg-white p-3 shadow-xl dark:bg-zinc-900 opacity-90 scale-105">
                    <div className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                        {activeExercise.orden}
                      </div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {activeExercise.nombre}
                      </span>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </main>

      {isSuggestExerciseOpen && (
        <SuggestExerciseModal onClose={() => setIsSuggestExerciseOpen(false)} />
      )}
    </div>
  );
}
