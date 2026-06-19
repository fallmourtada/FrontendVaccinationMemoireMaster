import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// ================================
// TYPES POUR LA PRÉDICTION DE RISQUE CPN
// ================================

/**
 * Données d'entrée pour la prédiction de risque
 * Correspond aux champs envoyés au microservice FastAPI
 */
export interface PredictionInput {
  niveau_instruction: string;
  nombre_enfants: number;
  retard_vaccinal: string;
  distance_centre_sante: number;
  acces_transport: string;
  zone_residence: string;
  niveau_revenu_menage: string;
}

/**
 * Résultat de la prédiction de risque
 */
export interface PredictionResult {
  prediction: 'Haut risque' | 'Risque modéré' | 'Faible risque';
  probabilities: {
    'Faible risque': number;
    'Risque modéré': number;
    'Haut risque': number;
  };
}

// ================================
// CLIENT AXIOS DÉDIÉ POUR FASTAPI
// ================================

const predictionClient = axios.create({
  // baseURL: '/prediction-api', // Ancienne URL locale — FastAPI sur http://localhost:8000 (via proxy Vite)
  baseURL: 'https://mourtada23-vaccination-risk-prediction-api.hf.space', // Modèle déployé sur HuggingFace Spaces
  timeout: 30000, // Augmenté à 30s pour le cold-start HuggingFace
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ================================
// FONCTIONS DE SERVICE
// ================================

/**
 * Appelle le microservice FastAPI pour prédire le risque CPN
 */
export const predictRisk = async (input: PredictionInput): Promise<PredictionResult> => {
  const response = await predictionClient.post<PredictionResult>('/predict', input);
  return response.data;
};

// ================================
// HOOKS REACT QUERY
// ================================

/**
 * Hook mutation pour lancer une prédiction de risque
 */
export const usePredictRisk = () => {
  return useMutation<PredictionResult, Error, PredictionInput>({
    mutationFn: predictRisk,
  });
};

// ================================
// HELPERS
// ================================

/**
 * Mappe les données d'un parent (UtilisateurDTO) vers le format PredictionInput
 */
export const mapParentToPredictionInput = (parent: {
  niveauInstruction?: string | null;
  nombre_enfants?: number | null;
  retard_vaccinal?: string | null;
  distance_centre_sante?: number | null;
  acces_transport?: string | null;
  zoneResidence?: string | null;
  niveauRevenu?: string | null;
}): PredictionInput | null => {
  // Vérifier que les champs requis sont présents
  if (
    !parent.niveauInstruction ||
    parent.nombre_enfants == null ||
    !parent.retard_vaccinal ||
    parent.distance_centre_sante == null ||
    !parent.acces_transport ||
    !parent.zoneResidence ||
    !parent.niveauRevenu
  ) {
    return null;
  }

  // Mapping des valeurs enum vers les valeurs attendues par le modèle
  const niveauInstructionMap: Record<string, string> = {
    'AUCUN': 'Aucun',
    'PRIMAIRE': 'Primaire',
    'SECONDAIRE': 'Secondaire',
    'SUPERIEUR': 'Supérieur',
  };

  const zoneResidenceMap: Record<string, string> = {
    'URBAINE': 'Urbaine',
    'RURALE': 'Rurale',
  };

  const niveauRevenuMap: Record<string, string> = {
    'ELEVE': 'Élevé',
    'MOYEN': 'Moyen',
    'BAS': 'Bas',
  };

  return {
    niveau_instruction: niveauInstructionMap[parent.niveauInstruction] || parent.niveauInstruction,
    nombre_enfants: parent.nombre_enfants,
    retard_vaccinal: parent.retard_vaccinal,
    distance_centre_sante: parent.distance_centre_sante,
    acces_transport: parent.acces_transport,
    zone_residence: zoneResidenceMap[parent.zoneResidence] || parent.zoneResidence,
    niveau_revenu_menage: niveauRevenuMap[parent.niveauRevenu] || parent.niveauRevenu,
  };
};

/**
 * Retourne la couleur et le style associés à un niveau de risque
 */
export const getRiskStyle = (prediction: string) => {
  switch (prediction) {
    case 'Haut risque':
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
        badgeBg: 'bg-red-100 text-red-800 border-red-300',
        iconColor: 'text-red-500',
        progressColor: 'bg-red-500',
        gradientFrom: 'from-red-500',
        gradientTo: 'to-red-600',
      };
    case 'Risque modéré':
      return {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        iconColor: 'text-amber-500',
        progressColor: 'bg-amber-500',
        gradientFrom: 'from-amber-500',
        gradientTo: 'to-amber-600',
      };
    case 'Faible risque':
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-700',
        badgeBg: 'bg-green-100 text-green-800 border-green-300',
        iconColor: 'text-green-500',
        progressColor: 'bg-green-500',
        gradientFrom: 'from-green-500',
        gradientTo: 'to-green-600',
      };
    default:
      return {
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-700',
        badgeBg: 'bg-gray-100 text-gray-800 border-gray-300',
        iconColor: 'text-gray-500',
        progressColor: 'bg-gray-500',
        gradientFrom: 'from-gray-500',
        gradientTo: 'to-gray-600',
      };
  }
};

/**
 * Retourne l'icône emoji pour un niveau de risque
 */
export const getRiskIcon = (prediction: string) => {
  switch (prediction) {
    case 'Haut risque':
      return '🔴';
    case 'Risque modéré':
      return '🟡';
    case 'Faible risque':
      return '🟢';
    default:
      return '⚪';
  }
};
