import { useState } from "react";
import PageContainer from "@/components/shared/page-container";
import { useAllUsers } from "@/services/user.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  UserCog,
  Stethoscope,
  Baby,
  Syringe,
  Building2,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info
} from "lucide-react";
import type { UtilisateurDTO, UserRoleEnum } from "@/types";
import { UserRole } from "@/types";

// ================================
// CONFIGURATION DES RÔLES ET PERMISSIONS
// ================================

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface RoleConfig {
  role: UserRoleEnum;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  permissions: Permission[];
}

// Définition des permissions du système
const SYSTEM_PERMISSIONS: Record<string, Permission> = {
  // Gestion utilisateurs
  USER_VIEW: { id: 'USER_VIEW', name: 'Voir les utilisateurs', description: 'Consulter la liste des utilisateurs' },
  USER_CREATE: { id: 'USER_CREATE', name: 'Créer des utilisateurs', description: 'Ajouter de nouveaux utilisateurs' },
  USER_EDIT: { id: 'USER_EDIT', name: 'Modifier les utilisateurs', description: 'Modifier les informations utilisateurs' },
  USER_DELETE: { id: 'USER_DELETE', name: 'Supprimer les utilisateurs', description: 'Supprimer des utilisateurs' },
  
  // Gestion vaccinations
  VACCINATION_VIEW: { id: 'VACCINATION_VIEW', name: 'Voir les vaccinations', description: 'Consulter les vaccinations' },
  VACCINATION_CREATE: { id: 'VACCINATION_CREATE', name: 'Créer des vaccinations', description: 'Enregistrer de nouvelles vaccinations' },
  VACCINATION_EDIT: { id: 'VACCINATION_EDIT', name: 'Modifier les vaccinations', description: 'Modifier les vaccinations existantes' },
  VACCINATION_DELETE: { id: 'VACCINATION_DELETE', name: 'Supprimer les vaccinations', description: 'Supprimer des vaccinations' },
  
  // Gestion enfants
  CHILD_VIEW: { id: 'CHILD_VIEW', name: 'Voir les enfants', description: 'Consulter la liste des enfants' },
  CHILD_CREATE: { id: 'CHILD_CREATE', name: 'Créer des enfants', description: 'Enregistrer de nouveaux enfants' },
  CHILD_EDIT: { id: 'CHILD_EDIT', name: 'Modifier les enfants', description: 'Modifier les informations enfants' },
  CHILD_DELETE: { id: 'CHILD_DELETE', name: 'Supprimer les enfants', description: 'Supprimer des enfants' },
  
  // Gestion centres
  CENTER_VIEW: { id: 'CENTER_VIEW', name: 'Voir les centres', description: 'Consulter la liste des centres' },
  CENTER_CREATE: { id: 'CENTER_CREATE', name: 'Créer des centres', description: 'Ajouter de nouveaux centres' },
  CENTER_EDIT: { id: 'CENTER_EDIT', name: 'Modifier les centres', description: 'Modifier les informations centres' },
  CENTER_DELETE: { id: 'CENTER_DELETE', name: 'Supprimer les centres', description: 'Supprimer des centres' },
  
  // Gestion vaccins
  VACCINE_VIEW: { id: 'VACCINE_VIEW', name: 'Voir les vaccins', description: 'Consulter la liste des vaccins' },
  VACCINE_CREATE: { id: 'VACCINE_CREATE', name: 'Créer des vaccins', description: 'Ajouter de nouveaux vaccins' },
  VACCINE_EDIT: { id: 'VACCINE_EDIT', name: 'Modifier les vaccins', description: 'Modifier les informations vaccins' },
  VACCINE_DELETE: { id: 'VACCINE_DELETE', name: 'Supprimer les vaccins', description: 'Supprimer des vaccins' },
  
  // Gestion localités
  LOCALITY_VIEW: { id: 'LOCALITY_VIEW', name: 'Voir les localités', description: 'Consulter les localités' },
  LOCALITY_MANAGE: { id: 'LOCALITY_MANAGE', name: 'Gérer les localités', description: 'Créer/modifier/supprimer les localités' },
  
  // Rapports et statistiques
  REPORT_VIEW: { id: 'REPORT_VIEW', name: 'Voir les rapports', description: 'Consulter les rapports et statistiques' },
  REPORT_EXPORT: { id: 'REPORT_EXPORT', name: 'Exporter les rapports', description: 'Exporter les données' },
  
  // Configuration système
  SYSTEM_CONFIG: { id: 'SYSTEM_CONFIG', name: 'Configuration système', description: 'Accéder aux paramètres système' },
  
  // Rendez-vous
  APPOINTMENT_VIEW: { id: 'APPOINTMENT_VIEW', name: 'Voir les rendez-vous', description: 'Consulter les rendez-vous' },
  APPOINTMENT_MANAGE: { id: 'APPOINTMENT_MANAGE', name: 'Gérer les rendez-vous', description: 'Créer/modifier les rendez-vous' },
  
  // Propres informations
  OWN_PROFILE: { id: 'OWN_PROFILE', name: 'Profil personnel', description: 'Voir et modifier son propre profil' },
  OWN_CHILDREN: { id: 'OWN_CHILDREN', name: 'Ses enfants', description: 'Gérer ses propres enfants' },
};

