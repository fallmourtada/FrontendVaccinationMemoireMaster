import { useAxiosPost } from "@/hooks/use-api";
import type { AuthCredentials, AuthToken } from "@/types";
import { buildAuthUrl } from "@/utils/api-config";
import { useNavigate } from "react-router-dom";



  export class AuthService {
  
    static getAuthToken(): string | null {
        try {
        const tokenData = localStorage.getItem('authToken');
        if (!tokenData) return null;
        
        return tokenData;
        } catch {
            AuthService.removeAuthToken();
            return null;
        }
    }

    static setAuthToken(token: AuthToken): void {
        localStorage.setItem("authToken", token.token);
    }

    static removeAuthToken(): void {
        localStorage.removeItem('authToken');
    }

    static isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }

    static handleUnauthorized(): void {
        AuthService.removeAuthToken();
        // Redirection vers la page de login en utilisant window.location
        window.location.href = ''; // Ou '/login' si vous avez une page login dédiée
    }
    
}


/** Clés de requête pour les utilisateurs */
const USERS_KEYS = { 
  all : ['users'] as const,
  current : () => [...USERS_KEYS.all, 'current'] as const,
  detail : (id: number) => [...USERS_KEYS.all, 'detail', id] as const,
};


/** Hook personnalisé pour la connexion utilisateur */
export function useLogin() {
    const url = buildAuthUrl("login");

    return useAxiosPost<AuthToken, AuthCredentials>(
        url,
        undefined,
        {},
        {
            onSuccess: async (data: AuthToken) => {
                // console.log('Connexion utilisateur avec succès !', data.token);
                AuthService.setAuthToken(data);
            },
            onError: () => {
                // console.error('Erreur de connexion :', error.message);
            },
            staleTime: 5000, // Rafraîchir toutes les 5 secondes
        }
    );
}

/** Hook personnalisé pour la déconnexion utilisateur */
export function useLogout() {
//   const { setUser } = useUser();
  const navigate = useNavigate();

  return () => {
    AuthService.removeAuthToken();
    // setUser(null);
    navigate('/login', { replace: true }); // Redirection vers la page d'accueil
  };
}