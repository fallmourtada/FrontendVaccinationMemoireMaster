// ================================
// ENUMS POUR LES VACCINS
// Correspondent exactement aux enums Java du microservice
// ================================

/**
 * VaccineType - Types de vaccins
 * Correspond à: com.gestionvaccination.vaccineservice.enumeration.VaccineType
 */
export const VaccineType = {
  BCG: 'BCG',                     // Tuberculose
  DTP: 'DTP',                     // Diphtérie, Tétanos, Poliomyélite
  COQUELUCHE: 'COQUELUCHE',       // Coqueluche
  HEPATITE_B: 'HEPATITE_B',       // Hépatite B
  HIB: 'HIB',                     // Haemophilus influenzae de type b
  PNEUMOCOQUE: 'PNEUMOCOQUE',     // Pneumocoque
  MENINGOCOQUE_C: 'MENINGOCOQUE_C', // Méningocoque C
  ROR: 'ROR',                     // Rougeole, Oreillons, Rubéole
  HEPATITE_A: 'HEPATITE_A',       // Hépatite A
  GRIPPE: 'GRIPPE',               // Grippe saisonnière
  FIEVRE_JAUNE: 'FIEVRE_JAUNE',   // Fièvre jaune
  COVID19: 'COVID19',             // Covid-19
  AUTRES: 'AUTRES'                // Autres types de vaccins
} as const;

export type VaccineTypeEnum = typeof VaccineType[keyof typeof VaccineType];

// Alias pour compatibilité (ancien nom)
export const TypeVaccin = VaccineType;
export type TypeVaccinEnum = VaccineTypeEnum;

/**
 * AdministrationMode - Mode d'administration du vaccin
 * Correspond à: com.gestionvaccination.vaccineservice.enumeration.AdministrationMode
 */
export const AdministrationMode = {
  INTRADERMAL: 'INTRADERMAL',     // Intradermique
  INTRAMUSCULAR: 'INTRAMUSCULAR', // Intramusculaire
  SUBCUTANEOUS: 'SUBCUTANEOUS',   // Sous-cutanée
  ORAL: 'ORAL',                   // Orale
  NASAL: 'NASAL'                  // Nasale
} as const;

export type AdministrationModeEnum = typeof AdministrationMode[keyof typeof AdministrationMode];

// Alias pour compatibilité (ancien nom)
export const ModeAdministration = AdministrationMode;
export type ModeAdministrationEnum = AdministrationModeEnum;

/**
 * PeriodePrise - Période de prise du vaccin
 * Correspond à: com.gestionvaccination.vaccineservice.enumeration.PeriodePrise
 */
export const PeriodePrise = {
  NAISSANCE: 'NAISSANCE',
  DEUX_MOIS: 'DEUX_MOIS',
  TROIS_MOIS: 'TROIS_MOIS',
  SIX_MOIS: 'SIX_MOIS'
} as const;

export type PeriodePriseEnum = typeof PeriodePrise[keyof typeof PeriodePrise];

// Alias pour compatibilité (ancien nom)
export const PeriodeVaccination = PeriodePrise;
export type PeriodeVaccinationEnum = PeriodePriseEnum;

// ================================
// DTO VACCIN - Correspond au backend
// ================================

export interface VaccinDTO {
  id: number | null;
  nom: string;
  fabricant?: string;
  numeroLot?: string;
  dateProduction?: string;        // LocalDate -> ISO string
  dateExpiration?: string;        // LocalDate -> ISO string
  description?: string;
  dosage?: string;
  typeVaccin: VaccineTypeEnum;
  modeAdministration?: AdministrationModeEnum;
  temperatureConservation?: string;
  effetsSecondaires?: string;
  dosesRequises?: number;
  quantiteDisponible?: number;
  periode?: PeriodePriseEnum;
  createdAt?: string;
  updatedAt?: string;
}

// Pour les opérations de création (sans id)
export type VaccinCreateDTO = Omit<VaccinDTO, 'id' | 'createdAt' | 'updatedAt'>;

// Types pour les opérations de mise à jour
export type VaccinUpdateDTO = Partial<VaccinCreateDTO>;

// ================================
// LABELS POUR AFFICHAGE
// ================================

export const VaccineTypeLabels: Record<VaccineTypeEnum, string> = {
  BCG: 'BCG (Tuberculose)',
  DTP: 'DTP (Diphtérie, Tétanos, Polio)',
  COQUELUCHE: 'Coqueluche',
  HEPATITE_B: 'Hépatite B',
  HIB: 'Hib (Haemophilus influenzae)',
  PNEUMOCOQUE: 'Pneumocoque',
  MENINGOCOQUE_C: 'Méningocoque C',
  ROR: 'ROR (Rougeole, Oreillons, Rubéole)',
  HEPATITE_A: 'Hépatite A',
  GRIPPE: 'Grippe saisonnière',
  FIEVRE_JAUNE: 'Fièvre jaune',
  COVID19: 'COVID-19',
  AUTRES: 'Autres'
};

// Alias pour compatibilité
export const TypeVaccinLabels = VaccineTypeLabels;

export const AdministrationModeLabels: Record<AdministrationModeEnum, string> = {
  INTRADERMAL: 'Intradermique',
  INTRAMUSCULAR: 'Intramusculaire',
  SUBCUTANEOUS: 'Sous-cutané',
  ORAL: 'Oral',
  NASAL: 'Nasal'
};

// Alias pour compatibilité
export const ModeAdministrationLabels = AdministrationModeLabels;

export const PeriodePriseLabels: Record<PeriodePriseEnum, string> = {
  NAISSANCE: 'À la naissance',
  DEUX_MOIS: '2 mois',
  TROIS_MOIS: '3 mois',
  SIX_MOIS: '6 mois'
};

// Alias pour compatibilité
export const PeriodeVaccinationLabels = PeriodePriseLabels;