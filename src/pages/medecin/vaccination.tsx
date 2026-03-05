import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  Search, 
  Syringe,
  Plus,
  Eye,
  Trash2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Calendar,
  User,
  Baby,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  AlertTriangle,
  Stethoscope,
  Building2,
  Thermometer
} from 'lucide-react';
import PageContainer from "@/components/shared/page-container";
import { useModal, ModalProvider } from '@/components/shared/modal-provider';
import { useAllVaccinations, useDeleteVaccination } from '@/services/vaccination.service';
import type { VaccinationDTO } from '@/types';
import { 
  StatutVaccination, 
  type StatutVaccinationEnum 
} from '@/types';
import { toast } from 'sonner';

// Configuration des statuts avec icônes et couleurs
const statutConfig: Record<StatutVaccinationEnum, { label: string; color: string; bgColor: string; icon: typeof CheckCircle2 }> = {
  EFFECTUER: { 
    label: 'Effectué', 
    color: 'text-green-700 dark:text-green-300', 
    bgColor: 'bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800',
    icon: CheckCircle2 
  },
  EN_ATTENTE: { 
    label: 'En attente', 
    color: 'text-orange-700 dark:text-orange-300', 
    bgColor: 'bg-orange-100 dark:bg-orange-900/50 border-orange-200 dark:border-orange-800',
    icon: Clock 
  },
  NON_EFFECTUER: { 
    label: 'Non effectué', 
    color: 'text-red-700 dark:text-red-300', 
    bgColor: 'bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800',
    icon: XCircle 
  }
};

// Helper pour obtenir les initiales d'un nom
const getInitials = (prenom?: string, nom?: string): string => {
  const p = prenom?.charAt(0)?.toUpperCase() || '';
  const n = nom?.charAt(0)?.toUpperCase() || '';
  return p + n || '??';
};

// Helper pour formater une date
const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Helper pour formater une date courte
const formatDateShort = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

