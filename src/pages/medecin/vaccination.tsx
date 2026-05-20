import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Syringe,
  AlertCircle,
  RefreshCw,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import PageContainer from "@/components/shared/page-container";
import { VaccinationCarnetModal } from '@/components/modals/vaccination-carnet-modal';
import { useAllVaccinations } from '@/services/vaccination.service';
import { useAllEnfants, useUserByEmail } from '@/services/user.service';
import { useDecodedToken } from '@/contexts/decoded-token-context';
import type { VaccinationDTO, EnfantDTO } from '@/types';
import { StatutVaccination, type StatutVaccinationEnum } from '@/types';

// Configuration des statuts
const statutConfig: Record<StatutVaccinationEnum, { label: string; color: string; bgColor: string; icon: typeof CheckCircle2 }> = {
  EFFECTUER: { 
    label: 'Effecté', 
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

export default function Vaccination() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('tous');
  const [selectedChildForCarnet, setSelectedChildForCarnet] = useState<EnfantDTO | null>(null);
  const [carnetModalOpen, setCarnetModalOpen] = useState(false);
  const { decodedToken } = useDecodedToken();
  const { data: currentUser } = useUserByEmail(decodedToken?.sub || '');
  const normalizedRole = (decodedToken?.role || '').replace(/^ROLE_/, '').toUpperCase();
  const isInfirmier = normalizedRole === 'INFIRMIER';
  const currentUserEmail = (decodedToken?.sub || currentUser?.email || '').toLowerCase();

  // API Hooks
  const { data: vaccinations = [], isLoading, isError, refetch } = useAllVaccinations();
  const { data: enfants = [] } = useAllEnfants();
  const ownedIds = useMemo(() => {
    try {
      const raw = decodedToken?.sub
        ? localStorage.getItem(`infirmier-owned-records:${decodedToken.sub.toLowerCase()}`)
        : null;
      if (!raw) return { vaccinationIds: [] as number[] };
      const parsed = JSON.parse(raw) as { vaccinationIds?: number[] };
      return { vaccinationIds: Array.isArray(parsed.vaccinationIds) ? parsed.vaccinationIds : [] };
    } catch {
      return { vaccinationIds: [] as number[] };
    }
  }, [decodedToken?.sub, vaccinations]);
  const scopedVaccinations = useMemo(() => {
    if (!isInfirmier) return vaccinations;
    return vaccinations.filter((vacc) => {
      const vaccId = vacc.id != null ? Number(vacc.id) : null;
      const ownerId = vacc.utilisateur?.id != null ? Number(vacc.utilisateur.id) : null;
      const ownerEmail = (vacc.utilisateur?.email || '').toLowerCase();
      return (
        (ownerId != null && ownerId === (currentUser?.id ?? -1)) ||
        (!!ownerEmail && ownerEmail === currentUserEmail) ||
        (vaccId != null && ownedIds.vaccinationIds.includes(vaccId))
      );
    });
  }, [vaccinations, isInfirmier, currentUser?.id, currentUserEmail, ownedIds.vaccinationIds]);

  // Group vaccinations by child
  const vaccinationsByChild = enfants.reduce((acc, child) => {
    const childVaccinations = scopedVaccinations.filter(vacc => {
      const enfantId = vacc.appointment?.enfant?.id || vacc.enfant?.id;
      return enfantId === child.id;
    });
    if (childVaccinations.length > 0) {
      acc.push({ child, vaccinations: childVaccinations });
    }
    return acc;
  }, [] as Array<{ child: EnfantDTO; vaccinations: VaccinationDTO[] }>);

  // Filter
  const filteredChildren = vaccinationsByChild.filter(({ child, vaccinations: childVaccinations }) => {
    const matchSearch = searchTerm === '' || 
      child.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = statutFilter === 'tous' || 
      childVaccinations.some(vacc => vacc.statutVaccination === statutFilter);
    return matchSearch && matchStatut;
  });

  // Stats
  const stats = {
    total: scopedVaccinations.length,
    effectue: scopedVaccinations.filter(r => r.statutVaccination === StatutVaccination.EFFECTUER).length,
    enAttente: scopedVaccinations.filter(r => r.statutVaccination === StatutVaccination.EN_ATTENTE).length,
    nonEffectue: scopedVaccinations.filter(r => r.statutVaccination === StatutVaccination.NON_EFFECTUER).length,
  };

  // Loading state
  if (isLoading) {
    return (
      <PageContainer title="Vaccinations" subtitle="Carnet de vaccination des enfants">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Chargement les vaccinations...</h3>
            <p className="text-muted-foreground">Veuillez patienter</p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  // Error state
  if (isError) {
    return (
      <PageContainer title="Vaccinations" subtitle="Carnet de vaccination des enfants">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des vaccinations.
            <Button variant="link" onClick={() => refetch()}>Réessayer</Button>
          </AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Vaccinations" subtitle="Carnet de vaccination des enfants">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <Syringe className="h-8 w-8 text-blue-500" />
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
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Non effectués</p>
                <p className="text-2xl font-bold text-red-700">{stats.nonEffectue}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
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
                  placeholder="Rechercher un enfant..."
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
                  <SelectItem value={StatutVaccination.EFFECTUER}>Effectué</SelectItem>
                  <SelectItem value={StatutVaccination.EN_ATTENTE}>En attente</SelectItem>
                  <SelectItem value={StatutVaccination.NON_EFFECTUER}>Non effectué</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content - Carnets par enfant */}
      {filteredChildren.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Syringe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune vaccination</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statutFilter !== 'tous' 
                ? 'Aucune vaccination ne correspond à vos critères.'
                : isInfirmier
                  ? 'Aucune vaccination créée par votre compte pour le moment.'
                  : 'Aucune vaccination pour le moment.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map(({ child, vaccinations: childVaccinations }) => (
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
                      {childVaccinations.length} vaccination{childVaccinations.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-5">
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/30 rounded-lg p-4 border border-green-100 dark:border-green-800">
                    <p className="text-2xl font-bold text-green-600">
                      {childVaccinations.filter(r => r.statutVaccination === StatutVaccination.EFFECTUER).length}
                    </p>
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mt-1">Effectuées</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/30 rounded-lg p-4 border border-orange-100 dark:border-orange-800">
                    <p className="text-2xl font-bold text-orange-600">
                      {childVaccinations.filter(r => r.statutVaccination === StatutVaccination.EN_ATTENTE).length}
                    </p>
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mt-1">En attente</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/30 rounded-lg p-4 border border-red-100 dark:border-red-800">
                    <p className="text-2xl font-bold text-red-600">
                      {childVaccinations.filter(r => r.statutVaccination === StatutVaccination.NON_EFFECTUER).length}
                    </p>
                    <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mt-1">Non effectuées</p>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

                {/* Preview vaccinations */}
                {childVaccinations.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Dernières vaccinations</p>
                    <div className="space-y-2">
                      {childVaccinations.slice(0, 2).map((vacc) => (
                        <div key={vacc.id} className="flex items-start justify-between gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{vacc.vaccine?.nom}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {vacc.date && new Date(vacc.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <Badge className={`${statutConfig[vacc.statutVaccination as StatutVaccinationEnum].bgColor} ${statutConfig[vacc.statutVaccination as StatutVaccinationEnum].color} border text-xs`}>
                            {statutConfig[vacc.statutVaccination as StatutVaccinationEnum].label}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    {childVaccinations.length > 2 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium pt-1">
                        +{childVaccinations.length - 2} autres
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Aucune vaccination pour le moment</p>
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
                  Voir les vaccinations
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Carnet Modal */}
      {selectedChildForCarnet && (
        <VaccinationCarnetModal
          enfant={selectedChildForCarnet}
          isOpen={carnetModalOpen}
          onClose={() => {
            setCarnetModalOpen(false);
            setSelectedChildForCarnet(null);
          }}
        />
      )}
    </PageContainer>
  );
}
