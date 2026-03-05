import { Baby, BarChart3, Calendar, FileText, Heart, Home, Inbox, MapPin, Package, Settings, Syringe, Users } from "lucide-react"
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
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";
import { AppLogo } from "@/utils/common";
import { UserAvatar } from "./user-avatar";
import type { UserDTO } from "@/types";



// Menu items.
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

const user: UserDTO = {
  prenom: "Abdoulaye",
  nom: "Diagne",
  email: "abdoulaye@gmail.com",
  role: "ROLE_ADMIN",
  telephone: "771234567",
  dateNaissance: "1990-01-01",
  regionId: null,
  departementId: null,
  communeId: null,
  id: null
}

export function AppSidebar({itemsProp, pageTitle}: {itemsProp?: typeof sections, pageTitle:string}) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const location = useLocation();
    const isActive: (path: string) => boolean = (path) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">

    <SidebarHeader className={` ${!isCollapsed ? "p-4" : "p-3"}`}>
        <div className="flex items-center gap-3 pt-2">
          <AppLogo className={`flex-shrink-0 ${!isCollapsed ? "w-8 h-8" : "w-6 h-6"}`} />
          {!isCollapsed && (
            <div className="flex flex-col align-items-center pt-1">
              <h2 className="text-lg font-bold text-sidebar-foreground">{pageTitle}</h2>
              {/* <span className="text-xs text-sidebar-foreground/60">v1.0.0</span> */}
            </div>
          )}
        </div>
      </SidebarHeader>
      {/* <div className="border-t border-b border-border" /> */}
      {!isCollapsed && <Separator />}
      <div className={`h-full overflow-y-auto ${!isCollapsed ? 'p-2' : ''}`}>
        <SidebarContent>
          { (itemsProp ?? sections).map((section) => (
            <SidebarGroup key={section.title}>
              {/* Titre de la section */}
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.path} className="cursor-pointer">
                      <SidebarMenuButton asChild>
                        <Link to={item.path} className={`flex items-center gap-3 w-full ${isActive(item.path) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium ' : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground'} px-3 py-2 rounded-lg transition-colors duration-200`}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>

    <div className="bg-inherit md:shadow-inner hover:none pb-3">
      <SidebarFooter>
        <UserAvatar user={user} />
      </SidebarFooter>
      </div>
    </Sidebar>
  )
}