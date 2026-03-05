import type { EnfantDTO, UserDTO } from "./user";
import type { VaccinDTO } from "./vaccin";
import type { AppointmentDTO } from "./appointment";

// ================================
// ENUM STATUT VACCINATION
// Correspond à: com.gestionvaccination.vaccinationservice.enumeration.StatutVaccination
// ================================

export const StatutVaccination = {
  EFFECTUER: 'EFFECTUER',
  NON_EFFECTUER: 'NON_EFFECTUER',
  EN_ATTENTE: 'EN_ATTENTE'
} as const;

export type StatutVaccinationEnum = typeof StatutVaccination[keyof typeof StatutVaccination];

// Labels pour affichage
export const StatutVaccinationLabels: Record<StatutVaccinationEnum, string> = {
  EFFECTUER: 'Effectué',
  NON_EFFECTUER: 'Non effectué',
  EN_ATTENTE: 'En attente'
};

// Couleurs pour les badges
export const StatutVaccinationColors: Record<StatutVaccinationEnum, { bg: string; text: string; border: string }> = {
  EFFECTUER: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  NON_EFFECTUER: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  EN_ATTENTE: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' }
};

// ================================
// DTO VACCINATION - Correspond au backend
// ================================

/**
 * VaccinationDTO - Correspond au DTO Java
 * Retourné par GET /api/v1/vaccinations
 */
export interface VaccinationDTO {
  id: number | null;
  statutVaccination: StatutVaccinationEnum;
  date: string; // LocalDate -> ISO string "YYYY-MM-DD"
  utilisateur?: UserDTO | null;
  appointment?: AppointmentDTO | null;
  vaccine?: VaccinDTO | null;
  enfant?: EnfantDTO | null;
}

/**
 * SaveVaccinationDTO - Pour créer une vaccination
 * POST /api/v1/vaccinations?vaccinId=X&appointmentId=Y&userId=Z&enfantId=W
 */
export interface SaveVaccinationDTO {
  statut?: StatutVaccinationEnum;
}

/**
 * UpdateVaccinationDTO - Pour modifier une vaccination
 * PUT /api/v1/vaccinations/{id}
 */
export interface UpdateVaccinationDTO {
  statutVaccination?: StatutVaccinationEnum;
  date?: string;
}

// Alias pour compatibilité avec l'ancien code
export type VaccinationCreateDTO = SaveVaccinationDTO;
export type VaccinationUpdateDTO = UpdateVaccinationDTO;