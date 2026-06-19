import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { useTheme } from "./theme-provider";
import { ModeToggle } from "./mode-toggle";
import AppBreadcrumb from "./app-breadcrumb";
import { UserAvatarHeader } from "./user-avatar";
import { ChatbotModal } from "@/components/modals";
import { useDecodedToken } from "@/contexts/decoded-token-context";
import type { UtilisateurDTO } from "@/types";

export function AppHeader() {
    const { theme } = useTheme();
    const { decodedToken } = useDecodedToken();

    // Construire le user affiché depuis le token JWT uniquement (pas d'appel API supplémentaire)
    const displayUser: UtilisateurDTO | null = decodedToken
        ? {
            id: null,
            prenom: decodedToken.sub.split('@')[0] ?? '—',
            nom: '',
            email: decodedToken.sub,
            userRole: decodedToken.role.replace('ROLE_', '') as any,
          }
        : null;

    return (
        <header className={`w-full sticky top-0 bg-background/80 p-1 backdrop-blur-sm ${theme !== "light" ? "border-b" : ""} shadow-xs z-50`}>
            <div className="flex items-center justify-between px-4 py-3 lg:px-6">
                {/* Section gauche */}
                <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
                    <SidebarTrigger className="cursor-pointer flex-shrink-0 -ml-2 sm:ml-3 md:-ml-4" />
                    <div className="min-w-0 flex-1 overflow-hidden">
                        <AppBreadcrumb />
                    </div>
                </div>

                {/* Section droite */}
                <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                    <ChatbotModal />

                    <Button variant="ghost" size="sm" className="relative h-9 w-9 cursor-pointer">
                        <Bell className="h-4 w-4" />
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                            3
                        </Badge>
                    </Button>

                    <ModeToggle />

                    <div className="h-6 w-px bg-border" />
                    <UserAvatarHeader user={displayUser} />
                </div>
            </div>
        </header>
    );
}