import type { ServiceConfig, UrlParams } from '@/types';

// ================================
// CONFIGURATION DES MICROSERVICES
// ================================

// En développement, VITE_API_URL peut être vide pour utiliser le proxy Vite
// En production, VITE_API_URL doit pointer vers la gateway
export const GATEWAY_URL = import.meta.env.VITE_API_URL || '';

// Configuration typée avec 'as const' pour l'inférence stricte des types littéraux
export const MICROSERVICES_CONFIG = {
  AUTH_SERVICE: {
    baseURL: GATEWAY_URL,
    basePath: '/api/auth/v1',
    endpoints: {
      login: '/login',
      register: '/register',
      changePassword: '/change-password',
    }
  },
  USER_SERVICE: {
    baseURL: GATEWAY_URL,
    basePath: '/api/v1/users',
    endpoints: {
      // Endpoints Utilisateurs
      users: '',                                          // GET: tous les utilisateurs
      userById: '/{id}',                                  // GET: utilisateur par ID
      userByEmail: '/findUserByEmail/{email}',            // GET: utilisateur par email
      userByTelephone: '/telephone/{telephone}',          // GET: utilisateur par téléphone
      createParent: '/parent',                            // POST: créer parent (?centreId=X)
      createInfirmier: '/Infirmier',                      // POST: créer infirmier (?centreId=X)
      createICP: '/ICP',                                  // POST: créer ICP (?districtId=X)
      updateUser: '/{id}',                                // PUT: mettre à jour utilisateur
      deleteUser: '/{id}',                                // DELETE: supprimer utilisateur
      validateUser: '/validate',                          // GET: valider utilisateur
      
      // Endpoints Enfants
      enfants: '/enfants',                                // GET: tous les enfants
      enfantById: '/enfants/{id}',                        // GET: enfant par ID
      enfantByQrCode: '/enfants/by-qr-code/{qrCode}',     // GET: enfant par QR code
      createEnfant: '/enfants',                           // POST: créer enfant (?parentId=X)
      updateEnfant: '/enfants/{id}',                      // PUT: mettre à jour enfant
      deleteEnfant: '/enfants/{id}',                      // DELETE: supprimer enfant
      enfantStats: '/enfants/stats/total',                // GET: statistiques enfants
      enfantVaccinations: '/enfants/by-access-token/{accessToken}/with-vaccinations' // GET: vaccinations enfant
    }
  },
  LOCALITE_SERVICE: {
    baseURL: GATEWAY_URL,
    basePath: '/api/v1/localites',
    endpoints: {
      localites: '',
      regions: '/types/regions',
      departments: '/types/regions/{regionId}/departments',
      communes: '/types/departments/{departmentId}/communes'
    }
  },
  APPOINTMENT_SERVICE: {
    baseURL: GATEWAY_URL,
    basePath: '/api/v1/appointments',
    endpoints: {
      appointments: '',                           // GET: tous, POST: créer (avec ?userId=X&enfantId=Y)
      byId: '/{id}',                              // GET: par ID, PUT: update, DELETE: supprimer
      by_user: '/user/{userId}',                  // GET: par utilisateur
      by_enfant: '/enfant/{enfantId}',            // GET: par enfant
      updateStatus: '/{appointmentId}/status'     // PUT: changer statut
    }
  },
  VACCINATION_SERVICE: {
    baseURL: GATEWAY_URL,
    basePath: '/api/v1/vaccinations',
    endpoints: {
      vaccinations: '',                           // GET: tous, POST: créer (avec ?params)
      byId: '/{id}',                              // GET: par ID, PUT: update, DELETE: supprimer
      by_enfant: '/enfant/{enfantId}',            // GET: par enfant
      by_vaccine: '/vaccine/{vaccineId}'          // GET: par vaccin
    }
  },
  VACCIN_SERVICE: {
    baseURL: GATEWAY_URL,
    basePath: '/api/v1/vaccines',
    endpoints: {
      vaccins: '',
      calendrier: '/calendrier',
      by_age: '/by-age/{ageInMonths}',
      details: '/details/{vaccineId}'
    }
  }
} as const satisfies Record<string, ServiceConfig>;

