import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { 
  Home, 
  Users, 
  Heart, 
  Calendar, 
  MapPin, 
  Package, 
  BarChart3, 
  FileText, 
  Settings, 
  Inbox,
  LayoutDashboard,
  UserCheck,
  Database
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Mapping des chemins vers les métadonnées des pages
const routeMap: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  "/medecin/accueil": { label: "Accueil", icon: Home },
  "/medecin/patients": { label: "Patients", icon: Users },
  "/medecin/vaccinations": { label: "Vaccinations", icon: Heart },
  "/medecin/calendrier": { label: "Calendrier", icon: Calendar },
  "/medecin/centres": { label: "Centres", icon: MapPin },
  "/medecin/stocks": { label: "Stock vaccins", icon: Package },
  "/medecin/statistiques": { label: "Statistiques", icon: BarChart3 },
  "/medecin/rapports": { label: "Rapports", icon: FileText },
  "/medecin/parametres": { label: "Paramètres", icon: Settings },
  "/medecin/messages": { label: "Messages", icon: Inbox },
  "/admin": { label: "Administration", icon: Home },
  "/admin/dashboard": { label: "Dashboard", icon: LayoutDashboard },
  "/admin/users": { label: "Utilisateurs", icon: Users },
  "/admin/roles": { label: "Rôles & Permissions", icon: UserCheck },
  "/admin/localites": { label: "Localités", icon: MapPin },
  "/admin/centres": { label: "Centres", icon: Database },
  "/admin/rapports": { label: "Rapports système", icon: BarChart3 },
  "/admin/configuration": { label: "Configuration", icon: Settings },
  "/admin/messages": { label: "Messages", icon: Inbox },
};

export default function AppBreadcrumb() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Génération automatique du breadcrumb basé sur l'URL
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = [];

  // Page d'accueil
  if (location.pathname === "/" || location.pathname === "/medecin/accueil" || pathSegments.length === 0) {
    breadcrumbItems.push({
      label: "Accueil",
      icon: Home,
    });
  } else if (location.pathname === "/admin" || location.pathname === "/admin/dashboard") {
    breadcrumbItems.push({
      label: "Dashboard",
      icon: LayoutDashboard,
    });
  } else {
    // Ajouter la page d'accueil/racine en premier
    if (pathSegments[0] === "admin") {
      breadcrumbItems.push({
        label: "Administration",
        href: "/admin/dashboard",
        icon: Home,
      });
    } else {
      breadcrumbItems.push({
        label: "Accueil",
        href: "/medecin/accueil",
        icon: Home,
      });
    }

    // Construire le breadcrumb basé sur les segments de chemin
    let currentPath = "";
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const routeInfo = routeMap[currentPath];
      
      if (routeInfo) {
        const isLast = index === pathSegments.length - 1;
        // Ne pas ajouter la racine admin si c'est déjà ajoutée
        if (!(currentPath === "/admin" && breadcrumbItems.some(item => item.label === "Administration"))) {
          breadcrumbItems.push({
            label: routeInfo.label,
            href: isLast ? undefined : currentPath,
            icon: routeInfo.icon,
          });
        }
      }
    });

    // Si aucun mapping trouvé, fallback sur le segment
    if (breadcrumbItems.length === 1) { // Seulement la racine
      const lastSegment = pathSegments[pathSegments.length - 1];
      breadcrumbItems.push({
        label: lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1),
        icon: Home,
      });
    }
  }

  // Sur mobile, afficher seulement la page actuelle si le breadcrumb est trop long
  const displayItems = isMobile && breadcrumbItems.length > 2 
    ? [breadcrumbItems[breadcrumbItems.length - 1]] 
    : breadcrumbItems;

  const currentPage = displayItems[displayItems.length - 1];
  const previousItems = displayItems.slice(0, -1);

  return (
    <div className="hidden sm:block">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-1 sm:gap-1.5">
          {previousItems.length > 0 && previousItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1 sm:gap-1.5">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link 
                    to={item.href!}
                    className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.icon && <item.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                    <span className="truncate max-w-[100px] sm:max-w-none">{item.label}</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground" />
            </div>
          ))}
          
          {breadcrumbItems.length > 3 && !isMobile && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <BreadcrumbItem>
                <BreadcrumbEllipsis className="h-4 w-4" />
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground" />
            </div>
          )}
          
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-foreground">
              {currentPage.icon && <currentPage.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
              <span className="truncate max-w-[120px] sm:max-w-none">{currentPage.label}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}