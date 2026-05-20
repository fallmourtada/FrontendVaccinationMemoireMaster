import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Plus, 
  AlertCircle,
  Loader2,
  Calendar,
  Search,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageContainer from "@/components/shared/page-container";
import { toast } from 'sonner';
import { RendezVousCarnetModal } from '@/components/modals/rendez-vous-carnet-modal';
import { 
  useAllAppointments, 
  useCreateAppointment,
} from '@/services/appointment.service';
import { useAllVaccinations } from '@/services/vaccination.service';
import { useAllEnfants } from '@/services/user.service';
import { useAllVaccins } from '@/services/vaccin.service';
import type { AppointmentDTO, SaveAppointmentDTO, EnfantDTO } from '@/types';
import { StatutRvLabels, StatutRvColors, type StatutRvEnum } from '@/types/appointment';
import { useDecodedToken } from '@/contexts/decoded-token-context';
import { useUserByEmail } from '@/services/user.service';

function StatutBadge({ statut }: { statut: StatutRvEnum }) {
  const colors = StatutRvColors[statut] || StatutRvColors.EN_ATTENTE;
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
      {StatutRvLabels[statut]}
    </span>
  );
}

interface RendezVousFormProps {
  selectedEnfantId: number;
  onEnfantChange: (id: number) => void;
  onSubmit: (data: SaveAppointmentDTO, userId: number, enfantId: number) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function RendezVousForm({ 
  selectedEnfantId,
  onEnfantChange,
  onSubmit, 
  onCancel, 
  isLoading, 
}: RendezVousFormProps) {
  const { data: enfants = [], isLoading: loadingEnfants } = useAllEnfants();
  const { data: vaccins = [], isLoading: loadingVaccins } = useAllVaccins();

  const [formData, setFormData] = useState<SaveAppointmentDTO>({
    nomVaccinAEffectuer: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEnfantId) {
      toast.error('Veuillez sélectionner un enfant');
      return;
    }
    
    const enfant = enfants.find(e => e.id === selectedEnfantId);
    const parentId = enfant?.parent?.id;
    
    if (!parentId) {
      toast.error('Impossible de trouver le parent de l\'enfant');
      return;
    }

    await onSubmit(formData, parentId, selectedEnfantId);
    setFormData({
      nomVaccinAEffectuer: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-blue-700 dark:text-blue-300 font-semibold">Enfant *</Label>
        {loadingEnfants ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select 
            value={selectedEnfantId ? String(selectedEnfantId) : ''} 
            onValueChange={(v) => onEnfantChange(Number(v))}
          >
            <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-300 dark:border-blue-800 dark:bg-slate-800 dark:text-white">
              <SelectValue placeholder="Sélectionner un enfant" />
            </SelectTrigger>
            <SelectContent>
              {enfants.map((enfant) => (
                <SelectItem key={enfant.id} value={String(enfant.id)}>
                  {enfant.prenom} {enfant.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-blue-700 dark:text-blue-300 font-semibold">Vaccin à effectuer *</Label>
        {loadingVaccins ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select 
            value={formData.nomVaccinAEffectuer} 
            onValueChange={(v) => setFormData(prev => ({ ...prev, nomVaccinAEffectuer: v }))}
          >
            <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-300 dark:border-blue-800 dark:bg-slate-800 dark:text-white">
              <SelectValue placeholder="Sélectionner un vaccin" />
            </SelectTrigger>
            <SelectContent>
              {vaccins.map((vaccin) => (
                <SelectItem key={vaccin.id} value={vaccin.nom}>
                  {vaccin.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-blue-700 dark:text-blue-300 font-semibold">Date du rendez-vous *</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-300 dark:border-blue-800 dark:bg-slate-800 dark:text-white"
          min={format(new Date(), 'yyyy-MM-dd')}
          required
        />
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20">
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading || !formData.nomVaccinAEffectuer} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Créer le rendez-vous
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function RendezVous() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('tous');
  const [selectedEnfantId, setSelectedEnfantId] = useState<number>(0);
  const [selectedChildForCarnet, setSelectedChildForCarnet] = useState<EnfantDTO | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [carnetModalOpen, setCarnetModalOpen] = useState(false);
  const { decodedToken } = useDecodedToken();
  const { data: currentUser } = useUserByEmail(decodedToken?.sub || '');
  const normalizedRole = (decodedToken?.role || '').replace(/^ROLE_/, '').toUpperCase();
  const isInfirmier = normalizedRole === 'INFIRMIER';
  const currentUserEmail = (decodedToken?.sub || currentUser?.email || '').toLowerCase();

  // API Hooks
  const { data: appointments = [], isLoading, isError, refetch } = useAllAppointments();
  const { data: enfants = [] } = useAllEnfants();
  const { data: vaccinations = [] } = useAllVaccinations();
  const createMutation = useCreateAppointment();
  const ownedIds = useMemo(() => {
    try {
      const raw = decodedToken?.sub
        ? localStorage.getItem(`infirmier-owned-records:${decodedToken.sub.toLowerCase()}`)
        : null;
      if (!raw) return { appointmentIds: [] as number[] };
      const parsed = JSON.parse(raw) as { appointmentIds?: number[] };
      return { appointmentIds: Array.isArray(parsed.appointmentIds) ? parsed.appointmentIds : [] };
    } catch {
      return { appointmentIds: [] as number[] };
    }
  }, [decodedToken?.sub, appointments]);
  const scopedAppointments = useMemo(() => {
    if (!isInfirmier) return appointments;
    const vaccinationAppointmentIds = vaccinations
      .filter((vacc) => {
        const ownerId = vacc.utilisateur?.id != null ? Number(vacc.utilisateur.id) : null;
        const ownerEmail = (vacc.utilisateur?.email || '').toLowerCase();
        return (
          (ownerId != null && ownerId === (currentUser?.id ?? -1)) ||
          (!!ownerEmail && ownerEmail === currentUserEmail)
        );
      })
      .map((vacc) => vacc.appointment?.id)
      .filter((id): id is number => typeof id === 'number');

    return appointments.filter((rdv) => {
      const rdvId = rdv.id != null ? Number(rdv.id) : null;
      const ownerId = rdv.utilisateur?.id != null ? Number(rdv.utilisateur.id) : null;
      const ownerEmail = (rdv.utilisateur?.email || '').toLowerCase();
      return (
        (ownerId != null && ownerId === (currentUser?.id ?? -1)) ||
        (!!ownerEmail && ownerEmail === currentUserEmail) ||
        (rdvId != null && vaccinationAppointmentIds.includes(rdvId)) ||
        (rdvId != null && ownedIds.appointmentIds.includes(rdvId))
      );
    });
  }, [appointments, vaccinations, isInfirmier, currentUser?.id, currentUserEmail, ownedIds.appointmentIds]);

  // Group appointments by child
  const appointmentsByChild = enfants.reduce((acc, child) => {
    const childAppointments = scopedAppointments.filter(rdv => rdv.enfant?.id === child.id);
    if (childAppointments.length > 0) {
      acc.push({ child, appointments: childAppointments });
    }
    return acc;
  }, [] as Array<{ child: EnfantDTO; appointments: AppointmentDTO[] }>);

  // Filter
  const filteredChildren = appointmentsByChild.filter(({ child, appointments }) => {
    const matchSearch = searchTerm === '' || 
      child.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = statutFilter === 'tous' || 
      appointments.some(rdv => rdv.statut === statutFilter as StatutRvEnum);
    return matchSearch && matchStatut;
  });

  // Stats
  const stats = {
    total: scopedAppointments.length,
    enAttente: scopedAppointments.filter(r => r.statut === 'EN_ATTENTE').length,
    confirme: scopedAppointments.filter(r => r.statut === 'CONFIRME').length,
    effectue: scopedAppointments.filter(r => r.statut === 'EFFECTUE').length,
  };

  // Handlers
  const handleCreate = async (data: SaveAppointmentDTO, userId: number, enfantId: number) => {
    try {
      const createdAppointment = await createMutation.mutateAsync({ data, userId, enfantId });
      try {
        const raw = decodedToken?.sub
          ? localStorage.getItem(`infirmier-owned-records:${decodedToken.sub.toLowerCase()}`)
          : null;
        const parsed = raw ? JSON.parse(raw) : {};
        const existing = Array.isArray(parsed.appointmentIds) ? parsed.appointmentIds : [];
        if (createdAppointment?.id && !existing.includes(createdAppointment.id)) {
          localStorage.setItem(
            `infirmier-owned-records:${(decodedToken?.sub || '').toLowerCase()}`,
            JSON.stringify({ ...parsed, appointmentIds: [...existing, createdAppointment.id] })
          );
        }
      } catch {
        // ignore storage errors
      }
      toast.success('Rendez-vous créé avec succès');
      setCreateModalOpen(false);
      setSelectedEnfantId(0);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    }
  };

  const handleCreateFromCarnet = (enfant: EnfantDTO) => {
    setSelectedEnfantId(enfant.id || 0);
    setCarnetModalOpen(false);
    setCreateModalOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <PageContainer title="Rendez-vous" subtitle="Gestion des rendez-vous de vaccination">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Chargement les rendez-vous...</h3>
            <p className="text-muted-foreground">Veuillez patienter</p>
          </CardContent>
        </Card>
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
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">En attente</p>
                <p className="text-2xl font-bold text-blue-700">{stats.enAttente}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Confirmés</p>
                <p className="text-2xl font-bold text-blue-700">{stats.confirme}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Effectués</p>
                <p className="text-2xl font-bold text-blue-700">{stats.effectue}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="mb-6 border-0 dark:bg-slate-900 shadow-md">
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 w-full lg:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                <Input
                  placeholder="Rechercher un enfant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-300 dark:border-blue-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger className="w-48 border-blue-200 focus:border-blue-500 focus:ring-blue-300 dark:border-blue-800 dark:bg-slate-800 dark:text-white">
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
              <Button variant="outline" size="sm" onClick={() => refetch()} className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button onClick={() => setCreateModalOpen(true)} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau RDV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content - Carnets par enfant */}
      {filteredChildren.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun rendez-vous</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statutFilter !== 'tous' 
                ? 'Aucun rendez-vous ne correspond à vos critères.'
                : isInfirmier
                  ? 'Aucun rendez-vous créé par votre compte pour le moment.'
                  : 'Commencez par créer un nouveau rendez-vous.'}
            </p>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un rendez-vous
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map(({ child, appointments: childAppointments }) => (
            <Card key={child.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-900">
              {/* Header avec gradient bleu */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 relative">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-3 border-white shadow-lg">
                    <AvatarFallback className="bg-white text-blue-600 font-bold text-lg">
                      {child.prenom?.[0]}{child.nom?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-white">
                    <p className="font-bold text-lg leading-none">{child.prenom} {child.nom}</p>
                    <p className="text-sm text-blue-100 mt-1">
                      {childAppointments.length} rendez-vous
                    </p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-5">
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/30 rounded-lg p-4 border border-orange-100 dark:border-orange-800">
                    <p className="text-2xl font-bold text-orange-600">
                      {childAppointments.filter(r => r.statut === 'EN_ATTENTE').length}
                    </p>
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mt-1">En attente</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/30 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
                    <p className="text-2xl font-bold text-emerald-600">
                      {childAppointments.filter(r => r.statut === 'CONFIRME').length}
                    </p>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mt-1">Confirmés</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                    <p className="text-2xl font-bold text-blue-600">
                      {childAppointments.filter(r => r.statut === 'EFFECTUE').length}
                    </p>
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mt-1">Effectués</p>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

                {/* Preview appointments */}
                {childAppointments.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Prochains rendez-vous</p>
                    <div className="space-y-2">
                      {childAppointments.slice(0, 2).map((rdv) => (
                        <div key={rdv.id} className="flex items-start justify-between gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{rdv.nomVaccinAEffectuer}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {rdv.date && format(parseISO(rdv.date), 'dd MMM yyyy', { locale: fr })}
                            </p>
                          </div>
                          <StatutBadge statut={rdv.statut as StatutRvEnum} />
                        </div>
                      ))}
                    </div>
                    {childAppointments.length > 2 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium pt-1">
                        +{childAppointments.length - 2} autres
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Aucun rendez-vous pour le moment</p>
                  </div>
                )}

                {/* Button */}
                <Button 
                  className="w-full mt-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  onClick={() => {
                    setSelectedChildForCarnet(child);
                    setCarnetModalOpen(true);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Voir les rendez-vous
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {/* Create Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="border-0 dark:bg-slate-900">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-500 -mx-6 -mt-6 mb-4 px-6 py-4 rounded-t-lg">
            <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Créer un rendez-vous
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Ajouter un nouveau rendez-vous de vaccination
            </DialogDescription>
          </DialogHeader>
          <RendezVousForm 
            selectedEnfantId={selectedEnfantId}
            onEnfantChange={setSelectedEnfantId}
            onSubmit={handleCreate}
            onCancel={() => setCreateModalOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Carnet Modal */}
      {selectedChildForCarnet && (
        <RendezVousCarnetModal
          enfant={selectedChildForCarnet}
          isOpen={carnetModalOpen}
          onClose={() => {
            setCarnetModalOpen(false);
            setSelectedChildForCarnet(null);
          }}
          onCreateAppointment={handleCreateFromCarnet}
        />
      )}
    </PageContainer>
  );
}