// Types inférés automatiquement depuis la configuration
type ServiceKey = keyof typeof MICROSERVICES_CONFIG;
type AuthEndpoints = keyof typeof MICROSERVICES_CONFIG.AUTH_SERVICE.endpoints;
type UserEndpoints = keyof typeof MICROSERVICES_CONFIG.USER_SERVICE.endpoints;
type LocationEndpoints = keyof typeof MICROSERVICES_CONFIG.LOCALITE_SERVICE.endpoints;
type AppointmentEndpoints = keyof typeof MICROSERVICES_CONFIG.APPOINTMENT_SERVICE.endpoints;
type VaccinationEndpoints = keyof typeof MICROSERVICES_CONFIG.VACCINATION_SERVICE.endpoints;
type VaccinEndpoints = keyof typeof MICROSERVICES_CONFIG.VACCIN_SERVICE.endpoints;

// ================================
// GÉNÉRATEUR D'URL TYPÉ
// ================================

/**
 * Construit une URL d'API relative (sans baseURL) avec gestion des paramètres
 * Le baseURL est géré par axios dans api-client.ts
 * @param service - Le service cible
 * @param endpoint - Le point de terminaison
 * @param params - Les paramètres pour l'URL
 * @returns L'URL relative (ex: /api/v1/users)
 */
export const buildApiUrl = <T extends ServiceKey>(
  service: T,
  endpoint: string,
  params: UrlParams = {}
): string => {
  const config = MICROSERVICES_CONFIG[service];
  if (!config) {
    throw new Error(`Service ${String(service)} non configuré`);
  }
  
  // Retourne seulement le chemin relatif (basePath + endpoint)
  // Le baseURL est géré par axios
  let url = `${config.basePath}${endpoint}`;
  
  // Remplacer les paramètres dans l'URL (ex: {regionId})
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, String(value));
  });
  
  return url;
};

// ================================
// FONCTIONS HELPER TYPÉES
// ================================

export const buildAuthUrl = (endpoint: AuthEndpoints, params: UrlParams = {}): string => {
  return buildApiUrl<"AUTH_SERVICE">('AUTH_SERVICE', MICROSERVICES_CONFIG.AUTH_SERVICE.endpoints[endpoint], params);
}

export const buildUserUrl = (endpoint: UserEndpoints, params: UrlParams = {}) => 
  buildApiUrl<"USER_SERVICE">('USER_SERVICE', MICROSERVICES_CONFIG.USER_SERVICE.endpoints[endpoint], params);

export const buildLocaliteUrl = (endpoint: LocationEndpoints, params: UrlParams = {}) => 
  buildApiUrl<"LOCALITE_SERVICE">('LOCALITE_SERVICE', MICROSERVICES_CONFIG.LOCALITE_SERVICE.endpoints[endpoint], params);

export const buildAppointmentUrl = (endpoint: AppointmentEndpoints, params: UrlParams = {}) => 
  buildApiUrl<"APPOINTMENT_SERVICE">('APPOINTMENT_SERVICE', MICROSERVICES_CONFIG.APPOINTMENT_SERVICE.endpoints[endpoint], params);

export const buildVaccinationUrl = (endpoint: VaccinationEndpoints, params: UrlParams = {}) => 
  buildApiUrl<"VACCINATION_SERVICE">('VACCINATION_SERVICE', MICROSERVICES_CONFIG.VACCINATION_SERVICE.endpoints[endpoint], params);

export const buildVaccinUrl = (endpoint: VaccinEndpoints, params: UrlParams = {}) => 
  buildApiUrl<"VACCIN_SERVICE">('VACCIN_SERVICE', MICROSERVICES_CONFIG.VACCIN_SERVICE.endpoints[endpoint], params);
