import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  EyeOff, 
  Shield, 
  ArrowLeft, 
  Mail, 
  Lock, 
  UserCheck, 
  Stethoscope,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { AppLogo } from "@/utils/common";
import { useLogin } from "@/services/auth.service";
import { useRoleRedirect } from "@/helpers/Role-based-redirect";
import type { AuthCredentials, DecodedToken } from "@/types";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDecodedToken } from "@/contexts/decoded-token-context";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { mutateAsync: login } = useLogin();

  const { setDecodedToken } = useDecodedToken();

  const roleRedirect = useRoleRedirect();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    const formData = new FormData(e.currentTarget);

    const credentials: AuthCredentials = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    }

    try {
      const response = await login(credentials);
      console.log('Login response:', response.token);
      // Décoder le token fraîchement reçu
      const decoded = jwtDecode<DecodedToken>(response.token);
      // Mettre à jour le contexte
      setDecodedToken(decoded);

      // console.log('Decoded token after login:', decoded);
      roleRedirect(decoded?.role || '');

      toast.success("Connexion réussie !",
        {
          description: `Bienvenue ${credentials.username} !`
        }
      );
    } catch (error : any) {
       let errorMessage = 'Une erreur est survenue lors de la connexion';
      //  console.error('Login error object:', error);

      if (error?.status !== 500) {
        if (error?.message) {
          errorMessage = error?.details?.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
      }

      setLoginError(errorMessage);

      //  console.error("Login failed:", error.message);
      toast.error(errorMessage);
    }finally {
      setLoading(false);
    }

    // Simulation de connexion
    // setTimeout(() => {
    //   setLoading(false);
    //   // Redirection vers le dashboard après connexion
    //   window.location.href = "/medecin/accueil";
    // }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-3 sm:p-4">
      {/* Bouton retour */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-3 left-3 sm:top-6 sm:left-6 gap-2 text-xs sm:text-sm"
        asChild
      >
        <Link to="/">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Retour à l'accueil</span>
          <span className="sm:hidden">Retour</span>
        </Link>
      </Button>

      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header avec logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <AppLogo className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2 px-2 sm:px-0">
            Espace Professionnel de Santé
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground px-2 sm:px-0">
            Accédez à votre plateforme de gestion vaccinale
          </p>
        </div>

        {/* Carte de connexion */}
        <Card className="border-2 border-border/50 shadow-xl backdrop-blur mx-2 sm:mx-0">
          <CardHeader className="space-y-1 pb-4 sm:pb-6 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-2xl text-center flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Espace Sécurisé
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Connexion protégée pour les professionnels de santé
            </CardDescription>
          </CardHeader>

            {loginError && (
              <div className="px-4 sm:px-6">
                <Alert variant="destructive" className="border-1 border-destructive/30 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              </div>
            )}


          <CardContent className="space-y-2 sm:space-y-4 p-4 sm:p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Champ Email */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  Adresse e-mail professionnelle
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="docteur@vaccimed.sn"
                  value={username}
                  name="username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 sm:h-12 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Champ Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  Mot de passe sécurisé
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 sm:h-12 text-sm sm:text-base pr-10 sm:pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Options de connexion */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-xs sm:text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-3 h-3 sm:w-4 sm:h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-muted-foreground">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-primary hover:text-primary/80 font-medium">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Bouton de connexion */}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-white h-10 sm:h-12 text-base sm:text-lg font-medium"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">Connexion en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">Se connecter</span>
                  </div>
                )}
              </Button>
            </form>

            <Separator className="my-4 sm:my-6" />

            {/* Informations de sécurité */}
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center">
                <Badge variant="secondary" className="gap-2 text-xs sm:text-sm">
                  <Stethoscope className="h-3 w-3" />
                  Plateforme Médicale Certifiée
                </Badge>
              </div>

              {/* <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent-foreground flex-shrink-0" />
                  <span>Données de santé chiffrées et sécurisées</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent-foreground flex-shrink-0" />
                  <span>Conformité RGPD et normes hospitalières</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent-foreground flex-shrink-0" />
                  <span>Authentification multi-facteurs disponible</span>
                </div>
              </div> */}
            </div>

            {/* Assistance */}
            {/* <div className="bg-accent/10 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Besoin d'aide ?</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Notre équipe support est disponible 24h/24 pour vous accompagner.
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="h-3 w-3" />
                Contacter le support
              </Button>
            </div> */}

            {/* Informations de compte de démonstration */}
            {/* <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-primary">Compte de démonstration</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div><strong>Email:</strong> demo@vaccimed.fr</div>
                  <div><strong>Mot de passe:</strong> Demo2025!</div>
                </div>
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 space-y-3 px-2 sm:px-0">
          {/* <p className="text-sm text-muted-foreground">
            Vous n'avez pas encore d'accès professionnel ?
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              Demander un accès médical
            </Link>
          </Button> */}
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-foreground transition-colors">Conditions d'utilisation</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
