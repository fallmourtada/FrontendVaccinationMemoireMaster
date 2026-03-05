import { 
  useAxiosGet, 
  useAxiosGetById,
  useAxiosDelete 
} from "@/hooks/use-api";
import type { 
  VaccinationDTO, 
  SaveVaccinationDTO, 
  UpdateVaccinationDTO,
} from "@/types";
import { buildVaccinationUrl } from "@/utils/api-config";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import apiClient from "@/utils/api-client";

/**
 * Clés de cache pour les vaccinations
 */
export const VACCINATIONS_KEYS = {
  all: ['vaccinations'] as const,
  lists: () => [...VACCINATIONS_KEYS.all, 'list'] as const,
  byEnfant: (enfantId: string | number) => [...VACCINATIONS_KEYS.all, 'enfant', enfantId] as const,
  byVaccine: (vaccineId: string | number) => [...VACCINATIONS_KEYS.all, 'vaccine', vaccineId] as const,
  detail: (id: string | number) => [...VACCINATIONS_KEYS.all, 'detail', id] as const,
};

/**
 * Hook pour récupérer toutes les vaccinations
 */
export const useAllVaccinations = () => {
  const url = buildVaccinationUrl('vaccinations');
  console.log('[useAllVaccinations] URL générée:', url);
  return useAxiosGet<VaccinationDTO[]>(
    VACCINATIONS_KEYS.lists(),
    url
  );
};

/**
 * Hook pour récupérer les vaccinations d'un enfant spécifique
 */
export const useVaccinationsByEnfant = (enfantId: string | number | null | undefined) => {
  const url = enfantId ? buildVaccinationUrl('by_enfant', { enfantId: String(enfantId) }) : '';
  return useAxiosGet<VaccinationDTO[]>(
    VACCINATIONS_KEYS.byEnfant(enfantId || ''),
    url,
    {},
    { enabled: !!enfantId }
  );
};

/**
 * Hook pour récupérer les vaccinations par vaccin
 */
export const useVaccinationsByVaccin = (vaccineId: string | number | null | undefined) => {
  const url = vaccineId ? buildVaccinationUrl('by_vaccine', { vaccineId: String(vaccineId) }) : '';
  return useAxiosGet<VaccinationDTO[]>(
    VACCINATIONS_KEYS.byVaccine(vaccineId || ''),
    url,
    {},
    { enabled: !!vaccineId }
  );
};

/**
 * Hook pour récupérer une vaccination par son ID
 */
export const useVaccinationById = (id: string | number | null | undefined) => {
  const url = buildVaccinationUrl('vaccinations');
  return useAxiosGetById<VaccinationDTO>(
    VACCINATIONS_KEYS.detail(id || ''),
    url,
    id
  );
};

/**
 * Interface pour les paramètres de création de vaccination
 * POST /api/v1/vaccinations?vaccinId=X&appointmentId=Y&userId=Z&enfantId=W
 */
export interface CreateVaccinationParams {
  vaccinId: number;
  appointmentId?: number;
  userId: number;
  enfantId: number;
  data?: SaveVaccinationDTO;
}

/**
 * Hook pour créer une vaccination
 * Utilise les query params pour les IDs
 */
export const useCreateVaccination = () => {
  const queryClient = useQueryClient();
  
  return useMutation<VaccinationDTO, Error, CreateVaccinationParams>({
    mutationFn: async ({ vaccinId, appointmentId, userId, enfantId, data }) => {
      // Construire l'URL avec les query params
      const baseUrl = buildVaccinationUrl('vaccinations');
      const params = new URLSearchParams({
        vaccinId: String(vaccinId),
        userId: String(userId),
        enfantId: String(enfantId),
      });
      
      if (appointmentId) {
        params.append('appointmentId', String(appointmentId));
      }
      
      const urlWithParams = `${baseUrl}?${params.toString()}`;
      const response = await apiClient.post<VaccinationDTO>(urlWithParams, data || {});
      // Extraire la data depuis ApiResponse si présente
      const responseData = response.data;
      return (responseData && 'data' in responseData && responseData.data) 
        ? responseData.data 
        : responseData as unknown as VaccinationDTO;
    },
    onSuccess: (data) => {
      // Invalider les listes pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: VACCINATIONS_KEYS.lists()
      });
      
      // Invalider les vaccinations de l'enfant
      if (data.enfant?.id) {
        queryClient.invalidateQueries({
          queryKey: VACCINATIONS_KEYS.byEnfant(data.enfant.id)
        });
      }
      
      console.log('Vaccination enregistrée avec succès');
    }
  });
};

/**
 * Interface pour la mise à jour de vaccination
 */
export interface UpdateVaccinationParams {
  id: number;
  data: UpdateVaccinationDTO;
}

/**
 * Hook pour mettre à jour une vaccination
 * PUT /api/v1/vaccinations/{id}
 */
export const useUpdateVaccination = () => {
  const queryClient = useQueryClient();
  
  return useMutation<VaccinationDTO, Error, UpdateVaccinationParams>({
    mutationFn: async ({ id, data }): Promise<VaccinationDTO> => {
      const url = buildVaccinationUrl('byId', { id: String(id) });
      const response = await apiClient.put<VaccinationDTO>(url, data);
      // Extraire la data depuis ApiResponse si présente
      const responseData = response.data as any;
      return (responseData && 'data' in responseData && responseData.data) 
        ? responseData.data 
        : responseData;
    },
    onSuccess: (data, variables) => {
      // Invalider toutes les listes
      queryClient.invalidateQueries({
        queryKey: VACCINATIONS_KEYS.lists()
      });
      
      // Invalider la requête détaillée pour cette vaccination
      queryClient.invalidateQueries({
        queryKey: VACCINATIONS_KEYS.detail(variables.id)
      });
      
      // Invalider les vaccinations de l'enfant
      if (data.enfant?.id) {
        queryClient.invalidateQueries({
          queryKey: VACCINATIONS_KEYS.byEnfant(data.enfant.id)
        });
      }
      
      console.log(`Vaccination ${variables.id} mise à jour avec succès`);
    }
  });
};

/**
 * Hook pour supprimer une vaccination
 * DELETE /api/v1/vaccinations/{id}
 */
export const useDeleteVaccination = () => {
  const queryClient = useQueryClient();
  const baseUrl = buildVaccinationUrl('vaccinations');
  
  return useAxiosDelete(
    baseUrl,
    undefined,
    {
      onSuccess: (_data: unknown, variables: string | number) => {
        // Invalider toutes les listes après suppression
        queryClient.invalidateQueries({
          queryKey: VACCINATIONS_KEYS.lists()
        });
        
        console.log(`Vaccination ${variables} supprimée avec succès`);
      }
    }
  );
};
