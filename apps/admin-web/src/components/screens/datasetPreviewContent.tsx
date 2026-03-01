import { useEffect, useState } from "react";
import Header from "../Header";

type Tab = "dataset" | "ejercicios" | "equipamiento";

interface DatasetEntry {
  id: number;
  systemPrompt: string;
  userPrompt: string;
  respuestaOriginal: string;
  respuestaCorregida: string | null;
  nivelUsuario: string | null;
  objetivo: string | null;
  estado: "pendiente" | "aprobado" | "rechazado";
  notasRevision: string | null;
  createdAt: string;
}

interface SugerenciaEntry {
  id: number;
  tipo: "ejercicio" | "equipamiento";
  nombre: string;
  imageUrl: string | null;
  idsAsociados: number[] | null;
  createdAt: string;
}

export default function DatasetPreviewContent() {
  const [activeTab, setActiveTab] = useState<Tab>("dataset");
  const [datasetEntries, setDatasetEntries] = useState<DatasetEntry[]>([]);
  const [sugerencias, setSugerencias] = useState<SugerenciaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCardIds, setExpandedCardIds] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [datasetRes, sugerenciasRes] = await Promise.all([
          fetch("/api/dataset"),
          fetch("/api/sugerencias"),
        ]);

        if (datasetRes.ok) {
          const json = await datasetRes.json();
          setDatasetEntries(json.dataset || []);
        }

        if (sugerenciasRes.ok) {
          const json = await sugerenciasRes.json();
          setSugerencias(json.sugerencias || []);
        }
      } catch (error) {
        console.error("Error fetching preview data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedCardIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "rechazado":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
    }
  };

  const formatJson = (text: string | null) => {
    if (!text) return "";
    try {
      const parsed = JSON.parse(text);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return text;
    }
  };

  const renderFormattedPrompt = (text: string | null) => {
    if (!text) return null;

    try {
      // Intenta parsear si por casualidad es JSON puro
      const parsed = JSON.parse(text);
      return (
        <pre className="bg-zinc-200 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-md overflow-x-auto text-xs font-mono">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      // Como el texto es mixto, intentamos encontrar los bloques estáticos del Prompt de Generar Rutina
      const invMarker = "**Inventario de Ejercicios Disponibles:**";
      const instMarker = "**Instrucciones Estrictas de Selección:**";
      const schemaMarker = "siguiente schema:";

      if (
        text.includes(invMarker) &&
        text.includes(instMarker) &&
        text.includes(schemaMarker)
      ) {
        const p1 = text.indexOf(invMarker) + invMarker.length;
        const p2 = text.indexOf(instMarker);
        const p3 = text.indexOf(schemaMarker) + schemaMarker.length;

        const part1 = text.substring(0, p1);
        const json1 = text.substring(p1, p2).trim();
        const part2 = text.substring(p2, p3);
        const json2 = text.substring(p3).trim();

        return (
          <div className="flex flex-col gap-3 font-sans text-sm">
            <p className="whitespace-pre-wrap">{part1.trim()}</p>
            <pre className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-md overflow-x-auto text-xs font-mono">
              {formatJson(json1) || json1}
            </pre>
            <p className="whitespace-pre-wrap">{part2.trim()}</p>
            <pre className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-md overflow-x-auto text-xs font-mono">
              {formatJson(json2) || json2}
            </pre>
          </div>
        );
      }

      // Si no hace match a este schema, devolvemos el texto plano pero respetando saltos
      return <span className="whitespace-pre-wrap">{text}</span>;
    }
  };

  const renderDataset = () => {
    if (datasetEntries.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            No hay datos en el dataset de entrenamiento todavía.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {datasetEntries.map((entry) => {
          const isExpanded = expandedCardIds.has(entry.id);
          return (
            <div
              key={entry.id}
              className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                onClick={() => toggleExpand(entry.id)}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded border ${getStatusColor(
                      entry.estado,
                    )} uppercase`}
                  >
                    {entry.estado}
                  </span>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                      Entrenamiento #{entry.id}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {entry.nivelUsuario || "Nivel desconocido"} •{" "}
                      {entry.objetivo || "Objetivo desconocido"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-zinc-400">
                  <span className="text-xs">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-zinc-200 p-4 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Respuesta Original (DeepSeek)
                      </h4>
                      <pre className="text-xs bg-zinc-100 dark:bg-zinc-950 p-3 rounded-lg overflow-x-auto border border-zinc-200 dark:border-zinc-800 max-h-64 whitespace-pre-wrap font-mono">
                        {formatJson(entry.respuestaOriginal)}
                      </pre>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Respuesta Corregida
                      </h4>
                      {entry.respuestaCorregida ? (
                        <pre className="text-xs bg-green-50 dark:bg-green-900/10 text-green-900 dark:text-green-100 p-3 rounded-lg overflow-x-auto border border-green-200 dark:border-green-900/30 max-h-64 whitespace-pre-wrap font-mono">
                          {formatJson(entry.respuestaCorregida)}
                        </pre>
                      ) : (
                        <div className="text-xs bg-zinc-100 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 italic flex h-full items-center justify-center min-h-[4rem]">
                          Sin correcciones (Respuesta original aceptada)
                        </div>
                      )}
                    </div>

                    <div className="col-span-1 lg:col-span-2 flex flex-col gap-2 mt-2">
                      <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Prompt del Usuario
                      </h4>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        {renderFormattedPrompt(entry.userPrompt)}
                      </div>
                    </div>

                    {entry.notasRevision && (
                      <div className="col-span-1 lg:col-span-2 flex flex-col gap-2 mt-2">
                        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                          Notas de Revisión
                        </h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30">
                          {entry.notasRevision}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSugerencias = (tipo: "ejercicio" | "equipamiento") => {
    const list = sugerencias.filter((s) => s.tipo === tipo);

    if (list.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            No hay sugerencias de {tipo} por ahora.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((sug) => {
          const isExpanded = expandedCardIds.has(sug.id);
          return (
            <div
              key={sug.id}
              className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden flex flex-col"
            >
              {sug.imageUrl && (
                <div className="w-full h-40 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 relative">
                  <img
                    src={sug.imageUrl}
                    alt={sug.nombre}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-2">
                    {sug.nombre}
                  </h3>
                  <span className="text-xs text-zinc-400 shrink-0 ml-2">
                    {new Date(sug.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {sug.idsAsociados && sug.idsAsociados.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => toggleExpand(sug.id)}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Ver IDs de Equipamiento Asociados (
                      {sug.idsAsociados.length})
                      <svg
                        className={`w-3 h-3 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {sug.idsAsociados.map((id) => (
                          <span
                            key={id}
                            className="inline-flex px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 text-xs border border-zinc-200 dark:border-zinc-700"
                          >
                            ID: {id}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-4 flex gap-2">
                  <button className="flex-1 py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white rounded text-sm font-medium transition-colors">
                    Aprobar en BD
                  </button>
                  <button className="py-1.5 px-3 border border-zinc-200 hover:bg-red-50 text-red-600 dark:border-zinc-700 dark:hover:bg-red-900/20 dark:text-red-400 rounded text-sm font-medium transition-colors">
                    Descartar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
      <Header />
      <div className="flex flex-1 max-w-7xl mx-auto w-full p-6 gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-64 shrink-0 flex flex-col gap-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3 px-3">
            Explorador de Datos
          </h2>

          <button
            onClick={() => setActiveTab("dataset")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "dataset"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
            }`}
          >
            <svg
              className="w-5 h-5 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
            Dataset Entrenamiento
          </button>

          <button
            onClick={() => setActiveTab("equipamiento")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "equipamiento"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
            }`}
          >
            <svg
              className="w-5 h-5 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Sugerencias Equipamiento
          </button>

          <button
            onClick={() => setActiveTab("ejercicios")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "ejercicios"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
            }`}
          >
            <svg
              className="w-5 h-5 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Sugerencias Ejercicios
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {activeTab === "dataset" && "Dataset Entrenamiento IA"}
                {activeTab === "equipamiento" && "Sugerencias de Equipamiento"}
                {activeTab === "ejercicios" && "Sugerencias de Ejercicios"}
              </h1>
              <p className="text-sm text-zinc-500 mt-1 dark:text-zinc-400">
                {activeTab === "dataset" &&
                  "Historial de rutinas generadas y supervisadas enviadas para fine-tuning."}
                {activeTab === "equipamiento" &&
                  "Equipamiento sugerido por los usuarios para agregar al catálogo."}
                {activeTab === "ejercicios" &&
                  "Ejercicios sugeridos por los usuarios para agregar a la base de datos."}
              </p>
            </div>
          </header>

          {loading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === "dataset" && renderDataset()}
              {activeTab === "equipamiento" &&
                renderSugerencias("equipamiento")}
              {activeTab === "ejercicios" && renderSugerencias("ejercicio")}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