// Configuration des rôles avec leurs permissions
const ROLES_CONFIG: RoleConfig[] = [
  {
    role: UserRole.ADMIN,
    label: 'Administrateur',
    description: 'Accès complet au système. Peut gérer tous les utilisateurs, centres, vaccins et configurations.',
    icon: ShieldAlert,
    color: 'bg-red-500',
    badgeVariant: 'destructive',
    permissions: Object.values(SYSTEM_PERMISSIONS) // Toutes les permissions
  },
  {
    role: UserRole.ICP,
    label: 'ICP (Infirmier Chef de Poste)',
    description: 'Responsable d\'un centre de santé. Peut gérer le personnel et les vaccinations de son centre.',
    icon: ShieldCheck,
    color: 'bg-blue-500',
    badgeVariant: 'default',
    permissions: [
      SYSTEM_PERMISSIONS.USER_VIEW,
      SYSTEM_PERMISSIONS.USER_CREATE,
      SYSTEM_PERMISSIONS.USER_EDIT,
      SYSTEM_PERMISSIONS.VACCINATION_VIEW,
      SYSTEM_PERMISSIONS.VACCINATION_CREATE,
      SYSTEM_PERMISSIONS.VACCINATION_EDIT,
      SYSTEM_PERMISSIONS.CHILD_VIEW,
      SYSTEM_PERMISSIONS.CHILD_CREATE,
      SYSTEM_PERMISSIONS.CHILD_EDIT,
      SYSTEM_PERMISSIONS.CENTER_VIEW,
      SYSTEM_PERMISSIONS.VACCINE_VIEW,
      SYSTEM_PERMISSIONS.REPORT_VIEW,
      SYSTEM_PERMISSIONS.REPORT_EXPORT,
      SYSTEM_PERMISSIONS.APPOINTMENT_VIEW,
      SYSTEM_PERMISSIONS.APPOINTMENT_MANAGE,
      SYSTEM_PERMISSIONS.OWN_PROFILE,
    ]
  },
  {
    role: UserRole.MEDECIN,
    label: 'Médecin',
    description: 'Personnel médical pouvant consulter et administrer les vaccinations.',
    icon: Stethoscope,
    color: 'bg-green-500',
    badgeVariant: 'default',
    permissions: [
      SYSTEM_PERMISSIONS.VACCINATION_VIEW,
      SYSTEM_PERMISSIONS.VACCINATION_CREATE,
      SYSTEM_PERMISSIONS.VACCINATION_EDIT,
      SYSTEM_PERMISSIONS.CHILD_VIEW,
      SYSTEM_PERMISSIONS.CHILD_EDIT,
      SYSTEM_PERMISSIONS.VACCINE_VIEW,
      SYSTEM_PERMISSIONS.REPORT_VIEW,
      SYSTEM_PERMISSIONS.APPOINTMENT_VIEW,
      SYSTEM_PERMISSIONS.APPOINTMENT_MANAGE,
      SYSTEM_PERMISSIONS.OWN_PROFILE,
    ]
  },
  {
    role: UserRole.INFIRMIER,
    label: 'Infirmier',
    description: 'Personnel soignant assistant dans les vaccinations et le suivi des enfants.',
    icon: Syringe,
    color: 'bg-cyan-500',
    badgeVariant: 'secondary',
    permissions: [
      SYSTEM_PERMISSIONS.VACCINATION_VIEW,
      SYSTEM_PERMISSIONS.VACCINATION_CREATE,
      SYSTEM_PERMISSIONS.CHILD_VIEW,
      SYSTEM_PERMISSIONS.CHILD_CREATE,
      SYSTEM_PERMISSIONS.VACCINE_VIEW,
      SYSTEM_PERMISSIONS.APPOINTMENT_VIEW,
      SYSTEM_PERMISSIONS.APPOINTMENT_MANAGE,
      SYSTEM_PERMISSIONS.OWN_PROFILE,
    ]
  },
  {
    role: UserRole.SAGE_FEMME,
    label: 'Sage-Femme',
    description: 'Spécialiste de la maternité et des soins aux nouveau-nés.',
    icon: Baby,
    color: 'bg-pink-500',
    badgeVariant: 'secondary',
    permissions: [
      SYSTEM_PERMISSIONS.VACCINATION_VIEW,
      SYSTEM_PERMISSIONS.VACCINATION_CREATE,
      SYSTEM_PERMISSIONS.CHILD_VIEW,
      SYSTEM_PERMISSIONS.CHILD_CREATE,
      SYSTEM_PERMISSIONS.CHILD_EDIT,
      SYSTEM_PERMISSIONS.VACCINE_VIEW,
      SYSTEM_PERMISSIONS.APPOINTMENT_VIEW,
      SYSTEM_PERMISSIONS.APPOINTMENT_MANAGE,
      SYSTEM_PERMISSIONS.OWN_PROFILE,
    ]
  },
  {
    role: UserRole.PARENT,
    label: 'Parent',
    description: 'Parent ou tuteur d\'enfant(s) inscrit(s) dans le système de vaccination.',
    icon: Users,
    color: 'bg-purple-500',
    badgeVariant: 'outline',
    permissions: [
      SYSTEM_PERMISSIONS.OWN_PROFILE,
      SYSTEM_PERMISSIONS.OWN_CHILDREN,
      SYSTEM_PERMISSIONS.VACCINATION_VIEW, // Ses propres vaccinations
      SYSTEM_PERMISSIONS.APPOINTMENT_VIEW, // Ses propres RDV
    ]
  },
];

