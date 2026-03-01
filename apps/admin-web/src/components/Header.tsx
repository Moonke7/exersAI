"use client";

import { useState } from "react";
import { useTestSession } from "../hooks/useTestSession";
import CreateProfileModal from "./CreateProfileModal";

export default function Header() {
  const {
    state,
    isLoaded,
    activeProfile,
    addProfile,
    updateProfile,
    setActiveProfile,
  } = useTestSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfileMode, setEditingProfileMode] = useState(false);

  if (!isLoaded) {
    return (
      <header className="flex h-16 items-center border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-black">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </header>
    );
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-black">
        <div className="flex items-center gap-4">
          <h1
            className="cursor-pointer text-xl font-bold dark:text-white"
            onClick={() => (window.location.href = "/")}
          >
            Admin Test Session
          </h1>
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

          <div className="flex items-center gap-3">
            <select
              value={state.activeProfileId || ""}
              onChange={(e) => setActiveProfile(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-black dark:text-white"
            >
              <option value="" disabled>
                Seleccionar Perfil
              </option>
              {state.profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setEditingProfileMode(false);
                setIsModalOpen(true);
              }}
              className="rounded-lg bg-black px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Crear Perfil
            </button>
            {activeProfile && (
              <button
                onClick={() => {
                  setEditingProfileMode(true);
                  setIsModalOpen(true);
                }}
                className="rounded-lg border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        {activeProfile && (
          <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                Peso:
              </span>
              {activeProfile.weight}kg
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                Altura:
              </span>
              {activeProfile.height}cm
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                Edad:
              </span>
              {activeProfile.age}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                Sexo:
              </span>
              {activeProfile.gender}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                Objetivo:
              </span>
              {activeProfile.goal}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                Nivel:
              </span>
              {activeProfile.nivel}
            </div>
          </div>
        )}
      </header>

      <CreateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingProfileMode && activeProfile ? activeProfile : null}
        onSave={(profile) => {
          if (editingProfileMode && activeProfile) {
            updateProfile(activeProfile.id, profile);
          } else {
            addProfile(profile);
          }
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
