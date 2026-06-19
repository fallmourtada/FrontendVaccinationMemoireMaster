import { Baby, BarChart3, Calendar, FileText, Heart, Home, Inbox, MessageCircle, Package, Settings, Syringe, Users } from "lucide-react"
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";
import { AppLogo } from "@/utils/common";
import { UserAvatar } from "./user-avatar";
import type { UtilisateurDTO } from "@/types";
import { useDecodedToken } from "@/contexts/decoded-token-context";



// Menu items.
const sections = [
  { 
    title: "TABLEAU DE BORD", 
    items: [
      { label: "Accueil", icon: Home, path: "/medecin/accueil" },
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
      { icon: Users, label: "Parents", path: "/medecin/patients" },
      { icon: Baby, label: "Enfants", path: "/medecin/enfants" },
      { icon: Heart, label: "Vaccinations", path: "/medecin/vaccinations" },
      { icon: Calendar, label: "Calendrier", path: "/medecin/calendrier" }
    ]
  },
  {
    title: "GESTION",
    items: [
      { icon: Syringe, label: "Vaccins", path: "/medecin/vaccins" },
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

export function AppSidebar({itemsProp, pageTitle}: {itemsProp?: typeof sections, pageTitle:string}) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const { decodedToken } = useDecodedToken();

    const sidebarUser: UtilisateurDTO | null = decodedToken
        ? {
            id: null,
            prenom: decodedToken.sub.split('@')[0] ?? '—',
            nom: '',
            email: decodedToken.sub,
            userRole: decodedToken.role.replace('ROLE_', '') as any,
          }
        : null;

    const location = useLocation();
    const isActive: (path: string) => boolean = (path) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="bg-white dark:bg-slate-900 border-r border-blue-100 dark:border-blue-900">

    <SidebarHeader className={`bg-gradient-to-r from-blue-600 to-blue-500 text-white ${!isCollapsed ? "p-4" : "p-3"}`}>
        <div className="flex items-center gap-3 pt-2">
          <AppLogo className={`flex-shrink-0 ${!isCollapsed ? "w-8 h-8" : "w-6 h-6"}`} />
          {!isCollapsed && (
            <div className="flex flex-col align-items-center pt-1">
              <h2 className="text-lg font-bold text-white">{pageTitle}</h2>
            </div>
          )}
        </div>
      </SidebarHeader>
      {!isCollapsed && <Separator className="bg-blue-100 dark:bg-blue-900" />}
      <div className={`h-full overflow-y-auto ${!isCollapsed ? 'p-2' : ''}`}>
        <SidebarContent>
          { (itemsProp ?? sections).map((section) => (
            <SidebarGroup key={section.title}>
              {/* Titre de la section */}
              <SidebarGroupLabel className="text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider mt-4 mb-3">{section.title}</SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.path} className="cursor-pointer list-none">
                      {(() => {
                        const active = isActive(item.path);
                        return (
                      <Link 
                        to={item.path} 
                        className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-blue-100 via-blue-50 to-white text-blue-800 dark:from-blue-900/40 dark:via-blue-900/20 dark:to-slate-800 dark:text-blue-200 font-semibold shadow-sm border border-blue-200/70 dark:border-blue-800/70'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-blue-900/20'
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                            active
                              ? 'border-blue-200 bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md dark:border-blue-700'
                              : 'border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                        );
                      })()}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>

    <div className="bg-inherit md:shadow-inner hover:none pb-3 border-t border-blue-100 dark:border-blue-900">
      <SidebarFooter>
        {sidebarUser && <UserAvatar user={sidebarUser} />}
      </SidebarFooter>
      </div>
    </Sidebar>
  )
}