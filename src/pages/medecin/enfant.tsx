import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  Search, 
  Plus, 
  Download, 
  Baby,
  Users,
  Phone,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Droplets,
  Calendar,
  Ruler,
  Scale,
  QrCode,
  Heart,
  UserCircle,
  LayoutGrid,
  List,
  MapPin,
  FileText,
  ExternalLink,
  Syringe,
  BookOpen
} from 'lucide-react';
import PageContainer from "@/components/shared/page-container";
import { useModal } from '@/components/shared/modal-provider';
import { BaseModal } from '@/components/shared/base-modal';
import { 
  useAllEnfants, 
  useCreateEnfant, 
  useUpdateEnfant, 
  useDeleteEnfant,
  useEnfantStats,
  useAllUsers,
  useUserByEmail
} from '@/services/user.service';
import { useAllVaccins } from '@/services/vaccin.service';
import { useCreateVaccination } from '@/services/vaccination.service';
import { useAppointmentsByEnfant } from '@/services/appointment.service';
import { CarnetVaccinationModal } from '@/components/modals/carnet-vaccination-modal';
import { useDecodedToken } from '@/contexts/decoded-token-context';
import type { EnfantDTO, SaveEnfantDTO, UpdateEnfantDTO, UtilisateurDTO, VaccinDTO, AppointmentDTO } from '@/types';
import { GroupeSanguinValues, StatutRv } from '@/types';
import { toast } from 'sonner';


// ================================
// COMPOSANT CARD ENFANT
// ================================

interface EnfantCardProps {
  enfant: EnfantDTO;
  onView: (enfant: EnfantDTO) => void;
  onEdit: (enfant: EnfantDTO) => void;
  onDelete: (enfant: EnfantDTO) => void;
  onVaccinate: (enfant: EnfantDTO) => void;
  onViewCarnet: (enfant: EnfantDTO) => void;
  calculateAge: (dateNaissance: string | null | undefined) => string;
}

