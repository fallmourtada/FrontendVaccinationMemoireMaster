import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  CalendarDays, 
  Plus, 
  Syringe,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Edit,
  Trash2,
  Eye,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  Baby,
  AlertTriangle,
  LayoutGrid,
  List
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageContainer from "@/components/shared/page-container";
import { toast } from 'sonner';
import { 
  useAllAppointments, 
  useCreateAppointment, 
  useUpdateAppointment, 
  useDeleteAppointment,
  useUpdateAppointmentStatus
} from '@/services/appointment.service';
import { useAllEnfants } from '@/services/user.service';
import { useAllVaccins } from '@/services/vaccin.service';
import type { AppointmentDTO, SaveAppointmentDTO, UpdateAppointmentDTO, StatutRvEnum } from '@/types';
import { StatutRv, StatutRvLabels, StatutRvColors } from '@/types';

// ================================
// COMPOSANTS UTILITAIRES
// ================================

function StatutBadge({ statut }: { statut: StatutRvEnum }) {
  const colors = StatutRvColors[statut] || StatutRvColors.EN_ATTENTE;
  const label = StatutRvLabels[statut] || statut;
  
  const Icon = {
    EN_ATTENTE: Clock,
    CONFIRME: CheckCircle2,
    REPORTE: Calendar,
    ANNULE: XCircle,
    EFFECTUE: CheckCircle2
  }[statut] || Clock;

  return (
    <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
}

// ================================
// CARD RENDEZ-VOUS
// ================================

interface RendezVousCardProps {
  rdv: AppointmentDTO;
  onView: (rdv: AppointmentDTO) => void;
  onEdit: (rdv: AppointmentDTO) => void;
  onDelete: (rdv: AppointmentDTO) => void;
  onChangeStatus: (rdv: AppointmentDTO) => void;
}

function RendezVousCard({ rdv, onView, onEdit, onDelete, onChangeStatus }: RendezVousCardProps) {
  const enfant = rdv.enfant;
  const parent = rdv.utilisateur;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className={`h-2 ${
        rdv.statut === 'CONFIRME' ? 'bg-emerald-500' :
        rdv.statut === 'EN_ATTENTE' ? 'bg-orange-500' :
        rdv.statut === 'EFFECTUE' ? 'bg-green-600' :
        rdv.statut === 'REPORTE' ? 'bg-blue-500' :
        'bg-red-500'
      }`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                {enfant ? `${enfant.prenom?.charAt(0) || ''}${enfant.nom?.charAt(0) || ''}` : 'RV'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {enfant ? `${enfant.prenom} ${enfant.nom}` : 'Enfant inconnu'}
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Baby className="w-3 h-3" />
                {enfant?.dateNaissance ? `Né(e) le ${format(parseISO(enfant.dateNaissance), 'dd/MM/yyyy', { locale: fr })}` : 'Date inconnue'}
              </CardDescription>
            </div>
          </div>
          <StatutBadge statut={rdv.statut} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date et vaccin */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">
                {rdv.date ? format(parseISO(rdv.date), 'dd MMM yyyy', { locale: fr }) : 'Non définie'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Syringe className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Vaccin</p>
              <p className="font-medium text-sm">{rdv.nomVaccinAEffectuer || 'Non spécifié'}</p>
            </div>
          </div>
        </div>

        {/* Parent info */}
        {parent && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <User className="w-5 h-5 text-blue-600" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-600">Parent</p>
              <p className="font-medium text-sm truncate">{parent.prenom} {parent.nom}</p>
              {parent.telephone && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {parent.telephone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onView(rdv)}>
            <Eye className="w-4 h-4 mr-1" /> Voir
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(rdv)}>
            <Edit className="w-4 h-4 mr-1" /> Modifier
          </Button>
          <Button size="sm" variant="outline" onClick={() => onChangeStatus(rdv)}>
            <Clock className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(rdv)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ================================
// SKELETON CARD
// ================================

function RendezVousCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-muted" />
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
        <Skeleton className="h-16 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </CardContent>
    </Card>
  );
}

// ================================
// FORMULAIRE RENDEZ-VOUS
// ================================

interface RendezVousFormProps {
  initialData?: AppointmentDTO;
  onSubmit: (data: SaveAppointmentDTO, userId: number, enfantId: number) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

function RendezVousForm({ initialData, onSubmit, onCancel, isLoading, isEdit }: RendezVousFormProps) {
  const { data: enfants = [], isLoading: loadingEnfants } = useAllEnfants();
  const { data: vaccins = [], isLoading: loadingVaccins } = useAllVaccins();

  const [formData, setFormData] = useState<SaveAppointmentDTO>({
    nomVaccinAEffectuer: initialData?.nomVaccinAEffectuer || '',
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
  });
  const [selectedEnfantId, setSelectedEnfantId] = useState<number>(initialData?.enfant?.id || 0);
  const [selectedUserId, setSelectedUserId] = useState<number>(initialData?.utilisateur?.id || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEnfantId) {
      toast.error('Veuillez sélectionner un enfant');
      return;
    }
    
    // Trouver le parent de l'enfant sélectionné
    const enfant = enfants.find(e => e.id === selectedEnfantId);
    const parentId = enfant?.parent?.id || selectedUserId;
    
    if (!parentId) {
      toast.error('Impossible de trouver le parent de l\'enfant');
      return;
    }

    await onSubmit(formData, parentId, selectedEnfantId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sélection de l'enfant */}
      <div className="space-y-2">
        <Label htmlFor="enfant">Enfant *</Label>
        {loadingEnfants ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select 
            value={selectedEnfantId ? String(selectedEnfantId) : ''} 
            onValueChange={(v) => setSelectedEnfantId(Number(v))}
            disabled={isEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un enfant" />
            </SelectTrigger>
            <SelectContent>
              {enfants.map((enfant) => (
                <SelectItem key={enfant.id} value={String(enfant.id)}>
                  {enfant.prenom} {enfant.nom} 
                  {enfant.parent && ` (Parent: ${enfant.parent.prenom} ${enfant.parent.nom})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Sélection du vaccin */}
      <div className="space-y-2">
        <Label htmlFor="vaccin">Vaccin à effectuer *</Label>
        {loadingVaccins ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select 
            value={formData.nomVaccinAEffectuer} 
            onValueChange={(v) => setFormData(prev => ({ ...prev, nomVaccinAEffectuer: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un vaccin" />
            </SelectTrigger>
            <SelectContent>
              {vaccins.map((vaccin) => (
                <SelectItem key={vaccin.id} value={vaccin.nom}>
                  {vaccin.nom}
                </SelectItem>
              ))}
              {/* Options manuelles pour vaccins non listés */}
              <SelectItem value="BCG">BCG</SelectItem>
              <SelectItem value="Pentavalent (Penta 1)">Pentavalent (Penta 1)</SelectItem>
              <SelectItem value="Pentavalent (Penta 2)">Pentavalent (Penta 2)</SelectItem>
              <SelectItem value="Pentavalent (Penta 3)">Pentavalent (Penta 3)</SelectItem>
              <SelectItem value="ROR">ROR</SelectItem>
              <SelectItem value="Hépatite B">Hépatite B</SelectItem>
              <SelectItem value="Polio Oral">Polio Oral</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date du rendez-vous *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          min={format(new Date(), 'yyyy-MM-dd')}
          required
        />
      </div>

      {/* Actions */}
      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEdit ? 'Mettre à jour' : 'Créer le rendez-vous'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ================================
// MODAL DÉTAILS
// ================================

interface DetailsModalProps {
  rdv: AppointmentDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

function DetailsModal({ rdv, isOpen, onClose }: DetailsModalProps) {
  if (!rdv) return null;

  const enfant = rdv.enfant;
  const parent = rdv.utilisateur;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Détails du rendez-vous
          </DialogTitle>
          <DialogDescription>
            Rendez-vous #{rdv.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Statut */}
          <div className="flex justify-center">
            <StatutBadge statut={rdv.statut} />
          </div>

          {/* Infos enfant */}
          {enfant && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Baby className="w-4 h-4" /> Enfant
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Nom:</span>
                  <p className="font-medium">{enfant.prenom} {enfant.nom}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date de naissance:</span>
                  <p className="font-medium">
                    {enfant.dateNaissance && format(parseISO(enfant.dateNaissance), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sexe:</span>
                  <p className="font-medium">{enfant.sexe}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Lieu de naissance:</span>
                  <p className="font-medium">{enfant.lieuNaissance || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Infos parent */}
          {parent && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4" /> Parent
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Nom:</span>
                  <p className="font-medium">{parent.prenom} {parent.nom}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Téléphone:</span>
                  <p className="font-medium">{parent.telephone || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{parent.email || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Infos RDV */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Syringe className="w-4 h-4" /> Vaccination
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Vaccin:</span>
                <p className="font-medium">{rdv.nomVaccinAEffectuer}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="font-medium">
                  {rdv.date && format(parseISO(rdv.date), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ================================
// MODAL CHANGEMENT STATUT
// ================================

interface ChangeStatusModalProps {
  rdv: AppointmentDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointmentId: number, newStatut: StatutRvEnum) => Promise<void>;
  isLoading?: boolean;
}

function ChangeStatusModal({ rdv, isOpen, onClose, onConfirm, isLoading }: ChangeStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatutRvEnum | ''>('');

  useEffect(() => {
    if (rdv) {
      setSelectedStatus(rdv.statut);
    }
  }, [rdv]);

  if (!rdv) return null;

  const handleConfirm = async () => {
    if (selectedStatus && rdv.id) {
      await onConfirm(rdv.id, selectedStatus);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer le statut</DialogTitle>
          <DialogDescription>
            Modifier le statut du rendez-vous pour {rdv.enfant?.prenom} {rdv.enfant?.nom}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-center mb-4">
            <StatutBadge statut={rdv.statut} />
          </div>
          
          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as StatutRvEnum)}>
            <SelectTrigger>
              <SelectValue placeholder="Nouveau statut" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(StatutRvLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || !selectedStatus}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ================================
// PAGE PRINCIPALE
// ================================

export default function RendezVous() {
  // États
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('tous');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 6 : 10;

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState<AppointmentDTO | null>(null);

  // API Hooks
  const { data: appointments = [], isLoading, isError, refetch } = useAllAppointments();
  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();
  const deleteMutation = useDeleteAppointment();
  const updateStatusMutation = useUpdateAppointmentStatus();

  // Filtrage
  const filteredAppointments = appointments.filter(rdv => {
    const matchSearch = searchTerm === '' || 
      rdv.nomVaccinAEffectuer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rdv.enfant?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rdv.enfant?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = statutFilter === 'tous' || rdv.statut === statutFilter;
    return matchSearch && matchStatut;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statutFilter, viewMode]);

  // Stats
  const stats = {
    total: appointments.length,
    enAttente: appointments.filter(r => r.statut === 'EN_ATTENTE').length,
    confirme: appointments.filter(r => r.statut === 'CONFIRME').length,
    effectue: appointments.filter(r => r.statut === 'EFFECTUE').length,
  };

  // Handlers
  const handleCreate = async (data: SaveAppointmentDTO, userId: number, enfantId: number) => {
    try {
      await createMutation.mutateAsync({ data, userId, enfantId });
      toast.success('Rendez-vous créé avec succès');
      setCreateModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    }
  };

  const handleUpdate = async (data: SaveAppointmentDTO) => {
    if (!selectedRdv?.id) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedRdv.id,
        nomVaccinAEffectuer: data.nomVaccinAEffectuer,
      });
      toast.success('Rendez-vous mis à jour');
      setEditModalOpen(false);
      setSelectedRdv(null);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (!selectedRdv?.id) return;
    try {
      await deleteMutation.mutateAsync(selectedRdv.id);
      toast.success('Rendez-vous supprimé');
      setDeleteModalOpen(false);
      setSelectedRdv(null);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  const handleChangeStatus = async (appointmentId: number, newStatut: StatutRvEnum) => {
    try {
      await updateStatusMutation.mutateAsync({ 
        appointmentId, 
        data: { statut: newStatut } 
      });
      toast.success('Statut mis à jour');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du changement de statut');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PageContainer title="Rendez-vous" subtitle="Gestion des rendez-vous de vaccination">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <RendezVousCardSkeleton key={i} />
          ))}
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (isError) {
    return (
      <PageContainer title="Rendez-vous" subtitle="Gestion des rendez-vous de vaccination">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des rendez-vous.
            <Button variant="link" onClick={() => refetch()}>Réessayer</Button>
          </AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Rendez-vous" subtitle="Gestion des rendez-vous de vaccination">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">En attente</p>
                <p className="text-2xl font-bold text-orange-700">{stats.enAttente}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Confirmés</p>
                <p className="text-2xl font-bold text-emerald-700">{stats.confirme}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Effectués</p>
                <p className="text-2xl font-bold text-green-700">{stats.effectue}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 w-full lg:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  {Object.entries(StatutRvLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau RDV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun rendez-vous</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statutFilter !== 'tous' 
                ? 'Aucun rendez-vous ne correspond à vos critères.'
                : 'Commencez par créer un nouveau rendez-vous.'}
            </p>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un rendez-vous
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedAppointments.map((rdv) => (
            <RendezVousCard
              key={rdv.id}
              rdv={rdv}
              onView={(r) => { setSelectedRdv(r); setDetailsModalOpen(true); }}
              onEdit={(r) => { setSelectedRdv(r); setEditModalOpen(true); }}
              onDelete={(r) => { setSelectedRdv(r); setDeleteModalOpen(true); }}
              onChangeStatus={(r) => { setSelectedRdv(r); setStatusModalOpen(true); }}
            />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enfant</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Vaccin</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAppointments.map((rdv) => (
                <TableRow key={rdv.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {rdv.enfant?.prenom?.charAt(0)}{rdv.enfant?.nom?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{rdv.enfant?.prenom} {rdv.enfant?.nom}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {rdv.utilisateur?.prenom} {rdv.utilisateur?.nom}
                  </TableCell>
                  <TableCell>{rdv.nomVaccinAEffectuer}</TableCell>
                  <TableCell>
                    {rdv.date && format(parseISO(rdv.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell><StatutBadge statut={rdv.statut} /></TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedRdv(rdv); setDetailsModalOpen(true); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedRdv(rdv); setEditModalOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedRdv(rdv); setStatusModalOpen(true); }}>
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => { setSelectedRdv(rdv); setDeleteModalOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === i + 1}
                    onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modals */}
      {/* Create Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nouveau rendez-vous
            </DialogTitle>
            <DialogDescription>
              Créer un nouveau rendez-vous de vaccination
            </DialogDescription>
          </DialogHeader>
          <RendezVousForm
            onSubmit={handleCreate}
            onCancel={() => setCreateModalOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Modifier le rendez-vous
            </DialogTitle>
            <DialogDescription>
              Modifier les informations du rendez-vous
            </DialogDescription>
          </DialogHeader>
          {selectedRdv && (
            <RendezVousForm
              initialData={selectedRdv}
              onSubmit={(data) => handleUpdate(data)}
              onCancel={() => { setEditModalOpen(false); setSelectedRdv(null); }}
              isLoading={updateMutation.isPending}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <DetailsModal
        rdv={selectedRdv}
        isOpen={detailsModalOpen}
        onClose={() => { setDetailsModalOpen(false); setSelectedRdv(null); }}
      />

      {/* Change Status Modal */}
      <ChangeStatusModal
        rdv={selectedRdv}
        isOpen={statusModalOpen}
        onClose={() => { setStatusModalOpen(false); setSelectedRdv(null); }}
        onConfirm={handleChangeStatus}
        isLoading={updateStatusMutation.isPending}
      />

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedRdv && (
            <div className="py-4">
              <p className="text-center">
                <strong>{selectedRdv.enfant?.prenom} {selectedRdv.enfant?.nom}</strong>
                <br />
                <span className="text-muted-foreground">{selectedRdv.nomVaccinAEffectuer}</span>
                <br />
                <span className="text-muted-foreground">
                  {selectedRdv.date && format(parseISO(selectedRdv.date), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteModalOpen(false); setSelectedRdv(null); }}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
