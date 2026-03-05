import type { VaccinCreateDTO, VaccinDTO, VaccinUpdateDTO } from "@/types";
import { buildVaccinUrl } from "@/utils/api-config";
import { useAxiosDelete, useAxiosGet, useAxiosPost, useAxiosPut } from "@/hooks/use-api";
import { useQueryClient } from "@tanstack/react-query";


/**
 * Clés de requête pour les vaccins
 */
const VACCINS_KEYS = {
  all: ['vaccins'] as const,
  lists: () => [...VACCINS_KEYS.all, 'list'] as const,
  detail: (id: string | number) => [...VACCINS_KEYS.all, 'detail', id] as const,
};

/**
 * Hook pour récupérer tous les vaccins
 */
export const useAllVaccins = () => {
  const url = buildVaccinUrl('vaccins');
  return useAxiosGet<VaccinDTO[]>(
    VACCINS_KEYS.lists(),
    url
  );
};

/**
 * Hook pour récupérer un vaccin par son ID
 */
export const useVaccinById = (vaccinId: string | number) => {
  const url = buildVaccinUrl('vaccins', { vaccinId: String(vaccinId) });
  return useAxiosGet<VaccinDTO>(
    VACCINS_KEYS.detail(vaccinId),
    url
  );
};

/**
 * Hook pour créer un vaccin
 */
export const useCreateVaccin = () => {
  const queryClient = useQueryClient();
  const url = buildVaccinUrl('vaccins');
  return useAxiosPost<VaccinDTO, VaccinCreateDTO>(
    url,
    undefined,
    {},    
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: VACCINS_KEYS.lists() });
      }
    }
  );
};

/**
 * Hook pour mettre à jour un vaccin
 */
export const useUpdateVaccin = () => {
  const queryClient = useQueryClient();
  const url = buildVaccinUrl('vaccins'); // URL de base sans l'ID

  return useAxiosPut<VaccinDTO, VaccinUpdateDTO & { id: string | number }>(
    url,
    undefined,
    {
      onSuccess: (_data: any) => {
        queryClient.invalidateQueries({ queryKey: VACCINS_KEYS.lists() });
        // queryClient.invalidateQueries({ queryKey: VACCINS_KEYS.detail(data.id) });
      }
    }
  );
};

/**
 * Hook pour supprimer un vaccin
 */
export const useDeleteVaccin = () => {
  const queryClient = useQueryClient();
  const url = buildVaccinUrl('vaccins'); // URL de base sans l'ID

  return useAxiosDelete(
    url,    
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: VACCINS_KEYS.lists() });
      }
    }
  );
};