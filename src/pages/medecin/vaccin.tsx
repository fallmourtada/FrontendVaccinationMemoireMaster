import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  Search, 
  Plus, 
  Download, 
  Syringe,
  MoreHorizontal,
  Eye,
  Edit,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Clock,
  Package,
  AlertTriangle,
  Thermometer,
  XCircle,
  LayoutGrid,
  List,
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
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-900">
      {/* Header bleu */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
              <Syringe className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0 text-white">
              <p className="font-bold text-sm leading-tight truncate">{vaccin.nom}</p>
              <p className="text-xs text-white/90 truncate">{vaccin.fabricant || 'Fabricant non spécifié'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-6 w-6" onClick={() => onView(vaccin)}>
                    <Eye className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voir détails</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-6 w-6" onClick={() => onEdit(vaccin)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Modifier</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-6 w-6" onClick={() => onDelete(vaccin)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Supprimer</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <CardContent className="p-3">
        <div className="flex flex-wrap items-start gap-2">
          {/* Type */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Type:</span>
            <span className="text-xs text-blue-900 dark:text-blue-100">{TypeVaccinLabels[vaccin.typeVaccin] || vaccin.typeVaccin}</span>
          </div>

          {/* Période */}
          {vaccin.periode && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
              <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Période:</span>
              <span className="text-xs text-blue-900 dark:text-blue-100">{PeriodeVaccinationLabels[vaccin.periode] || vaccin.periode}</span>
            </div>
          )}

          {/* N° Lot */}
          {vaccin.numeroLot && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
              <Package className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Lot:</span>
              <span className="text-xs text-blue-900 dark:text-blue-100 truncate max-w-xs">{vaccin.numeroLot}</span>
            </div>
          )}

          {/* Administration */}
          {vaccin.modeAdministration && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
              <Activity className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Admin:</span>
              <span className="text-xs text-blue-900 dark:text-blue-100">{ModeAdministrationLabels[vaccin.modeAdministration] || vaccin.modeAdministration}</span>
            </div>
          )}

          {/* Température */}
          {vaccin.temperatureConservation && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
              <Thermometer className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Temp:</span>
              <span className="text-xs text-blue-900 dark:text-blue-100">{vaccin.temperatureConservation}</span>
            </div>
          )}
        </div>
      </CardContent>
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
          <Label htmlFor="nom" className="text-slate-700 dark:text-slate-300 font-semibold">Nom du vaccin *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            placeholder="Ex: Pentavalent (Penta 1)"
            required
            className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        {/* Fabricant */}
        <div className="space-y-2">
          <Label htmlFor="fabricant" className="text-slate-700 dark:text-slate-300 font-semibold">Fabricant</Label>
          <Input
            id="fabricant"
            value={formData.fabricant}
            onChange={(e) => setFormData({ ...formData, fabricant: e.target.value })}
            placeholder="Ex: Serum Institute of India"
            className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        {/* Type de vaccin */}
        <div className="space-y-2">
          <Label htmlFor="typeVaccin" className="text-slate-700 dark:text-slate-300 font-semibold">Type de vaccin *</Label>
          <Select 
            value={formData.typeVaccin} 
            onValueChange={(v) => setFormData({ ...formData, typeVaccin: v as TypeVaccinEnum })}
          >
            <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
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
          <Label htmlFor="modeAdministration" className="text-slate-700 dark:text-slate-300 font-semibold">Mode d'administration</Label>
          <Select 
            value={formData.modeAdministration || ''} 
            onValueChange={(v) => setFormData({ ...formData, modeAdministration: v as ModeAdministrationEnum })}
          >
            <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
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
          <Label htmlFor="numeroLot" className="text-slate-700 dark:text-slate-300 font-semibold">Numéro de lot</Label>
          <Input
            id="numeroLot"
            value={formData.numeroLot}
            onChange={(e) => setFormData({ ...formData, numeroLot: e.target.value })}
            placeholder="Ex: PT789-2024"
            className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        {/* Période */}
        <div className="space-y-2">
          <Label htmlFor="periode" className="text-slate-700 dark:text-slate-300 font-semibold">Période de vaccination</Label>
          <Select 
            value={formData.periode || ''} 
            onValueChange={(v) => setFormData({ ...formData, periode: v as PeriodeVaccinationEnum })}
          >
            <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
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
          <Label htmlFor="dateProduction" className="text-slate-700 dark:text-slate-300 font-semibold">Date de production</Label>
          <Input
            id="dateProduction"
            type="date"
            value={formData.dateProduction}
            onChange={(e) => setFormData({ ...formData, dateProduction: e.target.value })}
            className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        {/* Date d'expiration */}
        <div className="space-y-2">
          <Label htmlFor="dateExpiration" className="text-slate-700 dark:text-slate-300 font-semibold">Date d'expiration</Label>
          <Input
            id="dateExpiration"
            type="date"
            value={formData.dateExpiration}
            onChange={(e) => setFormData({ ...formData, dateExpiration: e.target.value })}
            className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        {/* Température de conservation */}
        <div className="space-y-2">
          <Label htmlFor="temperatureConservation" className="text-slate-700 dark:text-slate-300 font-semibold">Température de conservation</Label>
          <Input
            id="temperatureConservation"
            value={formData.temperatureConservation}
            onChange={(e) => setFormData({ ...formData, temperatureConservation: e.target.value })}
            placeholder="Ex: 2°C - 8°C"
            className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        {/* Doses requises */}
        <div className="space-y-2">
          <Label htmlFor="dosesRequises" className="text-slate-700 dark:text-slate-300 font-semibold">Doses requises</Label>
          <Input
            id="dosesRequises"
            type="number"
            min="1"
            value={formData.dosesRequises || ''}
            onChange={(e) => setFormData({ ...formData, dosesRequises: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="Ex: 3"
            className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        {/* Quantité disponible */}
        <div className="space-y-2">
          <Label htmlFor="quantiteDisponible" className="text-slate-700 dark:text-slate-300 font-semibold">Quantité disponible</Label>
          <Input
            id="quantiteDisponible"
            type="number"
            min="0"
            value={formData.quantiteDisponible || ''}
            onChange={(e) => setFormData({ ...formData, quantiteDisponible: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="Ex: 500"
            className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>

        {/* Dosage */}
        <div className="space-y-2">
          <Label htmlFor="dosage" className="text-slate-700 dark:text-slate-300 font-semibold">Dosage</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            placeholder="Ex: 0.5 ml"
            className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 font-semibold">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description du vaccin..."
          rows={3}
          className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
        />
      </div>

      {/* Effets secondaires */}
      <div className="space-y-2">
        <Label htmlFor="effetsSecondaires" className="text-slate-700 dark:text-slate-300 font-semibold">Effets secondaires possibles</Label>
        <Textarea
          id="effetsSecondaires"
          value={formData.effetsSecondaires}
          onChange={(e) => setFormData({ ...formData, effetsSecondaires: e.target.value })}
          placeholder="Liste des effets secondaires possibles..."
          rows={2}
          className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
        />
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" className="border-slate-300 dark:border-slate-700" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md" disabled={isLoading}>
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-6 -mx-6 -mt-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Syringe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{vaccin.nom}</h2>
              <p className="text-blue-100 text-sm mt-1">{vaccin.fabricant || 'Fabricant non spécifié'}</p>
            </div>
          </div>
        </div>

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
      {/* Page Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 px-6 py-12 sm:px-8 lg:px-12 shadow-2xl rounded-lg mb-8">
        <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">Gestion des Vaccins</h1>
        <p className="text-lg text-blue-50 font-medium mt-2 drop-shadow">Gérez le catalogue des vaccins disponibles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Vaccins</CardTitle>
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
              <Syringe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-blue-700">{stats.total}</div>
            <p className="text-xs text-blue-600/70 font-semibold mt-1">Types de vaccins</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-slate-900 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Expire bientôt</CardTitle>
            <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-orange-700">{stats.expiringSoon}</div>
            <p className="text-xs text-orange-600/70 font-semibold mt-1">3 prochains mois</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-slate-900 border-red-200 dark:border-red-800 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Expirés</CardTitle>
            <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-red-700">{stats.expired}</div>
            <p className="text-xs text-red-600/70 font-semibold mt-1">À retirer du stock</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-slate-900 border-green-200 dark:border-green-800 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Stock faible</CardTitle>
            <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-green-700">{stats.lowStock}</div>
            <p className="text-xs text-green-600/70 font-semibold mt-1">{"< 50 doses"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card className="mb-6 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
              <Input
                placeholder="Rechercher par nom, fabricant, n° lot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
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

              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md" onClick={() => setIsCreateModalOpen(true)}>
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
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un vaccin
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-6 -mx-6 -mt-6 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">Ajouter un nouveau vaccin</h2>
                <p className="text-blue-100 text-sm mt-1">Remplissez les informations du vaccin</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <VaccinForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateModalOpen(false)}
              isLoading={createVaccinMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-6 -mx-6 -mt-6 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Pencil className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">Modifier le vaccin</h2>
                <p className="text-blue-100 text-sm mt-1">Modifiez les informations du vaccin</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <VaccinForm
              vaccin={selectedVaccin}
              onSubmit={handleUpdate}
              onCancel={() => { setIsEditModalOpen(false); setSelectedVaccin(null); }}
              isLoading={updateVaccinMutation.isPending}
            />
          </div>
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
