import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Baby,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  UserPlus,
  Eye,
  LayoutGrid,
  List,
  Loader2,
  AlertCircle,
  Droplets,
  Globe,
  Home
} from 'lucide-react';
import { ShieldAlert, ShieldCheck, ShieldQuestion, Activity } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

import {
  usePredictRisk,
  mapParentToPredictionInput,
  getRiskStyle,
  type PredictionResult,
} from '@/services/prediction.service';

import { 
  useAllUsers, 
  useCreateParent, 
  useUpdateUser, 
  useDeleteUser,
  useAllEnfants,
  useDeleteEnfant,
  useUserByEmail
} from '@/services/user.service';
import { useDecodedToken } from '@/contexts/decoded-token-context';
import { 
  type UtilisateurDTO, 
  type SaveParentDTO, 
  type UpdateUtilisateurDTO,
  type EnfantDTO,
  type SaveEnfantDTO,
  GroupeSanguinValues,
  type GroupeSanguinEnum,
  Sexe,
  type SexeEnum,
  StatutMatrimonialValues,
  LangueMaternelleValues,
  NiveauInstructionValues,
  NiveauEtudeValues,
  ZoneResidenceValues,
  NiveauRevenuValues,
  UserRole
} from '@/types/user';

// ================================
// COMPOSANT ENFANT CARD
// ================================
interface EnfantCardProps {
  enfant: EnfantDTO;
  onEdit: (enfant: EnfantDTO) => void;
  onDelete: (enfant: EnfantDTO) => void;
  onView: (enfant: EnfantDTO) => void;
}

