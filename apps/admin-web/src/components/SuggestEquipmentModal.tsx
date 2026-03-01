import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function SuggestEquipmentModal({ onClose }: Props) {
  const [nombre, setNombre] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sugerencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "equipamiento",
          nombre,
          imageUrl: imageUrl || null,
        }),
      });

      if (!res.ok) throw new Error("Error submitting suggestion");

      alert("¡Sugerencia de equipamiento enviada con éxito!");
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Sugerir Nuevo Equipamiento
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Ingresa el nombre y opcionalmente una URL de imagen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nombre del Equipamiento *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Máquina Smith"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              URL de la Imagen (opcional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.png"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white mb-3"
            />

            {/* Image Preview */}
            {imageUrl && (
              <div className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col items-center">
                <span className="text-xs text-zinc-500 mb-2">
                  Vista Previa:
                </span>
                <img
                  src={imageUrl}
                  alt="Vista previa"
                  className="max-h-40 object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (
                      e.target as HTMLImageElement
                    ).nextElementSibling?.classList.remove("hidden");
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.display = "block";
                    (
                      e.target as HTMLImageElement
                    ).nextElementSibling?.classList.add("hidden");
                  }}
                />
                <div className="hidden text-sm text-red-500 text-center py-4">
                  No se pudo cargar la imagen. Verifica que la URL sea válida.
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !nombre.trim()}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Enviando..." : "Enviar Sugerencia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
