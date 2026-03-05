// Interface pour une localité
export interface LocaliteDTO {
  id: string | null;
  name: string;
  codification: string;
  type: LocaliteTypeEnum;
  parent: LocaliteDTO | null;
  population: number;
  superficieKm2: number;
  chefLieu: string;
  latitude: number;
  longitude: number;
  active: boolean;
}

// Enum pour le type de localité
export const LocalityType = {
  REGION: 'REGION',
  DEPARTMENT: 'DEPARTMENT',
  DISTRICT: 'DISTRICT',
  COMMUNE: 'COMMUNE',
  NEIGHBORHOOD: 'NEIGHBORHOOD'
} as const;

export type LocaliteTypeEnum = typeof LocalityType[keyof typeof LocalityType];


// Pour les opérations de création (sans id)
export type LocaliteCreateDTO = Omit<LocaliteDTO, 'id' | 'parent'> & { parentId?: string | null };

// Types spécialisés pour les formulaires de sauvegarde
export type LocaliteUpdateDTO = Partial<LocaliteCreateDTO>;