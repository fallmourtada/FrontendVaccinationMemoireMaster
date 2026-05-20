import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  ChevronRight, 
  Plus, 
  Loader2, 
  ArrowLeft,
  Home,
  AlertCircle,
  Building2,
  MapPinned,
  Hospital,
  Sparkles,
  Pencil,
  Trash2,
  UserPlus
} from 'lucide-react';
import PageContainer from '@/components/shared/page-container';
import localityService from '@/services/locality.service';
import apiClient from '@/utils/api-client';
import type { LocaliteDTO } from '@/types/localite';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { UtilisateurDTO } from '@/types';

type NavigationLevel = 'regions' | 'departments' | 'districts' | 'centres';

const numId = (v: unknown): number | null => {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

interface BreadcrumbItem {
  label: string;
  level: NavigationLevel;
  id?: number;
}

const getCurrentEntityLabel = (level: NavigationLevel): string => {
  switch (level) {
    case 'regions':
      return 'région';
    case 'departments':
      return 'département';
    case 'districts':
      return 'district';
    default:
      return 'poste de santé';
  }
};

const getNextActionLabel = (level: NavigationLevel): string => {
  switch (level) {
    case 'regions':
      return 'Voir les départements';
    case 'departments':
      return 'Voir les districts';
    case 'districts':
      return 'Voir les postes de santé';
    default:
      return 'Détails';
  }
};

const SENEGAL_REGION_NODES = [
  { name: 'DAKAR', x: 15, y: 48 },
  { name: 'THIES', x: 24, y: 52 },
  { name: 'DIOURBEL', x: 34, y: 53 },
  { name: 'LOUGA', x: 35, y: 40 },
  { name: 'SAINT-LOUIS', x: 30, y: 22 },
  { name: 'MATAM', x: 58, y: 22 },
  { name: 'KAFFRINE', x: 43, y: 60 },
  { name: 'FATICK', x: 28, y: 64 },
  { name: 'KAOLACK', x: 36, y: 70 },
  { name: 'KOLDA', x: 47, y: 88 },
  { name: 'SEDHIOU', x: 35, y: 84 },
  { name: 'ZIGUINCHOR', x: 22, y: 89 },
  { name: 'TAMBACOUNDA', x: 62, y: 66 },
  { name: 'KEDOUGOU', x: 74, y: 82 },
];

const normalizeRegionName = (value: string): string => value.trim().toUpperCase();

export default function LocalitePage() {
  const queryClient = useQueryClient();
  // ===== STATE =====
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>('regions');
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    { label: 'Toutes les régions', level: 'regions' }
  ]);
  const [selectedIds, setSelectedIds] = useState<{ region?: number; department?: number; district?: number }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCode, setNewItemCode] = useState('');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffFormMode, setStaffFormMode] = useState<'ICP' | 'INFIRMIER'>('ICP');
  const [staffTargetItem, setStaffTargetItem] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'hierarchie' | 'carte'>('hierarchie');
  const [staffFormData, setStaffFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    matricule: '',
    password: '',
    dateEmbauche: '',
    age: '',
  });

  // ===== QUERIES =====
  const { data: regions = [], isLoading: loadingRegions } = useQuery({
    queryKey: ['regions'],
    queryFn: () => localityService.getAllRegions(),
  });

  const { data: departments = [], isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments', selectedIds.region],
    queryFn: () => localityService.getDepartmentsByRegion(selectedIds.region!),
    enabled: !!selectedIds.region,
  });

  const { data: districts = [], isLoading: loadingDistricts } = useQuery({
    queryKey: ['districts', selectedIds.department],
    queryFn: () => localityService.getDistrictsByDepartment(selectedIds.department!),
    enabled: !!selectedIds.department,
  });

  const { data: centres = [], isLoading: loadingCentres } = useQuery({
    queryKey: ['centres', selectedIds.district],
    queryFn: () => localityService.getCentresByDistrict(selectedIds.district!),
    enabled: !!selectedIds.district,
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['vaccination-users-staff'],
    queryFn: async () => {
      const res = await apiClient.get<UtilisateurDTO[] | { data: UtilisateurDTO }>('/api/v1/users');
      const body = res.data as unknown;
      if (Array.isArray(body)) return body as UtilisateurDTO[];
      if (body && typeof body === 'object' && 'data' in (body as object) && Array.isArray((body as { data: UtilisateurDTO[] }).data)) {
        return (body as { data: UtilisateurDTO[] }).data;
      }
      return [] as UtilisateurDTO[];
    },
  });

  type UserCentre = {
    id?: number;
    locality?: { id?: string | number | null };
  };

  const icpForLocalityDistrict = (districtId: string | number) =>
    (allUsers as UtilisateurDTO[]).filter((u) => {
      if (u.userRole !== 'ICP') return false;
      const c = (u as UtilisateurDTO & { centre?: UserCentre | null }).centre;
      return numId(c?.locality?.id) === numId(districtId);
    });

  const infirmiersForCentre = (centreId: string | number) =>
    (allUsers as UtilisateurDTO[]).filter(
      (u) => u.userRole === 'INFIRMIER' && numId((u as { centre?: { id?: number } | null }).centre?.id) === numId(centreId)
    );

  // ===== MUTATIONS =====
  const createRegionMutation = useMutation({
    mutationFn: (name: string) => localityService.createRegion(name, newItemCode),
    onSuccess: () => {
      setNewItemName('');
      setNewItemCode('');
      setShowAddForm(false);
      window.location.reload();
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: (name: string) =>
      localityService.createDepartment(selectedIds.region!, name, newItemCode),
    onSuccess: () => {
      setNewItemName('');
      setNewItemCode('');
      setShowAddForm(false);
      window.location.reload();
    },
  });

  const createDistrictMutation = useMutation({
    mutationFn: (name: string) =>
      localityService.createDistrict(selectedIds.department!, name, newItemCode),
    onSuccess: () => {
      setNewItemName('');
      setNewItemCode('');
      setShowAddForm(false);
      window.location.reload();
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: any }) => {
      if (currentLevel === 'centres') {
        return localityService.updateCentre(id, payload);
      }
      return localityService.updateLocality(id, payload);
    },
    onSuccess: () => {
      setShowEditForm(false);
      setEditingItem(null);
      setNewItemName('');
      setNewItemCode('');
      window.location.reload();
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string | number) => {
      if (currentLevel === 'centres') {
        return localityService.deleteCentre(id);
      }
      return localityService.deleteLocality(id);
    },
    onSuccess: () => {
      window.location.reload();
    }
  });

  const createStaffMutation = useMutation({
    mutationFn: async () => {
      if (!staffTargetItem?.id) {
        throw new Error('Aucune cible sélectionnée pour la création.');
      }

      const payload = {
        nom: staffFormData.nom.trim(),
        prenom: staffFormData.prenom.trim(),
        email: staffFormData.email.trim(),
        password: staffFormData.password,
        phone: staffFormData.phone.trim() || undefined,
        matricule: staffFormData.matricule.trim() || undefined,
        dateEmbauche: staffFormData.dateEmbauche || undefined,
        age: staffFormData.age ? Number(staffFormData.age) : undefined,
      };

      if (staffFormMode === 'ICP') {
        const idPourApi = await localityService.resolveDistrictSanitaireCentreId(
          staffTargetItem.id
        );
        await apiClient.post(
          `/api/v1/users/ICP?districtId=${idPourApi}`,
          payload
        );
        return;
      }

      await apiClient.post(
        `/api/v1/users/Infirmier?centreId=${staffTargetItem.id}`,
        payload
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccination-users-staff'] });
      if (staffFormMode === 'ICP') {
        toast.success('Infirmier chef de poste créé avec succès');
      } else {
        toast.success('Infirmier créé avec succès');
      }
      setShowStaffForm(false);
      setStaffTargetItem(null);
      setStaffFormData({
        nom: '',
        prenom: '',
        email: '',
        phone: '',
        matricule: '',
        password: '',
        dateEmbauche: '',
        age: '',
      });
    },
    onError: (error: any) => {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        'Erreur lors de la création de l’utilisateur.';
      toast.error(String(message));
    }
  });

  // ===== HANDLERS =====
  const handleSelectRegion = useCallback((region: LocaliteDTO) => {
    setSelectedIds({ region: region.id });
    setBreadcrumb([
      { label: 'Toutes les régions', level: 'regions' },
      { label: region.name, level: 'regions', id: region.id }
    ]);
    setCurrentLevel('departments');
  }, []);

  const handleSelectDepartment = useCallback((department: LocaliteDTO) => {
    setSelectedIds(prev => ({ ...prev, department: department.id }));
    setBreadcrumb(prev => [
      ...prev.slice(0, 2),
      { label: department.name, level: 'departments', id: department.id }
    ]);
    setCurrentLevel('districts');
  }, []);

  const handleSelectDistrict = useCallback((district: LocaliteDTO) => {
    setSelectedIds(prev => ({ ...prev, district: district.id }));
    setBreadcrumb(prev => [
      ...prev.slice(0, 3),
      { label: district.name, level: 'districts', id: district.id }
    ]);
    setCurrentLevel('centres');
  }, []);

  const handleBreadcrumbClick = (item: BreadcrumbItem, index: number) => {
    setBreadcrumb(breadcrumb.slice(0, index + 1));
    setCurrentLevel(item.level);

    if (item.level === 'regions') {
      setSelectedIds({});
    } else if (item.level === 'departments' && item.id) {
      setSelectedIds({ region: item.id });
    } else if (item.level === 'districts' && item.id) {
      const regionId = breadcrumb[1]?.id;
      setSelectedIds({ region: regionId, department: item.id });
    }
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim()) return;

    if (currentLevel === 'regions') {
      createRegionMutation.mutate(newItemName);
    } else if (currentLevel === 'departments') {
      createDepartmentMutation.mutate(newItemName);
    } else if (currentLevel === 'districts') {
      createDistrictMutation.mutate(newItemName);
    }
  };

  const handleBack = () => {
    if (currentLevel === 'centres') {
      const targetIndex = Math.max(breadcrumb.length - 2, 0);
      handleBreadcrumbClick(breadcrumb[targetIndex], targetIndex);
    } else if (currentLevel === 'districts') {
      const targetIndex = Math.max(breadcrumb.length - 2, 0);
      handleBreadcrumbClick(breadcrumb[targetIndex], targetIndex);
    } else if (currentLevel === 'departments') {
      handleBreadcrumbClick(breadcrumb[0], 0);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setNewItemName(item.name || '');
    setNewItemCode(item.codification || '');
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem || !newItemName.trim()) return;

    const payload = currentLevel === 'centres'
      ? { name: newItemName.trim() }
      : {
          name: newItemName.trim(),
          codification: newItemCode || '',
        };

    updateItemMutation.mutate({ id: editingItem.id, payload });
  };

  const handleDeleteItem = (item: any) => {
    const typeLabel = currentLevel === 'centres'
      ? 'ce centre/poste de santé'
      : `cette ${getCurrentEntityLabel(currentLevel)}`;

    const isConfirmed = window.confirm(`Voulez-vous vraiment supprimer ${typeLabel} ?`);
    if (!isConfirmed) return;
    deleteItemMutation.mutate(item.id);
  };

  const handleOpenStaffForm = (mode: 'ICP' | 'INFIRMIER', item: any) => {
    setStaffFormMode(mode);
    setStaffTargetItem(item);
    setStaffFormData({
      nom: '',
      prenom: '',
      email: '',
      phone: '',
      matricule: '',
      password: '',
      dateEmbauche: '',
      age: '',
    });
    setShowStaffForm(true);
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleSubmitStaffForm = () => {
    if (!staffFormData.nom || !staffFormData.prenom || !staffFormData.email || !staffFormData.password) {
      window.alert('Veuillez remplir les champs obligatoires (Nom, Prénom, Email, Mot de passe).');
      return;
    }
    createStaffMutation.mutate();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'REGION':
        return <MapPin className="h-5 w-5" />;
      case 'DEPARTMENT':
        return <Building2 className="h-5 w-5" />;
      case 'DISTRICT':
        return <MapPinned className="h-5 w-5" />;
      default:
        return <Hospital className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'REGION':
        return 'Région';
      case 'DEPARTMENT':
        return 'Département';
      case 'DISTRICT':
        return 'District';
      case 'CENTRE_DE_SANTE':
        return 'Centre de Santé';
      case 'POSTE_DE_SANTE':
        return 'Poste de Santé';
      default:
        return type;
    }
  };

  const isLoading = loadingRegions || loadingDepartments || loadingDistricts || loadingCentres;
  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    let data: any[] = [];

    if (currentLevel === 'regions') {
      data = regions;
    } else if (currentLevel === 'departments') {
      data = departments;
    } else if (currentLevel === 'districts') {
      data = districts;
    } else if (currentLevel === 'centres') {
      data = centres;
    }

    return data.filter(item => item.name.toLowerCase().includes(term));
  };

  const selectedRegionName = breadcrumb[1]?.label ? normalizeRegionName(breadcrumb[1].label) : '';
  const selectedDepartmentName = breadcrumb[2]?.label || '';
  const selectedDistrictName = breadcrumb[3]?.label || '';

  return (
    <PageContainer 
      title="Gestion des Localités" 
      subtitle="Vue hiérarchique des régions, départements, districts et centres de santé du Sénégal"
    >
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'hierarchie' | 'carte')} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <TabsTrigger value="hierarchie">Gestion Hiérarchique</TabsTrigger>
          <TabsTrigger value="carte">Carte du Sénégal (Aperçu)</TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchie" className="space-y-6 mt-0">
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg shadow-md p-4 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBreadcrumbClick(breadcrumb[0], 0)}
              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-bold"
            >
              <Home className="h-4 w-4 mr-1" />
              Accueil
            </Button>

            {breadcrumb.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-400 dark:text-blue-600" />
                <Button
                  variant={index === breadcrumb.length - 1 ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleBreadcrumbClick(item, index)}
                  className={index === breadcrumb.length - 1 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-lg hover:from-blue-700 hover:to-blue-600'
                    : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-semibold'
                  }
                >
                  {item.label}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex gap-3">
          {currentLevel !== 'regions' && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          )}
          <Input
            placeholder={`Rechercher une ${getCurrentEntityLabel(currentLevel)}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-300 dark:border-blue-800 rounded-full focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500"
          />
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold shadow-lg transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20">
              <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Ajouter une nouvelle localité
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">
                    Nom
                  </label>
                  <Input
                    placeholder={`Entrez le nom du ${getTypeLabel(currentLevel === 'centres' ? 'CENTRE_DE_SANTE' : currentLevel === 'districts' ? 'DISTRICT' : currentLevel === 'departments' ? 'DEPARTMENT' : 'REGION')}`}
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">
                    Code (optionnel)
                  </label>
                  <Input
                    placeholder="Code/Codification"
                    value={newItemCode}
                    onChange={(e) => setNewItemCode(e.target.value)}
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleAddNewItem}
                    disabled={!newItemName.trim() || createRegionMutation.isPending}
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold shadow-lg transition-all"
                  >
                    {createRegionMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Ajouter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-2 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Form */}
        {showEditForm && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20">
              <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                Modifier l'élément sélectionné
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">
                    Nom
                  </label>
                  <Input
                    placeholder="Nom"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
                {currentLevel !== 'centres' && (
                  <div>
                    <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">
                      Code (optionnel)
                    </label>
                    <Input
                      placeholder="Code/Codification"
                      value={newItemCode}
                      onChange={(e) => setNewItemCode(e.target.value)}
                      className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                    />
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleUpdateItem}
                    disabled={!newItemName.trim() || updateItemMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold shadow-lg transition-all"
                  >
                    {updateItemMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingItem(null);
                    }}
                    className="border-2 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Staff Form (ICP / Infirmier) */}
        {showStaffForm && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20">
              <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {staffFormMode === 'ICP' ? 'Inscrire ICP (Infirmier Chef de Poste)' : 'Ajouter Infirmier'}
              </CardTitle>
              {staffTargetItem && (
                <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                  Cible: <span className="font-semibold">{staffTargetItem.name}</span>
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">Nom *</label>
                  <Input
                    value={staffFormData.nom}
                    onChange={(e) => setStaffFormData((prev) => ({ ...prev, nom: e.target.value }))}
                    placeholder="Nom"
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">Prénom *</label>
                  <Input
                    value={staffFormData.prenom}
                    onChange={(e) => setStaffFormData((prev) => ({ ...prev, prenom: e.target.value }))}
                    placeholder="Prénom"
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">Email *</label>
                  <Input
                    type="email"
                    value={staffFormData.email}
                    onChange={(e) => setStaffFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemple.com"
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">Téléphone</label>
                  <Input
                    value={staffFormData.phone}
                    onChange={(e) => setStaffFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="77xxxxxxx"
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">Matricule</label>
                  <Input
                    value={staffFormData.matricule}
                    onChange={(e) => setStaffFormData((prev) => ({ ...prev, matricule: e.target.value }))}
                    placeholder="MAT-2026-001"
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">Date embauche</label>
                  <Input
                    type="date"
                    value={staffFormData.dateEmbauche}
                    onChange={(e) => setStaffFormData((prev) => ({ ...prev, dateEmbauche: e.target.value }))}
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">Age</label>
                  <Input
                    type="number"
                    min={0}
                    value={staffFormData.age}
                    onChange={(e) => setStaffFormData((prev) => ({ ...prev, age: e.target.value }))}
                    placeholder="Age"
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 block">Mot de passe *</label>
                  <Input
                    type="password"
                    value={staffFormData.password}
                    onChange={(e) => setStaffFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Mot de passe"
                    className="border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSubmitStaffForm}
                  disabled={createStaffMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold shadow-lg transition-all"
                >
                  {createStaffMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Enregistrer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStaffForm(false);
                    setStaffTargetItem(null);
                  }}
                  className="border-2 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {isLoading && currentLevel !== 'regions' ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : filteredData().length === 0 ? (
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardContent className="pt-12 pb-12 text-center">
              <AlertCircle className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-semibold">
                Aucun {getTypeLabel(currentLevel === 'centres' ? 'CENTRE_DE_SANTE' : currentLevel === 'districts' ? 'DISTRICT' : currentLevel === 'departments' ? 'DEPARTMENT' : 'REGION')} trouvé
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredData().map((item) => (
              <Card
                key={item.id}
                className="group border border-blue-100 dark:border-blue-900/60 shadow-sm hover:shadow-xl dark:bg-slate-800 overflow-hidden transition-all hover:-translate-y-1 cursor-pointer bg-white"
                onClick={() => {
                  if (currentLevel === 'regions') {
                    handleSelectRegion(item);
                  } else if (currentLevel === 'departments') {
                    handleSelectDepartment(item);
                  } else if (currentLevel === 'districts') {
                    handleSelectDistrict(item);
                  }
                }}
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-1.5" />
                <CardContent className="pt-5 pb-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 rounded-xl flex-shrink-0 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                      {getTypeIcon(item.type || (item.name ? 'CENTRE_DE_SANTE' : 'REGION'))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate text-base">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {item.codification || `ID: ${item.id}`}
                      </p>
                      <Badge className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 font-semibold text-xs">
                        {getTypeLabel(item.type || 'REGION')}
                      </Badge>
                    </div>
                  </div>
                  {(currentLevel === 'regions' || currentLevel === 'departments' || currentLevel === 'districts') && (
                    <div className="flex items-center justify-between rounded-lg border border-blue-100 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-900/20 px-3 py-2">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                        {getNextActionLabel(currentLevel)}
                      </p>
                      <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                  <div
                    className="space-y-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleEditItem(item);
                        }}
                        className="min-w-0 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
                      >
                        <Pencil className="h-4 w-4 mr-1 shrink-0" />
                        <span className="truncate">Modifier</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleDeleteItem(item);
                        }}
                        disabled={deleteItemMutation.isPending}
                        className="min-w-0 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        {deleteItemMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1 shrink-0" />
                            <span className="truncate">Supprimer</span>
                          </>
                        )}
                      </Button>
                    </div>
                    {currentLevel === 'districts' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleOpenStaffForm('ICP', item);
                          }}
                          className="h-auto w-full min-w-0 border-indigo-200 py-2 text-left text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900/60 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
                        >
                          <UserPlus className="mr-2 h-4 w-4 shrink-0" />
                          <span className="break-words leading-tight">Inscrire ICP</span>
                        </Button>
                        <div className="rounded-md border border-indigo-100 bg-indigo-50/60 px-2.5 py-2 text-left text-xs text-slate-700">
                          <p className="mb-1.5 font-semibold text-indigo-900">ICP (chef de poste)</p>
                          {icpForLocalityDistrict(item.id).length === 0 ? (
                            <p className="text-slate-500">Aucun ICP enregistré</p>
                          ) : (
                            <ul className="space-y-1">
                              {icpForLocalityDistrict(item.id).map((u) => (
                                <li key={String(u.id)} className="break-words border-b border-indigo-100/80 pb-1 last:border-0 last:pb-0">
                                  <span className="font-medium">
                                    {u.prenom} {u.nom}
                                  </span>
                                  {u.email ? <span className="block text-[11px] text-slate-500">{u.email}</span> : null}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </>
                    )}
                    {currentLevel === 'centres' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleOpenStaffForm('INFIRMIER', item);
                          }}
                          className="h-auto w-full min-w-0 border-emerald-200 py-2 text-left text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-200 dark:hover:bg-emerald-900/20"
                        >
                          <UserPlus className="mr-2 h-4 w-4 shrink-0" />
                          <span className="break-words leading-tight">Ajouter Infirmier</span>
                        </Button>
                        <div className="rounded-md border border-emerald-100 bg-emerald-50/60 px-2.5 py-2 text-left text-xs text-slate-700">
                          <p className="mb-1.5 font-semibold text-emerald-900">Infirmiers</p>
                          {infirmiersForCentre(item.id).length === 0 ? (
                            <p className="text-slate-500">Aucun infirmier enregistré</p>
                          ) : (
                            <ul className="space-y-1">
                              {infirmiersForCentre(item.id).map((u) => (
                                <li key={String(u.id)} className="break-words border-b border-emerald-100/80 pb-1 last:border-0 last:pb-0">
                                  <span className="font-medium">
                                    {u.prenom} {u.nom}
                                  </span>
                                  {u.email ? <span className="block text-[11px] text-slate-500">{u.email}</span> : null}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 overflow-hidden border-2 border-blue-200 dark:border-blue-800">
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-blue-200 to-blue-300 opacity-10 rounded-full -mr-12 -mt-12" />
          <CardContent className="pt-6 relative z-10">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 text-base flex items-center gap-2">
              📊 Structure Hiérarchique
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              <strong>Région</strong> → Départements → Districts → Postes de Santé<br/>
              Sélectionnez chaque niveau pour naviguer jusqu'aux postes de santé du Sénégal. 
              Vous pouvez ajouter de nouvelles localités et consulter les détails complets.
            </p>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="carte" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-700 dark:text-blue-300">Carte interactive des régions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mx-auto h-[470px] w-full max-w-3xl rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    <path
                      d="M22 18 L58 14 L81 26 L92 49 L86 77 L62 92 L36 90 L16 78 L9 58 L13 35 Z"
                      fill="#dbeafe"
                      stroke="#60a5fa"
                      strokeWidth="1.2"
                      opacity="0.9"
                    />
                    {regions.map((region: any) => {
                      const node = SENEGAL_REGION_NODES.find(
                        (item) => normalizeRegionName(item.name) === normalizeRegionName(region.name)
                      );
                      if (!node) return null;

                      const isSelected = selectedRegionName === normalizeRegionName(region.name);
                      return (
                        <g key={region.id} onClick={() => handleSelectRegion(region)} className="cursor-pointer">
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={isSelected ? 2.4 : 1.9}
                            fill={isSelected ? '#1d4ed8' : '#2563eb'}
                            stroke="white"
                            strokeWidth="0.8"
                          />
                          <text
                            x={node.x + 1.8}
                            y={node.y - 1.4}
                            fontSize="2.7"
                            fontWeight={isSelected ? 700 : 600}
                            fill={isSelected ? '#1e3a8a' : '#1e40af'}
                          >
                            {region.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Aperçu UI interactif de la carte. La position géographique sera affinée si tu valides cette approche.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300">Navigation par clic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentLevel !== 'regions' && (
                  <Button variant="outline" onClick={handleBack} className="w-full border-blue-200 text-blue-700">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour au niveau précédent
                  </Button>
                )}

                {currentLevel === 'regions' && (
                  <p className="text-sm text-slate-600">
                    Clique sur une région de la carte pour afficher ses départements.
                  </p>
                )}

                {currentLevel === 'departments' && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">Départements de {breadcrumb[1]?.label}</p>
                    {departments.length === 0 ? (
                      <p className="text-sm text-slate-500">Aucun département trouvé.</p>
                    ) : (
                      departments.map((department: any) => (
                        <Button
                          key={department.id}
                          variant="outline"
                          className="w-full justify-between border-blue-100 hover:bg-blue-50"
                          onClick={() => handleSelectDepartment(department)}
                        >
                          <span>{department.name}</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      ))
                    )}
                  </div>
                )}

                {currentLevel === 'districts' && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">
                      Districts de {selectedDepartmentName || breadcrumb[2]?.label}
                    </p>
                    {districts.length === 0 ? (
                      <p className="text-sm text-slate-500">Aucun district trouvé.</p>
                    ) : (
                      districts.map((district: any) => (
                        <Button
                          key={district.id}
                          variant="outline"
                          className="w-full justify-between border-blue-100 hover:bg-blue-50"
                          onClick={() => handleSelectDistrict(district)}
                        >
                          <span>{district.name}</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      ))
                    )}
                  </div>
                )}

                {currentLevel === 'centres' && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">
                      Structures de santé - {selectedDistrictName || 'District sélectionné'}
                    </p>
                    {centres.length === 0 ? (
                      <p className="text-sm text-slate-500">Aucune structure trouvée.</p>
                    ) : (
                      centres.map((centre: any) => (
                        <div key={centre.id} className="rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2">
                          <p className="text-sm font-semibold text-slate-800">{centre.name}</p>
                          <p className="text-xs text-slate-500">{getTypeLabel(centre.type || 'CENTRE_DE_SANTE')}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
