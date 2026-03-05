import type { 
  UtilisateurDTO, 
  SaveParentDTO, 
  SaveInfirmierDTO, 
  UpdateUtilisateurDTO,
  EnfantDTO, 
  SaveEnfantDTO, 
  UpdateEnfantDTO,
  EnfantStats
} from "@/types";
import { buildUserUrl } from "@/utils/api-config";
import { useAxiosDelete, useAxiosGet, useAxiosGetById, useAxiosPost, useAxiosPut } from "@/hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/utils/api-client";


// ================================
// CLÉS DE REQUÊTE REACT QUERY
// ================================

/** 
 * Clés de requête pour les utilisateurs
 */
const USERS_KEYS = {
  all: ['users'] as const,
  lists: () => [...USERS_KEYS.all, 'list'] as const,
  detail: (id: string | number) => [...USERS_KEYS.all, 'detail', id] as const,
  byEmail: (email: string) => [...USERS_KEYS.all, 'email', email] as const,
  byTelephone: (telephone: string) => [...USERS_KEYS.all, 'telephone', telephone] as const,
};

/**
 * Clés de requête pour les enfants
 */
const ENFANTS_KEYS = {
  all: ['enfants'] as const,
  lists: () => [...ENFANTS_KEYS.all, 'list'] as const,
  detail: (id: string | number) => [...ENFANTS_KEYS.all, 'detail', id] as const,
  byQrCode: (qrCode: string) => [...ENFANTS_KEYS.all, 'qr-code', qrCode] as const,
  stats: () => [...ENFANTS_KEYS.all, 'stats'] as const,
  vaccinations: (accessToken: string) => [...ENFANTS_KEYS.all, 'vaccinations', accessToken] as const,
};


// ================================
// HOOKS UTILISATEURS
// ================================

/** 
 * Hook pour récupérer tous les utilisateurs
 * GET /api/v1/users
 */
export const useAllUsers = () => {
  const url = buildUserUrl('users');
  return useAxiosGet<UtilisateurDTO[]>(
    USERS_KEYS.lists(),
    url
  );
};

/** 
 * Hook pour récupérer un utilisateur par son ID
 * GET /api/v1/users/{id}
 */
export const useUserById = (userId: string | number | null | undefined) => {
  const url = buildUserUrl('users');
  return useAxiosGetById<UtilisateurDTO>(
    USERS_KEYS.all,
    url,
    userId
  );
};

/** 
 * Hook pour récupérer un utilisateur par son email
 * GET /api/v1/users/findUserByEmail/{email}
 */
export const useUserByEmail = (email: string) => {
  const url = buildUserUrl('userByEmail', { email });
  return useAxiosGet<UtilisateurDTO>(
    USERS_KEYS.byEmail(email),
    url,
    undefined,
    { enabled: !!email }
  );
};

/** 
 * Hook pour récupérer un utilisateur par son téléphone
 * GET /api/v1/users/telephone/{telephone}
 */
export const useUserByTelephone = (telephone: string) => {
  const url = buildUserUrl('userByTelephone', { telephone });
  return useAxiosGet<UtilisateurDTO>(
    USERS_KEYS.byTelephone(telephone),
    url,
    undefined,
    { enabled: !!telephone }
  );
};

/**
 * Hook pour créer un parent
 * POST /api/v1/users/parent?centreId={centreId}
 */
export const useCreateParent = (centreId: number) => {
  const queryClient = useQueryClient();
  const url = `${buildUserUrl('createParent')}?centreId=${centreId}`;

  return useAxiosPost<UtilisateurDTO, SaveParentDTO>(
    url,
    [USERS_KEYS.lists()],
    { timeout: 15000 },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
      }
    }
  );
};

/**
 * Hook pour créer un infirmier
 * POST /api/v1/users/Infirmier?centreId={centreId}
 */
export const useCreateInfirmier = (centreId: number) => {
  const queryClient = useQueryClient();
  const url = `${buildUserUrl('createInfirmier')}?centreId=${centreId}`;

  return useAxiosPost<UtilisateurDTO, SaveInfirmierDTO>(
    url,
    [USERS_KEYS.lists()],
    { timeout: 15000 },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
      }
    }
  );
};

/**
 * Hook pour créer un ICP
 * POST /api/v1/users/ICP?districtId={districtId}
 */
export const useCreateICP = (districtId: number) => {
  const queryClient = useQueryClient();
  const url = `${buildUserUrl('createICP')}?districtId=${districtId}`;

  return useAxiosPost<UtilisateurDTO, SaveInfirmierDTO>(
    url,
    [USERS_KEYS.lists()],
    { timeout: 15000 },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
      }
    }
  );
};

/**
 * Hook pour mettre à jour un utilisateur
 * PUT /api/v1/users/{id}
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const url = buildUserUrl('users');

  return useAxiosPut<UtilisateurDTO, UpdateUtilisateurDTO & { id: string | number }>(
    url,
    [USERS_KEYS.lists()],
    {
      onSuccess: (data: UtilisateurDTO) => {
        queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
        if (data.id) {
          queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(data.id) });
        }
      }
    }
  );
};

/**
 * Hook pour supprimer un utilisateur
 * DELETE /api/v1/users/{id}
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const url = buildUserUrl('users');

  return useAxiosDelete<void>(
    url,
    [USERS_KEYS.lists()],
    {
      onSuccess: (_data: any, variables: string | number) => {
        queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
        console.log(`Utilisateur ${variables} supprimé avec succès`);
      }
    }
  );
};


// ================================
// HOOKS ENFANTS
// ================================

/** 
 * Hook pour récupérer tous les enfants
 * GET /api/v1/users/enfants
 */