function VaccinationContent() {
  const { openModal } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('tous');
  const [vaccinFilter, setVaccinFilter] = useState<string>('tous');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 cards par page pour un meilleur affichage

  // Récupération des vraies données du backend
  const { data: vaccinations, isLoading, isError, error, refetch } = useAllVaccinations();
  const deleteVaccination = useDeleteVaccination();

  // DEBUG: Afficher les données reçues
  console.log('[Vaccination Page] isLoading:', isLoading);
  console.log('[Vaccination Page] isError:', isError);
  console.log('[Vaccination Page] vaccinations:', vaccinations);
  console.log('[Vaccination Page] vaccinations length:', vaccinations?.length);

  // Remettre à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statutFilter, vaccinFilter]);

  // Liste des vaccinations (tableau vide si pas de données)
  const vaccinationsList = vaccinations || [];

  // Filtrage des vaccinations avec les vraies données du backend
  const filteredVaccinations = useMemo(() => {
    return vaccinationsList.filter(vaccination => {
      // Recherche sur plusieurs champs
      const enfantNom = vaccination.appointment?.enfant?.nom?.toLowerCase() || vaccination.enfant?.nom?.toLowerCase() || '';
      const enfantPrenom = vaccination.appointment?.enfant?.prenom?.toLowerCase() || vaccination.enfant?.prenom?.toLowerCase() || '';
      const vaccinNom = vaccination.vaccine?.nom?.toLowerCase() || '';
      const infirmierNom = vaccination.utilisateur?.nom?.toLowerCase() || '';
      const infirmierPrenom = vaccination.utilisateur?.prenom?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      
      const matchSearch = 
        enfantNom.includes(search) ||
        enfantPrenom.includes(search) ||
        vaccinNom.includes(search) ||
        infirmierNom.includes(search) ||
        infirmierPrenom.includes(search);
      
      const matchStatut = statutFilter === 'tous' || vaccination.statutVaccination === statutFilter;
      const matchVaccin = vaccinFilter === 'tous' || vaccinNom.includes(vaccinFilter.toLowerCase());
      
      return matchSearch && matchStatut && matchVaccin;
    });
  }, [vaccinationsList, searchTerm, statutFilter, vaccinFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredVaccinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVaccinations = filteredVaccinations.slice(startIndex, startIndex + itemsPerPage);

  // Statistiques rapides basées sur les vraies données
  const stats = useMemo(() => ({
    total: vaccinationsList.length,
    effectuer: vaccinationsList.filter(v => v.statutVaccination === StatutVaccination.EFFECTUER).length,
    en_attente: vaccinationsList.filter(v => v.statutVaccination === StatutVaccination.EN_ATTENTE).length,
    non_effectuer: vaccinationsList.filter(v => v.statutVaccination === StatutVaccination.NON_EFFECTUER).length
  }), [vaccinationsList]);

  // Liste des vaccins uniques pour le filtre
  const uniqueVaccins = useMemo(() => {
    const vaccins = new Set<string>();
    vaccinationsList.forEach(v => {
      if (v.vaccine?.nom) vaccins.add(v.vaccine.nom);
    });
    return Array.from(vaccins);
  }, [vaccinationsList]);

  const handleCreateVaccination = () => {
    openModal('create-vaccination', {});
    toast.info("Ouverture du formulaire de création de vaccination");
  };

  const handleViewDetails = (vaccination: VaccinationDTO) => {
    openModal('detail-vaccination', vaccination);
  };

  const handleDeleteVaccination = async (vaccination: VaccinationDTO) => {
    if (!vaccination.id) return;
    
    try {
      await deleteVaccination.mutateAsync(vaccination.id);
      toast.success("Vaccination supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // État de chargement
  if (isLoading) {
    return (
      <PageContainer 
        title="Gestion des Vaccinations" 
        subtitle="Suivi et administration des vaccins"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  // État d'erreur
  if (isError) {
    return (
      <PageContainer 
        title="Gestion des Vaccinations" 
        subtitle="Suivi et administration des vaccins"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des vaccinations: {(error as Error)?.message || 'Erreur inconnue'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      title="Gestion des Vaccinations" 
      subtitle="Suivi et administration des vaccins"
    >
      <div className="space-y-6">
        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                  <Syringe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Effectués</p>
                  <p className="text-2xl font-bold text-green-600">{stats.effectuer}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.en_attente}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Non effectués</p>
                  <p className="text-2xl font-bold text-red-600">{stats.non_effectuer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et actions */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Syringe className="h-5 w-5" />
                  <span>Liste des Vaccinations</span>
                </CardTitle>
                <CardDescription>
                  Gérez et suivez toutes les vaccinations des patients
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => refetch()} title="Rafraîchir">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button onClick={handleCreateVaccination} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nouvelle Vaccination</span>
                </Button>
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-col lg:flex-row gap-4 pt-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par patient, vaccin ou infirmier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value={StatutVaccination.EFFECTUER}>Effectué</SelectItem>
                  <SelectItem value={StatutVaccination.EN_ATTENTE}>En attente</SelectItem>
                  <SelectItem value={StatutVaccination.NON_EFFECTUER}>Non effectué</SelectItem>
                </SelectContent>
              </Select>

              <Select value={vaccinFilter} onValueChange={setVaccinFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Type de vaccin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les vaccins</SelectItem>
                  {uniqueVaccins.map((vaccin) => (
                    <SelectItem key={vaccin} value={vaccin}>{vaccin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Liste des vaccinations en cards */}
        {paginatedVaccinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedVaccinations.map((vaccination) => {
              const statut = vaccination.statutVaccination || StatutVaccination.EN_ATTENTE;
              const statutInfo = statutConfig[statut] || statutConfig[StatutVaccination.EN_ATTENTE];
              const StatusIcon = statutInfo.icon;
              
              // Récupérer les infos de l'enfant (depuis appointment ou enfant direct)
              const enfant = vaccination.appointment?.enfant || vaccination.enfant;
              const parent = vaccination.appointment?.enfant?.parent || vaccination.appointment?.utilisateur;
              
              return (
                <Card 
                  key={vaccination.id} 
                  className={`hover:shadow-lg transition-all duration-300 border-l-4 ${
                    statut === 'EFFECTUER' ? 'border-l-green-500' : 
                    statut === 'EN_ATTENTE' ? 'border-l-orange-500' : 'border-l-red-500'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(enfant?.prenom, enfant?.nom)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {enfant?.prenom || '-'} {enfant?.nom || '-'}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <Baby className="h-3 w-3" />
                            {enfant?.dateNaissance ? formatDateShort(enfant.dateNaissance) : 'Date non renseignée'}
                            {enfant?.sexe && (
                              <Badge variant="outline" className="ml-1 text-xs px-1 py-0">
                                {enfant.sexe === 'MASCULIN' ? '♂' : '♀'}
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={`${statutInfo.bgColor} ${statutInfo.color} border`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statutInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Informations Vaccin */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                        <Syringe className="h-4 w-4" />
                        <span className="text-sm">Vaccin administré</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        <p className="font-semibold text-sm">{vaccination.vaccine?.nom || 'Non spécifié'}</p>
                        {vaccination.vaccine?.fabricant && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {vaccination.vaccine.fabricant}
                          </p>
                        )}
                        {vaccination.vaccine?.numeroLot && (
                          <p className="text-xs text-muted-foreground">
                            Lot: {vaccination.vaccine.numeroLot}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {vaccination.vaccine?.typeVaccin && (
                            <Badge variant="secondary" className="text-xs">
                              {vaccination.vaccine.typeVaccin}
                            </Badge>
                          )}
                          {vaccination.vaccine?.modeAdministration && (
                            <Badge variant="outline" className="text-xs">
                              {vaccination.vaccine.modeAdministration}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Date de vaccination */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{formatDate(vaccination.date)}</span>
                    </div>

                    {/* Infirmier/Agent de santé */}
                    {vaccination.utilisateur && (
                      <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-medium">
                          <Stethoscope className="h-4 w-4" />
                          <span className="text-sm">Agent de santé</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          <p className="font-semibold text-sm">
                            {vaccination.utilisateur.prenom} {vaccination.utilisateur.nom}
                          </p>
                          {vaccination.utilisateur.email && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {vaccination.utilisateur.email}
                            </p>
                          )}
                          {vaccination.utilisateur.telephone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {vaccination.utilisateur.telephone}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Informations Parent */}
                    {parent && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                          <User className="h-4 w-4" />
                          <span className="text-sm">Parent/Tuteur</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          <p className="font-semibold text-sm">
                            {parent.prenom} {parent.nom}
                          </p>
                          {parent.telephone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {parent.telephone}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Infos supplémentaires de l'enfant */}
                    {(enfant?.allergies || enfant?.groupeSanguin || enfant?.poids) && (
                      <div className="flex flex-wrap gap-2">
                        {enfant?.groupeSanguin && (
                          <Badge variant="outline" className="text-xs">
                            🩸 {enfant.groupeSanguin}
                          </Badge>
                        )}
                        {enfant?.poids && (
                          <Badge variant="outline" className="text-xs">
                            ⚖️ {enfant.poids} kg
                          </Badge>
                        )}
                        {enfant?.allergies && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {enfant.allergies}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Conservation vaccin */}
                    {vaccination.vaccine?.temperatureConservation && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Thermometer className="h-3 w-3" />
                        Conservation: {vaccination.vaccine.temperatureConservation}
                      </div>
                    )}
                  </CardContent>

                  <Separator />

                  <CardFooter className="pt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(vaccination)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteVaccination(vaccination)}
                      disabled={deleteVaccination.isPending}
                    >
                      {deleteVaccination.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Aucune vaccination trouvée</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statutFilter !== 'tous' || vaccinFilter !== 'tous' 
                    ? "Aucune vaccination ne correspond à vos critères de recherche."
                    : "Aucune vaccination enregistrée pour le moment."
                  }
                </p>
                <Button onClick={handleCreateVaccination} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une vaccination
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Info pagination */}
        {filteredVaccinations.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredVaccinations.length)} sur {filteredVaccinations.length} vaccinations
          </div>
        )}
      </div>
    </PageContainer>
  );
}

// Export par défaut du composant principal
export default function Vaccination() {
  return (
    <ModalProvider>
      <VaccinationContent />
    </ModalProvider>
  );
}
