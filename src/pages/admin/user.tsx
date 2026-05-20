import { useState, useEffect } from "react";
import PageContainer from "@/components/shared/page-container";
import { useAllUsers, useDeleteUser, useCreateInfirmier, useUpdateUser } from "@/services/user.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  RefreshCw,
  Filter,
  Download,
  Building2,
  Phone,
  Mail,
  Loader2,
  Power,
  ShieldCheck,
  ShieldOff
} from "lucide-react";
import type { UtilisateurDTO, SaveInfirmierDTO, UpdateUtilisateurDTO, UserRoleEnum } from "@/types";
import { UserRole, GroupeSanguinValues } from "@/types";
import { useModal } from "@/components/shared/modal-provider";
import { BaseModal } from "@/components/shared/base-modal";
import { toast } from "sonner";

type UserStatusMap = Record<string, boolean>;
const USER_STATUS_STORAGE_KEY = "platform-user-status-map";

const readUserStatusMap = (): UserStatusMap => {
  try {
    const raw = localStorage.getItem(USER_STATUS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UserStatusMap;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

const writeUserStatusMap = (map: UserStatusMap) => {
  localStorage.setItem(USER_STATUS_STORAGE_KEY, JSON.stringify(map));
};

export default function UserPage() {
  const { data: users, isLoading, isError, error, refetch } = useAllUsers();
  const deleteUserMutation = useDeleteUser();
  const { openModal, closeModal } = useModal();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UtilisateurDTO | null>(null);
  const [userStatusMap, setUserStatusMap] = useState<UserStatusMap>({});

  useEffect(() => {
    setUserStatusMap(readUserStatusMap());
  }, []);

  const isUserActive = (user: UtilisateurDTO) => {
    const id = user.id != null ? String(user.id) : "";
    if (!id) return true;
    if (id in userStatusMap) return !!userStatusMap[id];
    return true;
  };

  const toggleUserStatus = (user: UtilisateurDTO) => {
    if (user.id == null) return;
    const id = String(user.id);
    const currentlyActive = isUserActive(user);
    const next = { ...userStatusMap, [id]: !currentlyActive };
    setUserStatusMap(next);
    writeUserStatusMap(next);
    toast.success(!currentlyActive ? "Utilisateur activé" : "Utilisateur désactivé", {
      description: `${user.prenom} ${user.nom} est maintenant ${!currentlyActive ? "actif" : "inactif"} sur la plateforme.`,
    });
  };

  // Filtrer les utilisateurs par recherche
  const filteredUsers = users?.filter((user: UtilisateurDTO) => {
    const search = searchTerm.toLowerCase();
    return (
      user.nom?.toLowerCase().includes(search) ||
      user.prenom?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.telephone?.toLowerCase().includes(search) ||
      user.userRole?.toLowerCase().includes(search)
    );
  });

  const activeUsersCount = (users || []).filter((u) => isUserActive(u)).length;
  const inactiveUsersCount = Math.max(0, (users || []).length - activeUsersCount);

  // Actions
  const handleViewDetails = (user: UtilisateurDTO) => {
    setSelectedUser(user);
    openModal('detail-user');
  };

  const handleEdit = (user: UtilisateurDTO) => {
    setSelectedUser(user);
    openModal('edit-user');
  };

  const handleDelete = (user: UtilisateurDTO) => {
    setSelectedUser(user);
    openModal('delete-user');
  };

  const confirmDelete = async () => {
    if (selectedUser?.id) {
      try {
        await deleteUserMutation.mutateAsync(selectedUser.id);
        toast.success("Utilisateur supprimé", {
          description: `${selectedUser.prenom} ${selectedUser.nom} a été supprimé avec succès.`
        });
        closeModal('delete-user');
        setSelectedUser(null);
      } catch (err) {
        toast.error("Erreur", {
          description: "Impossible de supprimer l'utilisateur."
        });
      }
    }
  };

  const handleAddUser = () => {
    openModal('add-user');
  };

  return (
    <PageContainer 
      title="Gestion des Utilisateurs" 
      subtitle="Gérez les utilisateurs du système de vaccination"
    >
      <div className="space-y-6">
        {/* Header avec statistiques */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-blue-700">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-blue-700">{users?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-blue-700">ICP</CardTitle>
              <Building2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-blue-700">
                {users?.filter((u: UtilisateurDTO) => u.userRole === 'ICP').length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-blue-700">Utilisateurs Actifs</CardTitle>
              <ShieldCheck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-blue-700">
                {activeUsersCount}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-blue-700">Utilisateurs Inactifs</CardTitle>
              <ShieldOff className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-blue-700">
                {inactiveUsersCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre d'actions */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Liste des Utilisateurs
                </CardTitle>
                <CardDescription>
                  {filteredUsers?.length || 0} utilisateur(s) {searchTerm && "trouvé(s)"}
                </CardDescription>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleAddUser} className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
                <Button variant="outline" size="icon" onClick={() => refetch()} title="Actualiser">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Exporter">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Barre de recherche */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>

            {/* État de chargement */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            )}

            {/* État d'erreur */}
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Erreur lors du chargement des utilisateurs: {error?.message || 'Erreur inconnue'}
                </AlertDescription>
              </Alert>
            )}

            {/* Tableau des utilisateurs */}
            {!isLoading && !isError && filteredUsers && (
              <div className="rounded-xl border border-blue-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50/80">
                      <TableHead className="font-semibold text-blue-700">Utilisateur</TableHead>
                      <TableHead className="font-semibold text-blue-700">Contact</TableHead>
                      <TableHead className="font-semibold text-blue-700">Rôle</TableHead>
                      <TableHead className="font-semibold text-blue-700">Statut</TableHead>
                      <TableHead className="font-semibold text-blue-700">Centre</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Users className="h-12 w-12 opacity-20" />
                            <p className="font-medium">Aucun utilisateur trouvé</p>
                            <p className="text-sm">
                              {searchTerm ? "Modifiez votre recherche" : "Ajoutez votre premier utilisateur"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user: UtilisateurDTO) => (
                        <TableRow key={user.id} className="hover:bg-blue-50/40 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {user.prenom?.[0]}{user.nom?.[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{user.prenom} {user.nom}</p>
                                <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{user.email}</span>
                              </div>
                              {user.telephone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="h-3.5 w-3.5" />
                                  <span>{user.telephone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.userRole)} className="font-medium">
                              {getRoleLabel(user.userRole)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                isUserActive(user)
                                  ? "border-blue-200 bg-blue-50 text-blue-700"
                                  : "border-slate-300 bg-slate-100 text-slate-600"
                              }
                            >
                              {isUserActive(user) ? "Actif" : "Inactif"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              {user.centre ? (
                                <div>
                                  <p className="font-medium truncate">{user.centre.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.centre.type}</p>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewDetails(user)} className="gap-2">
                                  <Eye className="h-4 w-4" />
                                  Voir détails
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(user)} className="gap-2">
                                  <Pencil className="h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleUserStatus(user)} className="gap-2">
                                  <Power className="h-4 w-4" />
                                  {isUserActive(user) ? "Désactiver" : "Activer"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(user)} 
                                  className="gap-2 text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Détails Utilisateur */}
      <BaseModal
        modalId="detail-user"
        title="Détails de l'utilisateur"
        description="Informations complètes sur l'utilisateur"
        size="lg"
        showFooter={false}
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Header avec avatar */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {selectedUser.prenom?.[0]}{selectedUser.nom?.[0]}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{selectedUser.prenom} {selectedUser.nom}</h3>
                <Badge variant={getRoleBadgeVariant(selectedUser.userRole)}>
                  {getRoleLabel(selectedUser.userRole)}
                </Badge>
              </div>
            </div>

            {/* Informations */}
            <div className="grid gap-4 md:grid-cols-2">
              <InfoItem icon={Mail} label="Email" value={selectedUser.email} />
              <InfoItem icon={Phone} label="Téléphone" value={selectedUser.telephone || '-'} />
              <InfoItem icon={Building2} label="Centre" value={selectedUser.centre?.name || '-'} />
              <InfoItem icon={Users} label="Âge" value={selectedUser.age ? `${selectedUser.age} ans` : '-'} />
            </div>

            {/* Informations supplémentaires */}
            {(selectedUser.profession || selectedUser.adresse) && (
              <div className="pt-4 border-t space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Informations supplémentaires
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {selectedUser.profession && (
                    <div>
                      <p className="text-sm text-muted-foreground">Profession</p>
                      <p className="font-medium">{selectedUser.profession}</p>
                    </div>
                  )}
                  {selectedUser.adresse && (
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse</p>
                      <p className="font-medium">{selectedUser.adresse}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </BaseModal>

      {/* Modal Ajouter Utilisateur */}
      <AddUserModal 
        onSuccess={() => {
          refetch();
          closeModal('add-user');
        }} 
      />

      {/* Modal Modifier Utilisateur */}
      <EditUserModal 
        user={selectedUser}
        onSuccess={() => {
          refetch();
          closeModal('edit-user');
          setSelectedUser(null);
        }}
      />

      {/* Modal Supprimer Utilisateur */}
      <BaseModal
        modalId="delete-user"
        title="Supprimer l'utilisateur"
        description="Cette action est irréversible"
        size="sm"
        confirmText="Supprimer"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm">
                Êtes-vous sûr de vouloir supprimer <strong>{selectedUser.prenom} {selectedUser.nom}</strong> ?
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Cette action supprimera définitivement :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Le compte utilisateur</li>
                <li>Toutes les données associées</li>
                <li>L'historique des actions</li>
              </ul>
            </div>
          </div>
        )}
      </BaseModal>
    </PageContainer>
  );
}

// Composant pour afficher une info
function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

// Helper pour le style du badge selon le rôle
function getRoleBadgeVariant(role: string | undefined): "default" | "secondary" | "destructive" | "outline" {
  switch (role) {
    case 'ADMIN':
      return 'destructive';
    case 'ICP':
      return 'default';
    case 'INFIRMIER':
      return 'secondary';
    case 'PARENT':
      return 'outline';
    default:
      return 'outline';
  }
}

// Helper pour le label du rôle
function getRoleLabel(role: string | undefined): string {
  switch (role) {
    case 'ADMIN':
      return 'Administrateur';
    case 'ICP':
      return 'ICP';
    case 'INFIRMIER':
      return 'Infirmier';
    case 'PARENT':
      return 'Parent';
    case 'MEDECIN':
      return 'Médecin';
    case 'SAGE_FEMME':
      return 'Sage-Femme';
    default:
      return role || 'Inconnu';
  }
}

// ================================
// COMPOSANT MODAL AJOUT UTILISATEUR
// ================================

interface AddUserModalProps {
  onSuccess: () => void;
}

function AddUserModal({ onSuccess }: AddUserModalProps) {
  const { isModalOpen, closeModal } = useModal();
  const [userType, setUserType] = useState<'INFIRMIER' | 'ICP'>('INFIRMIER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Utiliser centreId fixe pour le moment (à remplacer par un select de centres)
  const centreId = 3; // TODO: Récupérer dynamiquement
  const createInfirmierMutation = useCreateInfirmier(centreId);
  
  const [formData, setFormData] = useState<SaveInfirmierDTO>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
    matricule: '',
    dateEmbauche: '',
    age: undefined
  });

  const handleChange = (field: keyof SaveInfirmierDTO, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      phone: '',
      matricule: '',
      dateEmbauche: '',
      age: undefined
    });
  };

  const handleSubmit = async () => {
    // Validation basique
    if (!formData.nom || !formData.prenom || !formData.email || !formData.password) {
      toast.error("Erreur de validation", {
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createInfirmierMutation.mutateAsync(formData);
      toast.success("Utilisateur créé", {
        description: `${formData.prenom} ${formData.nom} a été créé avec succès.`
      });
      resetForm();
      onSuccess();
    } catch (err: any) {
      toast.error("Erreur", {
        description: err?.message || "Impossible de créer l'utilisateur."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen('add-user')) return null;

  return (
    <BaseModal
      modalId="add-user"
      title="Ajouter un utilisateur"
      description="Créez un nouveau compte utilisateur dans le système"
      size="xl"
      showFooter={false}
    >
      <div className="space-y-6">
        {/* Sélection du type d'utilisateur */}
        <div className="space-y-2">
          <Label>Type d'utilisateur *</Label>
          <Tabs value={userType} onValueChange={(v) => setUserType(v as 'INFIRMIER' | 'ICP')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="INFIRMIER">Infirmier</TabsTrigger>
              <TabsTrigger value="ICP">ICP (Chef de Poste)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Formulaire */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Prénom */}
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              placeholder="Entrez le prénom"
              value={formData.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
            />
          </div>

          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              placeholder="Entrez le nom"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              placeholder="77 123 45 67"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          {/* Âge */}
          <div className="space-y-2">
            <Label htmlFor="age">Âge</Label>
            <Input
              id="age"
              type="number"
              placeholder="30"
              value={formData.age || ''}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Matricule */}
          <div className="space-y-2">
            <Label htmlFor="matricule">Matricule</Label>
            <Input
              id="matricule"
              placeholder="MAT-001"
              value={formData.matricule || ''}
              onChange={(e) => handleChange('matricule', e.target.value)}
            />
          </div>

          {/* Date d'embauche */}
          <div className="space-y-2">
            <Label htmlFor="dateEmbauche">Date d'embauche</Label>
            <Input
              id="dateEmbauche"
              type="date"
              value={formData.dateEmbauche || ''}
              onChange={(e) => handleChange('dateEmbauche', e.target.value)}
            />
          </div>
        </div>

        {/* Footer avec boutons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => {
              resetForm();
              closeModal('add-user');
            }}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer l'utilisateur
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}

// ================================
// COMPOSANT MODAL MODIFICATION UTILISATEUR
// ================================

interface EditUserModalProps {
  user: UtilisateurDTO | null;
  onSuccess: () => void;
}

function EditUserModal({ user, onSuccess }: EditUserModalProps) {
  const { isModalOpen, closeModal } = useModal();
  const updateUserMutation = useUpdateUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<UpdateUtilisateurDTO>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    age: undefined,
    adresse: '',
    profession: '',
    groupeSanguin: undefined,
    statutMatrimonial: '',
    niveauEtude: ''
  });

  // Charger les données de l'utilisateur quand il change
  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        age: user.age || undefined,
        adresse: user.adresse || '',
        profession: user.profession || '',
        groupeSanguin: user.groupeSanguin || undefined,
        statutMatrimonial: user.statutMatrimonial || '',
        niveauEtude: user.niveauEtude || ''
      });
    }
  }, [user]);

  const handleChange = (field: keyof UpdateUtilisateurDTO, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

    // Validation basique
    if (!formData.nom || !formData.prenom) {
      toast.error("Erreur de validation", {
        description: "Le nom et le prénom sont obligatoires."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserMutation.mutateAsync({ ...formData, id: user.id });
      toast.success("Utilisateur modifié", {
        description: `${formData.prenom} ${formData.nom} a été modifié avec succès.`
      });
      onSuccess();
    } catch (err: any) {
      toast.error("Erreur", {
        description: err?.message || "Impossible de modifier l'utilisateur."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen('edit-user') || !user) return null;

  return (
    <BaseModal
      modalId="edit-user"
      title="Modifier l'utilisateur"
      description={`Modification de ${user.prenom} ${user.nom}`}
      size="xl"
      showFooter={false}
    >
      <div className="space-y-6">
        {/* Info utilisateur */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {user.prenom?.[0]}{user.nom?.[0]}
            </span>
          </div>
          <div>
            <p className="font-medium">{user.prenom} {user.nom}</p>
            <Badge variant={getRoleBadgeVariant(user.userRole)} className="mt-1">
              {getRoleLabel(user.userRole)}
            </Badge>
          </div>
        </div>

        {/* Formulaire */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Prénom */}
          <div className="space-y-2">
            <Label htmlFor="edit-prenom">Prénom *</Label>
            <Input
              id="edit-prenom"
              placeholder="Entrez le prénom"
              value={formData.prenom || ''}
              onChange={(e) => handleChange('prenom', e.target.value)}
            />
          </div>

          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="edit-nom">Nom *</Label>
            <Input
              id="edit-nom"
              placeholder="Entrez le nom"
              value={formData.nom || ''}
              onChange={(e) => handleChange('nom', e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="exemple@email.com"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="edit-telephone">Téléphone</Label>
            <Input
              id="edit-telephone"
              placeholder="77 123 45 67"
              value={formData.telephone || ''}
              onChange={(e) => handleChange('telephone', e.target.value)}
            />
          </div>

          {/* Âge */}
          <div className="space-y-2">
            <Label htmlFor="edit-age">Âge</Label>
            <Input
              id="edit-age"
              type="number"
              placeholder="30"
              value={formData.age || ''}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || undefined)}
            />
          </div>

          {/* Groupe sanguin */}
          <div className="space-y-2">
            <Label htmlFor="edit-groupeSanguin">Groupe sanguin</Label>
            <Select 
              value={formData.groupeSanguin || ''} 
              onValueChange={(v) => handleChange('groupeSanguin', v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {GroupeSanguinValues.map((gs) => (
                  <SelectItem key={gs} value={gs}>{gs}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <Label htmlFor="edit-profession">Profession</Label>
            <Input
              id="edit-profession"
              placeholder="Profession"
              value={formData.profession || ''}
              onChange={(e) => handleChange('profession', e.target.value)}
            />
          </div>

          {/* Niveau d'étude */}
          <div className="space-y-2">
            <Label htmlFor="edit-niveauEtude">Niveau d'étude</Label>
            <Select 
              value={formData.niveauEtude || ''} 
              onValueChange={(v) => handleChange('niveauEtude', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIMAIRE">Primaire</SelectItem>
                <SelectItem value="SECONDAIRE">Secondaire</SelectItem>
                <SelectItem value="UNIVERSITAIRE">Universitaire</SelectItem>
                <SelectItem value="AUCUN">Aucun</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Adresse - pleine largeur */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="edit-adresse">Adresse</Label>
            <Input
              id="edit-adresse"
              placeholder="Adresse complète"
              value={formData.adresse || ''}
              onChange={(e) => handleChange('adresse', e.target.value)}
            />
          </div>
        </div>

        {/* Footer avec boutons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => closeModal('edit-user')}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