export const useAllEnfants = () => {
  const url = buildUserUrl('enfants');
  return useAxiosGet<EnfantDTO[]>(
    ENFANTS_KEYS.lists(),
    url
  );
};

/**
 * Hook pour récupérer un enfant par son ID
 * GET /api/v1/users/enfants/{id}
 */
export const useEnfantById = (enfantId: string | number | null | undefined) => {
  const url = buildUserUrl('enfants');
  return useAxiosGetById<EnfantDTO>(
    ENFANTS_KEYS.all,
    url,
    enfantId
  );
};

/**
 * Hook pour récupérer un enfant par son QR code
 * GET /api/v1/users/enfants/by-qr-code/{qrCode}
 */
export const useEnfantByQrCode = (qrCode: string) => {
  const url = buildUserUrl('enfantByQrCode', { qrCode });
  return useAxiosGet<EnfantDTO>(
    ENFANTS_KEYS.byQrCode(qrCode),
    url,
    undefined,
    { enabled: !!qrCode }
  );
};

/**
 * Hook pour créer un enfant
 * POST /api/v1/users/enfants?parentId={parentId}
 * Le parentId est passé dynamiquement avec les données de l'enfant
 */
export const useCreateEnfant = (parentId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<EnfantDTO, Error, SaveEnfantDTO & { parentId?: number }>({
    mutationFn: async (variables: SaveEnfantDTO & { parentId?: number }) => {
      // Utiliser le parentId passé dans les variables, sinon celui du hook
      const effectiveParentId = variables.parentId ?? parentId;
      console.log('[useCreateEnfant] Variables reçues:', variables);
      console.log('[useCreateEnfant] ParentId effectif:', effectiveParentId);
      
      if (!effectiveParentId) {
        throw new Error('Le parentId est requis pour créer un enfant');
      }
      // Enlever parentId des données envoyées au serveur
      const { parentId: _, ...enfantData } = variables;
      // Construire l'URL dynamiquement au moment de la mutation
      const url = `${buildUserUrl('enfants')}?parentId=${effectiveParentId}`;
      console.log('[useCreateEnfant] URL:', url);
      console.log('[useCreateEnfant] Données envoyées:', enfantData);
      
      const response = await apiClient.post<EnfantDTO>(url, enfantData, { timeout: 15000 });
      console.log('[useCreateEnfant] Réponse:', response);
      // Extraire les données de la réponse
      const responseData = response.data as any;
      if (responseData && typeof responseData === 'object' && 'data' in responseData && 'status' in responseData) {
        return responseData.data as EnfantDTO;
      }
      return responseData as EnfantDTO;
    },
    onSuccess: (data: EnfantDTO) => {
      queryClient.invalidateQueries({ queryKey: ENFANTS_KEYS.lists() });
      // Invalider aussi le cache du parent
      if (data.parent?.id) {
        queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(data.parent.id) });
      }
    }
  });
};

/**
 * Hook pour mettre à jour un enfant
 * PUT /api/v1/users/enfants/{id}
 */
export const useUpdateEnfant = () => {
  const queryClient = useQueryClient();
  const url = buildUserUrl('enfants');

  return useAxiosPut<EnfantDTO, UpdateEnfantDTO & { id: string | number }>(
    url,
    [ENFANTS_KEYS.lists()],
    {
      onSuccess: (data: EnfantDTO) => {
        queryClient.invalidateQueries({ queryKey: ENFANTS_KEYS.lists() });
        if (data.id) {
          queryClient.invalidateQueries({ queryKey: ENFANTS_KEYS.detail(data.id) });
        }
        // Invalider aussi le cache du parent
        if (data.parent?.id) {
          queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(data.parent.id) });
        }
      }
    }
  );
};

/**
 * Hook pour supprimer un enfant
 * DELETE /api/v1/users/enfants/{id}
 */
export const useDeleteEnfant = () => {
  const queryClient = useQueryClient();
  const url = buildUserUrl('enfants');

  return useAxiosDelete<void>(
    url,
    [ENFANTS_KEYS.lists()],
    {
      onSuccess: (_data: any, variables: string | number) => {
        queryClient.invalidateQueries({ queryKey: ENFANTS_KEYS.lists() });
        console.log(`Enfant ${variables} supprimé avec succès`);
      }
    }
  );
};

/**
 * Hook pour récupérer les statistiques des enfants
 * GET /api/v1/users/enfants/stats/total
 */
export const useEnfantStats = () => {
  const url = buildUserUrl('enfantStats');
  return useAxiosGet<EnfantStats>(
    ENFANTS_KEYS.stats(),
    url
  );
};

/**
 * Hook pour récupérer les vaccinations d'un enfant par son accessToken
 * GET /api/v1/users/enfants/by-access-token/{accessToken}/with-vaccinations
 */
export const useEnfantVaccinations = (accessToken: string) => {
  const url = buildUserUrl('enfantVaccinations', { accessToken });
  return useAxiosGet<any[]>( // Type VaccinationDTO[] à définir plus tard
    ENFANTS_KEYS.vaccinations(accessToken),
    url,
    undefined,
    { enabled: !!accessToken }
  );
};


// ================================
// ALIAS POUR COMPATIBILITÉ
// ================================

/** @deprecated Utilisez useUserById à la place */
export const useUserProfile = useUserById;

/** @deprecated Utilisez useEnfantVaccinations à la place */
export const useUserByToken = useEnfantVaccinations;


