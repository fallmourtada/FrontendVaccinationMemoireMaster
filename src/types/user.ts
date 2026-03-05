// ================================
// TYPES CORRESPONDANT AU BACKEND SPRING BOOT - USER-SERVICE
// ================================

// Types pour les DTOs provenant d'autres services (enrichissement)
export interface LocalityDTO {
  id: number | null;
  name: string;
  codification?: string;
  type?: string;
  parentId?: number | null;
}

export interface CentreDTO {
  id: number | null;
  nom: string;
  adresse?: string;
  telephone?: string;
  localityId?: number | null;
}

// ================================
// ENUMS - Correspondant aux enums Java
// ================================

// Enum pour le rôle utilisateur (correspond à UserRole.java)
export const UserRole = {
  ADMIN: 'ADMIN',
  PARENT: 'PARENT',
  INFIRMIER: 'INFIRMIER',
  ICP: 'ICP',
  MEDECIN: 'MEDECIN',
  SAGE_FEMME: 'SAGE_FEMME'
} as const;

export type UserRoleEnum = typeof UserRole[keyof typeof UserRole];

// Enum pour le sexe (correspond à Sexe.java)
export const Sexe = {
  MASCULIN: 'MASCULIN',
  FEMININ: 'FEMININ'
} as const;

export type SexeEnum = typeof Sexe[keyof typeof Sexe];

// Enum pour le statut matrimonial
export const StatutMatrimonialValues = [
  'CÉLIBATAIRE',
  'MARIÉ',
  'MARIÉE',
  'DIVORCÉ',
  'DIVORCÉE',
  'VEUF',
  'VEUVE'
] as const;

export type StatutMatrimonial = typeof StatutMatrimonialValues[number];

// Enum pour le groupe sanguin
export const GroupeSanguinValues = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type GroupeSanguinEnum = typeof GroupeSanguinValues[number];

// Enum pour la langue maternelle (correspond à LangueMaternelle.java)
export const LangueMaternelleValues = ['WOLOF', 'SERERE', 'PULAAR', 'DIOLA'] as const;
export type LangueMaternelle = typeof LangueMaternelleValues[number];

// Enum pour le niveau d'instruction (correspond à NiveauInstruction.java)
export const NiveauInstructionValues = ['AUCUN', 'PRIMAIRE', 'SECONDAIRE', 'SUPERIEUR'] as const;
export type NiveauInstruction = typeof NiveauInstructionValues[number];

// Enum pour le niveau d'étude
export const NiveauEtudeValues = ['AUCUN', 'PRIMAIRE', 'SECONDAIRE', 'SUPERIEUR'] as const;
export type NiveauEtude = typeof NiveauEtudeValues[number];

// Enum pour la zone de résidence (correspond à ZoneResidence.java)
export const ZoneResidenceValues = ['URBAINE', 'RURALE'] as const;
export type ZoneResidence = typeof ZoneResidenceValues[number];

// Enum pour le niveau de revenu (correspond à NiveauRevenu.java)
export const NiveauRevenuValues = ['ELEVE', 'MOYEN', 'BAS'] as const;
export type NiveauRevenu = typeof NiveauRevenuValues[number];

// ================================
// DTOs UTILISATEUR - Correspondant à UtilisateurDTO.java
// ================================

/**
 * DTO pour retourner les données d'un utilisateur
 * Correspond à UtilisateurDTO.java
 */
export interface UtilisateurDTO {
  id: number | null;
  email: string;
  age?: number | null;
  statutMatrimonial?: string | null;
  telephone?: string;
  userRole: UserRoleEnum;
  prenom: string;
  nom: string;
  password?: string;
  adresse?: string | null;
  groupeSanguin?: GroupeSanguinEnum | null;
  matricule?: string | null;
  dateEmbauche?: string | null; // LocalDate en Java -> string ISO
  profession?: string | null;
  niveauEtude?: string | null;
  roles?: UserRoleEnum[];
  allergies?: string | null;
  antecedentsMedicaux?: string | null;
  numeroCarnet?: string | null;
  langueMaternelle?: string | null;
  niveauInstruction?: string | null;
  nombre_enfants?: number | null;
  retard_vaccinal?: string | null;
  distance_centre_sante?: number | null;
  acces_transport?: string | null;
  zoneResidence?: string | null;
  niveauRevenu?: string | null;
  
  // Données enrichies depuis les autres services
  locality?: LocalityDTO | null;
  centre?: CentreDTO | null;
  
  // Informations tuteurs
  nomTuteur1?: string | null;
  nomTuteur2?: string | null;
  prenomTuteur1?: string | null;
  prenomTuteur2?: string | null;
  numeroTuteur1?: string | null;
  numeroTuteur2?: string | null;
}

/**
 * DTO pour sauvegarder un parent
 * Correspond à SaveParentDTO.java
 */
export interface SaveParentDTO {
  email?: string;
  age?: number;
  statutMatrimonial?: string;
  telephone: string;
  prenom: string;
  nom: string;
  password?: string;
  adresse?: string;
  groupeSanguin?: GroupeSanguinEnum;
  profession?: string;
  niveauEtude?: string;
  allergies?: string;
  antecedentsMedicaux?: string;
  nomTuteur1?: string;
  nomTuteur2?: string;
  prenomTuteur1?: string;
  prenomTuteur2?: string;
  numeroTuteur1?: string;
  numeroTuteur2?: string;
  langueMaternelle?: string;
  niveauInstruction?: string;
  nombre_enfants?: number;
  retard_vaccinal?: string;
  distance_centre_sante?: number;
  acces_transport?: string;
  zoneResidence?: string;
  niveauRevenu?: string;
}