const EnfantCard: React.FC<EnfantCardProps> = ({ enfant, onEdit, onDelete, onView }) => {
  const getAge = (dateNaissance?: string | null) => {
    if (!dateNaissance) return null;
    const birth = new Date(dateNaissance);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (months < 12) return `${months} mois`;
    const years = Math.floor(months / 12);
    return `${years} an${years > 1 ? 's' : ''}`;
  };

  const getSexeColor = (sexe?: SexeEnum) => {
    if (sexe === 'MASCULIN') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (sexe === 'FEMININ') return 'bg-pink-100 text-pink-700 border-pink-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 hover:border-primary/30 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-offset-1 ring-slate-100">
          <AvatarFallback className={`text-sm font-medium ${enfant.sexe === 'MASCULIN' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
            {enfant.prenom?.[0]}{enfant.nom?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-slate-900">{enfant.prenom} {enfant.nom}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {enfant.dateNaissance && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {getAge(enfant.dateNaissance)}
              </span>
            )}
            {enfant.sexe && (
              <Badge variant="outline" className={`text-xs px-1.5 py-0 ${getSexeColor(enfant.sexe)}`}>
                {enfant.sexe === 'MASCULIN' ? 'Garçon' : 'Fille'}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(enfant)}>
                <Eye className="h-4 w-4 text-slate-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voir les détails</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(enfant)}>
                <Edit className="h-4 w-4 text-slate-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Modifier</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => onDelete(enfant)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Supprimer</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

// ================================
// COMPOSANT PARENT CARD
// ================================

// Badge de risque affiché sur chaque carte parent
const RiskPredictionBadge: React.FC<{ parent: UtilisateurDTO }> = ({ parent }) => {
  const predictMutation = usePredictRisk();
  const [result, setResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    const input = mapParentToPredictionInput(parent);
    if (input && !result && !predictMutation.isPending) {
      predictMutation.mutate(input, {
        onSuccess: (data) => setResult(data),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parent.id]);

  if (!mapParentToPredictionInput(parent)) return null;

  if (predictMutation.isPending) {
    return (
      <Badge variant="outline" className="text-xs gap-1 animate-pulse bg-slate-50">
        <Loader2 className="h-3 w-3 animate-spin" />
        Analyse...
      </Badge>
    );
  }

  if (!result) return null;

  const style = getRiskStyle(result.prediction);
  const Icon = result.prediction === 'Haut risque' ? ShieldAlert 
    : result.prediction === 'Risque modéré' ? ShieldQuestion 
    : ShieldCheck;

  return (
    <Badge variant="outline" className={`text-xs gap-1 ${style.badgeBg}`}>
      <Icon className={`h-3 w-3 ${style.iconColor}`} />
      {result.prediction}
    </Badge>
  );
};

interface ParentCardProps {
  parent: UtilisateurDTO;
  enfants: EnfantDTO[];
  onEdit: (parent: UtilisateurDTO) => void;
  onDelete: (parent: UtilisateurDTO) => void;
  onView: (parent: UtilisateurDTO) => void;
  onAddEnfant: (parent: UtilisateurDTO) => void;
  onEditEnfant: (enfant: EnfantDTO) => void;
  onDeleteEnfant: (enfant: EnfantDTO) => void;
  onViewEnfant: (enfant: EnfantDTO) => void;
}

const ParentCard: React.FC<ParentCardProps> = ({ 
  parent, 
  enfants, 
  onEdit, 
  onDelete, 
  onView,
  onAddEnfant,
  onEditEnfant,
  onDeleteEnfant,
  onViewEnfant
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-900">
      {/* Header avec gradient bleu professionnel */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-14 w-14 border-3 border-white shadow-lg">
              <AvatarFallback className="bg-white text-blue-600 font-bold text-lg">
                {parent.prenom?.[0]}{parent.nom?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-white min-w-0">
              <p className="font-bold text-lg leading-none">{parent.prenom} {parent.nom}</p>
              <p className="text-sm text-blue-100 mt-1">
                {parent.age ? `${parent.age} ans` : 'Âge non renseigné'}
              </p>
              {parent.statutMatrimonial && (
                <Badge className="mt-1 bg-white/20 text-white border-white/30 text-xs">
                  {parent.statutMatrimonial}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700/50 h-8 w-8" onClick={() => onView(parent)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voir détails</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700/50 h-8 w-8" onClick={() => onEdit(parent)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Modifier</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-red-500/50 h-8 w-8" onClick={() => onDelete(parent)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Supprimer</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-5">
        {/* Infos essentielles */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">Informations</p>
          
          <div className="space-y-2">
            {parent.telephone && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Téléphone</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{parent.telephone}</p>
                </div>
              </div>
            )}

            {parent.email && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Email</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{parent.email}</p>
                </div>
              </div>
            )}

            {parent.adresse && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Adresse</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{parent.adresse}</p>
                </div>
              </div>
            )}

            {(parent.groupeSanguin || parent.langueMaternelle) && (
              <div className="flex gap-2">
                {parent.groupeSanguin && (
                  <div className="flex-1 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <Droplets className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Groupe sanguin</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{parent.groupeSanguin}</p>
                    </div>
                  </div>
                )}
                {parent.langueMaternelle && (
                  <div className="flex-1 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Langue</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{parent.langueMaternelle}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {parent.zoneResidence && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <Home className="h-4 w-4 text-teal-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Zone Résidence</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{parent.zoneResidence}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Évaluation de risque */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">Évaluation</span>
          <RiskPredictionBadge parent={parent} />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-blue-800"></div>

        {/* Section Enfants */}
        <div>
          <button 
            className="flex items-center justify-between w-full text-left hover:bg-blue-50 dark:hover:bg-blue-950/20 -mx-2 px-2 py-2 rounded-md transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-2">
              <Baby className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Enfants</span>
              <Badge className="ml-1 h-5 px-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                {enfants.length}
              </Badge>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-blue-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-blue-400" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2">
              {enfants.length > 0 ? (
                enfants.map((enfant) => (
                  <EnfantCard 
                    key={enfant.id} 
                    enfant={enfant}
                    onEdit={onEditEnfant}
                    onDelete={onDeleteEnfant}
                    onView={onViewEnfant}
                  />
                ))
              ) : (
                <div className="text-center py-4 text-slate-500 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Baby className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Aucun enfant enregistré</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer avec bouton Ajouter enfant */}
      <CardFooter className="bg-blue-50 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-800 p-3">
        <Button 
          variant="outline" 
          className="w-full gap-2 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
          onClick={() => onAddEnfant(parent)}
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un enfant
        </Button>
      </CardFooter>
    </Card>
  );
};

// ================================
// COMPOSANT SKELETON LOADING
// ================================
const ParentCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="bg-blue-600 p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
    <CardContent className="p-6 space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <CardFooter className="bg-blue-50 border-t p-3">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

// ================================
// FORMULAIRE PARENT
// ================================
interface ParentFormData {
  prenom: string;
  nom: string;
  telephone: string;
  password?: string;
  email?: string;
  age?: number;
  statutMatrimonial?: string;
  adresse?: string;
  groupeSanguin?: GroupeSanguinEnum;
  profession?: string;
  niveauEtude?: string;
  allergies?: string;
  antecedentsMedicaux?: string;
  nomTuteur1?: string;
  prenomTuteur1?: string;
  numeroTuteur1?: string;
  nomTuteur2?: string;
  prenomTuteur2?: string;
  numeroTuteur2?: string;
  langueMaternelle?: string;
  niveauInstruction?: string;
  nombre_enfants?: number;
  retard_vaccinal?: string;
  distance_centre_sante?: number;
  acces_transport?: string;
  zoneResidence?: string;
  niveauRevenu?: string;
}

const initialParentForm: ParentFormData = {
  prenom: '',
  nom: '',
  telephone: '',
  password: '',
  email: '',
  age: undefined,
  statutMatrimonial: '',
  adresse: '',
  groupeSanguin: undefined,
  profession: '',
  niveauEtude: '',
  allergies: '',
  antecedentsMedicaux: '',
  langueMaternelle: '',
  niveauInstruction: '',
  nombre_enfants: undefined,
  retard_vaccinal: '',
  distance_centre_sante: undefined,
  acces_transport: '',
  zoneResidence: '',
  niveauRevenu: '',
};

// ================================
// FORMULAIRE ENFANT
// ================================
interface EnfantFormData {
  prenom: string;
  nom: string;
  dateNaissance?: string;
  sexe?: SexeEnum;
  lieuNaissance?: string;
  allergies?: string;
  antecedentsMedicaux?: string;
  groupeSanguin?: GroupeSanguinEnum;
  poids?: number;
  taille?: number;
}

const initialEnfantForm: EnfantFormData = {
  prenom: '',
  nom: '',
  dateNaissance: '',
  sexe: undefined,
  lieuNaissance: '',
  allergies: '',
  antecedentsMedicaux: '',
  groupeSanguin: undefined,
  poids: undefined,
  taille: undefined,
};

const normalizeRole = (role?: string | null) => (role || '').replace(/^ROLE_/, '').toUpperCase();

type InfirmierOwnedIds = {
  parentIds: number[];
  enfantIds: number[];
  appointmentIds: number[];
  vaccinationIds: number[];
};

const INFIRMIER_OWNERSHIP_PREFIX = 'infirmier-owned-records:';

const readInfirmierOwnedIds = (email?: string | null): InfirmierOwnedIds => {
  if (!email) {
    return { parentIds: [], enfantIds: [], appointmentIds: [], vaccinationIds: [] };
  }
  try {
    const raw = localStorage.getItem(`${INFIRMIER_OWNERSHIP_PREFIX}${email.toLowerCase()}`);
    if (!raw) {
      return { parentIds: [], enfantIds: [], appointmentIds: [], vaccinationIds: [] };
    }
    const parsed = JSON.parse(raw) as Partial<InfirmierOwnedIds>;
    return {
      parentIds: Array.isArray(parsed.parentIds) ? parsed.parentIds : [],
      enfantIds: Array.isArray(parsed.enfantIds) ? parsed.enfantIds : [],
      appointmentIds: Array.isArray(parsed.appointmentIds) ? parsed.appointmentIds : [],
      vaccinationIds: Array.isArray(parsed.vaccinationIds) ? parsed.vaccinationIds : [],
    };
  } catch {
    return { parentIds: [], enfantIds: [], appointmentIds: [], vaccinationIds: [] };
  }
};

const addOwnedId = (email: string | undefined, key: keyof InfirmierOwnedIds, id: number | null | undefined) => {
  if (!email || !id) return;
  const existing = readInfirmierOwnedIds(email);
  if (!existing[key].includes(id)) {
    const next = { ...existing, [key]: [...existing[key], id] };
    localStorage.setItem(`${INFIRMIER_OWNERSHIP_PREFIX}${email.toLowerCase()}`, JSON.stringify(next));
  }
};

// ================================
// HOOK DYNAMIQUE POUR CRÉER UN ENFANT
// ================================
const useCreateEnfantDynamic = () => {
  const queryClient = useQueryClient();
  
  return useMutation<EnfantDTO, Error, SaveEnfantDTO & { parentId: number }>({
    mutationFn: async (variables: SaveEnfantDTO & { parentId: number }) => {
      const { parentId, ...enfantData } = variables;
      const url = `/api/v1/users/enfants?parentId=${parentId}`;
      const response = await apiClient.post<EnfantDTO>(url, enfantData, { timeout: 15000 });
      const responseData = response.data as any;
      if (responseData && typeof responseData === 'object' && 'data' in responseData && 'status' in responseData) {
        return responseData.data as EnfantDTO;
      }
      return responseData as EnfantDTO;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enfants', 'list'] });
    }
  });
};

// ================================
// COMPOSANT PRINCIPAL
// ================================
const PatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { decodedToken } = useDecodedToken();

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [createdParent, setCreatedParent] = useState<UtilisateurDTO | null>(null);
  const [isRiskDialogOpen, setIsRiskDialogOpen] = useState(false);
  
  // Modals
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isEnfantModalOpen, setIsEnfantModalOpen] = useState(false);
  const [isViewParentModalOpen, setIsViewParentModalOpen] = useState(false);
  const [isViewEnfantModalOpen, setIsViewEnfantModalOpen] = useState(false);
  const [isDeleteParentDialogOpen, setIsDeleteParentDialogOpen] = useState(false);
  const [isDeleteEnfantDialogOpen, setIsDeleteEnfantDialogOpen] = useState(false);
  
  // Selected items
  const [selectedParent, setSelectedParent] = useState<UtilisateurDTO | null>(null);
  const [selectedEnfant, setSelectedEnfant] = useState<EnfantDTO | null>(null);
  const [parentForNewEnfant, setParentForNewEnfant] = useState<UtilisateurDTO | null>(null);
  
  // Forms
  const [parentForm, setParentForm] = useState<ParentFormData>(initialParentForm);
  const [enfantForm, setEnfantForm] = useState<EnfantFormData>(initialEnfantForm);
  const [isEditingParent, setIsEditingParent] = useState(false);
  const [isEditingEnfant, setIsEditingEnfant] = useState(false);

  // Utilisateur connecté (réel) pour filtrage par rôle/centre
  const { data: currentUser } = useUserByEmail(decodedToken?.sub || '');
  const centreId = currentUser?.centre?.id ?? 0;
  const normalizedRole = normalizeRole(decodedToken?.role);
  const isInfirmier = normalizedRole === 'INFIRMIER';

  // API Hooks
  const { data: usersData, isLoading: isLoadingUsers, error: usersError, refetch: refetchUsers } = useAllUsers();
  const { data: enfantsData, isLoading: isLoadingEnfants, refetch: refetchEnfants } = useAllEnfants();
  const ownedIds = useMemo(() => readInfirmierOwnedIds(decodedToken?.sub), [decodedToken?.sub, usersData, enfantsData]);
  const currentCentreId = currentUser?.centre?.id != null ? Number(currentUser.centre.id) : null;
  
  const createParentMutation = useCreateParent(centreId);
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const deleteEnfantMutation = useDeleteEnfant();

  // Récupération des parents uniquement
  const parents = useMemo(() => {
    const users = Array.isArray(usersData) ? usersData : [];
    const allParents = users.filter(user => user.userRole === UserRole.PARENT);
    if (isInfirmier) {
      if (ownedIds.parentIds.length > 0) {
        return allParents.filter((p) => p.id != null && ownedIds.parentIds.includes(Number(p.id)));
      }
      // Fallback pour comptes existants: parents du même centre que l'infirmier.
      if (currentCentreId != null) {
        return allParents.filter((p) => p.centre?.id != null && Number(p.centre.id) === currentCentreId);
      }
      return [];
    }
    return allParents;
  }, [usersData, isInfirmier, ownedIds.parentIds, currentCentreId]);

  // Tous les enfants
  const allEnfants = useMemo(() => {
    const enfants = Array.isArray(enfantsData) ? enfantsData : [];
    if (isInfirmier) {
      const visibleParentIds = parents.map((p) => Number(p.id)).filter((id) => Number.isFinite(id));
      return enfants.filter((enfant) => {
        const enfantId = enfant.id != null ? Number(enfant.id) : null;
        const parentId = enfant.parent?.id != null ? Number(enfant.parent.id) : null;
        return (
          (enfantId != null && ownedIds.enfantIds.includes(enfantId)) ||
          (parentId != null && (ownedIds.parentIds.includes(parentId) || visibleParentIds.includes(parentId)))
        );
      });
    }
    return enfants;
  }, [enfantsData, isInfirmier, ownedIds.enfantIds, ownedIds.parentIds, parents]);

  // Fonction pour obtenir les enfants d'un parent
  const getEnfantsForParent = useCallback((parentId: number | null) => {
    if (!parentId) return [];
    return allEnfants.filter(enfant => enfant.parent?.id === parentId);
  }, [allEnfants]);

  // Parents filtrés
  const filteredParents = useMemo(() => {
    return parents.filter(parent => {
      // Filtre recherche
      const searchMatch = 
        parent.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.telephone?.includes(searchTerm) ||
        parent.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre statut
      const statutMatch = filterStatut === 'all' || parent.statutMatrimonial === filterStatut;
      
      return searchMatch && statutMatch;
    });
  }, [parents, searchTerm, filterStatut]);

  // ================================
  // HANDLERS PARENT
  // ================================
  const handleOpenCreateParent = () => {
    setParentForm(initialParentForm);
    setSelectedParent(null);
    setIsEditingParent(false);
    setIsParentModalOpen(true);
  };

  const handleOpenEditParent = (parent: UtilisateurDTO) => {
    setSelectedParent(parent);
    setParentForm({
      prenom: parent.prenom || '',
      nom: parent.nom || '',
      telephone: parent.telephone || '',
      email: parent.email || '',
      age: parent.age || undefined,
      statutMatrimonial: parent.statutMatrimonial || '',
      adresse: parent.adresse || '',
      groupeSanguin: parent.groupeSanguin || undefined,
      profession: parent.profession || '',
      niveauEtude: parent.niveauEtude || '',
      allergies: parent.allergies || '',
      antecedentsMedicaux: parent.antecedentsMedicaux || '',
      nomTuteur1: parent.nomTuteur1 || '',
      prenomTuteur1: parent.prenomTuteur1 || '',
      numeroTuteur1: parent.numeroTuteur1 || '',
      nomTuteur2: parent.nomTuteur2 || '',
      prenomTuteur2: parent.prenomTuteur2 || '',
      numeroTuteur2: parent.numeroTuteur2 || '',
      langueMaternelle: parent.langueMaternelle || '',
      niveauInstruction: parent.niveauInstruction || '',
      nombre_enfants: parent.nombre_enfants || undefined,
      retard_vaccinal: parent.retard_vaccinal || '',
      distance_centre_sante: parent.distance_centre_sante || undefined,
      acces_transport: parent.acces_transport || '',
      zoneResidence: parent.zoneResidence || '',
      niveauRevenu: parent.niveauRevenu || '',
    });
    setIsEditingParent(true);
    setIsParentModalOpen(true);
  };

  const handleViewParent = (parent: UtilisateurDTO) => {
    setSelectedParent(parent);
    setIsViewParentModalOpen(true);
  };

  const handleDeleteParent = (parent: UtilisateurDTO) => {
    setSelectedParent(parent);
    setIsDeleteParentDialogOpen(true);
  };

  const handleConfirmDeleteParent = async () => {
    if (!selectedParent?.id) return;
    
    try {
      await deleteUserMutation.mutateAsync(selectedParent.id);
      toast.success('Parent supprimé avec succès');
      setIsDeleteParentDialogOpen(false);
      setSelectedParent(null);
      refetchUsers();
      refetchEnfants();
    } catch (error) {
      toast.error('Erreur lors de la suppression du parent');
      console.error(error);
    }
  };

  const handleSubmitParent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!parentForm.prenom || !parentForm.nom || !parentForm.telephone) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    if (!isEditingParent && !parentForm.password) {
      toast.error('Veuillez saisir un mot de passe');
      return;
    }

    try {
      if (isEditingParent && selectedParent?.id) {
        const updateData: UpdateUtilisateurDTO & { id: number } = {
          id: selectedParent.id,
          prenom: parentForm.prenom,
          nom: parentForm.nom,
          telephone: parentForm.telephone,
          email: parentForm.email,
          age: parentForm.age,
          statutMatrimonial: parentForm.statutMatrimonial,
          adresse: parentForm.adresse,
          groupeSanguin: parentForm.groupeSanguin,
          profession: parentForm.profession,
          niveauEtude: parentForm.niveauEtude,
          allergies: parentForm.allergies,
          antecedentsMedicaux: parentForm.antecedentsMedicaux,
          nomTuteur1: parentForm.nomTuteur1,
          prenomTuteur1: parentForm.prenomTuteur1,
          numeroTuteur1: parentForm.numeroTuteur1,
          nomTuteur2: parentForm.nomTuteur2,
          prenomTuteur2: parentForm.prenomTuteur2,
          numeroTuteur2: parentForm.numeroTuteur2,
          langueMaternelle: parentForm.langueMaternelle,
          niveauInstruction: parentForm.niveauInstruction,
          nombre_enfants: parentForm.nombre_enfants,
          retard_vaccinal: parentForm.retard_vaccinal,
          distance_centre_sante: parentForm.distance_centre_sante,
          acces_transport: parentForm.acces_transport,
          zoneResidence: parentForm.zoneResidence,
          niveauRevenu: parentForm.niveauRevenu,
        };
        await updateUserMutation.mutateAsync(updateData);
        toast.success('Parent modifié avec succès');
      } else {
        if (!centreId) {
          toast.error('Centre utilisateur introuvable. Veuillez vous reconnecter.');
          return;
        }
        const createData: SaveParentDTO = {
          prenom: parentForm.prenom,
          nom: parentForm.nom,
          telephone: parentForm.telephone,
          password: parentForm.password,
          email: parentForm.email,
          age: parentForm.age,
          statutMatrimonial: parentForm.statutMatrimonial,
          adresse: parentForm.adresse,
          groupeSanguin: parentForm.groupeSanguin,
          profession: parentForm.profession,
          niveauEtude: parentForm.niveauEtude,
          allergies: parentForm.allergies,
          antecedentsMedicaux: parentForm.antecedentsMedicaux,
          nomTuteur1: parentForm.nomTuteur1,
          prenomTuteur1: parentForm.prenomTuteur1,
          numeroTuteur1: parentForm.numeroTuteur1,
          nomTuteur2: parentForm.nomTuteur2,
          prenomTuteur2: parentForm.prenomTuteur2,
          numeroTuteur2: parentForm.numeroTuteur2,
          langueMaternelle: parentForm.langueMaternelle,
          niveauInstruction: parentForm.niveauInstruction,
          nombre_enfants: parentForm.nombre_enfants,
          retard_vaccinal: parentForm.retard_vaccinal,
          distance_centre_sante: parentForm.distance_centre_sante,
          acces_transport: parentForm.acces_transport,
          zoneResidence: parentForm.zoneResidence,
          niveauRevenu: parentForm.niveauRevenu,
        };
        const newParent = await createParentMutation.mutateAsync(createData);
        toast.success('Parent créé avec succès');
        addOwnedId(decodedToken?.sub, 'parentIds', newParent?.id ?? null);

        // Ouvrir le dialog de prédiction si les données le permettent
        if (newParent) {
          setCreatedParent(newParent as unknown as UtilisateurDTO);
          setIsRiskDialogOpen(true);
        }
      }
      
      setIsParentModalOpen(false);
      setParentForm(initialParentForm);
      setSelectedParent(null);
      refetchUsers();
    } catch (error) {
      toast.error(isEditingParent ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      console.error(error);
    }
  };

  // ================================
  // HANDLERS ENFANT
  // ================================
  const handleOpenAddEnfant = (parent: UtilisateurDTO) => {
    setParentForNewEnfant(parent);
    setEnfantForm(initialEnfantForm);
    setSelectedEnfant(null);
    setIsEditingEnfant(false);
    setIsEnfantModalOpen(true);
  };

  const handleOpenEditEnfant = (enfant: EnfantDTO) => {
    setSelectedEnfant(enfant);
    setParentForNewEnfant(enfant.parent || null);
    setEnfantForm({
      prenom: enfant.prenom || '',
      nom: enfant.nom || '',
      dateNaissance: enfant.dateNaissance || '',
      sexe: enfant.sexe,
      lieuNaissance: enfant.lieuNaissance || '',
      allergies: enfant.allergies || '',
      antecedentsMedicaux: enfant.antecedentsMedicaux || '',
      groupeSanguin: enfant.groupeSanguin || undefined,
      poids: enfant.poids || undefined,
      taille: enfant.taille || undefined,
    });
    setIsEditingEnfant(true);
    setIsEnfantModalOpen(true);
  };

  const handleViewEnfant = (enfant: EnfantDTO) => {
    setSelectedEnfant(enfant);
    setIsViewEnfantModalOpen(true);
  };

  const handleDeleteEnfant = (enfant: EnfantDTO) => {
    setSelectedEnfant(enfant);
    setIsDeleteEnfantDialogOpen(true);
  };

  const handleConfirmDeleteEnfant = async () => {
    if (!selectedEnfant?.id) return;
    
    try {
      await deleteEnfantMutation.mutateAsync(selectedEnfant.id);
      toast.success('Enfant supprimé avec succès');
      setIsDeleteEnfantDialogOpen(false);
      setSelectedEnfant(null);
      refetchEnfants();
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'enfant');
      console.error(error);
    }
  };

  // Hook pour créer un enfant avec le parentId dynamique
  const createEnfantMutation = useCreateEnfantDynamic();

  const handleSubmitEnfant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enfantForm.prenom || !enfantForm.nom) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      if (isEditingEnfant && selectedEnfant?.id) {
        // Pour la mise à jour, on utiliserait useUpdateEnfant
        // Mais ce hook n'est pas importé ici, on va l'ajouter
        toast.info('La modification des enfants sera bientôt disponible');
      } else if (parentForNewEnfant?.id) {
        const createData: SaveEnfantDTO & { parentId: number } = {
          prenom: enfantForm.prenom,
          nom: enfantForm.nom,
          dateNaissance: enfantForm.dateNaissance,
          sexe: enfantForm.sexe,
          lieuNaissance: enfantForm.lieuNaissance,
          allergies: enfantForm.allergies,
          antecedentsMedicaux: enfantForm.antecedentsMedicaux,
          groupeSanguin: enfantForm.groupeSanguin,
          poids: enfantForm.poids,
          taille: enfantForm.taille,
          parentId: parentForNewEnfant.id,
        };
        const enfantResult = await createEnfantMutation.mutateAsync(createData);
        toast.success('Enfant ajouté avec succès');
        addOwnedId(decodedToken?.sub, 'enfantIds', enfantResult?.id ?? null);
      }
      
      setIsEnfantModalOpen(false);
      setEnfantForm(initialEnfantForm);
      setSelectedEnfant(null);
      setParentForNewEnfant(null);
      refetchEnfants();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'enfant');
      console.error(error);
    }
  };

  // Stats
  const stats = useMemo(() => ({
    totalParents: parents.length,
    totalEnfants: allEnfants.length,
    avgEnfantsPerParent: parents.length > 0 ? (allEnfants.length / parents.length).toFixed(1) : '0',
  }), [parents, allEnfants]);

  // Loading state
  if (isLoadingUsers || isLoadingEnfants) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 px-6 py-12 sm:px-8 lg:px-12 shadow-2xl">
          <Skeleton className="h-12 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <ParentCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (usersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 px-6 py-12 sm:px-8 lg:px-12 shadow-2xl">
          <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">Gestion des Parents</h1>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardContent className="flex items-center gap-4 p-6">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-300">Erreur de chargement</h3>
                <p className="text-red-600 dark:text-red-400">Impossible de charger les données des parents.</p>
                <Button variant="outline" className="mt-2" onClick={() => refetchUsers()}>
                  Réessayer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Header Magnifique */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 px-6 py-12 sm:px-8 lg:px-12 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 drop-shadow-lg">
                Gestion des Parents
              </h1>
              <p className="text-lg text-blue-50 font-medium drop-shadow">
                Gérez les dossiers des parents et de leurs enfants
              </p>
            </div>
            <Button 
              onClick={handleOpenCreateParent}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg ml-4 hidden sm:flex"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau Parent
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-12">

        {/* Cartes statistiques */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="group relative bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">Total Parents</CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-blue-700 dark:text-blue-300">{stats.totalParents}</div>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2 font-medium">Parents enregistrés</p>
            </CardContent>
          </Card>

          <Card className="group relative bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/30 dark:to-slate-900 border-pink-200 dark:border-pink-800 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-pink-700 dark:text-pink-400 uppercase tracking-widest">Total Enfants</CardTitle>
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <Baby className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-pink-700 dark:text-pink-300">{stats.totalEnfants}</div>
              <p className="text-xs text-pink-600/70 dark:text-pink-400/70 mt-2 font-medium">Enfants enregistrés</p>
            </CardContent>
          </Card>

          <Card className="group relative bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-slate-900 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">Moyenne Enfants</CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-green-700 dark:text-green-300">{stats.avgEnfantsPerParent}</div>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-2 font-medium">Par parent</p>
            </CardContent>
          </Card>
        </div>

      {/* Barre d'actions */}
      <Card className="mb-6 bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
              <Input
                placeholder="Rechercher un parent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200"
              />
            </div>

            {/* Filtres et actions */}
            <div className="flex flex-wrap gap-2 justify-end">
              <Select value={filterStatut} onValueChange={setFilterStatut}>
                <SelectTrigger className="w-[180px] border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {StatutMatrimonialValues.map(statut => (
                    <SelectItem key={statut} value={statut}>{statut}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex border border-blue-200 dark:border-blue-800 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none border-blue-200 dark:border-blue-800"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none border-blue-200 dark:border-blue-800"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {!searchTerm && filterStatut === 'all' && (
                <Button 
                  onClick={handleOpenCreateParent}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Parent
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parents Grid/List */}
      {isLoadingUsers ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ParentCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredParents.length === 0 ? (
        <Card className="p-12 border-dashed border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Users className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Aucun parent trouvé</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {searchTerm || filterStatut !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : isInfirmier
                    ? 'Aucun parent n’a été créé pour le moment sur votre espace'
                    : 'Commencez par ajouter un nouveau parent'}
              </p>
            </div>
            {!searchTerm && filterStatut === 'all' && (
              <Button onClick={handleOpenCreateParent} className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un parent
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }>
          {filteredParents.map((parent) => (
            <ParentCard
              key={parent.id}
              parent={parent}
              enfants={getEnfantsForParent(parent.id)}
              onEdit={handleOpenEditParent}
              onDelete={handleDeleteParent}
              onView={handleViewParent}
              onAddEnfant={handleOpenAddEnfant}
              onEditEnfant={handleOpenEditEnfant}
              onDeleteEnfant={handleDeleteEnfant}
              onViewEnfant={handleViewEnfant}
            />
          ))}
        </div>
      )}
      </div>

      {/* Modal Création/Modification Parent */}
      <Dialog open={isParentModalOpen} onOpenChange={setIsParentModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-0">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-6 -mx-6 -mt-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{isEditingParent ? 'Modifier le parent' : 'Nouveau parent'}</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {isEditingParent 
                    ? 'Modifiez les informations du parent'
                    : 'Remplissez les informations pour créer un nouveau parent'}
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmitParent}>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <TabsTrigger value="general" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Général</TabsTrigger>
                <TabsTrigger value="medical" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Médical</TabsTrigger>
                <TabsTrigger value="tuteurs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Tuteurs</TabsTrigger>
                <TabsTrigger value="prediction" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Prédiction</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom" className="text-slate-700 dark:text-slate-300 font-semibold">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={parentForm.prenom}
                      onChange={(e) => setParentForm({...parentForm, prenom: e.target.value})}
                      placeholder="Prénom"
                      required
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom" className="text-slate-700 dark:text-slate-300 font-semibold">Nom *</Label>
                    <Input
                      id="nom"
                      value={parentForm.nom}
                      onChange={(e) => setParentForm({...parentForm, nom: e.target.value})}
                      placeholder="Nom"
                      required
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telephone" className="text-slate-700 dark:text-slate-300 font-semibold">Téléphone *</Label>
                    <Input
                      id="telephone"
                      value={parentForm.telephone}
                      onChange={(e) => setParentForm({...parentForm, telephone: e.target.value})}
                      placeholder="Téléphone"
                      required
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={parentForm.email}
                      onChange={(e) => setParentForm({...parentForm, email: e.target.value})}
                      placeholder="Email"
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                </div>

                {!isEditingParent && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold">Mot de passe *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={parentForm.password || ''}
                      onChange={(e) => setParentForm({...parentForm, password: e.target.value})}
                      placeholder="Mot de passe"
                      required
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-slate-700 dark:text-slate-300 font-semibold">Âge</Label>
                    <Input
                      id="age"
                      type="number"
                      value={parentForm.age || ''}
                      onChange={(e) => setParentForm({...parentForm, age: e.target.value ? parseInt(e.target.value) : undefined})}
                      placeholder="Âge"
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statutMatrimonial" className="text-slate-700 dark:text-slate-300 font-semibold">Statut matrimonial</Label>
                    <Select 
                      value={parentForm.statutMatrimonial} 
                      onValueChange={(value) => setParentForm({...parentForm, statutMatrimonial: value})}
                    >
                      <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {StatutMatrimonialValues.map(statut => (
                          <SelectItem key={statut} value={statut}>{statut}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse" className="text-slate-700 dark:text-slate-300 font-semibold">Adresse</Label>
                  <Input
                    id="adresse"
                    value={parentForm.adresse}
                    onChange={(e) => setParentForm({...parentForm, adresse: e.target.value})}
                    placeholder="Adresse complète"
                    className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profession" className="text-slate-700 dark:text-slate-300 font-semibold">Profession</Label>
                    <Input
                      id="profession"
                      value={parentForm.profession}
                      onChange={(e) => setParentForm({...parentForm, profession: e.target.value})}
                      placeholder="Profession"
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="niveauEtude" className="text-slate-700 dark:text-slate-300 font-semibold">Niveau d'étude</Label>
                    <Select
                      value={parentForm.niveauEtude}
                      onValueChange={(value) => setParentForm({...parentForm, niveauEtude: value})}
                    >
                      <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {NiveauEtudeValues.map(niveau => (
                          <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="langueMaternelle" className="text-slate-700 dark:text-slate-300 font-semibold">Langue maternelle</Label>
                  <Select
                    value={parentForm.langueMaternelle}
                    onValueChange={(value) => setParentForm({...parentForm, langueMaternelle: value})}
                  >
                    <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                      <SelectValue placeholder="Sélectionner la langue" />
                    </SelectTrigger>
                    <SelectContent>
                      {LangueMaternelleValues.map(langue => (
                        <SelectItem key={langue} value={langue}>{langue}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="groupeSanguin" className="text-slate-700 dark:text-slate-300 font-semibold">Groupe sanguin</Label>
                  <Select 
                    value={parentForm.groupeSanguin} 
                    onValueChange={(value) => setParentForm({...parentForm, groupeSanguin: value as GroupeSanguinEnum})}
                  >
                    <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {GroupeSanguinValues.map(groupe => (
                        <SelectItem key={groupe} value={groupe}>{groupe}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies" className="text-slate-700 dark:text-slate-300 font-semibold">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={parentForm.allergies}
                    onChange={(e) => setParentForm({...parentForm, allergies: e.target.value})}
                    placeholder="Liste des allergies connues"
                    rows={3}
                    className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="antecedentsMedicaux" className="text-slate-700 dark:text-slate-300 font-semibold">Antécédents médicaux</Label>
                  <Textarea
                    id="antecedentsMedicaux"
                    value={parentForm.antecedentsMedicaux}
                    onChange={(e) => setParentForm({...parentForm, antecedentsMedicaux: e.target.value})}
                    placeholder="Antécédents médicaux importants"
                    rows={3}
                    className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="tuteurs" className="space-y-4 mt-4">
                <Card className="border-dashed border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Tuteur 1</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Prénom"
                        value={parentForm.prenomTuteur1}
                        onChange={(e) => setParentForm({...parentForm, prenomTuteur1: e.target.value})}
                        className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                      />
                      <Input
                        placeholder="Nom"
                        value={parentForm.nomTuteur1}
                        onChange={(e) => setParentForm({...parentForm, nomTuteur1: e.target.value})}
                        className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                      />
                    </div>
                    <Input
                      placeholder="Numéro de téléphone"
                      value={parentForm.numeroTuteur1}
                      onChange={(e) => setParentForm({...parentForm, numeroTuteur1: e.target.value})}
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </CardContent>
                </Card>

                <Card className="border-dashed border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Tuteur 2</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Prénom"
                        value={parentForm.prenomTuteur2}
                        onChange={(e) => setParentForm({...parentForm, prenomTuteur2: e.target.value})}
                        className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                      />
                      <Input
                        placeholder="Nom"
                        value={parentForm.nomTuteur2}
                        onChange={(e) => setParentForm({...parentForm, nomTuteur2: e.target.value})}
                        className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                      />
                    </div>
                    <Input
                      placeholder="Numéro de téléphone"
                      value={parentForm.numeroTuteur2}
                      onChange={(e) => setParentForm({...parentForm, numeroTuteur2: e.target.value})}
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prediction" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="niveauInstruction" className="text-slate-700 dark:text-slate-300 font-semibold">Niveau d'instruction</Label>
                    <Select
                      value={parentForm.niveauInstruction}
                      onValueChange={(value) => setParentForm({...parentForm, niveauInstruction: value})}
                    >
                      <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {NiveauInstructionValues.map(niveau => (
                          <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre_enfants" className="text-slate-700 dark:text-slate-300 font-semibold">Nombre d'enfants</Label>
                    <Input
                      id="nombre_enfants"
                      type="number"
                      min={0}
                      value={parentForm.nombre_enfants ?? ''}
                      onChange={(e) => setParentForm({...parentForm, nombre_enfants: e.target.value ? parseInt(e.target.value) : undefined})}
                      placeholder="Ex: 3"
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zoneResidence" className="text-slate-700 dark:text-slate-300 font-semibold">Zone de résidence</Label>
                    <Select
                      value={parentForm.zoneResidence}
                      onValueChange={(value) => setParentForm({...parentForm, zoneResidence: value})}
                    >
                      <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {ZoneResidenceValues.map(zone => (
                          <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="niveauRevenu" className="text-slate-700 dark:text-slate-300 font-semibold">Niveau de revenu</Label>
                    <Select
                      value={parentForm.niveauRevenu}
                      onValueChange={(value) => setParentForm({...parentForm, niveauRevenu: value})}
                    >
                      <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {NiveauRevenuValues.map(niveau => (
                          <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance_centre_sante" className="text-slate-700 dark:text-slate-300 font-semibold">Distance centre de santé (km)</Label>
                    <Input
                      id="distance_centre_sante"
                      type="number"
                      step="0.1"
                      min={0}
                      value={parentForm.distance_centre_sante ?? ''}
                      onChange={(e) => setParentForm({...parentForm, distance_centre_sante: e.target.value ? parseFloat(e.target.value) : undefined})}
                      placeholder="Ex: 5.5"
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acces_transport" className="text-slate-700 dark:text-slate-300 font-semibold">Accès au transport</Label>
                    <Select
                      value={parentForm.acces_transport}
                      onValueChange={(value) => setParentForm({...parentForm, acces_transport: value})}
                    >
                      <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oui">Oui</SelectItem>
                        <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retard_vaccinal" className="text-slate-700 dark:text-slate-300 font-semibold">Retard vaccinal</Label>
                  <Select
                    value={parentForm.retard_vaccinal}
                    onValueChange={(value) => setParentForm({...parentForm, retard_vaccinal: value})}
                  >
                    <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oui">Oui</SelectItem>
                      <SelectItem value="Non">Non</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" className="border-slate-300 dark:border-slate-700" onClick={() => setIsParentModalOpen(false)}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md"
                disabled={createParentMutation.isPending || updateUserMutation.isPending}
              >
                {(createParentMutation.isPending || updateUserMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditingParent ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Création/Modification Enfant */}
      <Dialog open={isEnfantModalOpen} onOpenChange={setIsEnfantModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-6 -mx-6 -mt-6 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Baby className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                  {isEditingEnfant ? 'Modifier l\'enfant' : 'Ajouter un enfant'}
                </h2>
                {parentForNewEnfant && (
                  <p className="text-blue-100 text-sm mt-1">
                    Parent : <strong>{parentForNewEnfant.prenom} {parentForNewEnfant.nom}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmitEnfant} className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enfant-prenom" className="text-slate-700 dark:text-slate-300 font-semibold">Prénom *</Label>
                  <Input
                    id="enfant-prenom"
                    value={enfantForm.prenom}
                    onChange={(e) => setEnfantForm({...enfantForm, prenom: e.target.value})}
                    placeholder="Prénom de l'enfant"
                    required
                    className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enfant-nom" className="text-slate-700 dark:text-slate-300 font-semibold">Nom *</Label>
                  <Input
                    id="enfant-nom"
                    value={enfantForm.nom}
                    onChange={(e) => setEnfantForm({...enfantForm, nom: e.target.value})}
                    placeholder="Nom de l'enfant"
                    required
                    className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enfant-dateNaissance" className="text-slate-700 dark:text-slate-300 font-semibold">Date de naissance</Label>
                  <Input
                    id="enfant-dateNaissance"
                    type="date"
                    value={enfantForm.dateNaissance}
                    onChange={(e) => setEnfantForm({...enfantForm, dateNaissance: e.target.value})}
                    className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enfant-sexe" className="text-slate-700 dark:text-slate-300 font-semibold">Sexe</Label>
                  <Select 
                    value={enfantForm.sexe} 
                    onValueChange={(value) => setEnfantForm({...enfantForm, sexe: value as SexeEnum})}
                  >
                    <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Sexe.MASCULIN}>Masculin</SelectItem>
                      <SelectItem value={Sexe.FEMININ}>Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enfant-lieuNaissance" className="text-slate-700 dark:text-slate-300 font-semibold">Lieu de naissance</Label>
                <Input
                  id="enfant-lieuNaissance"
                  value={enfantForm.lieuNaissance}
                  onChange={(e) => setEnfantForm({...enfantForm, lieuNaissance: e.target.value})}
                  placeholder="Lieu de naissance"
                  className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enfant-poids" className="text-slate-700 dark:text-slate-300 font-semibold">Poids (kg)</Label>
                  <Input
                    id="enfant-poids"
                    type="number"
                    step="0.1"
                    value={enfantForm.poids || ''}
                    onChange={(e) => setEnfantForm({...enfantForm, poids: e.target.value ? parseFloat(e.target.value) : undefined})}
                    placeholder="Poids"
                    className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enfant-taille" className="text-slate-700 dark:text-slate-300 font-semibold">Taille (cm)</Label>
                  <Input
                    id="enfant-taille"
                    type="number"
                    step="0.1"
                    value={enfantForm.taille || ''}
                    onChange={(e) => setEnfantForm({...enfantForm, taille: e.target.value ? parseFloat(e.target.value) : undefined})}
                    placeholder="Taille"
                    className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enfant-groupeSanguin" className="text-slate-700 dark:text-slate-300 font-semibold">Groupe sanguin</Label>
                  <Select 
                    value={enfantForm.groupeSanguin} 
                    onValueChange={(value) => setEnfantForm({...enfantForm, groupeSanguin: value as GroupeSanguinEnum})}
                  >
                    <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {GroupeSanguinValues.map(groupe => (
                        <SelectItem key={groupe} value={groupe}>{groupe}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enfant-allergies" className="text-slate-700 dark:text-slate-300 font-semibold">Allergies</Label>
                <Textarea
                  id="enfant-allergies"
                  value={enfantForm.allergies}
                  onChange={(e) => setEnfantForm({...enfantForm, allergies: e.target.value})}
                  placeholder="Liste des allergies connues"
                  rows={2}
                  className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enfant-antecedents" className="text-slate-700 dark:text-slate-300 font-semibold">Antécédents médicaux</Label>
                <Textarea
                  id="enfant-antecedents"
                  value={enfantForm.antecedentsMedicaux}
                  onChange={(e) => setEnfantForm({...enfantForm, antecedentsMedicaux: e.target.value})}
                  placeholder="Antécédents médicaux importants"
                  rows={2}
                  className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" className="border-slate-300 dark:border-slate-700" onClick={() => setIsEnfantModalOpen(false)}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md"
                disabled={createEnfantMutation.isPending}
              >
                {createEnfantMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditingEnfant ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Détails Parent */}
      <Dialog open={isViewParentModalOpen} onOpenChange={setIsViewParentModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Détails du parent
            </DialogTitle>
          </DialogHeader>
          
          {selectedParent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {selectedParent.prenom?.[0]}{selectedParent.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedParent.prenom} {selectedParent.nom}</h3>
                  {selectedParent.statutMatrimonial && (
                    <Badge variant="secondary">{selectedParent.statutMatrimonial}</Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedParent.telephone && (
                  <div>
                    <p className="text-slate-500">Téléphone</p>
                    <p className="font-medium">{selectedParent.telephone}</p>
                  </div>
                )}
                {selectedParent.email && (
                  <div>
                    <p className="text-slate-500">Email</p>
                    <p className="font-medium">{selectedParent.email}</p>
                  </div>
                )}
                {selectedParent.age && (
                  <div>
                    <p className="text-slate-500">Âge</p>
                    <p className="font-medium">{selectedParent.age} ans</p>
                  </div>
                )}
                {selectedParent.adresse && (
                  <div className="col-span-2">
                    <p className="text-slate-500">Adresse</p>
                    <p className="font-medium">{selectedParent.adresse}</p>
                  </div>
                )}
                {selectedParent.profession && (
                  <div>
                    <p className="text-slate-500">Profession</p>
                    <p className="font-medium">{selectedParent.profession}</p>
                  </div>
                )}
                {selectedParent.groupeSanguin && (
                  <div>
                    <p className="text-slate-500">Groupe sanguin</p>
                    <p className="font-medium">{selectedParent.groupeSanguin}</p>
                  </div>
                )}
                {selectedParent.langueMaternelle && (
                  <div>
                    <p className="text-slate-500">Langue maternelle</p>
                    <p className="font-medium">{selectedParent.langueMaternelle}</p>
                  </div>
                )}
                {selectedParent.niveauEtude && (
                  <div>
                    <p className="text-slate-500">Niveau d'étude</p>
                    <p className="font-medium">{selectedParent.niveauEtude}</p>
                  </div>
                )}
                {selectedParent.niveauInstruction && (
                  <div>
                    <p className="text-slate-500">Niveau d'instruction</p>
                    <p className="font-medium">{selectedParent.niveauInstruction}</p>
                  </div>
                )}
                {selectedParent.zoneResidence && (
                  <div>
                    <p className="text-slate-500">Zone de résidence</p>
                    <p className="font-medium">{selectedParent.zoneResidence}</p>
                  </div>
                )}
                {selectedParent.niveauRevenu && (
                  <div>
                    <p className="text-slate-500">Niveau de revenu</p>
                    <p className="font-medium">{selectedParent.niveauRevenu}</p>
                  </div>
                )}
                {selectedParent.nombre_enfants != null && (
                  <div>
                    <p className="text-slate-500">Nombre d'enfants</p>
                    <p className="font-medium">{selectedParent.nombre_enfants}</p>
                  </div>
                )}
                {selectedParent.distance_centre_sante != null && selectedParent.distance_centre_sante > 0 && (
                  <div>
                    <p className="text-slate-500">Distance centre de santé</p>
                    <p className="font-medium">{selectedParent.distance_centre_sante} km</p>
                  </div>
                )}
                {selectedParent.acces_transport && (
                  <div>
                    <p className="text-slate-500">Accès transport</p>
                    <p className="font-medium">{selectedParent.acces_transport}</p>
                  </div>
                )}
                {selectedParent.retard_vaccinal && (
                  <div>
                    <p className="text-slate-500">Retard vaccinal</p>
                    <p className="font-medium">{selectedParent.retard_vaccinal}</p>
                  </div>
                )}
              </div>

              {/* Enfants du parent */}
              <div className="mt-4">
                <h4 className="font-medium flex items-center gap-2 mb-3">
                  <Baby className="h-4 w-4 text-pink-500" />
                  Enfants ({getEnfantsForParent(selectedParent.id).length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {getEnfantsForParent(selectedParent.id).map(enfant => (
                    <div key={enfant.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`text-xs ${enfant.sexe === 'MASCULIN' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                            {enfant.prenom?.[0]}{enfant.nom?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{enfant.prenom} {enfant.nom}</span>
                      </div>
                      {enfant.sexe && (
                        <Badge variant="outline" className="text-xs">
                          {enfant.sexe === 'MASCULIN' ? 'Garçon' : 'Fille'}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {getEnfantsForParent(selectedParent.id).length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">Aucun enfant enregistré</p>
                  )}
                </div>
              </div>

              {/* Bouton Analyse de risque */}
              <Separator />
              <Button
                className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={() => {
                  setIsViewParentModalOpen(false);
                  navigate(`/medecin/prediction-risque?parentId=${selectedParent.id}`);
                }}
              >
                <Activity className="h-4 w-4" />
                Voir l'analyse de risque IA
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Détails Enfant */}
      <Dialog open={isViewEnfantModalOpen} onOpenChange={setIsViewEnfantModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-pink-500" />
              Détails de l'enfant
            </DialogTitle>
          </DialogHeader>
          
          {selectedEnfant && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className={`text-xl font-semibold ${selectedEnfant.sexe === 'MASCULIN' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                    {selectedEnfant.prenom?.[0]}{selectedEnfant.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedEnfant.prenom} {selectedEnfant.nom}</h3>
                  {selectedEnfant.sexe && (
                    <Badge variant="secondary" className={selectedEnfant.sexe === 'MASCULIN' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}>
                      {selectedEnfant.sexe === 'MASCULIN' ? 'Garçon' : 'Fille'}
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedEnfant.dateNaissance && (
                  <div>
                    <p className="text-slate-500">Date de naissance</p>
                    <p className="font-medium">{new Date(selectedEnfant.dateNaissance).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
                {selectedEnfant.lieuNaissance && (
                  <div>
                    <p className="text-slate-500">Lieu de naissance</p>
                    <p className="font-medium">{selectedEnfant.lieuNaissance}</p>
                  </div>
                )}
                {selectedEnfant.poids && (
                  <div>
                    <p className="text-slate-500">Poids</p>
                    <p className="font-medium">{selectedEnfant.poids} kg</p>
                  </div>
                )}
                {selectedEnfant.taille && (
                  <div>
                    <p className="text-slate-500">Taille</p>
                    <p className="font-medium">{selectedEnfant.taille} cm</p>
                  </div>
                )}
                {selectedEnfant.groupeSanguin && (
                  <div>
                    <p className="text-slate-500">Groupe sanguin</p>
                    <p className="font-medium">{selectedEnfant.groupeSanguin}</p>
                  </div>
                )}
                {selectedEnfant.numeroCarnet && (
                  <div>
                    <p className="text-slate-500">N° Carnet</p>
                    <p className="font-medium">{selectedEnfant.numeroCarnet}</p>
                  </div>
                )}
                {selectedEnfant.allergies && (
                  <div className="col-span-2">
                    <p className="text-slate-500">Allergies</p>
                    <p className="font-medium">{selectedEnfant.allergies}</p>
                  </div>
                )}
                {selectedEnfant.antecedentsMedicaux && (
                  <div className="col-span-2">
                    <p className="text-slate-500">Antécédents médicaux</p>
                    <p className="font-medium">{selectedEnfant.antecedentsMedicaux}</p>
                  </div>
                )}
              </div>

              {/* Parent info */}
              {selectedEnfant.parent && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Parent</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {selectedEnfant.parent.prenom?.[0]}{selectedEnfant.parent.nom?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedEnfant.parent.prenom} {selectedEnfant.parent.nom}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmation Suppression Parent */}
      <AlertDialog open={isDeleteParentDialogOpen} onOpenChange={setIsDeleteParentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le parent{' '}
              <strong>{selectedParent?.prenom} {selectedParent?.nom}</strong> ?
              {getEnfantsForParent(selectedParent?.id || null).length > 0 && (
                <span className="block mt-2 text-orange-600">
                  ⚠️ Ce parent a {getEnfantsForParent(selectedParent?.id || null).length} enfant(s) enregistré(s).
                </span>
              )}
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDeleteParent}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Confirmation Suppression Enfant */}
      <AlertDialog open={isDeleteEnfantDialogOpen} onOpenChange={setIsDeleteEnfantDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'enfant{' '}
              <strong>{selectedEnfant?.prenom} {selectedEnfant?.nom}</strong> ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDeleteEnfant}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteEnfantMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* === DIALOG APRÈS CRÉATION — VOIR ANALYSE RISQUE === */}
      <Dialog open={isRiskDialogOpen} onOpenChange={setIsRiskDialogOpen}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            {/* Animation succès */}
            <div className="relative">
              <div className="p-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-lg shadow-emerald-200">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 p-1.5 bg-white rounded-full shadow">
                <div className="h-4 w-4 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Parent créé avec succès !
              </h3>
              {createdParent && (
                <p className="text-slate-500 mt-1">
                  <strong>{createdParent.prenom} {createdParent.nom}</strong> a été ajouté.
                </p>
              )}
            </div>

            <Separator />

            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 w-full">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-semibold text-slate-800">Analyse de risque IA</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Notre intelligence artificielle peut analyser le profil de ce parent
                et prédire son niveau de risque vaccinal (haut, modéré ou faible).
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 pt-2">
              <Button
                className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
                onClick={() => {
                  setIsRiskDialogOpen(false);
                  if (createdParent?.id) {
                    navigate(`/medecin/prediction-risque?parentId=${createdParent.id}`);
                  } else {
                    navigate('/medecin/prediction-risque');
                  }
                }}
              >
                <Activity className="h-4 w-4" />
                Voir l'analyse de risque
              </Button>
              <Button
                variant="ghost"
                className="w-full text-slate-500"
                onClick={() => setIsRiskDialogOpen(false)}
              >
                Plus tard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientPage;
