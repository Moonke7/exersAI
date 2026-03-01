"use client";

import { useState, useEffect } from "react";
import type { UserProfile } from "../hooks/useTestSession";

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Omit<UserProfile, "id">) => void;
  initialData?: UserProfile | null;
}

export default function CreateProfileModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CreateProfileModalProps) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"Masculino" | "Femenino" | "Otro">(
    "Masculino",
  );
  const [goal, setGoal] = useState<string>("");
  const [nivel, setNivel] = useState<
    "Principiante" | "Intermedio" | "Avanzado"
  >("Principiante");

  // Sync initialData if provided (Edit Mode)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setWeight(initialData.weight.toString());
        setHeight(initialData.height.toString());
        setAge(initialData.age.toString());
        setGender(initialData.gender);
        setGoal(initialData.goal);
        setNivel(initialData.nivel);
      } else {
        // Reset form for Create Mode
        setName("");
        setWeight("");
        setHeight("");
        setAge("");
        setGender("Masculino");
        setGoal("");
        setNivel("Principiante");
      }
    }
  }, [isOpen, initialData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
      gender,
      goal,
      nivel,
    });
    // Reset form
    setName("");
    setWeight("");
    setHeight("");
    setAge("");
    setGender("Masculino");
    setGoal("");
    setNivel("Principiante");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <h2 className="mb-4 text-xl font-bold dark:text-white">
          {initialData ? "Editar Perfil" : "Crear Nuevo Perfil"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nombre del caso
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-black dark:text-white focus:dark:border-blue-500"
              placeholder="Ej: Hombre Joven Principiante"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Peso (kg)
              </label>
              <input
                type="number"
                required
                min="30"
                max="300"
                placeholder="Ej: 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-black dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Altura (cm)
              </label>
              <input
                type="number"
                required
                min="100"
                max="250"
                placeholder="Ej: 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-black dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Edad
              </label>
              <input
                type="number"
                required
                min="10"
                placeholder="Ej: 25"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-black dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Objetivo
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Bajar peso"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-black dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Sexo
              </label>
              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value as "Masculino" | "Femenino" | "Otro")
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-black dark:text-white"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nivel
              </label>
              <select
                value={nivel}
                onChange={(e) =>
                  setNivel(
                    e.target.value as
                      | "Principiante"
                      | "Intermedio"
                      | "Avanzado",
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-black dark:text-white"
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
            >
              {initialData ? "Guardar Cambios" : "Guardar Perfil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
