import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Bell} from "lucide-react";
import { useTheme } from "./theme-provider";
import { ModeToggle } from "./mode-toggle";
import AppBreadcrumb from "./app-breadcrumb";
import { UserAvatarHeader } from "./user-avatar";
import { SexeType, type UserDTO } from "@/types";



const user: UserDTO = {
  prenom: "Abdoulaye",
  nom: "Diagne",
  sexe: SexeType.MASCULIN,
  email: "abdoulaye@gmail.com",
  role: "ROLE_ADMIN",
  telephone: "771234567",
  dateNaissance: "1990-01-01",
  regionId: null,
  departementId: null,
  communeId: null,
  id: null
};

export function AppHeader() {
    const { theme } = useTheme();

    return (
        <header className={`w-full sticky top-0 bg-background/80 p-1 backdrop-blur-sm ${theme !== "light" ? "border-b" : ""} shadow-xs z-50`}>
            <div className="flex items-center justify-between px-4 py-3 lg:px-6">
                {/* Section gauche */}
                <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
                    <SidebarTrigger className="cursor-pointer flex-shrink-0 -ml-2 sm:ml-3 md:-ml-4" />
                    {/* Breadcrumb - Masqué sur très petits écrans, visible à partir de sm */}
                    <div className="min-w-0 flex-1 overflow-hidden">
                        <AppBreadcrumb />
                    </div>
                </div>

                {/* Section droite */}
                <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                {/* Notifications optionnelles */}
                <Button variant="ghost" size="sm" className="relative h-9 w-9 cursor-pointer">
                    <Bell className="h-4 w-4" />
                    <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                        3
                    </Badge>
                </Button>

                {/* Mode Toggle intégré dans un dropdown professionnel */}
                <ModeToggle />

                {/* Séparateur visuel */}
                <div className="h-6 w-px bg-border" />
                    <UserAvatarHeader user={user} />
                </div>
            </div>
        </header>
    );
}