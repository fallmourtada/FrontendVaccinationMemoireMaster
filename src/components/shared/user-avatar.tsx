import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
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

const initials = (User: UserDTO) => {
    return (
        (User?.prenom?.charAt(0) || '') + 
        (User?.nom?.charAt(0) || '')
    ).toUpperCase();
}

const getProfilePath = (user: UserDTO) => {
    if (user.role === 'ROLE_ADMIN') return '/admin/profile';
    if (user.role === 'ROLE_ICP') return '/medecin/profile';
    if (user.role === 'ROLE_SAGE_FEMME') return '/medecin/profile';
    if (user.role === 'ROLE_INFIRMIER') return '/medecin/profile';
    return '/profile';
};


// Composant UserAvatar pour afficher l'avatar et le menu utilisateur
export function UserAvatarHeader({user}: {user: UserDTO | null}) {
    
    const navigate = useNavigate();

    const logout = useLogout();

    const handleLogout = () => {
      toast.success('Déconnexion réussie');
      logout();
    };

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    // Générer les initiales à partir du nom complet


    // Traduire le rôle en français
    // const getRoleBadge = (role: string) => {
    //     const roles: Record<string, string> = {
    //         'admin': 'Administrateur',
    //         'fournisseur': 'Fournisseur',
    //         'client': 'Client',
    //     };
    //     return roles[role] || role;
    // };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                    {/* {user?.profile.avatar && <AvatarImage src={user?.profile.avatar} alt={user?.full_name} />} */}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials(user)}
                    </AvatarFallback>
                </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.prenom} {user?.nom}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getProfilePath(user))}>
                    <User className="mr-2 size-4" />
                    <span>Mon Profil</span>
                </DropdownMenuItem>

                {user?.role === 'ROLE_ADMIN' && 
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                    <Settings className="mr-2 size-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                }

                {/* {user?.role === 'ROLE_ICP' && 
                <DropdownMenuItem onClick={() => navigate('/customer/orders')}>
                    <Package className="mr-2 size-4" />
                    <span>Mes Commandes</span>
                </DropdownMenuItem>
                }    */}
                <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 size-4" />
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
