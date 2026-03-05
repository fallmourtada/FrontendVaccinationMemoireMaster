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


export default function LandingPage() {
  const features = [
    {
      icon: Heart,
      title: "Gestion des Vaccinations",
      description: "Suivi complet des campagnes de vaccination avec calendrier personnalisé et rappels automatiques."
    },
    {
      icon: Users,
      title: "Gestion des Patients",
      description: "Dossiers médicaux sécurisés, historique des vaccinations et suivi personnalisé pour chaque patient."
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Protection des données de santé conforme RGPD avec authentification multi-facteurs."
    },
    {
      icon: BarChart3,
      title: "Analyses & Rapports",
      description: "Tableaux de bord interactifs et rapports détaillés pour optimiser vos campagnes de vaccination."
    },
    {
      icon: Calendar,
      title: "Planification Intelligente",
      description: "Calendrier automatisé des rappels et optimisation des créneaux de vaccination."
    },
    {
      icon: MapPin,
      title: "Multi-centres",
      description: "Gestion centralisée de plusieurs centres de vaccination avec synchronisation en temps réel."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Patients suivis", icon: Users },
    { number: "200+", label: "Centres partenaires", icon: MapPin },
    { number: "99.9%", label: "Disponibilité", icon: Activity },
    { number: "24/7", label: "Support médical", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <AppLogo className="h-8 w-8 sm:h-10 sm:w-10" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">VacciMed</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Plateforme de Vaccination</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              À propos
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mode Toggle intégré dans un dropdown professionnel */}
            <ModeToggle />
            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button size="sm" className="text-white text-xs sm:text-sm" asChild>
              <Link to="/login">
                <span className="hidden sm:inline">Commencer</span>
                <span className="sm:hidden">Connexion</span>
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-6 py-12 sm:py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Stethoscope className="mr-2 h-3 w-3" />
                <span className="text-xs sm:text-sm">Solution Médicale Professionnelle</span>
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Révolutionnez la
                <span className="text-primary block">Gestion Vaccinale</span>
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                Plateforme complète pour les professionnels de santé. Gérez vos campagnes de vaccination 
                avec efficacité, sécurité et simplicité. Optimisez vos processus médicaux dès aujourd'hui.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button size="lg" className="text-sm sm:text-lg text-white px-6 sm:px-8 w-full sm:w-auto" asChild>
                <Link to="/login">
                  Accéder à la plateforme <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              {/* <Button variant="outline" size="lg" className="text-lg px-8">
                Demander une démo
              </Button> */}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-1 sm:space-y-2">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto" />
                  <div className="text-lg sm:text-2xl font-bold text-foreground">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
            <Card className="relative bg-card/80 backdrop-blur border-2 border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-3 w-3 rounded-full bg-destructive animate-pulse"></div>
                  <div className="h-3 w-3 rounded-full bg-chart-3"></div>
                  <div className="h-3 w-3 rounded-full bg-accent"></div>
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Tableau de Bord Médical
                </CardTitle>
                <CardDescription>Aperçu en temps réel de votre activité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">847</div>
                    <div className="text-sm text-muted-foreground">Vaccinations ce mois</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-accent-foreground">98%</div>
                    <div className="text-sm text-muted-foreground">Taux de couverture</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Objectif mensuel</span>
                    <span className="font-medium">84%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-[84%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 bg-muted/30 rounded-2xl sm:rounded-3xl my-12 sm:my-16 lg:my-20">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <Badge variant="outline" className="w-fit mx-auto">
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
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/30 p-1 sm:p-0">
              <CardHeader className="p-4 sm:p-6">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground px-2 sm:px-0">
            Prêt à transformer votre
            <span className="text-primary block">pratique médicale ?</span>
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground px-2 sm:px-0">
            Rejoignez les milliers de professionnels de santé qui font confiance à VacciMed 
            pour optimiser leur gestion vaccinale.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button size="lg" className="text-base sm:text-lg text-white px-6 sm:px-8 py-3 sm:py-4" asChild>
              <Link to="/login">
                Commencer maintenant <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            {/* <Button variant="outline" size="lg" className="text-lg px-8">
              Planifier une démo
            </Button> */}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-6 sm:pt-8 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-accent-foreground" />
              Essai gratuit 30 jours
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-accent-foreground" />
              Support 24/7
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-accent-foreground" />
              Sécurité certifiée
            </div>
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section id="about" className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <Badge variant="outline" className="w-fit mx-auto">
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
              <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
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
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">5+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Années d'expérience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">100%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Sécurité certifiée</div>
                </div>
              </div>
            </div>

            <Card className="bg-card/80 backdrop-blur border-2 border-primary/20">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Nos valeurs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm sm:text-base">Sécurité avant tout</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Protection maximale des données de santé</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm sm:text-base">Innovation continue</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Technologies de pointe au service de la santé</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm sm:text-base">Accompagnement personnalisé</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Support dédié pour chaque professionnel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 bg-muted/30 rounded-2xl sm:rounded-3xl my-12 sm:my-16 lg:my-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <Badge variant="outline" className="w-fit mx-auto">
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
            {/* Informations de contact */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">Informations de contact</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm sm:text-base">Adresse</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">123 Avenue de la Santé, 75000 Paris</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm sm:text-base">Horaires</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Lun-Ven: 8h-18h | Support 24/7</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">Équipes spécialisées</h3>
                <div className="space-y-3">
                  <Card className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground text-sm sm:text-base">Support Médical</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">support@vaccimed.fr</div>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground text-sm sm:text-base">Sécurité & Conformité</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">security@vaccimed.fr</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <Card className="p-4 sm:p-6">
              <CardHeader className="px-0 pt-0 pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Demander une démonstration</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Remplissez ce formulaire et notre équipe vous contactera rapidement.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <form className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Prénom</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm sm:text-base"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Nom</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm sm:text-base"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email professionnel</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm sm:text-base"
                      placeholder="votre.email@hopital.fr"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Établissement</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm sm:text-base"
                      placeholder="Nom de votre établissement"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none text-sm sm:text-base"
                      placeholder="Décrivez vos besoins..."
                    ></textarea>
                  </div>
                  
                  <Button className="w-full text-white" size="lg">
                    Envoyer la demande
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-12 sm:mt-16 lg:mt-20">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-center gap-3 text-center lg:text-left">
              <AppLogo className="h-6 w-6 sm:h-8 sm:w-8" />
              <div>
                <div className="font-semibold text-foreground text-sm sm:text-base">VacciMed</div>
                <div className="text-xs sm:text-sm text-muted-foreground">© 2025 - Tous droits réservés</div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <a href="#about" className="hover:text-foreground transition-colors">À propos</a>
              <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
              <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-foreground transition-colors">Conditions</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
