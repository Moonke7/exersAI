import { useEffect, useState } from "react";
import Model from "@mjcdev/react-body-highlighter";
import { useTestSession } from "../../hooks/useTestSession";
import Header from "../Header";
import SuggestEquipmentModal from "../SuggestEquipmentModal";

interface Equipment {
  id: number;
  nombre: string;
  imagen_url: string | null;
  grupos_musculares: string[];
  es_peso_corporal: boolean;
}

export default function ModelInputContent() {
  const { state, isLoaded, toggleEquipment, setMuscles, activeProfile } =
    useTestSession();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelSide, setModelSide] = useState<"front" | "back">("front");
  const [isSuggestEquipmentOpen, setIsSuggestEquipmentOpen] = useState(false);

  console.log("activeProfile", activeProfile);
  console.log("state", state);

  useEffect(() => {
    async function fetchEquipment() {
      try {
        const response = await fetch("/api/equipamiento");
        if (!response.ok) throw new Error("Failed to fetch equipment");
        const json = await response.json();
        setEquipmentList(json.equipamiento || []);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setIsLoadingEquipment(false);
      }
    }
    fetchEquipment();
  }, []);

  if (!isLoaded) return null;

  const handleMuscleClick = (bodyPart: { slug?: string }) => {
    const clickedMuscle = bodyPart.slug;

    if (!clickedMuscle) return;

    if (state.selectedMuscles.includes(clickedMuscle)) {
      setMuscles(state.selectedMuscles.filter((m) => m !== clickedMuscle));
    } else {
      setMuscles([...state.selectedMuscles, clickedMuscle]);
    }
  };

  const handleGenerateRoutine = async () => {
    if (!activeProfile) {
      alert("Por favor, selecciona o crea un perfil primero.");
      return;
    }

    const payload = {
      profile: activeProfile,
      equipment: state.selectedEquipmentIds,
      muscles: state.selectedMuscles,
    };

    setIsGenerating(true);
    try {
      const res = await fetch("/api/rutina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to generate routine");
      }

      const data = await res.json();

      localStorage.setItem("exersai_generated_routine", JSON.stringify(data));

      window.location.href = "/review";
    } catch (error) {
      console.error("Error generating routine:", error);
      alert("Hubo un error al generar la rutina. Revisa la consola.");
    } finally {
      setIsGenerating(false);
    }
  };

  const dataForModel = state.selectedMuscles.map((muscle) => ({
    slug: muscle,
    intensity: 1,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
      <Header />

      <main className="flex flex-1 flex-col p-6 max-w-7xl mx-auto w-full gap-6">
        <div className="flex flex-1 gap-6 min-h-0">
          <div className="w-1/2 relative">
            <div className="absolute inset-0 flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-xl font-bold dark:text-white">
                  1. Equipamiento Disponible
                </h2>
                <button
                  onClick={() => setIsSuggestEquipmentOpen(true)}
                  className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                >
                  + Faltan equipos
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                {isLoadingEquipment ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Cargando equipamiento...
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {equipmentList.map((item) => {
                      const isSelected = state.selectedEquipmentIds.includes(
                        item.id,
                      );
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleEquipment(item.id)}
                          className={`flex flex-col items-start rounded-xl border overflow-hidden text-left transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50"
                          }`}
                        >
                          {item.imagen_url ? (
                            <div className="w-full h-28 relative bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                              <img
                                src={item.imagen_url}
                                alt={item.nombre}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-28 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 text-xs border-b border-zinc-200 dark:border-zinc-800">
                              Sin imagen
                            </div>
                          )}
                          <div className="p-4 w-full flex flex-col gap-2">
                            <div className="flex w-full items-center justify-between">
                              <span
                                className={`font-medium ${
                                  isSelected
                                    ? "text-blue-700 dark:text-blue-400"
                                    : "text-zinc-900 dark:text-zinc-200"
                                }`}
                              >
                                {item.nombre}
                              </span>
                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded border shrink-0 ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-500 text-white"
                                    : "border-zinc-300 dark:border-zinc-600"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                            {item.grupos_musculares && (
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate w-full">
                                {Array.isArray(item.grupos_musculares) &&
                                  item.grupos_musculares.join(", ")}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-1/2 flex-col rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm relative">
            <div className="absolute top-6 left-6 z-10 flex w-[calc(100%-3rem)] justify-between items-start">
              <div>
                <h2 className="text-xl font-bold dark:text-white">
                  2. Músculos a Entrenar
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Seleccionados: {state.selectedMuscles.length}
                </p>
              </div>
              <button
                onClick={() =>
                  setModelSide((prev) => (prev === "front" ? "back" : "front"))
                }
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
              >
                Girar ({modelSide === "front" ? "Frente" : "Espalda"})
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center pt-16">
              <div className="w-full flex items-center justify-center">
                <Model
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data={dataForModel as any}
                  onBodyPartClick={handleMuscleClick}
                  scale={1.5}
                  side={modelSide}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 min-h-[40px]">
              {state.selectedMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {muscle}
                  <button
                    onClick={() =>
                      setMuscles(
                        state.selectedMuscles.filter((m) => m !== muscle),
                      )
                    }
                    className="ml-1.5 hover:text-red-500 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              ¿Listo para probar el modelo?
            </h3>
            <p className="text-sm text-blue-700/80 dark:text-blue-300">
              Asegúrate de que tus datos de perfil, equipamiento y músculos
              estén correctos.
            </p>
          </div>

          <button
            onClick={handleGenerateRoutine}
            disabled={
              !activeProfile ||
              state.selectedMuscles.length === 0 ||
              isGenerating
            }
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-black"
          >
            {isGenerating ? "Generando..." : "Generar Rutina AI"}
          </button>
        </div>
      </main>

      {isSuggestEquipmentOpen && (
        <SuggestEquipmentModal
          onClose={() => setIsSuggestEquipmentOpen(false)}
        />
      )}
    </div>
  );
}
