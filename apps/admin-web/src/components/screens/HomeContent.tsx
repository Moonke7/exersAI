export default function HomeContent() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 font-sans dark:bg-black selection:bg-blue-500/30">
      {/* Aesthetic grid overlay in the background */}
      <div className="pointer-events-none absolute inset-0 z-0 flex justify-center opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Background glow effects */}
      <div className="absolute left-[20%] top-[10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-300/20 blur-[120px] dark:bg-blue-100/10 pointer-events-none" />
      <div className="absolute right-[20%] bottom-[10%] h-[500px] w-[500px] translate-x-1/2 rounded-full bg-blue-300/20 blur-[120px] dark:bg-blue-900/10 pointer-events-none" />

      <main className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">
        {/* Title */}
        <h1 className="mb-6 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-zinc-200 dark:to-zinc-500 sm:text-7xl">
          ExersAI{" "}
          <span className="bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Admin
          </span>
        </h1>

        {/* Warning Card */}
        <div className="mb-12 w-full max-w-xl overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-b from-amber-50/80 to-amber-100/50 p-6 shadow-sm backdrop-blur-xl dark:border-amber-900/30 dark:from-amber-900/20 dark:to-amber-950/20 transition-all hover:shadow-md text-left">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-inner dark:from-amber-600 dark:to-amber-700">
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="mb-1 text-base font-bold text-amber-950 dark:text-amber-200">
                Información de Entrenamiento
              </h3>
              <p className="text-sm leading-relaxed text-amber-900/80 dark:text-amber-400/90">
                Esta herramienta{" "}
                <strong>no entrena el modelo en tiempo real</strong>. El
                funcionamiento aquí es generar, revisar y aprobar iteraciones
                para construir un dataset de alta calidad para el fine-tuning.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center sm:gap-6">
          {/* Main CTA */}
          <a
            href="/model-input"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-black px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-white dark:text-black w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-3">
              Comenzar Sesión
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-400/0 dark:via-blue-400/20 dark:to-blue-400/0" />
          </a>

          {/* Secondary Link */}
          <a
            href="/dataset"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white px-8 py-4 text-lg font-semibold text-zinc-900 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:bg-zinc-800 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-3">
              Datos guardados
              <svg
                className="h-5 w-5 opacity-70 transition-transform duration-300 group-hover:translate-y-px"
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
            </span>
          </a>
        </div>
      </main>
    </div>
  );
}
