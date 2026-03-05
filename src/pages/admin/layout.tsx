import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, UserCheck, MapPin, Database, BarChart3, Settings, Inbox } from "lucide-react";
import { Outlet } from "react-router-dom";


export default function AdminLayout() {

    const sections = [
        {
        title: "TABLEAU DE BORD",
        items: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" }
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar itemsProp={sections} pageTitle="Admin-VacciMed" />
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