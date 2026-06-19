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
  AlertCircle,
  Heart,
  Users,
  BarChart3,
  CheckCircle2
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
      const decoded = jwtDecode<DecodedToken>(response.token);
      setDecodedToken(decoded);
      roleRedirect(decoded?.role || '');

      toast.success("Connexion réussie !", {
        description: `Bienvenue ${credentials.username} !`
      });
    } catch (error : any) {
       let errorMessage = 'Une erreur est survenue lors de la connexion';

      if (error?.status !== 500) {
        if (error?.message) {
          errorMessage = error?.details?.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
      }

      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL — Blue gradient branding ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex-col justify-between p-10 xl:p-14 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 right-8 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm">
            <AppLogo className="h-8 w-8 brightness-0 invert" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">VacciMed</div>
            <div className="text-sm text-blue-200">Plateforme de Vaccination</div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
              La santé publique,
              <span className="block text-blue-200">notre priorité</span>
            </h2>
            <p className="text-blue-100 text-base leading-relaxed max-w-md">
              Gérez vos campagnes de vaccination avec efficacité et sécurité.
              Une plateforme conçue pour les professionnels de santé.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              { icon: Heart,    text: "Suivi personnalisé de chaque patient" },
              { icon: Shield,   text: "Données chiffrées et conformes RGPD" },
              { icon: BarChart3,text: "Rapports et analyses avancés" },
              { icon: Users,    text: "Gestion multi-centres en temps réel" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-blue-100 text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">50 000+</div>
              <div className="text-xs text-blue-200 mt-1">Patients suivis</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">200+</div>
              <div className="text-xs text-blue-200 mt-1">Centres partenaires</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative text-blue-300 text-xs">
          © 2025 VacciMed — Tous droits réservés
        </div>
      </div>

      {/* ── RIGHT PANEL — Login form (blue & white) ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-8 relative overflow-hidden">

        {/* Decorative background circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/60 dark:bg-blue-950/20 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100/50 dark:bg-blue-950/15 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white dark:bg-transparent rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-60" />

        {/* Thin blue top accent bar (mobile — visible when left panel is hidden) */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-300 via-blue-600 to-blue-300" />

        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 gap-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Retour à l'accueil</span>
            <span className="sm:hidden">Retour</span>
          </Link>
        </Button>

        <div className="w-full max-w-sm sm:max-w-md relative">

          {/* Header avec logo */}
          <div className="text-center mb-7 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/25 rounded-2xl blur-md" />
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/35">
                  <AppLogo className="h-10 w-10 sm:h-12 sm:w-12 brightness-0 invert" />
                </div>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5">
              Bienvenue sur VacciMed
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Connectez-vous à votre espace professionnel
            </p>
          </div>

          {/* Carte de connexion */}
          <Card className="border border-blue-100 dark:border-blue-900/50 shadow-xl shadow-blue-200/30 dark:shadow-none bg-white dark:bg-slate-900 backdrop-blur-sm">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm shadow-blue-500/30">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                Connexion sécurisée
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Réservé aux professionnels de santé autorisés
              </CardDescription>
            </CardHeader>

            {loginError && (
              <div className="px-5 sm:px-6 pb-2">
                <Alert variant="destructive" className="border border-destructive/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              </div>
            )}

            <CardContent className="p-5 sm:p-6 pt-2">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Identifiant */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    Identifiant
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="docteur@vaccimed.sn"
                    value={username}
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 text-sm border-blue-100 dark:border-blue-900/50 focus:border-blue-400 focus:ring-blue-300/40 bg-blue-50/40 dark:bg-slate-800"
                    required
                  />
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                    <Lock className="h-3.5 w-3.5 text-blue-500" />
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 text-sm border-blue-100 dark:border-blue-900/50 focus:border-blue-400 focus:ring-blue-300/40 bg-blue-50/40 dark:bg-slate-800 pr-11"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-blue-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-background border-blue-200 rounded focus:ring-blue-400/30 focus:ring-2"
                    />
                    <span className="text-muted-foreground text-xs sm:text-sm">Se souvenir de moi</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm">
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Bouton connexion */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-white h-11 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md shadow-blue-500/30 border-0 mt-1"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connexion en cours...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      <span>Se connecter</span>
                    </div>
                  )}
                </Button>
              </form>

              <Separator className="my-5 bg-blue-100 dark:bg-blue-900/30" />

              {/* Badge certification */}
              <div className="text-center mb-4">
                <Badge className="gap-1.5 text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100">
                  <Stethoscope className="h-3 w-3" />
                  Plateforme Médicale Certifiée
                </Badge>
              </div>

              {/* Security hints */}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3.5 border border-blue-100 dark:border-blue-900/40 space-y-2">
                {[
                  "Données de santé chiffrées et sécurisées",
                  "Conformité RGPD et normes hospitalières",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-blue-600 transition-colors">Confidentialité</a>
            <span className="text-blue-200">•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Conditions d'utilisation</a>
            <span className="text-blue-200">•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
