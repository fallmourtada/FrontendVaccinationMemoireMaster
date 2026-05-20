import { apiClient } from '@/utils/api-client';
import type { LocaliteDTO, LocaliteCreateDTO } from '@/types/localite';

const LOCALITIES_API_PREFIX = '/api/v1/localities';

// Types pour les centres de santé
export interface Centre {
  id: number;
  name: string;
  type: 'DISTRICT' | 'POSTE_DE_SANTE' | 'CENTRE_DE_SANTE';
  phone?: string;
  quartier?: string;
  locality?: LocaliteDTO;
  parent?: Centre;
  createdAt?: string;
  updatedAt?: string;
}

const toNumericId = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const resolveDistrictIdFromCentre = (centre: Centre): number | null => {
  const directLocalityId = toNumericId(centre.locality?.id);
  if (directLocalityId !== null) return directLocalityId;

  const parentId = toNumericId(centre.parent?.id);
  if (centre.parent?.type === 'DISTRICT' && parentId !== null) {
    return parentId;
  }

  const parentLocalityId = toNumericId(centre.parent?.locality?.id);
  if (parentLocalityId !== null) return parentLocalityId;

  return null;
};

export type SaveLocalityDTO = LocaliteCreateDTO;

export interface SaveCentreDTO {
  name: string;
  phone?: string;
  quartier?: string;
  locationId?: number;
  parentId?: number;
}

// Re-export para compatibilidad
export type { LocaliteDTO };

/**
 * Service pour gérer les localités et les centres de santé
 */
