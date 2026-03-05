import type { VaccinDTO } from "./vaccin";



// Interface pour le calendrier vaccinal
export interface CalendrierVaccinalDTO {
  id: string | null;
  ageEnMois: number;
  vaccinsRecommandes: VaccinDTO[];
  description: string;
  priorite: number;
}

// Pour les opérations de création (sans id)
export type CalendrierVaccinalCreateDTO = Omit<CalendrierVaccinalDTO, 'id' | 'vaccinsRecommandes'> & { vaccinIds: string[] };

// Types pour les opérations de mise à jour
export type CalendrierVaccinalUpdateDTO = Partial<CalendrierVaccinalCreateDTO>;

