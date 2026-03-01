import { useState, useEffect } from "react";

interface Equipment {
  id: number;
  nombre: string;
}

interface Props {
  onClose: () => void;
}

export default function SuggestExerciseModal({ onClose }: Props) {
  const [nombre, setNombre] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [equipamientoDisponible, setEquipamientoDisponible] = useState<
    Equipment[]
  >([]);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<number[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true);

  useEffect(() => {
    async function fetchEquipment() {
      try {
        const response = await fetch("/api/equipamiento");
        if (!response.ok) throw new Error("Failed to fetch equipment");
        const json = await response.json();
        setEquipamientoDisponible(json.equipamiento || []);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setIsLoadingEquipment(false);
      }
    }
    fetchEquipment();
  }, []);

  const toggleEquipment = (id: number) => {
    setSelectedEquipmentIds((prev) =>
      prev.includes(id) ? prev.filter((eqId) => eqId !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sugerencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "ejercicio",
          nombre,
          imageUrl: imageUrl || null,
          idsAsociados:
            selectedEquipmentIds.length > 0 ? selectedEquipmentIds : null,
        }),
      });

      if (!res.ok) throw new Error("Error submitting suggestion");

      alert("¡Sugerencia de ejercicio enviada con éxito!");
      onClose();
    } catch (e) {
      console.error(e);
      alert("Hubo un error al enviar la sugerencia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Sugerir Nuevo Ejercicio
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Sugiere un ejercicio indicando el músculo y su nombre.
          </p>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form
            id="suggest-exercise-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Nombre del Ejercicio *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Pecho - Press de Banca Inclinado"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Formato sugerido: [Músculo principal] - [Nombre del ejercicio]
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                URL de la Imagen (opcional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/ejercicio.gif"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Equipamiento Asociado (opcional)
              </label>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/20 p-4 max-h-48 overflow-y-auto custom-scrollbar">
                {isLoadingEquipment ? (
                  <div className="text-sm text-center py-4 text-zinc-500">
                    Cargando equipamiento...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {equipamientoDisponible.map((eq) => (
                      <label
                        key={eq.id}
                        className={`flex items-start gap-2 rounded-lg p-2 border cursor-pointer transition-colors ${
                          selectedEquipmentIds.includes(eq.id)
                            ? "border-blue-500 bg-blue-50 dark:border-blue-500/50 dark:bg-blue-900/20"
                            : "border-transparent bg-white hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <div className="flex h-5 items-center">
                          <input
                            type="checkbox"
                            checked={selectedEquipmentIds.includes(eq.id)}
                            onChange={() => toggleEquipment(eq.id)}
                            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                          />
                        </div>
                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-tight">
                          {eq.nombre}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="suggest-exercise-form"
            disabled={isSubmitting || !nombre.trim()}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Enviando..." : "Enviar Sugerencia"}
          </button>
        </div>
      </div>
    </div>
  );
}
