import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
  User,
  ChevronDown,
  Shield,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import { Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import type { UserDTO } from "@/types"
import { useLogout } from "@/services/auth.service"

const initials = (user: UserDTO) => {
    return (
        (user?.prenom?.charAt(0) || '') +
        (user?.nom?.charAt(0) || '')
    ).toUpperCase() || '?';
};

const roleLabel = (role: string): string => {
    const r = (role || '').replace('ROLE_', '');
    const labels: Record<string, string> = {
        'ADMIN':      'Administrateur',
        'ICP':        'Infirmier Chef de Poste',
        'SAGE_FEMME': 'Sage-Femme',
        'INFIRMIER':  'Infirmier',
        'MEDECIN':    'Médecin',
        'PARENT':     'Parent',
    };
    return labels[r] || r;
};

const roleColor = (role: string): string => {
    const r = (role || '').replace('ROLE_', '');
    const colors: Record<string, string> = {
        'ADMIN':      'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
        'ICP':        'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
        'SAGE_FEMME': 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800',
        'INFIRMIER':  'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        'MEDECIN':    'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
    };
    return colors[r] || 'bg-gray-100 text-gray-700 border-gray-200';
};

const getProfilePath = (user: UserDTO) => {
    const r = (user.userRole || '').replace('ROLE_', '');
    if (r === 'ADMIN') return '/admin/profile';
    if (['ICP', 'SAGE_FEMME', 'INFIRMIER', 'MEDECIN'].includes(r)) return '/medecin/profile';
    return '/profile';
};

// Composant UserAvatar pour le header principal
export function UserAvatarHeader({ user }: { user: UserDTO | null }) {
    const navigate = useNavigate();
    const logout = useLogout();

    const handleLogout = () => {
        toast.success('Déconnexion réussie');
        logout();
    };

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-10 px-2 sm:px-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                >
                    {/* Avatar avec initiales */}
                    <div className="relative">
                        <Avatar className="h-8 w-8 ring-2 ring-blue-200 dark:ring-blue-800 ring-offset-1 ring-offset-background">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-bold">
                                {initials(user)}
                            </AvatarFallback>
                        </Avatar>
                        {/* Point vert "en ligne" */}
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                    </div>

                    {/* Nom + rôle (desktop uniquement) */}
                    <div className="hidden sm:flex flex-col items-start text-left">
                        <span className="text-xs font-semibold text-foreground leading-tight truncate max-w-[130px]">
                            {user.prenom} {user.nom}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                            {roleLabel(user.userRole)}
                        </span>
                    </div>

                    <ChevronDown className="hidden sm:block h-3 w-3 text-muted-foreground flex-shrink-0" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64" align="end" sideOffset={8} forceMount>

                {/* En-tête avec infos utilisateur */}
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-br from-blue-50 to-blue-100/60 dark:from-blue-950/40 dark:to-blue-900/20 rounded-t-md">
                        <Avatar className="h-11 w-11 ring-2 ring-blue-200 dark:ring-blue-700 ring-offset-2 ring-offset-blue-50 dark:ring-offset-blue-950/40 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-base">
                                {initials(user)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 space-y-0.5">
                            <p className="font-semibold text-sm text-foreground truncate leading-snug">
                                {user.prenom} {user.nom}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                                {user.email}
                            </p>
                            <Badge className={`mt-1 text-[10px] px-1.5 py-0 h-4 font-medium border ${roleColor(user.userRole)}`}>
                                <Shield className="h-2.5 w-2.5 mr-1" />
                                {roleLabel(user.userRole)}
                            </Badge>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => navigate(getProfilePath(user))}
                        className="gap-2.5 cursor-pointer"
                    >
                        <User className="size-4 text-blue-500" />
                        <span>Mon Profil</span>
                    </DropdownMenuItem>

                    {(user.userRole === 'ADMIN' || user.userRole === 'ROLE_ADMIN') && (
                        <DropdownMenuItem
                            onClick={() => navigate('/admin/settings')}
                            className="gap-2.5 cursor-pointer"
                        >
                            <Settings className="size-4 text-blue-500" />
                            <span>Paramètres</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2.5 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                >
                    <LogOut className="size-4" />
                    <span>Déconnexion</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


// Composant UserAvatar pour afficher l'avatar et le menu utilisateur
export function UserAvatar({user}: {user:UserDTO}) {
  // Hook appelé À L'INTÉRIEUR du composant
  const logout = useLogout();

  const handleLogout = () => {
    toast.success('Déconnexion réussie');
    logout();
  };
  const { isMobile } = useSidebar()

  const navigate = useNavigate();

    if (!user) {
      return <Navigate to="/" replace />;
    }

  // Déterminer le chemin de profil selon le rôle

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src={user.profile.avatar} alt={user.full_name} /> */}
                <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.prenom} {user.nom}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={user.profile.avatar} alt={user.full_name} /> */}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials(user)}
                </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.prenom} {user.nom}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate(getProfilePath(user))}>
                    <User className="mr-2 size-4" />
                    <span>Mon Profil</span>
                </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 size-4" />
                  <span>Déconnexion</span>
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
