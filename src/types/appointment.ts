import type { EnfantDTO, UserDTO } from "./user";

// ================================
// ENUM STATUT RENDEZ-VOUS
// Correspond à: com.gestionvaccination.appointmentservice.enumeration.StatutRv
// ================================

export const StatutRv = {
  EN_ATTENTE: 'EN_ATTENTE',
  CONFIRME: 'CONFIRME',
  REPORTE: 'REPORTE',
  ANNULE: 'ANNULE',
  EFFECTUE: 'EFFECTUE'
} as const;

export type StatutRvEnum = typeof StatutRv[keyof typeof StatutRv];

// Labels pour affichage
export const StatutRvLabels: Record<StatutRvEnum, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRME: 'Confirmé',
  REPORTE: 'Reporté',
  ANNULE: 'Annulé',
  EFFECTUE: 'Effectué'
};

// Couleurs pour les badges
export const StatutRvColors: Record<StatutRvEnum, { bg: string; text: string; border: string }> = {
  EN_ATTENTE: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  CONFIRME: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  REPORTE: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  ANNULE: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  EFFECTUE: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' }
};

// ================================
// DTO APPOINTMENT - Correspond au backend
// ================================

/**
 * AppointmentDTO - Correspond au DTO Java
 * Retourné par GET /api/v1/appointments
 */
export interface AppointmentDTO {
  id: number | null;
  nomVaccinAEffectuer: string;
  statut: StatutRvEnum;
  estEffectuer?: boolean;
  date: string; // LocalDate -> ISO string "YYYY-MM-DD"
  time?: string | null;
  enfant?: EnfantDTO | null;
  utilisateur?: UserDTO | null;
}

/**
 * SaveAppointmentDTO - Pour créer un rendez-vous
 * POST /api/v1/appointments?userId=X&enfantId=Y
 */
export interface SaveAppointmentDTO {
  nomVaccinAEffectuer: string;
  date: string; // LocalDate -> ISO string "YYYY-MM-DD"
  statutRv?: StatutRvEnum;
}

/**
 * UpdateAppointmentDTO - Pour modifier un rendez-vous
 * PUT /api/v1/appointments/{id}
 */
export interface UpdateAppointmentDTO {
  nomVaccinAEffectuer?: string;
  statut?: StatutRvEnum;
}

/**
 * UpdateStatutAppointmentDTO - Pour changer le statut uniquement
 * PUT /api/v1/appointments/{id}/status
 */
export interface UpdateStatutAppointmentDTO {
  statut: StatutRvEnum;
}

// Alias pour compatibilité avec l'ancien code
export const StatutRendezVous = StatutRv;
export type StatutRendezVousEnum = StatutRvEnum;
export type AppointmentCreateDTO = SaveAppointmentDTO;
export type AppointmentUpdateDTO = UpdateAppointmentDTO;