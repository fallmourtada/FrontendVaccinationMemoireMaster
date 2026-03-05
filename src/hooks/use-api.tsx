import { useQuery, useMutation, useQueryClient, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';
// import type { ApiError } from '@/models';
import apiClient from '../utils/api-client';

// ================================
// HELPER POUR EXTRAIRE LES DONNÉES
// ================================

/**
 * Extrait les données de la réponse API
 * Gère les deux formats : 
 * - Format wrappé : { data: T, message: string, status: string }
 * - Format direct : T (directement les données)
 */
function extractData<T>(responseData: any): T {
  // Si la réponse a une structure { data: ..., status: ... } (format ApiResponse)
  if (responseData && typeof responseData === 'object' && 'data' in responseData && 'status' in responseData) {
    return responseData.data as T;
  }
  // Sinon, retourner directement les données (format Spring Boot par défaut)
  return responseData as T;
}

// ================================
// HOOKS REACT QUERY POUR LES REQUÊTES GET
// ================================

/**
 * Hook personnalisé pour effectuer des requêtes GET avec React Query
 * @param queryKey - Clé unique pour identifier la requête dans le cache React Query
 * @param url - URL de l'endpoint API
 * @param config - Configuration Axios optionnelle
 */
export function useAxiosGet<TData = unknown>(
  queryKey: readonly unknown[], 
  url: string,
  config?: AxiosRequestConfig,
  options?: any
): UseQueryResult<TData, Error> {
  return useQuery<TData, Error>({
    queryKey,
    queryFn: async (): Promise<TData> => {
      const response = await apiClient.get<TData>(url, config);
      return extractData<TData>(response.data);
    },
    ...options,
  });
}

/**
 * Hook pour obtenir une entité par son ID
 * @param queryKey - Préfixe de la clé de cache (ex: ['user', 'detail'])
 * @param url - URL de base de l'endpoint API (sans l'ID)
 * @param id - ID de l'entité à récupérer
 */
export function useAxiosGetById<TData = unknown>(
  queryKey: readonly unknown[],
  url: string,
  id: string | number | null | undefined,
  options?: any
): UseQueryResult<TData, Error> {
  return useQuery<TData, Error>({
    queryKey: [...queryKey, id],
    queryFn: async (): Promise<TData> => {
      if (!id) throw new Error('ID is required');
      const fullUrl = `${url}/${id}`;
      const response = await apiClient.get<TData>(fullUrl);
      return extractData<TData>(response.data);
    },
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook pour la pagination
 * @param queryKey - Préfixe de la clé de cache
 * @param url - URL de l'endpoint API
 * @param page - Page actuelle
 * @param pageSize - Nombre d'éléments par page
 */
export function usePaginatedQuery<TData = unknown>(
  queryKey: readonly unknown[],
  url: string,
  page = 1,
  pageSize = 10,
  options?: any
): UseQueryResult<TData, Error> {
  return useQuery<TData, Error>({
    queryKey: [...queryKey, page, pageSize],
    queryFn: async (): Promise<TData> => {
      const params = { page, size: pageSize };
      const response = await apiClient.get<TData>(url, { params });
      return extractData<TData>(response.data);
    },
    ...options,
  });
}

// ================================
// HOOKS REACT QUERY POUR LES MUTATIONS
// ================================

/**
 * Hook pour créer une nouvelle entité (POST)
 * @param url - URL de l'endpoint API
 * @param queryKeysToInvalidate - Clés de cache à invalider après mutation
 */
  export function useAxiosPost<TData = unknown, TVariables = unknown>(
    url: string,
    queryKeysToInvalidate?: readonly unknown[][],
    axiosConfig?: AxiosRequestConfig,
    options?: any,
  ): UseMutationResult<TData, Error, TVariables> {
    const queryClient = useQueryClient();
    
    return useMutation<TData, Error, TVariables>({
      mutationFn: async (variables: TVariables) => {
        const response = await apiClient.post<TData>(url, variables, axiosConfig);
        return extractData<TData>(response.data);
      },
      onSuccess: () => {
        // Invalider les requêtes pertinentes après succès
        if (queryKeysToInvalidate) {
          queryKeysToInvalidate.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
        }
      },
      ...options,
    });
  }



/**
 * Hook pour mettre à jour une entité (PUT)
 * @param url - URL de base de l'endpoint API (sans l'ID)
 * @param queryKeysToInvalidate - Clés de cache à invalider après mutation
 */
export function useAxiosPut<TData = unknown, TVariables extends { id: string | number } = { id: string | number }>(
  url: string,
  queryKeysToInvalidate?: readonly unknown[][],
  options?: any
): UseMutationResult<TData, Error, TVariables> {
  const queryClient = useQueryClient();
  
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const { id, ...data } = variables;
      const fullUrl = `${url}/${id}`;
      const response = await apiClient.put<TData>(fullUrl, data);
      return extractData<TData>(response.data);
    },
    onSuccess: () => {
      if (queryKeysToInvalidate) {
        queryKeysToInvalidate.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
      }
    },
    ...options,
  });
}

/**
 * Hook pour mettre à jour partiellement une entité (PATCH)
 * @param url - URL de base de l'endpoint API (sans l'ID)
 * @param queryKeysToInvalidate - Clés de cache à invalider après mutation
 */
export function useAxiosPatch<TData = unknown, TVariables extends { id: string | number } = { id: string | number }>(
  url: string,
  queryKeysToInvalidate?: readonly unknown[][],
  options?: any
): UseMutationResult<TData, Error, TVariables> {
  const queryClient = useQueryClient();
  
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const { id, ...data } = variables;
      const fullUrl = `${url}/${id}`;
      const response = await apiClient.patch<TData>(fullUrl, data);
      return extractData<TData>(response.data);
    },
    onSuccess: () => {
      if (queryKeysToInvalidate) {
        queryKeysToInvalidate.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
      }
    },
    ...options,
  });
}

/**
 * Hook pour supprimer une entité (DELETE)
 * @param url - URL de base de l'endpoint API (sans l'ID)
 * @param queryKeysToInvalidate - Clés de cache à invalider après mutation
 */
export function useAxiosDelete<TData = unknown>(
  url: string,
  queryKeysToInvalidate?: readonly unknown[][],
  options?: any
): UseMutationResult<TData, Error, string | number> {
  const queryClient = useQueryClient();
  
  return useMutation<TData, Error, string | number>({
    mutationFn: async (id: string | number) => {
      const fullUrl = `${url}/${id}`;
      const response = await apiClient.delete<TData>(fullUrl);
      return extractData<TData>(response.data);
    },
    onSuccess: () => {
      if (queryKeysToInvalidate) {
        queryKeysToInvalidate.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
      }
    },
    ...options,
  });
}
