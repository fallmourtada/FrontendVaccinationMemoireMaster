import { useAxiosGet } from "@/hooks/use-api";
import type { VaccinationDTO } from "@/types";
import { buildUserUrl } from "@/utils/api-config";

/**
 * Clés de cache pour le carnet public
 */
export const PUBLIC_CARNET_KEYS = {
  byAccessToken: (accessToken: string) => ['public-carnet', accessToken] as const,
};

/**
 * Hook pour récupérer les vaccinations d'un enfant via son accessToken (QR code)
 * GET /api/v1/users/enfants/by-access-token/{accessToken}/with-vaccinations
 * Cette route est publique — pas besoin d'authentification
 */
export const useVaccinationsByAccessToken = (accessToken: string | undefined) => {
  const url = accessToken
    ? buildUserUrl('enfantVaccinations', { accessToken })
    : '';
  
  return useAxiosGet<VaccinationDTO[]>(
    PUBLIC_CARNET_KEYS.byAccessToken(accessToken || ''),
    url,
    {},
    { enabled: !!accessToken }
  );
};
