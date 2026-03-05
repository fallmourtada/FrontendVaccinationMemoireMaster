import { AppHeader } from '@/components/shared/app-header';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Home, Users, Heart, Calendar, CalendarDays, MapPin, Package, BarChart3, FileText, Settings, Inbox, Baby, Syringe, Activity } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export default function MedecinLayout() {
    // Menu sections.
    const sections = [
        { 
            title: "TABLEAU DE BORD", 
            items: [
            { label: "Accueil", icon: Home, path: "/medecin/accueil" },
            ]
        },
        {
            title: "PATIENTS & VACCINATIONS", 
            items: [
            { icon: Users, label: "Parents", path: "/medecin/patients" },
            { icon: Baby, label: "Enfants", path: "/medecin/enfants" },
            { icon: Heart, label: "Vaccinations", path: "/medecin/vaccinations" },
            { icon: Activity, label: "Prédiction risque", path: "/medecin/prediction-risque" },
            { icon: CalendarDays, label: "Rendez-vous", path: "/medecin/rendez-vous" },
            { icon: Calendar, label: "Calendrier", path: "/medecin/calendrier" }
            ]
        },
        {
            title: "GESTION",
            items: [
            { icon: Syringe, label: "Vaccins", path: "/medecin/vaccins" },
            { icon: MapPin, label: "Centres", path: "/medecin/centres" },
            { icon: Package, label: "Stock vaccins", path: "/medecin/stocks" }
            ]
        },
        {
            title: "STATISTIQUES & RAPPORTS",
            items: [
            { icon: BarChart3, label: "Statistiques", path: "/medecin/statistiques" },
            { icon: FileText, label: "Rapports", path: "/medecin/rapports" }
            ]
        },
        {
            title: "PARAMÈTRES",
            items: [
            { icon: Settings, label: "Paramètres", path: "/medecin/parametres" },
            { icon: Inbox, label: "Messages", path: "/medecin/messages" },
            ]
        }
    ];

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