const localityService = {
  // ===== RÉGIONS =====
  getAllRegions: async () => {
    try {
      const response = await apiClient.get<LocaliteDTO[]>(`${LOCALITIES_API_PREFIX}/types/regions`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des régions:', error);
      throw error;
    }
  },

  createRegion: async (name: string, codification?: string) => {
    try {
      const payload = {
        name,
        codification: codification || '',
        type: 'REGION' as const,
      };
      const response = await apiClient.post<LocaliteDTO>(`${LOCALITIES_API_PREFIX}/types/regions`, payload);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la région:', error);
      throw error;
    }
  },

  // ===== DÉPARTEMENTS =====
  getAllDepartments: async () => {
    try {
      const response = await apiClient.get<LocaliteDTO[]>(`${LOCALITIES_API_PREFIX}/types/departments`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error);
      throw error;
    }
  },

  getDepartmentsByRegion: async (regionId: string | number) => {
    try {
      const response = await apiClient.get<LocaliteDTO[]>(
        `${LOCALITIES_API_PREFIX}/types/regions/${regionId}/departments`
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des départements de la région ${regionId}:`, error);
      throw error;
    }
  },

  createDepartment: async (regionId: string | number, name: string, codification?: string) => {
    try {
      const payload = {
        name,
        codification: codification || '',
        type: 'DEPARTMENT' as const,
        parentId: String(regionId),
      };
      const response = await apiClient.post<LocaliteDTO>(
        `${LOCALITIES_API_PREFIX}/types/regions/${regionId}/departments`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du département:', error);
      throw error;
    }
  },

  // ===== DISTRICTS =====
  getAllDistricts: async () => {
    try {
      const response = await apiClient.get<LocaliteDTO[]>(`${LOCALITIES_API_PREFIX}/types/districts`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des districts:', error);
      throw error;
    }
  },

  getDistrictsByDepartment: async (departmentId: string | number) => {
    try {
      const response = await apiClient.get<LocaliteDTO[]>(
        `${LOCALITIES_API_PREFIX}/types/departments/${departmentId}/districts`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des districts du département ${departmentId}:`,
        error
      );
      throw error;
    }
  },

  createDistrict: async (departmentId: string | number, name: string, codification?: string) => {
    try {
      const payload = {
        name,
        codification: codification || '',
        type: 'DISTRICT' as const,
        parentId: String(departmentId),
      };
      const response = await apiClient.post<LocaliteDTO>(
        `${LOCALITIES_API_PREFIX}/types/departments/${departmentId}/districts`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du district:', error);
      throw error;
    }
  },

  // ===== COMMUNES =====
  getAllCommunes: async () => {
    try {
      const response = await apiClient.get<LocaliteDTO[]>(`${LOCALITIES_API_PREFIX}/types/communes`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des communes:', error);
      throw error;
    }
  },

  getCommunesByDistrict: async (districtId: string | number) => {
    try {
      const response = await apiClient.get<LocaliteDTO[]>(
        `${LOCALITIES_API_PREFIX}/types/districts/${districtId}/communes`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des communes du district ${districtId}:`,
        error
      );
      throw error;
    }
  },

  // ===== CENTRES DE SANTÉ =====
  getAllCentres: async () => {
    try {
      const response = await apiClient.get<Centre[]>(`${LOCALITIES_API_PREFIX}/centres`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des centres:', error);
      throw error;
    }
  },

  getCentresByDistrict: async (districtId: string | number) => {
    const targetDistrictId = toNumericId(districtId);

    try {
      const response = await apiClient.get<Centre[]>(
        `${LOCALITIES_API_PREFIX}/centres/by-district/${districtId}`
      );
      if (response.data.length > 0) {
        return response.data;
      }

      // Fallback: certains environnements renvoient la liste vide sur by-district.
      // On récupère tous les centres et on filtre côté client.
      const allCentresResponse = await apiClient.get<Centre[]>(`${LOCALITIES_API_PREFIX}/centres`);
      return allCentresResponse.data.filter((centre) => {
        const centreDistrictId = resolveDistrictIdFromCentre(centre);
        return targetDistrictId !== null && centreDistrictId === targetDistrictId;
      });
    } catch (error) {
      // Si l'endpoint by-district échoue, on tente aussi le fallback.
      try {
        const allCentresResponse = await apiClient.get<Centre[]>(`${LOCALITIES_API_PREFIX}/centres`);
        return allCentresResponse.data.filter((centre) => {
          const centreDistrictId = resolveDistrictIdFromCentre(centre);
          return targetDistrictId !== null && centreDistrictId === targetDistrictId;
        });
      } catch (fallbackError) {
        console.error(
          `Erreur lors de la récupération des centres du district ${districtId}:`,
          fallbackError
        );
        throw fallbackError;
      }
    }
  },

  createCentre: async (
    districtId: string | number,
    name: string,
    phone?: string,
    type: 'DISTRICT' | 'POSTE_DE_SANTE' | 'CENTRE_DE_SANTE' = 'CENTRE_DE_SANTE'
  ) => {
    try {
      const payload: SaveCentreDTO = {
        name,
        phone,
        locationId: typeof districtId === 'string' ? parseInt(districtId, 10) : districtId,
      };

      let url = `${LOCALITIES_API_PREFIX}/centres/centre-sante`;
      if (type === 'POSTE_DE_SANTE') {
        url = `${LOCALITIES_API_PREFIX}/centres/poste-de-sante?quartier=${encodeURIComponent(name)}`;
      } else if (type === 'DISTRICT') {
        url = `${LOCALITIES_API_PREFIX}/centres/district`;
      }

      const response = await apiClient.post<Centre>(url, payload);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du centre:', error);
      throw error;
    }
  },

  // ===== OPÉRATIONS GÉNÉRALES =====
  getLocalityById: async (localityId: string | number) => {
    try {
      const response = await apiClient.get<LocaliteDTO>(`${LOCALITIES_API_PREFIX}/${localityId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la localité ${localityId}:`, error);
      throw error;
    }
  },

  getCentreById: async (centreId: string | number) => {
    try {
      const response = await apiClient.get<Centre>(`${LOCALITIES_API_PREFIX}/centres/${centreId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du centre ${centreId}:`, error);
      throw error;
    }
  },

  updateLocality: async (localityId: string | number, updates: Partial<SaveLocalityDTO>) => {
    try {
      const response = await apiClient.put<LocaliteDTO>(`${LOCALITIES_API_PREFIX}/${localityId}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la localité ${localityId}:`, error);
      throw error;
    }
  },

  updateCentre: async (centreId: string | number, updates: Partial<SaveCentreDTO>) => {
    try {
      const response = await apiClient.put<Centre>(`${LOCALITIES_API_PREFIX}/centres/${centreId}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du centre ${centreId}:`, error);
      throw error;
    }
  },

  deleteLocality: async (localityId: string | number) => {
    try {
      await apiClient.delete(`${LOCALITIES_API_PREFIX}/${localityId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la localité ${localityId}:`, error);
      throw error;
    }
  },

  deleteCentre: async (centreId: string | number) => {
    try {
      await apiClient.delete(`${LOCALITIES_API_PREFIX}/centres/${centreId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du centre ${centreId}:`, error);
      throw error;
    }
  },

  /**
   * ID du centre (entité) à passer à POST /api/v1/users/ICP?districtId=…
   * = centre de type DISTRICT rattaché à la localité district, pas l'id de la localité.
   */
  resolveDistrictSanitaireCentreId: async (localityDistrictId: string | number): Promise<number> => {
    const target = toNumericId(localityDistrictId);
    if (target === null) {
      throw new Error("ID de district (localité) invalide.");
    }

    const inDistrict = await localityService.getCentresByDistrict(localityDistrictId);
    const direct = inDistrict.find((c) => c.type === 'DISTRICT');
    if (direct?.id != null) return direct.id;

    const all = await localityService.getAllCentres();
    const byLocality = all.find(
      (c) => c.type === 'DISTRICT' && toNumericId(c.locality?.id) === target
    );
    if (byLocality?.id != null) return byLocality.id;

    const parentIsDistrict = all.find(
      (c) =>
        c.parent?.type === 'DISTRICT' &&
        toNumericId(c.parent?.locality?.id) === target
    );
    if (parentIsDistrict?.parent?.id != null) return parentIsDistrict.parent.id;

    const parentIsDistrict2 = all.find(
      (c) =>
        c.parent?.type === 'DISTRICT' && toNumericId(c.locality?.id) === target
    );
    if (parentIsDistrict2?.parent?.id != null) return parentIsDistrict2.parent.id;

    const onlyLinked = all.find(
      (c) =>
        c.type === 'DISTRICT' &&
        (toNumericId(c.locality?.id) === target || toNumericId(c.parent?.locality?.id) === target)
    );
    if (onlyLinked?.id != null) return onlyLinked.id;

    throw new Error(
      "Aucun district sanitaire (centre de type DISTRICT) trouvé pour ce district. Créez d’abord le district sanitaire côté API localités, ou vérifiez le rattachement des centres."
    );
  },
};

export default localityService;

