import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Search, 
  Plus, 
  Download, 
  Syringe,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Calendar,
  Factory,
  Thermometer,
  Clock,
  Package,
  AlertTriangle,
  XCircle,
  LayoutGrid,
  List,
  FileText,
  Activity,
  Info
} from 'lucide-react';
import PageContainer from "@/components/shared/page-container";
import { 
  useAllVaccins, 
  useCreateVaccin, 
  useUpdateVaccin, 
  useDeleteVaccin 
} from '@/services/vaccin.service';
import type { VaccinDTO, VaccinCreateDTO, TypeVaccinEnum, ModeAdministrationEnum, PeriodeVaccinationEnum } from '@/types';
import { TypeVaccinLabels, ModeAdministrationLabels, PeriodeVaccinationLabels } from '@/types';
import { toast } from 'sonner';
import { format, parseISO, isAfter, isBefore, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';


// ================================
// COMPOSANT CARD VACCIN
// ================================

interface VaccinCardProps {
  vaccin: VaccinDTO;
  onView: (vaccin: VaccinDTO) => void;
  onEdit: (vaccin: VaccinDTO) => void;
  onDelete: (vaccin: VaccinDTO) => void;
}

function VaccinCard({ vaccin, onView, onEdit, onDelete }: VaccinCardProps) {
  const isExpired = vaccin.dateExpiration ? isBefore(parseISO(vaccin.dateExpiration), new Date()) : false;
  const isExpiringSoon = vaccin.dateExpiration ? 
    isBefore(parseISO(vaccin.dateExpiration), addMonths(new Date(), 3)) && !isExpired : false;
  
  const getStatusColor = () => {
    if (isExpired) return 'bg-red-500';
    if (isExpiringSoon) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getTypeColor = (type: TypeVaccinEnum) => {
    const colors: Record<string, string> = {
      BCG: 'bg-purple-100 text-purple-700 border-purple-200',
      POLIO: 'bg-blue-100 text-blue-700 border-blue-200',
      DTC: 'bg-green-100 text-green-700 border-green-200',
      HEPATITE_B: 'bg-orange-100 text-orange-700 border-orange-200',
      COVID_19: 'bg-red-100 text-red-700 border-red-200',
      GRIPPE: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      AUTRES: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[type] || colors.AUTRES;
  };
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Status bar */}
      <div className={`h-1.5 ${getStatusColor()}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isExpired ? 'bg-red-50' : 'bg-primary/10'}`}>
              <Syringe className={`h-6 w-6 ${isExpired ? 'text-red-500' : 'text-primary'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{vaccin.nom}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Factory className="h-3 w-3" />
                {vaccin.fabricant || 'Fabricant non spécifié'}
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
              <DropdownMenuItem onClick={() => onView(vaccin)}>
                <Eye className="mr-2 h-4 w-4" /> Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(vaccin)}>
                <Pencil className="mr-2 h-4 w-4" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(vaccin)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Type et Période */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getTypeColor(vaccin.typeVaccin)}>
            {TypeVaccinLabels[vaccin.typeVaccin] || vaccin.typeVaccin}
          </Badge>
          {vaccin.periode && (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {PeriodeVaccinationLabels[vaccin.periode] || vaccin.periode}
            </Badge>
          )}
        </div>

        {/* Informations principales */}
        <div className="grid grid-cols-2 gap-3">
          {vaccin.numeroLot && (
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">N° Lot</p>
                <p className="text-sm font-medium truncate">{vaccin.numeroLot}</p>
              </div>
            </div>
          )}
          
          {vaccin.modeAdministration && (
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Administration</p>
                <p className="text-sm font-medium truncate">
                  {ModeAdministrationLabels[vaccin.modeAdministration] || vaccin.modeAdministration}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="space-y-2">
          {vaccin.dateExpiration && (
            <div className={`flex items-center justify-between p-2 rounded-lg ${
              isExpired ? 'bg-red-50 dark:bg-red-950/30' : 
              isExpiringSoon ? 'bg-amber-50 dark:bg-amber-950/30' : 
              'bg-emerald-50 dark:bg-emerald-950/30'
            }`}>
              <div className="flex items-center gap-2">
                <Calendar className={`h-4 w-4 ${
                  isExpired ? 'text-red-500' : 
                  isExpiringSoon ? 'text-amber-500' : 
                  'text-emerald-500'
                }`} />
                <span className="text-sm">Expiration</span>
              </div>
              <span className={`text-sm font-medium ${
                isExpired ? 'text-red-600' : 
                isExpiringSoon ? 'text-amber-600' : 
                'text-emerald-600'
              }`}>
                {format(parseISO(vaccin.dateExpiration), 'dd MMM yyyy', { locale: fr })}
              </span>
            </div>
          )}
        </div>

        {/* Conservation */}
        {vaccin.temperatureConservation && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Thermometer className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {vaccin.temperatureConservation}
            </span>
          </div>
        )}

        {/* Quantité */}
        {vaccin.quantiteDisponible !== undefined && vaccin.quantiteDisponible !== null && (
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Stock disponible</span>
            <Badge variant={vaccin.quantiteDisponible > 100 ? 'default' : vaccin.quantiteDisponible > 0 ? 'secondary' : 'destructive'}>
              {vaccin.quantiteDisponible} doses
            </Badge>
          </div>
        )}

        {/* Effets secondaires */}
        {vaccin.effetsSecondaires && (
          <>
            <Separator />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-3 w-3" />
                <span>Effets secondaires possibles</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {vaccin.effetsSecondaires}
              </p>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onView(vaccin)}
        >
          <FileText className="mr-2 h-4 w-4" />
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );
}

// ================================
// COMPOSANT SKELETON CARD
// ================================

function VaccinCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700" />
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-14 rounded-lg" />
          <Skeleton className="h-14 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

// ================================
// FORMULAIRE VACCIN
// ================================

interface VaccinFormProps {
  vaccin?: VaccinDTO | null;
  onSubmit: (data: VaccinCreateDTO) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

function VaccinForm({ vaccin, onSubmit, onCancel, isLoading }: VaccinFormProps) {
  const [formData, setFormData] = useState<Partial<VaccinCreateDTO>>({
    nom: vaccin?.nom || '',
    fabricant: vaccin?.fabricant || '',
    numeroLot: vaccin?.numeroLot || '',
    dateProduction: vaccin?.dateProduction || '',
    dateExpiration: vaccin?.dateExpiration || '',
    description: vaccin?.description || '',
    dosage: vaccin?.dosage || '',
    typeVaccin: vaccin?.typeVaccin || 'AUTRES',
    modeAdministration: vaccin?.modeAdministration || undefined,
    temperatureConservation: vaccin?.temperatureConservation || '',
    effetsSecondaires: vaccin?.effetsSecondaires || '',
    dosesRequises: vaccin?.dosesRequises || undefined,
    quantiteDisponible: vaccin?.quantiteDisponible || undefined,
    periode: vaccin?.periode || undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.typeVaccin) {
      toast.error('Le nom et le type du vaccin sont obligatoires');
      return;
    }
    await onSubmit(formData as VaccinCreateDTO);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom */}
        <div className="space-y-2">
          <Label htmlFor="nom">Nom du vaccin *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            placeholder="Ex: Pentavalent (Penta 1)"
            required
          />
        </div>

        {/* Fabricant */}
        <div className="space-y-2">
          <Label htmlFor="fabricant">Fabricant</Label>
          <Input
            id="fabricant"
            value={formData.fabricant}
            onChange={(e) => setFormData({ ...formData, fabricant: e.target.value })}
            placeholder="Ex: Serum Institute of India"
          />
        </div>

        {/* Type de vaccin */}
        <div className="space-y-2">
          <Label htmlFor="typeVaccin">Type de vaccin *</Label>
          <Select 
            value={formData.typeVaccin} 
            onValueChange={(v) => setFormData({ ...formData, typeVaccin: v as TypeVaccinEnum })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TypeVaccinLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mode d'administration */}
        <div className="space-y-2">
          <Label htmlFor="modeAdministration">Mode d'administration</Label>
          <Select 
            value={formData.modeAdministration || ''} 
            onValueChange={(v) => setFormData({ ...formData, modeAdministration: v as ModeAdministrationEnum })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un mode" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ModeAdministrationLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Numéro de lot */}
        <div className="space-y-2">
          <Label htmlFor="numeroLot">Numéro de lot</Label>
          <Input
            id="numeroLot"
            value={formData.numeroLot}
            onChange={(e) => setFormData({ ...formData, numeroLot: e.target.value })}
            placeholder="Ex: PT789-2024"
          />
        </div>

        {/* Période */}
        <div className="space-y-2">
          <Label htmlFor="periode">Période de vaccination</Label>
          <Select 
            value={formData.periode || ''} 
            onValueChange={(v) => setFormData({ ...formData, periode: v as PeriodeVaccinationEnum })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PeriodeVaccinationLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date de production */}
        <div className="space-y-2">
          <Label htmlFor="dateProduction">Date de production</Label>
          <Input
            id="dateProduction"
            type="date"
            value={formData.dateProduction}
            onChange={(e) => setFormData({ ...formData, dateProduction: e.target.value })}
          />
        </div>

        {/* Date d'expiration */}
        <div className="space-y-2">
          <Label htmlFor="dateExpiration">Date d'expiration</Label>
          <Input
            id="dateExpiration"
            type="date"
            value={formData.dateExpiration}
            onChange={(e) => setFormData({ ...formData, dateExpiration: e.target.value })}
          />
        </div>

        {/* Température de conservation */}
        <div className="space-y-2">
          <Label htmlFor="temperatureConservation">Température de conservation</Label>
          <Input
            id="temperatureConservation"
            value={formData.temperatureConservation}
            onChange={(e) => setFormData({ ...formData, temperatureConservation: e.target.value })}
            placeholder="Ex: 2°C - 8°C"
          />
        </div>

        {/* Doses requises */}
        <div className="space-y-2">
          <Label htmlFor="dosesRequises">Doses requises</Label>
          <Input
            id="dosesRequises"
            type="number"
            min="1"
            value={formData.dosesRequises || ''}
            onChange={(e) => setFormData({ ...formData, dosesRequises: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="Ex: 3"
          />
        </div>

        {/* Quantité disponible */}
        <div className="space-y-2">
          <Label htmlFor="quantiteDisponible">Quantité disponible</Label>
          <Input
            id="quantiteDisponible"
            type="number"
            min="0"
            value={formData.quantiteDisponible || ''}
            onChange={(e) => setFormData({ ...formData, quantiteDisponible: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="Ex: 500"
          />
        </div>

        {/* Dosage */}
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            placeholder="Ex: 0.5 ml"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description du vaccin..."
          rows={3}
        />
      </div>

      {/* Effets secondaires */}
      <div className="space-y-2">
        <Label htmlFor="effetsSecondaires">Effets secondaires possibles</Label>
        <Textarea
          id="effetsSecondaires"
          value={formData.effetsSecondaires}
          onChange={(e) => setFormData({ ...formData, effetsSecondaires: e.target.value })}
          placeholder="Liste des effets secondaires possibles..."
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {vaccin ? 'Mettre à jour' : 'Créer le vaccin'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ================================
// MODAL DÉTAILS VACCIN
// ================================

interface VaccinDetailsModalProps {
  vaccin: VaccinDTO | null;
  open: boolean;
  onClose: () => void;
}

function VaccinDetailsModal({ vaccin, open, onClose }: VaccinDetailsModalProps) {
  if (!vaccin) return null;

  const isExpired = vaccin.dateExpiration ? isBefore(parseISO(vaccin.dateExpiration), new Date()) : false;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isExpired ? 'bg-red-100' : 'bg-primary/10'}`}>
              <Syringe className={`h-6 w-6 ${isExpired ? 'text-red-500' : 'text-primary'}`} />
            </div>
            <div>
              <DialogTitle className="text-xl">{vaccin.nom}</DialogTitle>
              <DialogDescription>{vaccin.fabricant || 'Fabricant non spécifié'}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {TypeVaccinLabels[vaccin.typeVaccin] || vaccin.typeVaccin}
            </Badge>
            {vaccin.modeAdministration && (
              <Badge variant="secondary">
                {ModeAdministrationLabels[vaccin.modeAdministration]}
              </Badge>
            )}
            {vaccin.periode && (
              <Badge variant="secondary">
                {PeriodeVaccinationLabels[vaccin.periode]}
              </Badge>
            )}
            {isExpired && (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" /> Expiré
              </Badge>
            )}
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4">
            {vaccin.numeroLot && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Numéro de lot</p>
                <p className="font-medium">{vaccin.numeroLot}</p>
              </div>
            )}
            {vaccin.dosage && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Dosage</p>
                <p className="font-medium">{vaccin.dosage}</p>
              </div>
            )}
            {vaccin.dateProduction && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Date de production</p>
                <p className="font-medium">{format(parseISO(vaccin.dateProduction), 'dd MMMM yyyy', { locale: fr })}</p>
              </div>
            )}
            {vaccin.dateExpiration && (
              <div className={`p-3 rounded-lg ${isExpired ? 'bg-red-50' : 'bg-muted/50'}`}>
                <p className="text-xs text-muted-foreground mb-1">Date d'expiration</p>
                <p className={`font-medium ${isExpired ? 'text-red-600' : ''}`}>
                  {format(parseISO(vaccin.dateExpiration), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            )}
            {vaccin.temperatureConservation && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Conservation</p>
                <p className="font-medium text-blue-700 dark:text-blue-300">{vaccin.temperatureConservation}</p>
              </div>
            )}
            {vaccin.dosesRequises && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Doses requises</p>
                <p className="font-medium">{vaccin.dosesRequises} dose(s)</p>
              </div>
            )}
          </div>

          {/* Description */}
          {vaccin.description && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Info className="h-4 w-4" /> Description
              </h4>
              <p className="text-sm text-muted-foreground">{vaccin.description}</p>
            </div>
          )}

          {/* Effets secondaires */}
          {vaccin.effetsSecondaires && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" /> Effets secondaires possibles
              </h4>
              <p className="text-sm text-muted-foreground">{vaccin.effetsSecondaires}</p>
            </div>
          )}

          {/* Stock */}
          {vaccin.quantiteDisponible !== undefined && vaccin.quantiteDisponible !== null && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stock disponible</span>
                <Badge variant={vaccin.quantiteDisponible > 100 ? 'default' : vaccin.quantiteDisponible > 0 ? 'secondary' : 'destructive'}>
                  {vaccin.quantiteDisponible} doses
                </Badge>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ================================
// COMPOSANT PRINCIPAL
// ================================

export default function VaccinPage() {
  const { data: vaccins, isLoading, isError, error, refetch } = useAllVaccins();
  const createVaccinMutation = useCreateVaccin();
  const updateVaccinMutation = useUpdateVaccin();
  const deleteVaccinMutation = useDeleteVaccin();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVaccin, setSelectedVaccin] = useState<VaccinDTO | null>(null);
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const itemsPerPage = viewMode === 'grid' ? 8 : 10;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  // Filtrage
  const filteredVaccins = (vaccins || []).filter(vaccin => {
    const matchesSearch = 
      vaccin.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccin.fabricant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccin.numeroLot?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'tous' || vaccin.typeVaccin === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVaccins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVaccins = filteredVaccins.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const stats = {
    total: vaccins?.length || 0,
    expired: vaccins?.filter(v => v.dateExpiration && isBefore(parseISO(v.dateExpiration), new Date())).length || 0,
    lowStock: vaccins?.filter(v => v.quantiteDisponible !== undefined && v.quantiteDisponible !== null && v.quantiteDisponible < 50).length || 0,
    expiringSoon: vaccins?.filter(v => 
      v.dateExpiration && 
      isBefore(parseISO(v.dateExpiration), addMonths(new Date(), 3)) && 
      isAfter(parseISO(v.dateExpiration), new Date())
    ).length || 0,
  };

  // Handlers
  const handleCreate = async (data: VaccinCreateDTO) => {
    try {
      await createVaccinMutation.mutateAsync(data);
      toast.success('Vaccin créé avec succès');
      setIsCreateModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la création');
    }
  };

  const handleUpdate = async (data: VaccinCreateDTO) => {
    if (!selectedVaccin?.id) return;
    try {
      await updateVaccinMutation.mutateAsync({ ...data, id: selectedVaccin.id });
      toast.success('Vaccin mis à jour avec succès');
      setIsEditModalOpen(false);
      setSelectedVaccin(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (!selectedVaccin?.id) return;
    try {
      await deleteVaccinMutation.mutateAsync(selectedVaccin.id);
      toast.success('Vaccin supprimé avec succès');
      setIsDeleteModalOpen(false);
      setSelectedVaccin(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <PageContainer 
      title="Gestion des Vaccins" 
      subtitle="Gérez le catalogue des vaccins disponibles dans votre centre"
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vaccins</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Types de vaccins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expire bientôt</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Dans les 3 prochains mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirés</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">À retirer du stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock faible</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">{"< 50 doses"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, fabricant, n° lot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type de vaccin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les types</SelectItem>
                  {Object.entries(TypeVaccinLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un vaccin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des vaccins: {error?.message || 'Erreur inconnue'}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Catalogue des Vaccins</h2>
          <p className="text-sm text-muted-foreground">
            {filteredVaccins.length} vaccin(s) trouvé(s)
          </p>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <VaccinCardSkeleton key={i} />
              ))}
            </div>
          ) : paginatedVaccins.length === 0 ? (
            <Card className="p-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-muted rounded-full">
                  <Syringe className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Aucun vaccin trouvé</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter un vaccin'}
                  </p>
                </div>
                {searchTerm ? (
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Réinitialiser la recherche
                  </Button>
                ) : (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un vaccin
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedVaccins.map((vaccin) => (
                <VaccinCard
                  key={vaccin.id}
                  vaccin={vaccin}
                  onView={(v) => { setSelectedVaccin(v); setIsViewModalOpen(true); }}
                  onEdit={(v) => { setSelectedVaccin(v); setIsEditModalOpen(true); }}
                  onDelete={(v) => { setSelectedVaccin(v); setIsDeleteModalOpen(true); }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaccin</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>N° Lot</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedVaccins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Syringe className="h-12 w-12 opacity-20" />
                        <p>Aucun vaccin trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVaccins.map((vaccin) => {
                    const isExpired = vaccin.dateExpiration ? isBefore(parseISO(vaccin.dateExpiration), new Date()) : false;
                    return (
                      <TableRow key={vaccin.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isExpired ? 'bg-red-100' : 'bg-primary/10'}`}>
                              <Syringe className={`h-4 w-4 ${isExpired ? 'text-red-500' : 'text-primary'}`} />
                            </div>
                            <div>
                              <div className="font-medium">{vaccin.nom}</div>
                              <div className="text-sm text-muted-foreground">{vaccin.fabricant}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {TypeVaccinLabels[vaccin.typeVaccin] || vaccin.typeVaccin}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {vaccin.numeroLot || '-'}
                          </code>
                        </TableCell>
                        <TableCell>
                          {vaccin.dateExpiration ? (
                            <span className={isExpired ? 'text-red-600 font-medium' : ''}>
                              {format(parseISO(vaccin.dateExpiration), 'dd/MM/yyyy')}
                            </span>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {vaccin.quantiteDisponible !== undefined && vaccin.quantiteDisponible !== null ? (
                            <Badge variant={vaccin.quantiteDisponible > 100 ? 'default' : vaccin.quantiteDisponible > 0 ? 'secondary' : 'destructive'}>
                              {vaccin.quantiteDisponible}
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
                              <DropdownMenuItem onClick={() => { setSelectedVaccin(vaccin); setIsViewModalOpen(true); }}>
                                <Eye className="mr-2 h-4 w-4" /> Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedVaccin(vaccin); setIsEditModalOpen(true); }}>
                                <Pencil className="mr-2 h-4 w-4" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => { setSelectedVaccin(vaccin); setIsDeleteModalOpen(true); }}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
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

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau vaccin</DialogTitle>
            <DialogDescription>
              Remplissez les informations du vaccin à ajouter au catalogue
            </DialogDescription>
          </DialogHeader>
          <VaccinForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createVaccinMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le vaccin</DialogTitle>
            <DialogDescription>
              Modifiez les informations du vaccin
            </DialogDescription>
          </DialogHeader>
          <VaccinForm
            vaccin={selectedVaccin}
            onSubmit={handleUpdate}
            onCancel={() => { setIsEditModalOpen(false); setSelectedVaccin(null); }}
            isLoading={updateVaccinMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <VaccinDetailsModal
        vaccin={selectedVaccin}
        open={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setSelectedVaccin(null); }}
      />

      {/* Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Cette action est irréversible
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              Êtes-vous sûr de vouloir supprimer le vaccin{' '}
              <strong>{selectedVaccin?.nom}</strong> ?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Cette action supprimera définitivement ce vaccin du catalogue.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteVaccinMutation.isPending}
            >
              {deleteVaccinMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