/**
 * DTO pour sauvegarder un infirmier
 * Correspond à SaveInfirmierDTO.java
 */
export interface SaveInfirmierDTO {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  phone?: string;
  matricule?: string;
  dateEmbauche?: string; // LocalDate -> ISO string
  age?: number;
}

/**
 * DTO pour sauvegarder un utilisateur générique
 * Correspond à SaveUtilisateurDTO.java
 */
export interface SaveUtilisateurDTO {
  password?: string;
  email?: string;
  age?: number;
  statutMatrimonial?: string;
  telephone: string;
  prenom: string;
  nom: string;
  adresse?: string;
  groupeSanguin?: GroupeSanguinEnum;
  localityId?: number;
  centreId?: number;
  profession?: string;
  niveauEtude?: string;
  allergies?: string;
  antecedentsMedicaux?: string;
  nomTuteur1?: string;
  nomTuteur2?: string;
  prenomTuteur1?: string;
  prenomTuteur2?: string;
  numeroTuteur1?: string;
  numeroTuteur2?: string;
}

/**
 * DTO pour mettre à jour un utilisateur
 * Correspond à UpdateUtilisateurDTO.java
 */
export interface UpdateUtilisateurDTO {
  email?: string;
  age?: number;
  statutMatrimonial?: string;
  telephone?: string;
  prenom?: string;
  nom?: string;
  adresse?: string;
  groupeSanguin?: GroupeSanguinEnum;
  profession?: string;
  niveauEtude?: string;
  allergies?: string;
  antecedentsMedicaux?: string;
  numeroCarnet?: string;
  nomTuteur1?: string;
  nomTuteur2?: string;
  prenomTuteur1?: string;
  prenomTuteur2?: string;
  numeroTuteur1?: string;
  numeroTuteur2?: string;
  langueMaternelle?: string;
  niveauInstruction?: string;
  nombre_enfants?: number;
  retard_vaccinal?: string;
  distance_centre_sante?: number;
  acces_transport?: string;
  zoneResidence?: string;
  niveauRevenu?: string;
}

// ================================
// DTOs ENFANT - Correspondant à EnfantDTO.java
// ================================

/**
 * DTO pour retourner les données d'un enfant
 * Correspond à EnfantDTO.java
 */
export interface EnfantDTO {
  id: number | null;
  contenuQrCcode?: string | null; // Note: typo dans le backend (Ccode)
  qrCode?: string | null;
  prenom: string;
  nom: string;
  dateNaissance?: string | null; // LocalDate -> ISO string
  sexe?: SexeEnum;
  lieuNaissance?: string | null;
  allergies?: string | null;
  antecedentsMedicaux?: string | null;
  numeroCarnet?: string | null;
  groupeSanguin?: GroupeSanguinEnum | null;
  poids?: number | null; // Double en Java
  taille?: number | null; // Double en Java
  parent?: UtilisateurDTO | null;
  createdAt?: string | null; // Date -> ISO string
  updatedAt?: string | null; // Date -> ISO string
}

/**
 * DTO pour sauvegarder un enfant
 * Correspond à SaveEnfantDTO.java
 */
export interface SaveEnfantDTO {
  prenom: string;
  nom: string;
  dateNaissance?: string; // LocalDate -> ISO string (YYYY-MM-DD)
  sexe?: SexeEnum;
  lieuNaissance?: string;
  adresse?: string;
  allergies?: string;
  antecedentsMedicaux?: string;
  groupeSanguin?: GroupeSanguinEnum;
  poids?: number;
  taille?: number;
  parentId?: number; // Note: utilisé seulement dans certains cas
}

/**
 * DTO pour mettre à jour un enfant
 * Correspond à UpdateEnfantDTO.java
 */
export interface UpdateEnfantDTO {
  prenom?: string;
  nom?: string;
  adresse?: string;
  groupeSanguin?: GroupeSanguinEnum;
  poids?: number;
  taille?: number;
  sexe?: SexeEnum;
  allergies?: string;
  antecedentsMedicaux?: string;
  numeroCarnet?: string;
}

// ================================
// TYPES DE STATISTIQUES
// ================================

/**
 * Statistiques des enfants
 * Correspond au retour de /api/v1/users/enfants/stats/total
 */
export interface EnfantStats {
  nombreTotalEnfants: number;
  nombreTotalFilles: number;
  nombreTotalGarcons: number;
}

// ================================
// ALIAS POUR COMPATIBILITÉ (anciens noms)
// ================================

/** @deprecated Utilisez UtilisateurDTO à la place */
export type UserDTO = UtilisateurDTO;

/** @deprecated Utilisez SaveParentDTO à la place */
export type CreateParentDTO = SaveParentDTO;

/** @deprecated Utilisez UpdateUtilisateurDTO à la place */
export type UserUpdateDTO = UpdateUtilisateurDTO;

/** @deprecated Utilisez SaveUtilisateurDTO à la place */
export type UserCreateDTO = SaveUtilisateurDTO;

/** @deprecated Utilisez SaveEnfantDTO à la place */
export type CreateEnfantDTO = SaveEnfantDTO;

/** @deprecated Utilisez UpdateEnfantDTO à la place */
export type EnfantUpdateDTO = UpdateEnfantDTO;

/** @deprecated Utilisez SexeEnum à la place */
export type SexeTypeEnum = SexeEnum;

/** @deprecated Utilisez Sexe à la place */
export const SexeType = Sexe;
