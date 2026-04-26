"use client";

import { useCallback, useEffect, useState } from "react";

import type { PetProfile } from "@/lib/api/types";

const STORAGE_KEY = "petmind:pet-profile";

/**
 * Hook ligero para leer/escribir el perfil de mascota en `localStorage`.
 *
 * Lo mantenemos en cliente porque, en esta primera versión del demo,
 * el perfil no se persiste en el backend.
 */
export function usePetProfile() {
  const [profile, setProfileState] = useState<PetProfile | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setProfileState(JSON.parse(raw) as PetProfile);
    } catch {
    }
    setIsHydrated(true);
  }, []);

  const setProfile = useCallback((next: PetProfile | null) => {
    setProfileState(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  }, []);

  const clearProfile = useCallback(() => setProfile(null), [setProfile]);

  return { profile, setProfile, clearProfile, isHydrated };
}
