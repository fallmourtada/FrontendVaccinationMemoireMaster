import type { VaccineTypeEnum } from '@/types/vaccin';

/** Une ligne de rapport pour un type de vaccin (fin de mois). */
export interface VaccineLineReport {
  vaccinCode: VaccineTypeEnum;
  vaccinLabel: string;
  dosesUtilisees: number;
  dosesRestantes: number;
  fillesVaccinees: number;
  garconsVaccines: number;
}

/** Rapport mensuel envoyé par un poste vers le district. */
export interface MonthlyCentreReport {
  id: string;
  centreId: number;
  centreName: string;
  districtLocalityId: number;
  authorEmail: string;
  authorName: string;
  year: number;
  month: number;
  vaccines: VaccineLineReport[];
  submittedAt: string;
}
