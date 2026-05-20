import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, UserCheck, MapPin, Database, BarChart3, Settings, Inbox, MessageCircle, Baby, Heart, CalendarDays, Syringe, Home } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useDecodedToken } from "@/contexts/decoded-token-context";


export default function AdminLayout() {
    const { decodedToken } = useDecodedToken();
    const role = (decodedToken?.role || '').replace(/^ROLE_/, '').toUpperCase();
    const isAdmin = role === 'ADMIN';
    const isIcp = role === 'ICP';
    const isInfirmier = role === 'INFIRMIER';

    const adminSections = [
        {
        title: "TABLEAU DE BORD",
        items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" }
        ]
        },
        {
        title: "ASSISTANT VACCINATION",
        items: [
            { icon: MessageCircle, label: "Chatbot IA", path: "/chatbot" }
        ]
        },
        {
        title: "GESTION",
        items: [
            { icon: Users, label: "Utilisateurs", path: "/admin/users" },
            { icon: UserCheck, label: "Rôles & Permissions", path: "/admin/roles" },
            { icon: MapPin, label: "Gestion des Localités", path: "/admin/localites" },
            { icon: Database, label: "Centres de vaccination", path: "/admin/centres" }
        ]
        },
        {
        title: "RAPPORTS",
        items: [
            { icon: BarChart3, label: "Rapports système", path: "/admin/rapports" }
            // { icon: FileText, label: "Logs système", path: "/admin/logs" }
        ]
        },
        {
        title: "PARAMÈTRES",
        items: [
            { icon: Settings, label: "Configuration", path: "/admin/configuration" },
            { icon: Inbox, label: "Messages", path: "/admin/messages" },
        ]
        }
    ];

    const restrictedSections = [
        {
        title: "ASSISTANT VACCINATION",
        items: [
            { icon: MessageCircle, label: "Chatbot IA", path: "/chatbot" }
        ]
        },
        {
        title: "TABLEAU DE BORD",
        items: [
            { icon: Home, label: "Accueil", path: "/medecin/accueil" },
            ...(isIcp ? [{ icon: BarChart3, label: "Statistiques", path: "/medecin/statistiques" }] : [])
        ]
        },
        {
        title: "PATIENTS & VACCINATIONS",
        items: [
            ...(isInfirmier ? [
              { icon: Users, label: "Parents", path: "/medecin/patients" },
              { icon: Baby, label: "Enfants", path: "/medecin/enfants" },
              { icon: Heart, label: "Vaccinations", path: "/medecin/vaccinations" },
              { icon: CalendarDays, label: "Rendez-vous", path: "/medecin/rendez-vous" },
            ] : []),
        ]
        },
        {
        title: "MON ESPACE",
        items: [
            ...((isIcp || isInfirmier) ? [{ icon: MapPin, label: "Gestion des Localités", path: "/admin/localites" }] : [])
        ]
        }
    ].filter((section) => section.items.length > 0);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar itemsProp={isAdmin ? adminSections : restrictedSections} pageTitle="Admin-VacciMed" />
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