import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Shield,
  Calendar,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Activity,
  MapPin,
  Clock,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { AppLogo } from "@/utils/common";

const MotherChildIllustration = () => (
  <svg viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Glowing background circles */}
    <circle cx="190" cy="195" r="170" fill="white" fillOpacity="0.04"/>
    <circle cx="170" cy="200" r="110" fill="white" fillOpacity="0.03"/>

    {/* === MOTHER FIGURE === */}
    {/* Hair back layer */}
    <ellipse cx="148" cy="70" rx="44" ry="30" fill="#93c5fd" fillOpacity="0.92"/>
    <ellipse cx="112" cy="98" rx="18" ry="35" fill="#93c5fd" fillOpacity="0.88"/>
    <ellipse cx="184" cy="98" rx="18" ry="35" fill="#93c5fd" fillOpacity="0.88"/>
    {/* Head */}
    <circle cx="148" cy="100" r="40" fill="white" fillOpacity="0.94"/>
    {/* Hair front */}
    <ellipse cx="148" cy="74" rx="40" ry="22" fill="#bfdbfe" fillOpacity="0.82"/>
    {/* Eyes */}
    <ellipse cx="136" cy="96" rx="4.5" ry="5" fill="#1e3a8a"/>
    <ellipse cx="160" cy="96" rx="4.5" ry="5" fill="#1e3a8a"/>
    <circle cx="137.8" cy="94.2" r="1.6" fill="white"/>
    <circle cx="161.8" cy="94.2" r="1.6" fill="white"/>
    {/* Eyebrows */}
    <path d="M 130 87 Q 136 84 143 87" stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M 153 87 Q 160 84 167 87" stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Nose */}
    <path d="M 148 103 Q 144 110 148 112 Q 152 110 148 103" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
    {/* Warm smile */}
    <path d="M 136 115 Q 148 126 160 115" stroke="#1e3a8a" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Cheek blush */}
    <ellipse cx="125" cy="112" rx="8" ry="5" fill="#fca5a5" fillOpacity="0.35"/>
    <ellipse cx="171" cy="112" rx="8" ry="5" fill="#fca5a5" fillOpacity="0.35"/>
    {/* Neck */}
    <rect x="139" y="138" width="18" height="14" rx="6" fill="white" fillOpacity="0.88"/>
    {/* Body — nurse/doctor coat */}
    <path d="M 106 152 L 95 270 L 201 270 L 190 152 Z" fill="white" fillOpacity="0.88"/>
    {/* Coat collar */}
    <path d="M 126 152 L 148 182 L 170 152" fill="#dbeafe" fillOpacity="0.65"/>
    <path d="M 126 152 L 148 182 L 170 152" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
    {/* Coat buttons */}
    <circle cx="148" cy="210" r="3.5" fill="#93c5fd" fillOpacity="0.8"/>
    <circle cx="148" cy="230" r="3.5" fill="#93c5fd" fillOpacity="0.8"/>
    <circle cx="148" cy="250" r="3.5" fill="#93c5fd" fillOpacity="0.8"/>
    {/* Medical cross on coat pocket */}
    <rect x="114" y="182" width="22" height="8" rx="3" fill="#3b82f6" fillOpacity="0.78"/>
    <rect x="121" y="175" width="8" height="22" rx="3" fill="#3b82f6" fillOpacity="0.78"/>
    {/* Stethoscope */}
    <path d="M 138 158 Q 126 180 130 192 Q 135 200 148 198" stroke="#93c5fd" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <circle cx="148" cy="198" r="7" stroke="#60a5fa" strokeWidth="2.5" fill="white" fillOpacity="0.55"/>

    {/* Left arm (wrapping around child protectively) */}
    <path d="M 95 180 Q 58 215 62 260 Q 68 276 98 270" stroke="white" strokeWidth="28" fill="none" strokeLinecap="round" strokeOpacity="0.84"/>
    {/* Right arm (reaching gently toward child) */}
    <path d="M 190 178 Q 222 172 246 182" stroke="white" strokeWidth="26" fill="none" strokeLinecap="round" strokeOpacity="0.84"/>

    {/* === CHILD FIGURE (smaller) === */}
    {/* Child hair */}
    <ellipse cx="276" cy="161" rx="33" ry="23" fill="#dbeafe" fillOpacity="0.97"/>
    <ellipse cx="253" cy="178" rx="13" ry="22" fill="#dbeafe" fillOpacity="0.88"/>
    <ellipse cx="299" cy="178" rx="13" ry="20" fill="#dbeafe" fillOpacity="0.88"/>
    {/* Child head */}
    <circle cx="276" cy="182" r="31" fill="white" fillOpacity="0.94"/>
    {/* Child hair front */}
    <ellipse cx="276" cy="162" rx="31" ry="17" fill="#eff6ff" fillOpacity="0.78"/>
    {/* Child eyes */}
    <ellipse cx="266" cy="180" rx="4" ry="4.5" fill="#1e3a8a"/>
    <ellipse cx="286" cy="180" rx="4" ry="4.5" fill="#1e3a8a"/>
    <circle cx="267.5" cy="178.5" r="1.4" fill="white"/>
    <circle cx="287.5" cy="178.5" r="1.4" fill="white"/>
    {/* Child smile */}
    <path d="M 264 193 Q 276 203 288 193" stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Child cheeks */}
    <ellipse cx="256" cy="190" rx="7" ry="4.5" fill="#fca5a5" fillOpacity="0.35"/>
    <ellipse cx="296" cy="190" rx="7" ry="4.5" fill="#fca5a5" fillOpacity="0.35"/>
    {/* Child body */}
    <path d="M 252 213 L 244 296 L 308 296 L 300 213 Z" fill="white" fillOpacity="0.8"/>
    {/* Shirt stripe detail */}
    <rect x="248" y="228" width="60" height="9" rx="2.5" fill="#dbeafe" fillOpacity="0.72"/>
    {/* Child right arm extended (for injection) */}
    <path d="M 300 228 Q 328 222 346 228" stroke="white" strokeWidth="22" fill="none" strokeLinecap="round" strokeOpacity="0.84"/>
    {/* Bandage at injection site */}
    <rect x="337" y="220" width="20" height="14" rx="4" fill="#fef9c3" fillOpacity="0.92"/>
    <line x1="337" y1="227" x2="357" y2="227" stroke="#fde68a" strokeWidth="1.5" strokeDasharray="3,2"/>

    {/* === SYRINGE === */}
    {/* Needle */}
    <line x1="360" y1="227" x2="380" y2="227" stroke="#bfdbfe" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="357" y1="224" x2="360" y2="230" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Barrel */}
    <rect x="380" y="220" width="55" height="14" rx="7" fill="#93c5fd" fillOpacity="0.96"/>
    {/* Liquid inside */}
    <rect x="381" y="221" width="42" height="12" rx="6" fill="#dbeafe" fillOpacity="0.55"/>
    {/* Barrel markings */}
    <line x1="396" y1="220" x2="396" y2="234" stroke="#60a5fa" strokeWidth="2" strokeOpacity="0.6"/>
    <line x1="409" y1="220" x2="409" y2="234" stroke="#60a5fa" strokeWidth="2" strokeOpacity="0.6"/>
    <line x1="422" y1="220" x2="422" y2="234" stroke="#60a5fa" strokeWidth="2" strokeOpacity="0.6"/>
    {/* Plunger handle */}
    <rect x="433" y="216" width="8" height="22" rx="3" fill="#3b82f6" fillOpacity="0.92"/>

    {/* === DECORATIVE ELEMENTS === */}
    {/* Large heart left */}
    <path d="M 34 162 C 34 154 28 145 19 145 C 10 145 4 154 4 162 C 4 177 34 194 34 194 C 34 194 64 177 64 162 C 64 154 58 145 49 145 C 40 145 34 154 34 162Z" fill="white" fillOpacity="0.2"/>
    {/* Small heart top right */}
    <path d="M 356 54 C 356 48 352 42 346 42 C 340 42 336 48 336 54 C 336 65 356 76 356 76 C 356 76 376 65 376 54 C 376 48 372 42 366 42 C 360 42 356 48 356 54Z" fill="white" fillOpacity="0.3"/>
    {/* Tiny heart bottom left */}
    <path d="M 72 315 C 72 311 69 307 65 307 C 61 307 58 311 58 315 C 58 323 72 330 72 330 C 72 330 86 323 86 315 C 86 311 83 307 79 307 C 75 307 72 311 72 315Z" fill="white" fillOpacity="0.22"/>
    {/* Shield with check (top left) */}
    <path d="M 38 34 Q 38 72 63 86 Q 88 72 88 34 L 63 25 Z" fill="white" fillOpacity="0.18"/>
    <path d="M 48 57 L 60 70 L 80 46" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.72"/>
    {/* Medical cross bottom right */}
    <rect x="372" y="312" width="44" height="14" rx="5" fill="white" fillOpacity="0.18"/>
    <rect x="386" y="298" width="16" height="42" rx="5" fill="white" fillOpacity="0.18"/>
    {/* Sparkles top */}
    <circle cx="206" cy="26" r="6" fill="white" fillOpacity="0.48"/>
    <circle cx="224" cy="16" r="3.5" fill="white" fillOpacity="0.32"/>
    <circle cx="190" cy="20" r="4" fill="white" fillOpacity="0.3"/>
    <circle cx="216" cy="40" r="2.2" fill="white" fillOpacity="0.22"/>
    {/* Sparkles right side */}
    <circle cx="400" cy="138" r="4.5" fill="white" fillOpacity="0.25"/>
    <circle cx="415" cy="128" r="2.8" fill="white" fillOpacity="0.2"/>
    {/* Sparkles bottom left */}
    <circle cx="16" cy="280" r="4" fill="white" fillOpacity="0.2"/>
    <circle cx="30" cy="266" r="2.5" fill="white" fillOpacity="0.15"/>
    {/* Plus symbols */}
    <text x="390" y="92" fill="white" fillOpacity="0.3" fontSize="22" fontWeight="bold" fontFamily="sans-serif">+</text>
    <text x="16" y="145" fill="white" fillOpacity="0.2" fontSize="18" fontWeight="bold" fontFamily="sans-serif">+</text>
    <text x="112" y="336" fill="white" fillOpacity="0.18" fontSize="16" fontWeight="bold" fontFamily="sans-serif">+</text>
  </svg>
);

