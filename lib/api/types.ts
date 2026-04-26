/**
 * Tipos compartidos del backend de PetMind AI.
 *
 * El contrato exacto se irá refinando cuando tengamos los JSON de ejemplo
 * reales del backend. Mantén estos tipos como fuente única de verdad y
 * actualízalos junto con los esquemas de Zod en `lib/schemas` cuando cambien.
 */

export type PetSpecies = "dog";

export type PetLifeStage = "puppy" | "adult" | "senior";

export type PetMindConfidence = "low" | "medium" | "high";

export interface PetProfile {
  name: string;
  species: PetSpecies;
  breed?: string;
  ageYears?: number;
  weightKg?: number;
  lifeStage?: PetLifeStage;
  notes?: string;
}

export interface QuerySource {
  id?: string;
  title: string;
  url?: string;
  snippet?: string;
  similarity_score?: number;
  category?: string;
  species?: string;
  life_stage?: string;
}

export interface QueryRequest {
  question: string;
  pet?: PetProfile;
}

export interface QueryResponse {
  answer: string;
  confidence: PetMindConfidence;
  sources: QuerySource[];
  disclaimers: string[];
  needs_vet_followup: boolean;
  generated_at: string;
  used_filters?: Record<string, unknown>;
}

export interface IngestRequest {
  title: string;
  content: string;
  source_url?: string;
  tags?: string[];
}

export interface IngestResponse {
  id?: string;
  status: string;
  message?: string;
}

export interface HealthResponse {
  status: string;
  version?: string;
  uptime_seconds?: number;
}
