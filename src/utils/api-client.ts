import type { ApiError, ApiResponse } from '@/types';
import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios';
import { GATEWAY_URL } from './api-config';
import { AuthService } from '@/services/auth.service';


// ================================
// CLASSE API CLIENT 
// ================================

class ApiClient {
  private client = axios.create({
    baseURL: GATEWAY_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Routes publiques qui ne nécessitent pas de token
  private publicRoutes = [
    '/api/auth/v1/login',
    '/api/auth/v1/register',
    '/api/auth/v1/forgot-password',
    '/api/auth/v1/reset-password',
    '/api/v1/users/enfants/by-access-token'
  ];

  constructor() {
    this.setupInterceptors();
  }

  private isPublicRoute(url: string | undefined): boolean {
    if (!url) return false;
    return this.publicRoutes.some(route => url.includes(route));
  }

  private setupInterceptors(): void {
    // Intercepteur pour les requêtes
    this.client.interceptors.request.use(
      (config) => {
        // Ne pas ajouter le token pour les routes publiques
        if (!this.isPublicRoute(config.url)) {
          const token = AuthService.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          console.log(`[API Token] ${token ? 'Token présent' : 'Pas de token'}`);
        } else {
          console.log(`[API Public Route] Pas de token requis pour ${config.url}`);
        }
        
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
      },
      (error: any) => {
        console.error('[API Request Error]', error.message);
        return Promise.reject(error);
      }
    );

    // Intercepteur pour les réponses
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
        return response;
      },
      (error: any) => {
        console.error('[API Response Error]', error.message, error.response?.data);
        
        // Gérer les erreurs d'authentification
        if (error.response?.status === 401) {
          console.warn('[API] Token expiré ou invalide - Déconnexion');
          AuthService.removeAuthToken();
          // Optionnel: rediriger vers login
          // window.location.href = '/login';
        }
        
        // Gérer les erreurs d'autorisation (403)
        if (error.response?.status === 403) {
          console.warn('[API] Accès refusé - Vérifiez les permissions de l\'utilisateur');
          console.warn('[API] URL:', error.config?.url);
          console.warn('[API] Token utilisé:', error.config?.headers?.Authorization ? 'Présent' : 'Absent');
        }
        
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: any): ApiError {
    // Messages d'erreur plus explicites selon le code HTTP
    let message = error.response?.data?.message || error.message || 'Une erreur est survenue';
    
    if (error.response?.status === 401) {
      message = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.response?.status === 403) {
      message = 'Accès non autorisé. Vous n\'avez pas les permissions nécessaires.';
    } else if (error.response?.status === 404) {
      message = 'Ressource non trouvée.';
    } else if (error.response?.status === 500) {
      message = 'Erreur serveur. Veuillez réessayer plus tard.';
    }
    
    return {
      message,
      code: error.response?.data?.code || `HTTP_${error.response?.status}` || 'UNKNOWN_ERROR',
      details: error.response?.data
    };
  }

  // Méthodes HTTP typées
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.get<ApiResponse<T>>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.post<ApiResponse<T>>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.put<ApiResponse<T>>(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.patch<ApiResponse<T>>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.delete<ApiResponse<T>>(url, config);
  }
}

// Instance singleton
export const apiClient = new ApiClient();

// Export par défaut de l'instance API
export default apiClient;