// ================================
// COMPOSANTS
// ================================

// Carte de statistiques par rôle
interface RoleStatCardProps {
  config: RoleConfig;
  count: number;
  onClick: () => void;
  isSelected: boolean;
}

function RoleStatCard({ config, count, onClick, isSelected }: RoleStatCardProps) {
  const Icon = config.icon;
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
        <div className={`p-2 rounded-lg ${config.color} bg-opacity-10`}>
          <Icon className={`h-4 w-4 ${config.color.replace('bg-', 'text-')}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">utilisateur{count > 1 ? 's' : ''}</p>
      </CardContent>
    </Card>
  );
}

// Composant pour afficher une permission
function PermissionBadge({ permission, hasPermission }: { permission: Permission; hasPermission: boolean }) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${hasPermission ? 'bg-green-50 dark:bg-green-950' : 'bg-gray-50 dark:bg-gray-900'}`}>
      {hasPermission ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-400" />
      )}
      <div className="flex-1">
        <p className={`text-sm font-medium ${hasPermission ? 'text-green-700 dark:text-green-300' : 'text-gray-500'}`}>
          {permission.name}
        </p>
        <p className="text-xs text-muted-foreground">{permission.description}</p>
      </div>
    </div>
  );
}

// Détail d'un rôle
function RoleDetailCard({ config }: { config: RoleConfig }) {
  const Icon = config.icon;
  const allPermissions = Object.values(SYSTEM_PERMISSIONS);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${config.color} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${config.color.replace('bg-', 'text-')}`} />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              {config.label}
              <Badge variant={config.badgeVariant}>{config.role}</Badge>
            </CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Permissions ({config.permissions.length}/{allPermissions.length})</h4>
            <Badge variant="outline">
              {Math.round((config.permissions.length / allPermissions.length) * 100)}% des permissions
            </Badge>
          </div>
          
          {/* Grille de permissions groupées */}
          <div className="space-y-4">
            {/* Utilisateurs */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Gestion des utilisateurs</h5>
              <div className="grid gap-2 md:grid-cols-2">
                {allPermissions.filter(p => p.id.startsWith('USER_')).map(perm => (
                  <PermissionBadge 
                    key={perm.id} 
                    permission={perm} 
                    hasPermission={config.permissions.some(p => p.id === perm.id)} 
                  />
                ))}
              </div>
            </div>
            
            {/* Vaccinations */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Gestion des vaccinations</h5>
              <div className="grid gap-2 md:grid-cols-2">
                {allPermissions.filter(p => p.id.startsWith('VACCINATION_')).map(perm => (
                  <PermissionBadge 
                    key={perm.id} 
                    permission={perm} 
                    hasPermission={config.permissions.some(p => p.id === perm.id)} 
                  />
                ))}
              </div>
            </div>
            
            {/* Enfants */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Gestion des enfants</h5>
              <div className="grid gap-2 md:grid-cols-2">
                {allPermissions.filter(p => p.id.startsWith('CHILD_')).map(perm => (
                  <PermissionBadge 
                    key={perm.id} 
                    permission={perm} 
                    hasPermission={config.permissions.some(p => p.id === perm.id)} 
                  />
                ))}
              </div>
            </div>
            
            {/* Centres & Vaccins */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Centres & Vaccins</h5>
              <div className="grid gap-2 md:grid-cols-2">
                {allPermissions.filter(p => p.id.startsWith('CENTER_') || p.id.startsWith('VACCINE_')).map(perm => (
                  <PermissionBadge 
                    key={perm.id} 
                    permission={perm} 
                    hasPermission={config.permissions.some(p => p.id === perm.id)} 
                  />
                ))}
              </div>
            </div>
            
            {/* Autres */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Autres permissions</h5>
              <div className="grid gap-2 md:grid-cols-2">
                {allPermissions.filter(p => 
                  !p.id.startsWith('USER_') && 
                  !p.id.startsWith('VACCINATION_') && 
                  !p.id.startsWith('CHILD_') &&
                  !p.id.startsWith('CENTER_') &&
                  !p.id.startsWith('VACCINE_')
                ).map(perm => (
                  <PermissionBadge 
                    key={perm.id} 
                    permission={perm} 
                    hasPermission={config.permissions.some(p => p.id === perm.id)} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ================================
// PAGE PRINCIPALE
// ================================

export default function RolePermissionPage() {
  const { data: users, isLoading, isError, error } = useAllUsers();
  const [selectedRole, setSelectedRole] = useState<UserRoleEnum | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Compter les utilisateurs par rôle
  const getUserCountByRole = (role: UserRoleEnum): number => {
    if (!users) return 0;
    return users.filter(u => u.userRole === role).length;
  };

  // Filtrer les utilisateurs par rôle et recherche
  const filteredUsers = users?.filter(user => {
    const matchesRole = !selectedRole || user.userRole === selectedRole;
    const matchesSearch = !searchTerm || 
      user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  }) || [];

  // Obtenir la config du rôle sélectionné
  const selectedRoleConfig = selectedRole 
    ? ROLES_CONFIG.find(r => r.role === selectedRole) 
    : null;

  return (
    <PageContainer 
      title="Rôles et Permissions" 
      subtitle="Gérez les rôles et consultez les permissions associées à chaque profil utilisateur."
    >
      <div className="space-y-6">
        {/* En-tête avec info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Les rôles et permissions sont définis au niveau du système. Chaque utilisateur se voit attribuer un rôle 
            qui détermine ses accès. Pour modifier le rôle d'un utilisateur, utilisez la page de gestion des utilisateurs.
          </AlertDescription>
        </Alert>

        {/* Statistiques par rôle */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {ROLES_CONFIG.map(config => (
            <RoleStatCard
              key={config.role}
              config={config}
              count={getUserCountByRole(config.role)}
              onClick={() => setSelectedRole(selectedRole === config.role ? null : config.role)}
              isSelected={selectedRole === config.role}
            />
          ))}
        </div>

        {/* Tabs de navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Matrice des permissions
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs par rôle
            </TabsTrigger>
          </TabsList>

          {/* Tab: Vue d'ensemble */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {selectedRoleConfig ? (
                <div className="lg:col-span-2">
                  <RoleDetailCard config={selectedRoleConfig} />
                </div>
              ) : (
                ROLES_CONFIG.map(config => (
                  <RoleDetailCard key={config.role} config={config} />
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab: Matrice des permissions */}
          <TabsContent value="permissions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Matrice des permissions</CardTitle>
                <CardDescription>
                  Vue comparative des permissions par rôle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Permission</TableHead>
                        {ROLES_CONFIG.map(config => (
                          <TableHead key={config.role} className="text-center min-w-[100px]">
                            <div className="flex flex-col items-center gap-1">
                              <config.icon className="h-4 w-4" />
                              <span className="text-xs">{config.label}</span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.values(SYSTEM_PERMISSIONS).map(permission => (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{permission.name}</p>
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            </div>
                          </TableCell>
                          {ROLES_CONFIG.map(config => {
                            const hasPermission = config.permissions.some(p => p.id === permission.id);
                            return (
                              <TableCell key={config.role} className="text-center">
                                {hasPermission ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Utilisateurs par rôle */}
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>
                      {selectedRole 
                        ? `Utilisateurs - ${ROLES_CONFIG.find(r => r.role === selectedRole)?.label}` 
                        : 'Tous les utilisateurs'}
                    </CardTitle>
                    <CardDescription>
                      {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : isError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erreur lors du chargement: {error?.message || 'Une erreur est survenue'}
                    </AlertDescription>
                  </Alert>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun utilisateur trouvé</p>
                    {selectedRole && (
                      <Button 
                        variant="link" 
                        onClick={() => setSelectedRole(null)}
                        className="mt-2"
                      >
                        Afficher tous les rôles
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rôle</TableHead>
                          <TableHead>Centre</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => {
                          const roleConfig = ROLES_CONFIG.find(r => r.role === user.userRole);
                          const Icon = roleConfig?.icon || Users;
                          return (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className={`h-9 w-9 rounded-full ${roleConfig?.color || 'bg-gray-500'} bg-opacity-10 flex items-center justify-center`}>
                                    <span className="text-sm font-medium">
                                      {user.prenom?.[0]}{user.nom?.[0]}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{user.prenom} {user.nom}</p>
                                    <p className="text-xs text-muted-foreground">{user.telephone || '-'}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={roleConfig?.badgeVariant || 'outline'} className="flex items-center gap-1 w-fit">
                                  <Icon className="h-3 w-3" />
                                  {roleConfig?.label || user.userRole}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {user.centre?.nom || '-'}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