export default function LandingPage() {
  const features = [
    {
      icon: Heart,
      title: "Gestion des Vaccinations",
      description: "Suivi complet des campagnes de vaccination avec calendrier personnalisé et rappels automatiques.",
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/30"
    },
    {
      icon: Users,
      title: "Gestion des Patients",
      description: "Dossiers médicaux sécurisés, historique des vaccinations et suivi personnalisé pour chaque patient.",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30"
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Protection des données de santé conforme RGPD avec authentification multi-facteurs.",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30"
    },
    {
      icon: BarChart3,
      title: "Analyses & Rapports",
      description: "Tableaux de bord interactifs et rapports détaillés pour optimiser vos campagnes de vaccination.",
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/30"
    },
    {
      icon: Calendar,
      title: "Planification Intelligente",
      description: "Calendrier automatisé des rappels et optimisation des créneaux de vaccination.",
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/30"
    },
    {
      icon: MapPin,
      title: "Multi-centres",
      description: "Gestion centralisée de plusieurs centres de vaccination avec synchronisation en temps réel.",
      color: "text-cyan-500",
      bg: "bg-cyan-50 dark:bg-cyan-950/30"
    }
  ];

  const stats = [
    { number: "50 000+", label: "Patients suivis", icon: Users },
    { number: "200+", label: "Centres partenaires", icon: MapPin },
    { number: "99.9%", label: "Disponibilité", icon: Activity },
    { number: "24/7", label: "Support médical", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">

      {/* ─────────────────── HEADER ─────────────────── */}
      <header className="sticky top-0 z-50 w-full">
        {/* Gradient accent bar */}
        <div className="h-[3px] bg-gradient-to-r from-blue-300 via-blue-600 to-blue-300 dark:from-blue-800 dark:via-blue-500 dark:to-blue-800" />

        <div className="border-b border-blue-100 dark:border-slate-800 bg-white/96 dark:bg-slate-950/96 backdrop-blur-md supports-[backdrop-filter]:bg-white/85">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/25 rounded-xl blur-md" />
                <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/35">
                  <AppLogo className="h-6 w-6 sm:h-7 sm:w-7 brightness-0 invert" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight leading-none">VacciMed</h1>
                <p className="text-xs text-muted-foreground hidden sm:block mt-0.5">Plateforme de Vaccination</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: "#features", label: "Fonctionnalités" },
                { href: "#about",    label: "À propos" },
                { href: "#contact",  label: "Contact" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ModeToggle />
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex border-blue-200 dark:border-blue-800 text-primary hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300"
                asChild
              >
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs sm:text-sm shadow-md shadow-blue-500/30 border-0"
                asChild
              >
                <Link to="/login">
                  <span className="hidden sm:inline">Commencer</span>
                  <span className="sm:hidden">Connexion</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 dark:from-blue-900 dark:via-blue-950 dark:to-slate-950">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-6 py-14 sm:py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">

            {/* Left — text */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-5">
                <Badge className="w-fit bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur">
                  <Stethoscope className="mr-2 h-3 w-3" />
                  <span className="text-xs sm:text-sm">Solution Médicale Professionnelle</span>
                </Badge>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight">
                  Révolutionnez la
                  <span className="block text-blue-200">Gestion Vaccinale</span>
                </h1>

                <p className="text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed">
                  Plateforme complète pour les professionnels de santé. Gérez vos campagnes de vaccination
                  avec efficacité, sécurité et simplicité.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 text-sm sm:text-base font-semibold px-6 sm:px-8 shadow-lg shadow-blue-900/30 w-full sm:w-auto"
                  asChild
                >
                  <Link to="/login">
                    Accéder à la plateforme <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-4 border-t border-white/20">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center space-y-1 sm:space-y-2">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-200 mx-auto" />
                    <div className="text-lg sm:text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Illustration maman + enfant */}
            <div className="relative mt-4 lg:mt-0 flex items-center justify-center">
              <div className="absolute inset-8 bg-white/8 rounded-full blur-3xl pointer-events-none" />
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-full">
                <MotherChildIllustration />
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 72L60 64C120 56 240 40 360 36C480 32 600 40 720 46C840 52 960 56 1080 52C1200 48 1320 36 1380 30L1440 24V72H0Z" fill="white" className="dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      {/* ─────────────────── FEATURES ─────────────────── */}
      <section id="features" className="container mx-auto px-4 py-16 sm:py-20 lg:py-28">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <Badge variant="outline" className="w-fit mx-auto border-primary/30 text-primary bg-primary/5">
            <Star className="mr-2 h-3 w-3" />
            Fonctionnalités Avancées
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground px-2 sm:px-0">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
            Une suite complète d'outils professionnels pour optimiser votre gestion vaccinale
            et améliorer la prise en charge de vos patients.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/60 hover:border-primary/30 overflow-hidden cursor-default">
              <CardHeader className="p-5 sm:p-6 pb-3">
                <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors duration-200">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 pt-0">
                <CardDescription className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─────────────────── CTA ─────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-slate-900 mx-4 sm:mx-6 lg:mx-10 rounded-2xl sm:rounded-3xl my-4 sm:my-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative container mx-auto px-6 py-14 sm:py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white px-2 sm:px-0">
              Prêt à transformer votre
              <span className="block text-blue-200">pratique médicale ?</span>
            </h2>
            <p className="text-base sm:text-lg text-blue-100 px-2 sm:px-0">
              Rejoignez les milliers de professionnels de santé qui font confiance à VacciMed.
            </p>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-base sm:text-lg px-8 shadow-lg shadow-blue-900/30" asChild>
              <Link to="/login">
                Commencer maintenant <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-blue-200">
              {["Essai gratuit 30 jours", "Support 24/7", "Sécurité certifiée"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-300" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── ABOUT ─────────────────── */}
      <section id="about" className="container mx-auto px-4 py-16 sm:py-20 lg:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <Badge variant="outline" className="w-fit mx-auto border-primary/30 text-primary bg-primary/5">
              <Stethoscope className="mr-2 h-3 w-3" />
              À propos de nous
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground px-2 sm:px-0">
              Notre mission pour la santé publique
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
              Nous développons des solutions technologiques innovantes pour améliorer
              la gestion vaccinale et optimiser la protection de la santé publique.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Une expertise médicale reconnue</h3>
              <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                <p>
                  Notre équipe réunit des professionnels de santé, des ingénieurs logiciels
                  et des experts en cybersécurité pour créer la plateforme de vaccination
                  la plus avancée du marché.
                </p>
                <p>
                  Nous travaillons en étroite collaboration avec les centres hospitaliers,
                  les cliniques et les centres de vaccination pour comprendre leurs besoins
                  réels et développer des solutions adaptées.
                </p>
                <p>
                  Notre engagement : faciliter le travail des professionnels de santé
                  tout en garantissant la sécurité et la confidentialité des données patients.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6">
                <div className="text-center bg-primary/5 rounded-xl p-5 border border-primary/10">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">5+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Années d'expérience</div>
                </div>
                <div className="text-center bg-primary/5 rounded-xl p-5 border border-primary/10">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">100%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Sécurité certifiée</div>
                </div>
              </div>
            </div>

            <Card className="border border-primary/20 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-primary to-blue-700 p-5 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                  <Shield className="h-5 w-5 text-blue-200" />
                  Nos valeurs
                </CardTitle>
              </div>
              <CardContent className="space-y-5 p-5 sm:p-6">
                {[
                  { title: "Sécurité avant tout", desc: "Protection maximale des données de santé" },
                  { title: "Innovation continue", desc: "Technologies de pointe au service de la santé" },
                  { title: "Accompagnement personnalisé", desc: "Support dédié pour chaque professionnel" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm sm:text-base">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─────────────────── CONTACT ─────────────────── */}
      <section id="contact" className="bg-slate-50 dark:bg-slate-900/50 border-y border-border/50 py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
              <Badge variant="outline" className="w-fit mx-auto border-primary/30 text-primary bg-primary/5">
                <Activity className="mr-2 h-3 w-3" />
                Nous contacter
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground px-2 sm:px-0">
                Parlons de votre projet
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
                Notre équipe est à votre disposition pour vous accompagner dans la mise en place
                de votre solution de gestion vaccinale.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-5">Informations de contact</h3>
                  <div className="space-y-4">
                    {[
                      { icon: MapPin, title: "Adresse", desc: "123 Avenue de la Santé, 75000 Paris" },
                      { icon: Clock, title: "Horaires", desc: "Lun-Ven: 8h-18h | Support 24/7" },
                    ].map(({ icon: Icon, title, desc }) => (
                      <div key={title} className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm sm:text-base">{title}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-5">Équipes spécialisées</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Heart, bg: "bg-rose-50 dark:bg-rose-950/30", color: "text-rose-500", title: "Support Médical", email: "support@vaccimed.fr" },
                      { icon: Shield, bg: "bg-emerald-50 dark:bg-emerald-950/30", color: "text-emerald-500", title: "Sécurité & Conformité", email: "security@vaccimed.fr" },
                    ].map(({ icon: Icon, bg, color, title, email }) => (
                      <Card key={title} className="p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`h-5 w-5 ${color}`} />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground text-sm sm:text-base">{title}</div>
                            <div className="text-xs sm:text-sm text-primary">{email}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <Card className="shadow-lg border-border/60 bg-white dark:bg-slate-900">
                <CardHeader className="p-5 sm:p-6 pb-4">
                  <CardTitle className="text-lg sm:text-xl">Demander une démonstration</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Remplissez ce formulaire et notre équipe vous contactera rapidement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 sm:p-6 pt-0">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {["Prénom", "Nom"].map((label) => (
                        <div key={label}>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            placeholder={`Votre ${label.toLowerCase()}`}
                          />
                        </div>
                      ))}
                    </div>
                    {[
                      { label: "Email professionnel", type: "email", placeholder: "votre.email@hopital.fr" },
                      { label: "Établissement", type: "text", placeholder: "Nom de votre établissement" },
                    ].map(({ label, type, placeholder }) => (
                      <div key={label}>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
                        <input
                          type={type}
                          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                          placeholder={placeholder}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="Décrivez vos besoins..."
                      />
                    </div>
                    <Button className="w-full text-white bg-primary hover:bg-primary/90 shadow-sm shadow-primary/30" size="lg">
                      Envoyer la demande <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <AppLogo className="h-5 w-5 brightness-0 invert" />
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg">VacciMed</div>
                <div className="text-xs sm:text-sm text-slate-400">© 2025 — Tous droits réservés</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
              {["#about|À propos", "#contact|Contact", "#|Confidentialité", "#|Conditions", "#|Support"].map((item) => {
                const [href, label] = item.split("|");
                return <a key={label} href={href} className="hover:text-white transition-colors">{label}</a>;
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