function EnfantCard({ enfant, onView, onEdit, onDelete, onVaccinate, onViewCarnet, calculateAge }: EnfantCardProps) {
  const isMale = enfant.sexe === 'MASCULIN';
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header avec gradient selon le sexe */}
      <div className={`h-2 ${isMale ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-pink-400 to-pink-600'}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className={`h-14 w-14 border-2 ${isMale ? 'border-blue-200' : 'border-pink-200'}`}>
              <AvatarFallback className={`text-lg font-semibold ${isMale ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                {enfant.prenom?.[0]}{enfant.nom?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{enfant.prenom} {enfant.nom}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                {calculateAge(enfant.dateNaissance)}
              </CardDescription>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(enfant)}>
                <Eye className="mr-2 h-4 w-4" /> Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onVaccinate(enfant)} className="text-green-600">
                <Syringe className="mr-2 h-4 w-4" /> Vacciner
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewCarnet(enfant)} className="text-purple-600">
                <BookOpen className="mr-2 h-4 w-4" /> Voir Carnet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(enfant)}>
                <Pencil className="mr-2 h-4 w-4" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(enfant)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* QR Code Section */}
        <div className="flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center space-y-2">
            {enfant.qrCode ? (
              <div className="relative">
                <div className="p-3 bg-white rounded-lg shadow-sm inline-block">
                  <QrCode className="h-20 w-20 text-gray-800" />
                </div>
                {enfant.contenuQrCcode && (
                  <a 
                    href={enfant.contenuQrCcode} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Ouvrir le lien QR"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ) : (
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block">
                <QrCode className="h-20 w-20 text-gray-400" />
              </div>
            )}
            <p className="text-xs text-muted-foreground font-medium">
              {enfant.numeroCarnet || 'N° Carnet non défini'}
            </p>
          </div>
        </div>

        {/* Infos Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Badge variant={isMale ? 'default' : 'secondary'} 
                   className={`${isMale ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-pink-100 text-pink-700 hover:bg-pink-100'}`}>
              {isMale ? 'Garçon' : 'Fille'}
            </Badge>
          </div>
          
          {enfant.groupeSanguin && (
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <Droplets className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">{enfant.groupeSanguin}</span>
            </div>
          )}
          
          {enfant.lieuNaissance && (
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg col-span-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate">{enfant.lieuNaissance}</span>
            </div>
          )}
        </div>

        {/* Infos Physiques */}
        {(enfant.poids || enfant.taille) && (
          <div className="flex items-center justify-center gap-4 py-2">
            {enfant.poids && (
              <div className="flex items-center gap-1.5 text-sm">
                <Scale className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{enfant.poids} kg</span>
              </div>
            )}
            {enfant.poids && enfant.taille && <Separator orientation="vertical" className="h-4" />}
            {enfant.taille && (
              <div className="flex items-center gap-1.5 text-sm">
                <Ruler className="h-4 w-4 text-green-500" />
                <span className="font-medium">{enfant.taille} cm</span>
              </div>
            )}
          </div>
        )}

        {/* Allergies Alert */}
        {enfant.allergies && (
          <div className="p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Allergies</span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 line-clamp-2">{enfant.allergies}</p>
          </div>
        )}

        <Separator />

        {/* Parent Info */}
        {enfant.parent && (
          <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {enfant.parent.prenom?.[0]}{enfant.parent.nom?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {enfant.parent.prenom} {enfant.parent.nom}
              </p>
              {enfant.parent.telephone && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {enfant.parent.telephone}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex-col gap-2">
        <div className="flex w-full gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1" 
            onClick={() => onView(enfant)}
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Dossier
          </Button>
          <Button 
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700" 
            onClick={() => onVaccinate(enfant)}
          >
            <Syringe className="mr-1.5 h-3.5 w-3.5" />
            Vacciner
          </Button>
        </div>
        <Button 
          variant="outline"
          size="sm"
          className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/40" 
          onClick={() => onViewCarnet(enfant)}
        >
          <BookOpen className="mr-1.5 h-3.5 w-3.5" />
          Voir Carnet de Vaccination
        </Button>
      </CardFooter>
    </Card>
  );
}

// ================================
// COMPOSANT SKELETON CARD
// ================================

function EnfantCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-gray-200 dark:bg-gray-700" />
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

// ================================
// COMPOSANT PRINCIPAL - GESTION ENFANTS
// ================================

export default function EnfantPage() {
  const { data: enfants, isLoading, isError, error, refetch } = useAllEnfants();
  const { data: stats } = useEnfantStats();
  const { data: allUsers } = useAllUsers();
  const { data: vaccins } = useAllVaccins();
  const deleteEnfantMutation = useDeleteEnfant();
  const createVaccinationMutation = useCreateVaccination();
  const { openModal, closeModal } = useModal();
  const { decodedToken } = useDecodedToken();
  
  // Récupérer l'utilisateur connecté via son email (depuis le token)
  const { data: currentUser } = useUserByEmail(decodedToken?.sub || '');

  const [searchTerm, setSearchTerm] = useState('');
  const [sexeFilter, setSexeFilter] = useState('tous');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnfant, setSelectedEnfant] = useState<EnfantDTO | null>(null);
  const [selectedVaccinId, setSelectedVaccinId] = useState<string>('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');
  const itemsPerPage = viewMode === 'grid' ? 8 : 10;

  // Récupérer uniquement les parents pour le formulaire de création
  const parents = allUsers?.filter(user => user.userRole === 'PARENT') || [];

  // Remettre à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sexeFilter]);

  // Filtrage
  const filteredEnfants = (enfants || []).filter(enfant => {
    const matchesSearch = 
      enfant.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enfant.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enfant.numeroCarnet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enfant.parent?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enfant.parent?.prenom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSexe = sexeFilter === 'tous' || enfant.sexe === sexeFilter;
    return matchesSearch && matchesSexe;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEnfants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnfants = filteredEnfants.slice(startIndex, startIndex + itemsPerPage);

  // Calcul de l'âge
  const calculateAge = (dateNaissance: string | null | undefined): string => {
    if (!dateNaissance) return '-';
    const birth = new Date(dateNaissance);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (months < 12) return `${months} mois`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years} an(s) ${remainingMonths} mois` : `${years} an(s)`;
  };

  // Handlers
  const handleViewDetails = (enfant: EnfantDTO) => {
    setSelectedEnfant(enfant);
    openModal('view-enfant');
  };

  const handleEdit = (enfant: EnfantDTO) => {
    setSelectedEnfant(enfant);
    openModal('edit-enfant');
  };

  const handleDelete = (enfant: EnfantDTO) => {
    setSelectedEnfant(enfant);
    openModal('delete-enfant');
  };

  const handleVaccinate = (enfant: EnfantDTO) => {
    setSelectedEnfant(enfant);
    setSelectedVaccinId('');
    setSelectedAppointmentId('');
    openModal('vaccinate-enfant');
  };

  const handleViewCarnet = (enfant: EnfantDTO) => {
    setSelectedEnfant(enfant);
    openModal('carnet-vaccination');
  };

  const confirmVaccination = async () => {
    console.log('Confirmation vaccination:', { 
      selectedEnfantId: selectedEnfant?.id, 
      selectedVaccinId,
      selectedAppointmentId,
      userId: currentUser?.id 
    });
    
    if (!selectedEnfant?.id) {
      toast.error("Erreur", {
        description: "Aucun enfant sélectionné."
      });
      return;
    }
    
    if (!selectedAppointmentId) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner un rendez-vous."
      });
      return;
    }
    
    if (!selectedVaccinId) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner un vaccin."
      });
      return;
    }
    
    if (!currentUser?.id) {
      toast.error("Erreur", {
        description: "Utilisateur non connecté. Veuillez vous reconnecter."
      });
      return;
    }
    
    try {
      await createVaccinationMutation.mutateAsync({
        enfantId: selectedEnfant.id,
        vaccinId: parseInt(selectedVaccinId),
        appointmentId: parseInt(selectedAppointmentId),
        userId: currentUser.id
      });
      
      toast.success("Vaccination enregistrée", {
        description: `${selectedEnfant.prenom} ${selectedEnfant.nom} a été vacciné(e) avec succès.`
      });
      closeModal('vaccinate-enfant');
      setSelectedVaccinId('');
      setSelectedAppointmentId('');
    } catch (err: any) {
      toast.error("Erreur", {
        description: err?.message || "Impossible d'enregistrer la vaccination."
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedEnfant?.id) return;
    try {
      await deleteEnfantMutation.mutateAsync(selectedEnfant.id);
      toast.success("Enfant supprimé", {
        description: `${selectedEnfant.prenom} ${selectedEnfant.nom} a été supprimé avec succès.`
      });
      closeModal('delete-enfant');
      refetch();
    } catch (err: any) {
      toast.error("Erreur", {
        description: err?.message || "Impossible de supprimer l'enfant."
      });
    }
  };

  const handleSuccess = () => {
    closeModal('add-enfant');
    closeModal('edit-enfant');
    refetch();
  };

  // Rendu du tableau skeleton
  const renderSkeletonRows = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <PageContainer 
      title="Gestion des Enfants" 
      subtitle="Gérez les dossiers des enfants enregistrés dans le système de vaccination"
    >
      {/* Cartes statistiques */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enfants</CardTitle>
            <Baby className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.nombreTotalEnfants || enfants?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Enfants enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garçons</CardTitle>
            <UserCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.nombreTotalGarcons || 0}</div>
            <p className="text-xs text-muted-foreground">Sexe masculin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filles</CardTitle>
            <UserCircle className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{stats?.nombreTotalFilles || 0}</div>
            <p className="text-xs text-muted-foreground">Sexe féminin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parents.length}</div>
            <p className="text-xs text-muted-foreground">Parents enregistrés</p>
          </CardContent>
        </Card>
      </div>

      {/* Barre d'actions */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, prénom, n° carnet ou parent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtres et actions */}
            <div className="flex flex-wrap gap-2">
              <Select value={sexeFilter} onValueChange={setSexeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="MASCULIN">Garçon</SelectItem>
                  <SelectItem value="FEMININ">Fille</SelectItem>
                </SelectContent>
              </Select>

              {/* Toggle vue grille/liste */}
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')} className="hidden sm:block">
                <TabsList className="h-9">
                  <TabsTrigger value="grid" className="px-3">
                    <LayoutGrid className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="px-3">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button variant="outline" size="icon" onClick={() => refetch()} title="Actualiser">
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon" title="Exporter">
                <Download className="h-4 w-4" />
              </Button>

              <Button onClick={() => openModal('add-enfant')}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un enfant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message d'erreur */}
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des enfants: {error?.message || 'Erreur inconnue'}
          </AlertDescription>
        </Alert>
      )}

      {/* Header avec compteur */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Liste des Enfants</h2>
          <p className="text-sm text-muted-foreground">
            {filteredEnfants.length} enfant(s) trouvé(s)
          </p>
        </div>
      </div>

      {/* Vue Grille */}
      {viewMode === 'grid' && (
        <>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <EnfantCardSkeleton key={i} />
              ))}
            </div>
          ) : paginatedEnfants.length === 0 ? (
            <Card className="p-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-muted rounded-full">
                  <Baby className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Aucun enfant trouvé</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter un enfant'}
                  </p>
                </div>
                {searchTerm ? (
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Réinitialiser la recherche
                  </Button>
                ) : (
                  <Button onClick={() => openModal('add-enfant')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un enfant
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {paginatedEnfants.map((enfant) => (
                <EnfantCard
                  key={enfant.id}
                  enfant={enfant}
                  onView={handleViewDetails}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onVaccinate={handleVaccinate}
                  onViewCarnet={handleViewCarnet}
                  calculateAge={calculateAge}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Vue Liste (Tableau) */}
      {viewMode === 'list' && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Photo</TableHead>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Âge</TableHead>
                  <TableHead>Sexe</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>N° Carnet</TableHead>
                  <TableHead>Groupe sanguin</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderSkeletonRows()
                ) : paginatedEnfants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Baby className="h-12 w-12 opacity-20" />
                        <p>Aucun enfant trouvé</p>
                        {searchTerm && (
                          <Button variant="link" onClick={() => setSearchTerm('')}>
                            Réinitialiser la recherche
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEnfants.map((enfant) => (
                    <TableRow key={enfant.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={enfant.sexe === 'MASCULIN' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}>
                            {enfant.prenom?.[0]}{enfant.nom?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{enfant.prenom} {enfant.nom}</div>
                        <div className="text-sm text-muted-foreground">
                          {enfant.lieuNaissance && `Né(e) à ${enfant.lieuNaissance}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {calculateAge(enfant.dateNaissance)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={enfant.sexe === 'MASCULIN' ? 'default' : 'secondary'} 
                               className={enfant.sexe === 'MASCULIN' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-pink-100 text-pink-700 hover:bg-pink-100'}>
                          {enfant.sexe === 'MASCULIN' ? 'Garçon' : 'Fille'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{enfant.parent?.prenom} {enfant.parent?.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {enfant.numeroCarnet || '-'}
                        </code>
                      </TableCell>
                      <TableCell>
                        {enfant.groupeSanguin ? (
                          <Badge variant="outline" className="gap-1">
                            <Droplets className="h-3 w-3 text-red-500" />
                            {enfant.groupeSanguin}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(enfant)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleVaccinate(enfant)} className="text-green-600">
                              <Syringe className="mr-2 h-4 w-4" />
                              Vacciner
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewCarnet(enfant)} className="text-purple-600">
                              <BookOpen className="mr-2 h-4 w-4" />
                              Voir Carnet
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(enfant)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(enfant)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modals */}
      <AddEnfantModal parents={parents} onSuccess={handleSuccess} />
      <EditEnfantModal enfant={selectedEnfant} onSuccess={handleSuccess} />
      <ViewEnfantModal enfant={selectedEnfant} />
      
      {/* Modal de confirmation de suppression */}
      <BaseModal
        modalId="delete-enfant"
        title="Confirmer la suppression"
        description="Cette action est irréversible"
        size="sm"
        showFooter={false}
      >
        <div className="space-y-4">
          <p>
            Êtes-vous sûr de vouloir supprimer l'enfant{' '}
            <strong>{selectedEnfant?.prenom} {selectedEnfant?.nom}</strong> ?
          </p>
          <p className="text-sm text-muted-foreground">
            Cette action supprimera définitivement le dossier de l'enfant et toutes ses données associées.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => closeModal('delete-enfant')}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteEnfantMutation.isPending}
            >
              {deleteEnfantMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* Modal de vaccination */}
      <VaccinationModal 
        enfant={selectedEnfant}
        vaccins={vaccins || []}
        selectedVaccinId={selectedVaccinId}
        setSelectedVaccinId={setSelectedVaccinId}
        selectedAppointmentId={selectedAppointmentId}
        setSelectedAppointmentId={setSelectedAppointmentId}
        onConfirm={confirmVaccination}
        isPending={createVaccinationMutation.isPending}
        calculateAge={calculateAge}
      />

      {/* Modal Carnet de Vaccination */}
      <CarnetVaccinationModal enfant={selectedEnfant} />
    </PageContainer>
  );
}


// ================================
// MODAL AJOUT ENFANT
// ================================

interface AddEnfantModalProps {
  parents: UtilisateurDTO[];
  onSuccess: () => void;
}

function AddEnfantModal({ parents, onSuccess }: AddEnfantModalProps) {
  const { isModalOpen, closeModal } = useModal();
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Créer le hook sans parentId - il sera passé dynamiquement
  const createEnfantMutation = useCreateEnfant();

  const [formData, setFormData] = useState<SaveEnfantDTO>({
    prenom: '',
    nom: '',
    dateNaissance: '',
    sexe: undefined,
    lieuNaissance: '',
    groupeSanguin: undefined,
    poids: undefined,
    taille: undefined,
    allergies: '',
    antecedentsMedicaux: ''
  });

  const handleChange = (field: keyof SaveEnfantDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      prenom: '',
      nom: '',
      dateNaissance: '',
      sexe: undefined,
      lieuNaissance: '',
      groupeSanguin: undefined,
      poids: undefined,
      taille: undefined,
      allergies: '',
      antecedentsMedicaux: ''
    });
    setSelectedParentId(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.prenom || !formData.nom) {
      toast.error("Erreur de validation", {
        description: "Le prénom et le nom sont obligatoires."
      });
      return;
    }
    if (!selectedParentId) {
      toast.error("Erreur de validation", {
        description: "Veuillez sélectionner un parent."
      });
      return;
    }
    if (!formData.dateNaissance) {
      toast.error("Erreur de validation", {
        description: "La date de naissance est obligatoire."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createEnfantMutation.mutateAsync({ ...formData, parentId: selectedParentId });
      toast.success("Enfant créé", {
        description: `${formData.prenom} ${formData.nom} a été enregistré avec succès.`
      });
      resetForm();
      onSuccess();
    } catch (err: any) {
      toast.error("Erreur", {
        description: err?.message || "Impossible de créer l'enfant."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen('add-enfant')) return null;

  return (
    <BaseModal
      modalId="add-enfant"
      title="Ajouter un enfant"
      description="Enregistrez un nouvel enfant dans le système"
      size="xl"
      showFooter={false}
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Sélection du parent */}
        <div className="space-y-2">
          <Label htmlFor="parent">Parent *</Label>
          <Select 
            value={selectedParentId?.toString() || ''} 
            onValueChange={(v) => setSelectedParentId(parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un parent" />
            </SelectTrigger>
            <SelectContent>
              {parents.length === 0 ? (
                <SelectItem value="none" disabled>Aucun parent disponible</SelectItem>
              ) : (
                parents.map((parent) => (
                  <SelectItem key={parent.id} value={parent.id?.toString() || ''}>
                    {parent.prenom} {parent.nom} - {parent.telephone}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Informations de base */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              placeholder="Prénom de l'enfant"
              value={formData.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              placeholder="Nom de l'enfant"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de naissance *</Label>
            <Input
              id="dateNaissance"
              type="date"
              value={formData.dateNaissance || ''}
              onChange={(e) => handleChange('dateNaissance', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sexe">Sexe *</Label>
            <Select 
              value={formData.sexe || ''} 
              onValueChange={(v) => handleChange('sexe', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MASCULIN">Garçon</SelectItem>
                <SelectItem value="FEMININ">Fille</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lieuNaissance">Lieu de naissance</Label>
            <Input
              id="lieuNaissance"
              placeholder="Ex: Dakar"
              value={formData.lieuNaissance || ''}
              onChange={(e) => handleChange('lieuNaissance', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupeSanguin">Groupe sanguin</Label>
            <Select 
              value={formData.groupeSanguin || ''} 
              onValueChange={(v) => handleChange('groupeSanguin', v)}
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
        </div>

        {/* Mesures */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="poids">Poids (kg)</Label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="poids"
                type="number"
                step="0.1"
                placeholder="Ex: 8.5"
                className="pl-10"
                value={formData.poids || ''}
                onChange={(e) => handleChange('poids', parseFloat(e.target.value) || undefined)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taille">Taille (cm)</Label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="taille"
                type="number"
                step="0.1"
                placeholder="Ex: 70"
                className="pl-10"
                value={formData.taille || ''}
                onChange={(e) => handleChange('taille', parseFloat(e.target.value) || undefined)}
              />
            </div>
          </div>
        </div>

        {/* Informations médicales */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Informations médicales
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Input
              id="allergies"
              placeholder="Ex: Arachides, Lactose..."
              value={formData.allergies || ''}
              onChange={(e) => handleChange('allergies', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="antecedentsMedicaux">Antécédents médicaux</Label>
            <Input
              id="antecedentsMedicaux"
              placeholder="Ex: Asthme léger..."
              value={formData.antecedentsMedicaux || ''}
              onChange={(e) => handleChange('antecedentsMedicaux', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => {
              resetForm();
              closeModal('add-enfant');
            }}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer l'enfant
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}


// ================================
// MODAL MODIFICATION ENFANT
// ================================

interface EditEnfantModalProps {
  enfant: EnfantDTO | null;
  onSuccess: () => void;
}

function EditEnfantModal({ enfant, onSuccess }: EditEnfantModalProps) {
  const { isModalOpen, closeModal } = useModal();
  const updateEnfantMutation = useUpdateEnfant();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<UpdateEnfantDTO>({
    prenom: '',
    nom: '',
    groupeSanguin: undefined,
    poids: undefined,
    taille: undefined,
    sexe: undefined,
    allergies: '',
    antecedentsMedicaux: '',
    numeroCarnet: ''
  });

  // Charger les données de l'enfant
  useEffect(() => {
    if (enfant) {
      setFormData({
        prenom: enfant.prenom || '',
        nom: enfant.nom || '',
        groupeSanguin: enfant.groupeSanguin || undefined,
        poids: enfant.poids || undefined,
        taille: enfant.taille || undefined,
        sexe: enfant.sexe || undefined,
        allergies: enfant.allergies || '',
        antecedentsMedicaux: enfant.antecedentsMedicaux || '',
        numeroCarnet: enfant.numeroCarnet || ''
      });
    }
  }, [enfant]);

  const handleChange = (field: keyof UpdateEnfantDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!enfant?.id) return;

    if (!formData.prenom || !formData.nom) {
      toast.error("Erreur de validation", {
        description: "Le prénom et le nom sont obligatoires."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateEnfantMutation.mutateAsync({ ...formData, id: enfant.id });
      toast.success("Enfant modifié", {
        description: `${formData.prenom} ${formData.nom} a été modifié avec succès.`
      });
      onSuccess();
    } catch (err: any) {
      toast.error("Erreur", {
        description: err?.message || "Impossible de modifier l'enfant."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen('edit-enfant') || !enfant) return null;

  return (
    <BaseModal
      modalId="edit-enfant"
      title="Modifier l'enfant"
      description={`Modification de ${enfant.prenom} ${enfant.nom}`}
      size="xl"
      showFooter={false}
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Info enfant */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <Avatar className={`h-12 w-12 ${enfant.sexe === 'MASCULIN' ? 'bg-blue-100' : 'bg-pink-100'}`}>
            <AvatarFallback className={enfant.sexe === 'MASCULIN' ? 'text-blue-700' : 'text-pink-700'}>
              {enfant.prenom?.[0]}{enfant.nom?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{enfant.prenom} {enfant.nom}</p>
            <p className="text-sm text-muted-foreground">
              N° Carnet: {enfant.numeroCarnet || 'Non attribué'}
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edit-prenom">Prénom *</Label>
            <Input
              id="edit-prenom"
              value={formData.prenom || ''}
              onChange={(e) => handleChange('prenom', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-nom">Nom *</Label>
            <Input
              id="edit-nom"
              value={formData.nom || ''}
              onChange={(e) => handleChange('nom', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-sexe">Sexe</Label>
            <Select 
              value={formData.sexe || ''} 
              onValueChange={(v) => handleChange('sexe', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MASCULIN">Garçon</SelectItem>
                <SelectItem value="FEMININ">Fille</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-groupeSanguin">Groupe sanguin</Label>
            <Select 
              value={formData.groupeSanguin || ''} 
              onValueChange={(v) => handleChange('groupeSanguin', v)}
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

          <div className="space-y-2">
            <Label htmlFor="edit-poids">Poids (kg)</Label>
            <Input
              id="edit-poids"
              type="number"
              step="0.1"
              value={formData.poids || ''}
              onChange={(e) => handleChange('poids', parseFloat(e.target.value) || undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-taille">Taille (cm)</Label>
            <Input
              id="edit-taille"
              type="number"
              step="0.1"
              value={formData.taille || ''}
              onChange={(e) => handleChange('taille', parseFloat(e.target.value) || undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-numeroCarnet">N° Carnet</Label>
            <Input
              id="edit-numeroCarnet"
              value={formData.numeroCarnet || ''}
              onChange={(e) => handleChange('numeroCarnet', e.target.value)}
            />
          </div>
        </div>

        {/* Informations médicales */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Informations médicales
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor="edit-allergies">Allergies</Label>
            <Input
              id="edit-allergies"
              value={formData.allergies || ''}
              onChange={(e) => handleChange('allergies', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-antecedentsMedicaux">Antécédents médicaux</Label>
            <Input
              id="edit-antecedentsMedicaux"
              value={formData.antecedentsMedicaux || ''}
              onChange={(e) => handleChange('antecedentsMedicaux', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => closeModal('edit-enfant')}>
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


// ================================
// MODAL DÉTAILS ENFANT
// ================================

interface ViewEnfantModalProps {
  enfant: EnfantDTO | null;
}

function ViewEnfantModal({ enfant }: ViewEnfantModalProps) {
  const { isModalOpen } = useModal();

  // Calcul de l'âge
  const calculateAge = (dateNaissance: string | null | undefined): string => {
    if (!dateNaissance) return '-';
    const birth = new Date(dateNaissance);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (months < 12) return `${months} mois`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years} an(s) et ${remainingMonths} mois` : `${years} an(s)`;
  };

  if (!isModalOpen('view-enfant') || !enfant) return null;

  return (
    <BaseModal
      modalId="view-enfant"
      title="Détails de l'enfant"
      description="Informations complètes"
      size="xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* En-tête avec avatar */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
          <Avatar className={`h-16 w-16 ${enfant.sexe === 'MASCULIN' ? 'bg-blue-100' : 'bg-pink-100'}`}>
            <AvatarFallback className={`text-xl ${enfant.sexe === 'MASCULIN' ? 'text-blue-700' : 'text-pink-700'}`}>
              {enfant.prenom?.[0]}{enfant.nom?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{enfant.prenom} {enfant.nom}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={enfant.sexe === 'MASCULIN' ? 'default' : 'secondary'}
                     className={enfant.sexe === 'MASCULIN' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}>
                {enfant.sexe === 'MASCULIN' ? 'Garçon' : 'Fille'}
              </Badge>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{calculateAge(enfant.dateNaissance)}</span>
            </div>
          </div>
        </div>

        {/* QR Code et N° Carnet */}
        {enfant.numeroCarnet && (
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <QrCode className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Numéro de carnet</p>
              <code className="text-lg font-mono font-semibold">{enfant.numeroCarnet}</code>
            </div>
          </div>
        )}

        {/* Informations personnelles */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Baby className="h-4 w-4" />
            Informations personnelles
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex justify-between p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Date de naissance</span>
              <span className="font-medium">
                {enfant.dateNaissance ? new Date(enfant.dateNaissance).toLocaleDateString('fr-FR') : '-'}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Lieu de naissance</span>
              <span className="font-medium">{enfant.lieuNaissance || '-'}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Poids</span>
              <span className="font-medium">{enfant.poids ? `${enfant.poids} kg` : '-'}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Taille</span>
              <span className="font-medium">{enfant.taille ? `${enfant.taille} cm` : '-'}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Groupe sanguin</span>
              <span className="font-medium">
                {enfant.groupeSanguin ? (
                  <Badge variant="outline" className="gap-1">
                    <Droplets className="h-3 w-3 text-red-500" />
                    {enfant.groupeSanguin}
                  </Badge>
                ) : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Informations médicales */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Informations médicales
          </h4>
          <div className="space-y-2">
            <div className="p-3 bg-muted/30 rounded">
              <p className="text-sm text-muted-foreground mb-1">Allergies</p>
              <p className="font-medium">{enfant.allergies || 'Aucune allergie connue'}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded">
              <p className="text-sm text-muted-foreground mb-1">Antécédents médicaux</p>
              <p className="font-medium">{enfant.antecedentsMedicaux || 'Aucun antécédent'}</p>
            </div>
          </div>
        </div>

        {/* Informations du parent */}
        {enfant.parent && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Parent / Tuteur
            </h4>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {enfant.parent.prenom?.[0]}{enfant.parent.nom?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{enfant.parent.prenom} {enfant.parent.nom}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {enfant.parent.telephone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {enfant.parent.telephone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dates de création/modification */}
        <div className="text-xs text-muted-foreground border-t pt-3 flex justify-between">
          <span>Créé le: {enfant.createdAt ? new Date(enfant.createdAt).toLocaleDateString('fr-FR') : '-'}</span>
          <span>Modifié le: {enfant.updatedAt ? new Date(enfant.updatedAt).toLocaleDateString('fr-FR') : '-'}</span>
        </div>
      </div>
    </BaseModal>
  );
}


// ================================
// MODAL VACCINATION
// ================================

interface VaccinationModalProps {
  enfant: EnfantDTO | null;
  vaccins: VaccinDTO[];
  selectedVaccinId: string;
  setSelectedVaccinId: (value: string) => void;
  selectedAppointmentId: string;
  setSelectedAppointmentId: (value: string) => void;
  onConfirm: () => void;
  isPending: boolean;
  calculateAge: (dateNaissance: string | null | undefined) => string;
}

function VaccinationModal({
  enfant,
  vaccins,
  selectedVaccinId,
  setSelectedVaccinId,
  selectedAppointmentId,
  setSelectedAppointmentId,
  onConfirm,
  isPending,
  calculateAge
}: VaccinationModalProps) {
  const { closeModal } = useModal();
  
  // Charger les rendez-vous de l'enfant sélectionné
  const { data: appointments, isLoading: loadingAppointments } = useAppointmentsByEnfant(
    enfant?.id || 0
  );
  
  // Filtrer pour ne garder que les rendez-vous non effectués
  const pendingAppointments = appointments?.filter(
    (apt: AppointmentDTO) => apt.statut !== StatutRv.EFFECTUE && apt.statut !== StatutRv.ANNULE
  ) || [];

  return (
    <BaseModal
      modalId="vaccinate-enfant"
      title="Enregistrer une vaccination"
      description={`Vacciner ${enfant?.prenom} ${enfant?.nom}`}
      size="md"
      showFooter={false}
    >
      <div className="space-y-6">
        {/* Info enfant */}
        <div className="p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-4">
            <Avatar className={`h-14 w-14 border-2 ${enfant?.sexe === 'MASCULIN' ? 'border-blue-200' : 'border-pink-200'}`}>
              <AvatarFallback className={enfant?.sexe === 'MASCULIN' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}>
                {enfant?.prenom?.[0]}{enfant?.nom?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{enfant?.prenom} {enfant?.nom}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {calculateAge(enfant?.dateNaissance)}
                <span className="mx-1">•</span>
                <Badge variant="outline" className={enfant?.sexe === 'MASCULIN' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}>
                  {enfant?.sexe === 'MASCULIN' ? 'Garçon' : 'Fille'}
                </Badge>
              </p>
              {enfant?.numeroCarnet && (
                <p className="text-xs text-muted-foreground mt-1">
                  N° Carnet: {enfant.numeroCarnet}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sélection du rendez-vous */}
        <div className="space-y-2">
          <Label htmlFor="appointment-select" className="text-base font-medium">
            Sélectionner le rendez-vous <span className="text-red-500">*</span>
          </Label>
          {loadingAppointments ? (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Chargement des rendez-vous...</span>
            </div>
          ) : pendingAppointments.length === 0 ? (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                Aucun rendez-vous en attente pour cet enfant. Veuillez d'abord créer un rendez-vous.
              </AlertDescription>
            </Alert>
          ) : (
            <Select value={selectedAppointmentId} onValueChange={setSelectedAppointmentId}>
              <SelectTrigger id="appointment-select" className="w-full">
                <SelectValue placeholder="Choisir un rendez-vous..." />
              </SelectTrigger>
              <SelectContent>
                {pendingAppointments.map((apt: AppointmentDTO) => (
                  <SelectItem key={apt.id!} value={String(apt.id!)}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">
                        RDV du {apt.date ? new Date(apt.date).toLocaleDateString('fr-FR') : 'Date non définie'}
                      </span>
                      {apt.nomVaccinAEffectuer && (
                        <span className="text-xs text-muted-foreground">
                          - {apt.nomVaccinAEffectuer}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Sélection du vaccin */}
        <div className="space-y-2">
          <Label htmlFor="vaccin-select" className="text-base font-medium">
            Sélectionner le vaccin <span className="text-red-500">*</span>
          </Label>
          <Select value={selectedVaccinId} onValueChange={setSelectedVaccinId}>
            <SelectTrigger id="vaccin-select" className="w-full">
              <SelectValue placeholder="Choisir un vaccin..." />
            </SelectTrigger>
            <SelectContent>
              {vaccins?.filter((v: VaccinDTO) => v.id !== null).map((vaccin: VaccinDTO) => (
                <SelectItem key={vaccin.id!} value={String(vaccin.id!)}>
                  <span className="font-medium">{vaccin.nom}</span>
                  {vaccin.fabricant && (
                    <span className="text-muted-foreground text-xs ml-2">({vaccin.fabricant})</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(!vaccins || vaccins.length === 0) && (
            <p className="text-sm text-amber-600">
              Aucun vaccin disponible. Veuillez d'abord ajouter des vaccins dans la section Vaccins.
            </p>
          )}
        </div>

        {/* Allergies Warning si présent */}
        {enfant?.allergies && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              <strong>Attention - Allergies:</strong> {enfant.allergies}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => closeModal('vaccinate-enfant')}>
            Annuler
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={!selectedVaccinId || !selectedAppointmentId || isPending || pendingAppointments.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Syringe className="mr-2 h-4 w-4" />
            Confirmer la vaccination
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
