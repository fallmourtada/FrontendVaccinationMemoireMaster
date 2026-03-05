import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Activity,
  ArrowLeft,
  Users,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  BarChart3,
  Heart,
  MapPin,
  GraduationCap,
  Baby,
  Bus,
  Banknote,
  Syringe,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

import {
  usePredictRisk,
  mapParentToPredictionInput,
  getRiskStyle,
  type PredictionResult,
} from '@/services/prediction.service';

import { useAllUsers } from '@/services/user.service';
import { type UtilisateurDTO, UserRole } from '@/types/user';

// ================================
// COMPOSANT JAUGE CIRCULAIRE
// ================================
const CircularGauge: React.FC<{
  value: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;
}> = ({ value, color, size = 120, strokeWidth = 10, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {value.toFixed(1)}%
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
};

// ================================
// COMPOSANT CARTE RÉSULTAT RISQUE
// ================================
const RiskResultCard: React.FC<{
  parent: UtilisateurDTO;
  result: PredictionResult;
  onRefresh: () => void;
  isRefreshing: boolean;
}> = ({ parent, result, onRefresh, isRefreshing }) => {
  const style = getRiskStyle(result.prediction);

  const MainIcon = result.prediction === 'Haut risque' ? ShieldAlert
    : result.prediction === 'Risque modéré' ? ShieldQuestion
    : ShieldCheck;

  const RecommendIcon = result.prediction === 'Haut risque' ? AlertTriangle
    : result.prediction === 'Risque modéré' ? Info
    : CheckCircle2;

  const mainProb = result.probabilities[result.prediction as keyof typeof result.probabilities];

  const recommendations = {
    'Haut risque': [
      'Planifier un suivi vaccinal renforcé immédiatement',
      'Contacter le parent pour un rendez-vous prioritaire',
      'Vérifier les vaccins manquants de tous les enfants',
      'Mettre en place des rappels SMS automatiques',
      'Envisager une visite à domicile si nécessaire',
    ],
    'Risque modéré': [
      'Planifier des rappels réguliers de rendez-vous',
      'Vérifier le calendrier vaccinal de chaque enfant',
      'Sensibiliser le parent sur l\'importance de la vaccination',
      'Proposer un transport vers le centre de santé si besoin',
    ],
    'Faible risque': [
      'Continuer le suivi standard de vaccination',
      'Maintenir la communication avec le parent',
      'Encourager le parent dans ses bonnes pratiques',
    ],
  };

  const colorMap = {
    'Haut risque': { main: '#ef4444', bg: 'from-red-500 to-rose-600', light: 'bg-red-50', border: 'border-red-200' },
    'Risque modéré': { main: '#f59e0b', bg: 'from-amber-500 to-orange-600', light: 'bg-amber-50', border: 'border-amber-200' },
    'Faible risque': { main: '#22c55e', bg: 'from-emerald-500 to-green-600', light: 'bg-green-50', border: 'border-green-200' },
  };

  const colors = colorMap[result.prediction as keyof typeof colorMap] || colorMap['Faible risque'];

  // Données facteurs du parent
  const factors = [
    { icon: GraduationCap, label: 'Instruction', value: parent.niveauInstruction || '—' },
    { icon: Baby, label: 'Enfants', value: parent.nombre_enfants != null ? String(parent.nombre_enfants) : '—' },
    { icon: Syringe, label: 'Retard vaccinal', value: parent.retard_vaccinal || '—' },
    { icon: MapPin, label: 'Distance centre', value: parent.distance_centre_sante != null ? `${parent.distance_centre_sante} km` : '—' },
    { icon: Bus, label: 'Transport', value: parent.acces_transport || '—' },
    { icon: Heart, label: 'Zone résidence', value: parent.zoneResidence || '—' },
    { icon: Banknote, label: 'Revenu', value: parent.niveauRevenu || '—' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* === HEADER CARD PRINCIPALE === */}
      <Card className={`overflow-hidden border-2 ${colors.border} shadow-xl`}>
        {/* Bandeau gradient */}
        <div className={`bg-gradient-to-r ${colors.bg} p-6 text-white relative overflow-hidden`}>
          {/* Cercles décoratifs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <MainIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Résultat de l'analyse IA</p>
                <h2 className="text-3xl font-bold tracking-tight">{result.prediction}</h2>
                <p className="text-white/70 text-sm mt-1">
                  Prédiction pour {parent.prenom} {parent.nom}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black tracking-tighter">
                {mainProb.toFixed(1)}%
              </div>
              <p className="text-white/70 text-sm">de probabilité</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Jauges circulaires */}
          <div className="flex items-center justify-center gap-8 py-4">
            <CircularGauge
              value={result.probabilities['Haut risque']}
              color="#ef4444"
              label="Haut risque"
            />
            <CircularGauge
              value={result.probabilities['Risque modéré']}
              color="#f59e0b"
              label="Risque modéré"
            />
            <CircularGauge
              value={result.probabilities['Faible risque']}
              color="#22c55e"
              label="Faible risque"
            />
          </div>

          {/* Barres de probabilité */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Distribution des probabilités
            </h4>
            {[
              { label: 'Haut risque', value: result.probabilities['Haut risque'], color: 'bg-red-500', bg: 'bg-red-100' },
              { label: 'Risque modéré', value: result.probabilities['Risque modéré'], color: 'bg-amber-500', bg: 'bg-amber-100' },
              { label: 'Faible risque', value: result.probabilities['Faible risque'], color: 'bg-emerald-500', bg: 'bg-emerald-100' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="font-bold text-slate-900">{value.toFixed(2)}%</span>
                </div>
                <div className={`w-full ${bg} rounded-full h-3 overflow-hidden`}>
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: `${Math.min(value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* === GRILLE INFOS + RECOMMANDATIONS === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facteurs analysés */}
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Facteurs analysés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {factors.map(({ icon: FactorIcon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      <FactorIcon className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-slate-600">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommandations */}
        <Card className={`shadow-lg ${colors.border} border-2`}>
          <CardHeader className={`${colors.light} pb-3`}>
            <CardTitle className="text-base flex items-center gap-2">
              <RecommendIcon className={`h-5 w-5 ${style.iconColor}`} />
              Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {(recommendations[result.prediction as keyof typeof recommendations] || []).map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${colors.bg} shrink-0`}>
                    {i + 1}
                  </div>
                  <span className="text-sm text-slate-700 leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Bouton relancer */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Relancer l'analyse
        </Button>
      </div>
    </div>
  );
};

// ================================
// COMPOSANT CARTE PARENT SÉLECTIONNABLE
// ================================
const ParentSelectCard: React.FC<{
  parent: UtilisateurDTO;
  isSelected: boolean;
  onClick: () => void;
}> = ({ parent, isSelected, onClick }) => {
  const canPredict = !!mapParentToPredictionInput(parent);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar className={`h-11 w-11 ring-2 ${isSelected ? 'ring-primary' : 'ring-slate-200'}`}>
          <AvatarFallback className={`font-semibold ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
            {parent.prenom?.[0]}{parent.nom?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold truncate ${isSelected ? 'text-primary' : 'text-slate-900'}`}>
            {parent.prenom} {parent.nom}
          </p>
          <p className="text-xs text-slate-500 truncate">{parent.telephone}</p>
        </div>
        {canPredict ? (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs shrink-0">
            Données OK
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-xs shrink-0">
            Incomplet
          </Badge>
        )}
      </div>
    </button>
  );
};

// ================================
// PAGE PRINCIPALE PRÉDICTION
// ================================
const PredictionRisquePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: usersData, isLoading: isLoadingUsers } = useAllUsers();
  const predictMutation = usePredictRisk();

  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer les parents
  const parents = useMemo(() => {
    const users = Array.isArray(usersData) ? usersData : [];
    return users.filter(u => u.userRole === UserRole.PARENT);
  }, [usersData]);

  // Parent sélectionné
  const selectedParent = useMemo(() => {
    if (!selectedParentId) return null;
    return parents.find(p => p.id === selectedParentId) || null;
  }, [parents, selectedParentId]);

  // Filtrer parents par recherche
  const filteredParents = useMemo(() => {
    if (!searchTerm) return parents;
    const term = searchTerm.toLowerCase();
    return parents.filter(p =>
      p.prenom?.toLowerCase().includes(term) ||
      p.nom?.toLowerCase().includes(term) ||
      p.telephone?.includes(term)
    );
  }, [parents, searchTerm]);

  // Lancer la prédiction quand un parent est sélectionné
  const handlePredict = (parent: UtilisateurDTO) => {
    const input = mapParentToPredictionInput(parent);
    if (!input) {
      toast.error(
        'Données insuffisantes pour la prédiction. Veuillez compléter les informations du parent (onglet Prédiction).'
      );
      return;
    }
    setPredictionResult(null);
    predictMutation.mutate(input, {
      onSuccess: (data) => setPredictionResult(data),
      onError: () => toast.error('Erreur de connexion au service de prédiction. Vérifiez qu\'il est démarré.'),
    });
  };

  // Sélectionner un parent
  const handleSelectParent = (parent: UtilisateurDTO) => {
    setSelectedParentId(parent.id);
    setPredictionResult(null);
    handlePredict(parent);
  };

  // Relancer
  const handleRefresh = () => {
    if (selectedParent) handlePredict(selectedParent);
  };

  // Check URL params (ex: ?parentId=5)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('parentId');
    if (pid && parents.length > 0) {
      const parent = parents.find(p => p.id === Number(pid));
      if (parent) {
        handleSelectParent(parent);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parents]);

  return (
    <div className="space-y-6">
      {/* === EN-TÊTE === */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/medecin/patients')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/70 rounded-xl text-white">
                <Activity className="h-6 w-6" />
              </div>
              Analyse de risque CPN
            </h1>
            <p className="text-slate-500 mt-1">
              Prédiction intelligente du niveau de risque vaccinal par parent
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* === COLONNE GAUCHE : LISTE PARENTS === */}
        <div className="lg:col-span-4">
          <Card className="shadow-lg sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Sélectionner un parent
              </CardTitle>
              <div className="relative mt-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un parent..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[65vh] overflow-y-auto space-y-2 pt-0">
              {isLoadingUsers ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-11 w-11 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredParents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">Aucun parent trouvé</p>
                </div>
              ) : (
                filteredParents.map(parent => (
                  <ParentSelectCard
                    key={parent.id}
                    parent={parent}
                    isSelected={selectedParentId === parent.id}
                    onClick={() => handleSelectParent(parent)}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* === COLONNE DROITE : RÉSULTATS === */}
        <div className="lg:col-span-8">
          {!selectedParent ? (
            /* État initial - aucun parent sélectionné */
            <Card className="shadow-lg border-dashed border-2 border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="p-6 bg-slate-50 rounded-full mb-6">
                  <Activity className="h-16 w-16 text-slate-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  Sélectionnez un parent
                </h3>
                <p className="text-slate-400 text-center max-w-md">
                  Choisissez un parent dans la liste à gauche pour lancer une analyse
                  de risque CPN alimentée par l'intelligence artificielle.
                </p>
              </CardContent>
            </Card>
          ) : predictMutation.isPending ? (
            /* Chargement */
            <Card className="shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="p-6 bg-primary/5 rounded-full mb-6 animate-pulse">
                    <Activity className="h-16 w-16 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Analyse en cours...
                </h3>
                <p className="text-slate-400 text-center max-w-md">
                  Notre modèle d'IA analyse les données de <strong>{selectedParent.prenom} {selectedParent.nom}</strong> pour prédire le niveau de risque.
                </p>
                <div className="w-48 mt-6">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '75%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : predictionResult ? (
            /* Résultats */
            <RiskResultCard
              parent={selectedParent}
              result={predictionResult}
              onRefresh={handleRefresh}
              isRefreshing={predictMutation.isPending}
            />
          ) : (
            /* Données insuffisantes */
            <Card className="shadow-lg border-dashed border-2 border-amber-200 bg-amber-50/50">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="p-6 bg-amber-100 rounded-full mb-6">
                  <AlertTriangle className="h-16 w-16 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-amber-700 mb-2">
                  Données insuffisantes
                </h3>
                <p className="text-amber-600 text-center max-w-md mb-4">
                  Les informations de prédiction de <strong>{selectedParent.prenom} {selectedParent.nom}</strong> sont incomplètes.
                  Veuillez modifier le parent et remplir l'onglet "Prédiction".
                </p>
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={() => navigate('/medecin/patients')}
                >
                  Retour aux parents
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionRisquePage;
