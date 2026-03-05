import type { LocaliteCreateDTO, LocaliteDTO, LocaliteUpdateDTO } from "@/types";
import { buildLocaliteUrl } from "@/utils/api-config";
import { useAxiosDelete, useAxiosGet, useAxiosPost, useAxiosPut } from "@/hooks/use-api";
import { useQueryClient } from "@tanstack/react-query";


/** 
 * Clés de requête pour les localités
 */
const LOCALITES_KEYS = {
  all: ['localites'] as const,
  lists: () => [...LOCALITES_KEYS.all, 'list'] as const,
  detail: (id: string | number) => [...LOCALITES_KEYS.all, 'detail', id] as const,
};

/**
 * Hook pour récupérer toutes les localités 
 */
export const useAllLocalites = () => {
  const url = buildLocaliteUrl('localites');
  return useAxiosGet<LocaliteDTO[]>(
    LOCALITES_KEYS.lists(),
    url
  );
};

/**
 * Hook pour récupérer une localité par son ID
 */
export const useLocaliteById = (localiteId: string | number) => {
  const url = buildLocaliteUrl('localites', { localiteId: String(localiteId) });
  return useAxiosGet<LocaliteDTO>(
    LOCALITES_KEYS.detail(localiteId),
    url
  );
};

/**
 * Hook pour créer une localité
 */
export const useCreateLocalite = () => {
  const queryClient = useQueryClient();
  const url = buildLocaliteUrl('localites');
  return useAxiosPost<LocaliteDTO, LocaliteCreateDTO>(
    url,
    undefined,
    {},
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: LOCALITES_KEYS.lists() });
      }
    }
  );
};

/**
 * Hook pour mettre à jour une localité
 */
export const useUpdateLocalite = () => {
  const queryClient = useQueryClient();
  const url = buildLocaliteUrl('localites'); // URL de base sans l'ID

  return useAxiosPut<LocaliteDTO, LocaliteUpdateDTO & { id: string | number }>(
    url,
    undefined,
    {
      onSuccess: (_data: any, variables: { id: string | number }) => {
        queryClient.invalidateQueries({ queryKey: LOCALITES_KEYS.lists() });
        // queryClient.invalidateQueries({ queryKey: LOCALITES_KEYS.detail(variables.id) });
        console.log(`Localité ${variables.id} mise à jour avec succès`);
      }
    }
  );
};

/**
 * Hook pour supprimer une localité
 */
export const useDeleteLocalite = () => {
  const queryClient = useQueryClient();
  const url = buildLocaliteUrl('localites'); // URL de base sans l'ID

  return useAxiosDelete(
    url,
    undefined,
    {
      onSuccess: (_data: any, variables: string | number) => {
        queryClient.invalidateQueries({ queryKey: LOCALITES_KEYS.lists() });
        
        console.log(`Localité ${variables} supprimée avec succès`);
      }
    }
  );
}