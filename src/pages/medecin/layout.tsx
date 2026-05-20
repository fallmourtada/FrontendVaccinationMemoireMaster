import { AppHeader } from '@/components/shared/app-header';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Home, Users, Heart, Calendar, CalendarDays, Package, BarChart3, FileText, Settings, Inbox, Baby, Syringe, Activity, MessageCircle, MapPin } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useDecodedToken } from '@/contexts/decoded-token-context';

export default function MedecinLayout() {
    const { decodedToken } = useDecodedToken();
    const role = (decodedToken?.role || '').replace(/^ROLE_/, '').toUpperCase();
    const isIcp = role === 'ICP';
    const isInfirmier = role === 'INFIRMIER';

    // Menu sections.
    const sections = [
        { 
            title: "TABLEAU DE BORD", 
            items: [
            { label: "Accueil", icon: Home, path: "/medecin/accueil" },
            ...(isIcp ? [{ icon: BarChart3, label: "Statistiques", path: "/medecin/statistiques" }] : []),
            ]
        },
        {
            title: "ASSISTANT VACCINATION",
            items: [
            { icon: MessageCircle, label: "Chatbot IA", path: "/chatbot" },
            ]
        },
        {
            title: "PATIENTS & VACCINATIONS", 
            items: [
            ...(isIcp
              ? []
              : [
                  { icon: Users, label: "Parents", path: "/medecin/patients" },
                  { icon: Baby, label: "Enfants", path: "/medecin/enfants" },
                  { icon: Heart, label: "Vaccinations", path: "/medecin/vaccinations" },
                  { icon: Activity, label: "Prédiction risque", path: "/medecin/prediction-risque" },
                  { icon: CalendarDays, label: "Rendez-vous", path: "/medecin/rendez-vous" },
                  { icon: Calendar, label: "Calendrier", path: "/medecin/calendrier" },
                ])
            ]
        },
        {
            title: "GESTION",
            items: [
            ...(isIcp || isInfirmier
              ? []
              : [
                  { icon: Syringe, label: "Vaccins", path: "/medecin/vaccins" },
                  { icon: Package, label: "Stock vaccins", path: "/medecin/stocks" },
                ])
            ]
        },
        {
            title: "STATISTIQUES & RAPPORTS",
            items: [
            ...(isIcp || isInfirmier ? [] : [
              { icon: BarChart3, label: "Statistiques", path: "/medecin/statistiques" },
              { icon: FileText, label: "Rapports", path: "/medecin/rapports" }
            ])
            ]
        },
        {
            title: "PARAMÈTRES",
            items: [
            ...(isIcp || isInfirmier ? [] : [
              { icon: Settings, label: "Paramètres", path: "/medecin/parametres" },
              { icon: Inbox, label: "Messages", path: "/medecin/messages" },
            ])
            ]
        },
        {
            title: "MON ESPACE",
            items: [
              ...(isIcp || isInfirmier ? [{ icon: MapPin, label: "Gestion des Localités", path: "/admin/localites" }] : [])
            ]
        },
    ].filter((section) => section.items.length > 0);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar itemsProp={sections} pageTitle="VacciMed" />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}