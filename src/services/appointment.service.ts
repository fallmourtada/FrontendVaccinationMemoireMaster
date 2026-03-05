import type { AppointmentDTO, SaveAppointmentDTO, UpdateAppointmentDTO, UpdateStatutAppointmentDTO } from "@/types";
import { buildAppointmentUrl } from "@/utils/api-config";
import { useAxiosDelete, useAxiosGet, useAxiosPost, useAxiosPut } from "@/hooks/use-api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import apiClient from "@/utils/api-client";


/** 
 * Clés de requête pour les appointments
 */
const APPOINTMENTS_KEYS = {
  all: ['appointments'] as const,
  lists: () => [...APPOINTMENTS_KEYS.all, 'list'] as const,
  detail: (id: string | number) => [...APPOINTMENTS_KEYS.all, 'detail', id] as const,
  byEnfant: (enfantId: string | number) => [...APPOINTMENTS_KEYS.all, 'byEnfant', enfantId] as const,
  byUser: (userId: string | number) => [...APPOINTMENTS_KEYS.all, 'byUser', userId] as const,
};

/**
 * Hook pour récupérer tous les appointments 
 * GET /api/v1/appointments
 */
export const useAllAppointments = () => {
  const url = buildAppointmentUrl('appointments');
  return useAxiosGet<AppointmentDTO[]>(
    APPOINTMENTS_KEYS.lists(),
    url
  );
};

/**
 * Hook pour récupérer un appointment par son ID
 * GET /api/v1/appointments/{id}
 */
export const useAppointmentById = (appointmentId: string | number) => {
  const url = buildAppointmentUrl('byId', { id: String(appointmentId) });
  return useAxiosGet<AppointmentDTO>(
    APPOINTMENTS_KEYS.detail(appointmentId),
    url,
    undefined,
    { enabled: !!appointmentId }
  );
};

/**
 * Hook pour récupérer les appointments d'un enfant spécifique
 * GET /api/v1/appointments/enfant/{enfantId}
 */
export const useAppointmentsByEnfant = (enfantId: string | number) => {
  const url = buildAppointmentUrl('by_enfant', { enfantId: String(enfantId) });
  return useAxiosGet<AppointmentDTO[]>(
    APPOINTMENTS_KEYS.byEnfant(enfantId),
    url,
    undefined,
    { enabled: !!enfantId }
  );
};

/**
 * Hook pour récupérer les appointments d'un utilisateur (infirmier/médecin)
 * GET /api/v1/appointments/user/{userId}
 */
export const useAppointmentsByUser = (userId: string | number) => {
  const url = buildAppointmentUrl('by_user', { userId: String(userId) });
  return useAxiosGet<AppointmentDTO[]>(
    APPOINTMENTS_KEYS.byUser(userId),
    url,
    undefined,
    { enabled: !!userId }
  );
};

/**
 * Hook pour créer un nouveau rendez-vous
 * POST /api/v1/appointments?userId=X&enfantId=Y
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const baseUrl = buildAppointmentUrl('appointments');
  
  return useMutation<AppointmentDTO, Error, { data: SaveAppointmentDTO; userId: number; enfantId: number }>({
    mutationFn: async ({ data, userId, enfantId }) => {
      const url = `${baseUrl}?userId=${userId}&enfantId=${enfantId}`;
      const response = await apiClient.post<AppointmentDTO>(url, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEYS.all });
    }
  });
};

/**
 * Hook pour mettre à jour un rendez-vous
 * PUT /api/v1/appointments/{id}
 */
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  const url = buildAppointmentUrl('appointments');

  return useAxiosPut<AppointmentDTO, UpdateAppointmentDTO & { id: number }>(
    url,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEYS.all });
      }
    }
  );
};

/**
 * Hook pour supprimer un rendez-vous
 * DELETE /api/v1/appointments/{id}
 */
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  const url = buildAppointmentUrl('appointments');

  return useAxiosDelete(
    url,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEYS.all });
      }
    }
  );
};

/**
 * Hook pour mettre à jour le statut d'un rendez-vous
 * PUT /api/v1/appointments/{id}/status
 */
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { appointmentId: number; data: UpdateStatutAppointmentDTO }>({
    mutationFn: async ({ appointmentId, data }) => {
      const url = buildAppointmentUrl('updateStatus', { appointmentId: String(appointmentId) });
      await apiClient.put(url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEYS.all });
    }
  });
};

// Alias pour compatibilité
export const useCancelAppointment = useDeleteAppointment;