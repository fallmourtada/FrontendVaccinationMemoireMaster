// Interface pour les credentials de connexion
export interface AuthCredentials {
  readonly username: string;
  readonly password: string;
}

// Interface pour les données d'authentification
export interface AuthToken {
  readonly token: string;
  readonly expiresAt: number;
}


// Interface pour le token décodé
export interface DecodedToken {
  role: string;
  scope: string;
  sub: string; // email de l'utilisateur
  iat: number;
  exp: number;
}