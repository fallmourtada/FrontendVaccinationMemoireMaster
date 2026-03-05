import { useParams } from "react-router-dom";
// TODO: Décommenter ces imports pour utiliser les vraies données du backend
// import { useUserByToken } from "@/services/user.service";
// import { useVaccinationsByEnfant } from "@/services/vaccination.service";
import type { EnfantDTO } from "@/types";
import type { VaccinationDTO } from "@/types/vaccination";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Droplet, 
  MapPin, 
  AlertCircle,
  Syringe,
  Building2,
  CalendarCheck,
  ClipboardList,
  UserCircle
} from "lucide-react";

export default function UserByToken() {
  const { token } = useParams<{ token: string }>();

  // TODO: Décommenter ces lignes pour utiliser les vraies données du backend
  // const { data: user, isLoading, error } = useUserByToken(token || '');
  // const { data: vaccinations, isLoading: vaccinationsLoading } = useVaccinationsByEnfant((user as UserDTO)?.id || '');

  // Données statiques pour la démo - ENFANT avec parent
  const isLoading = false;
  const error = null;
  const vaccinationsLoading = false;
  
  // Exemple: Enfant (affichera l'historique de l'enfant à gauche et celui de la maman à droite)
  const enfant: EnfantDTO = {
    id: '1',
    nom: 'DIOP',
    prenom: 'Mamadou',
    dateNaissance: '2023-08-10',
    lieuNaissance: 'Hôpital Principal de Dakar',
    adresse: 'Plateau, Dakar',
    groupeSanguin: 'O+',
    poids: '12.5',
    taille: '75',
    sexe: 'FEMININ',
    numeroCarnet: 'SN-2023-001234',
    parentId: '2',
    allergies: 'Aucune allergie connue',
    antecedentsMedicaux: 'Aucun',
    regionId: '1',
    departementId: '1',
    communeId: '1',
    region: {
      id: '1',
      name: 'Dakar',
      codification: 'DKR',
      type: 'REGION',
      parent: null,
      population: 3000000,
      superficieKm2: 547,
      chefLieu: 'Dakar',
      latitude: 14.6928,
      longitude: -17.4467,
      active: true
    },
    departement: {
      id: '2',
      name: 'Dakar',
      codification: 'DKR-DEPT',
      type: 'DEPARTMENT',
      parent: null,
      population: 1500000,
      superficieKm2: 83,
      chefLieu: 'Dakar',
      latitude: 14.6928,
      longitude: -17.4467,
      active: true
    },
    commune: {
      id: '3',
      name: 'Plateau',
      codification: 'PLT',
      type: 'COMMUNE',
      parent: null,
      population: 50000,
      superficieKm2: 10,
      chefLieu: 'Plateau',
      latitude: 14.6928,
      longitude: -17.4467,
      active: true
    },
    parent: {
      id: '2',
      nom: 'DIOP',
      prenom: 'Fatou',
      email: 'fatou.diop123@gmail.com',
      role: 'PARENT',
      telephone: '+221 77 456 78 90',
      dateNaissance: '1992-03-20',
      groupeSanguin: 'A+',
      sexe: 'FEMININ',
      allergies: 'Allergie aux arachides',
      antecedentsMedicaux: 'Hypertension légère',
      regionId: '1',
      departementId: '1',
      communeId: '1',
      region: {
        id: '1',
        name: 'Dakar',
        codification: 'DKR',
        type: 'REGION',
        parent: null,
        population: 3000000,
        superficieKm2: 547,
        chefLieu: 'Dakar',
        latitude: 14.6928,
        longitude: -17.4467,
        active: true
      },
      departement: {
        id: '2',
        name: 'Dakar',
        codification: 'DKR-DEPT',
        type: 'DEPARTMENT',
        parent: null,
        population: 1500000,
        superficieKm2: 83,
        chefLieu: 'Dakar',
        latitude: 14.6928,
        longitude: -17.4467,
        active: true
      },
      commune: {
        id: '3',
        name: 'Plateau',
        codification: 'PLT',
        type: 'COMMUNE',
        parent: null,
        population: 50000,
        superficieKm2: 10,
        chefLieu: 'Plateau',
        latitude: 14.6928,
        longitude: -17.4467,
        active: true
      }
    }
  };

  // Vaccinations de l'enfant (0-5 ans - Programme Élargi de Vaccination PEV)
  const vaccinationsEnfant: VaccinationDTO[] = [
    {
      id: '1',
      enfantId: '1',
      vaccinId: '1',
      dateVaccination: '2023-08-10',
      centreVaccination: 'Hôpital Principal de Dakar',
      lotVaccin: 'BCG-2023-156',
      professionnelSante: 'Dr. Aminata Fall',
      reactions: 'Aucune réaction',
      prochainRappel: null,
      vaccin: {
        id: '1',
        nom: 'BCG (Tuberculose)',
        description: 'Vaccin à la naissance',
        maladiesCiblees: ['Tuberculose'],
        ageMinimumMois: 0,
        ageMaximumMois: 12,
        intervalleDoses: 0,
        nombreDoses: 1,
        type: 'OBLIGATOIRE',
        obligatoire: true,
        active: true
      }
    },
    {
      id: '2',
      enfantId: '1',
      vaccinId: '2',
      dateVaccination: '2023-08-10',
      centreVaccination: 'Hôpital Principal de Dakar',
      lotVaccin: 'POLIO-2023-345',
      professionnelSante: 'Dr. Aminata Fall',
      reactions: 'Aucune réaction',
      prochainRappel: null,
      vaccin: {
        id: '2',
        nom: 'VPO0 (Polio oral)',
        description: 'Vaccin polio oral à la naissance',
        maladiesCiblees: ['Poliomyélite'],
        ageMinimumMois: 0,
        ageMaximumMois: 1,
        intervalleDoses: 0,
        nombreDoses: 1,
        type: 'OBLIGATOIRE',
        obligatoire: true,
        active: true
      }
    },
    {
      id: '3',
      enfantId: '1',
      vaccinId: '3',
      dateVaccination: '2023-10-12',
      centreVaccination: 'Centre de Santé de Plateau',
      lotVaccin: 'PENTA-2023-789',
      professionnelSante: 'Mme. Awa Ndiaye',
      reactions: 'Légère rougeur au point d\'injection',
      prochainRappel: '2023-12-12',
      vaccin: {
        id: '3',
        nom: 'Pentavalent 1 (DTC-HepB-Hib)',
        description: 'Première dose à 6 semaines',
        maladiesCiblees: ['Diphtérie', 'Tétanos', 'Coqueluche', 'Hépatite B', 'Haemophilus influenzae'],
        ageMinimumMois: 2,
        ageMaximumMois: 18,
        intervalleDoses: 2,
        nombreDoses: 3,
        type: 'OBLIGATOIRE',
        obligatoire: true,
        active: true
      }
    },
    // {
    //   id: '4',
    //   enfantId: '1',
    //   vaccinId: '4',
    //   dateVaccination: '2023-10-12',
    //   centreVaccination: 'Centre de Santé de Plateau',
    //   lotVaccin: 'PNEUMO-2023-456',
    //   professionnelSante: 'Mme. Awa Ndiaye',
    //   reactions: 'Aucune réaction',
    //   prochainRappel: '2023-12-12',
    //   vaccin: {
    //     id: '4',
    //     nom: 'VPC1 (Pneumocoque)',
    //     description: 'Première dose à 6 semaines',
    //     maladiesCiblees: ['Pneumonie', 'Méningite', 'Otite'],
    //     ageMinimumMois: 2,
    //     ageMaximumMois: 24,
    //     intervalleDoses: 2,
    //     nombreDoses: 3,
    //     type: 'OBLIGATOIRE',
    //     obligatoire: true,
    //     active: true
    //   }
    // },
    // {
    //   id: '5',
    //   enfantId: '1',
    //   vaccinId: '5',
    //   dateVaccination: '2023-12-15',
    //   centreVaccination: 'Centre de Santé de Plateau',
    //   lotVaccin: 'PENTA-2023-790',
    //   professionnelSante: 'Mme. Awa Ndiaye',
    //   reactions: 'Fièvre légère',
    //   prochainRappel: '2024-02-15',
    //   vaccin: {
    //     id: '3',
    //     nom: 'Pentavalent 2 (DTC-HepB-Hib)',
    //     description: 'Deuxième dose à 10 semaines',
    //     maladiesCiblees: ['Diphtérie', 'Tétanos', 'Coqueluche', 'Hépatite B', 'Haemophilus influenzae'],
    //     ageMinimumMois: 2,
    //     ageMaximumMois: 18,
    //     intervalleDoses: 2,
    //     nombreDoses: 3,
    //     type: 'OBLIGATOIRE',
    //     obligatoire: true,
    //     active: true
    //   }
    // },
    // {
    //   id: '6',
    //   enfantId: '1',
    //   vaccinId: '6',
    //   dateVaccination: '2024-02-20',
    //   centreVaccination: 'Centre de Santé de Plateau',
    //   lotVaccin: 'PENTA-2024-123',
    //   professionnelSante: 'Mme. Awa Ndiaye',
    //   reactions: 'Aucune réaction',
    //   prochainRappel: null,
    //   vaccin: {
    //     id: '3',
    //     nom: 'Pentavalent 3 (DTC-HepB-Hib)',
    //     description: 'Troisième dose à 14 semaines',
    //     maladiesCiblees: ['Diphtérie', 'Tétanos', 'Coqueluche', 'Hépatite B', 'Haemophilus influenzae'],
    //     ageMinimumMois: 2,
    //     ageMaximumMois: 18,
    //     intervalleDoses: 2,
    //     nombreDoses: 3,
    //     type: 'OBLIGATOIRE',
    //     obligatoire: true,
    //     active: true
    //   }
    // },
    // {
    //   id: '7',
    //   enfantId: '1',
    //   vaccinId: '7',
    //   dateVaccination: '2024-05-15',
    //   centreVaccination: 'Hôpital Principal de Dakar',
    //   lotVaccin: 'ROR-2024-234',
    //   professionnelSante: 'Dr. Moussa Diop',
    //   reactions: 'Légère éruption cutanée',
    //   prochainRappel: null,
    //   vaccin: {
    //     id: '7',
    //     nom: 'VAR (Rougeole-Rubéole)',
    //     description: 'Vaccin à 9 mois',
    //     maladiesCiblees: ['Rougeole', 'Rubéole'],
    //     ageMinimumMois: 9,
    //     ageMaximumMois: 24,
    //     intervalleDoses: 0,
    //     nombreDoses: 1,
    //     type: 'OBLIGATOIRE',
    //     obligatoire: true,
    //     active: true
    //   }
    // },
    // {
    //   id: '8',
    //   enfantId: '1',
    //   vaccinId: '8',
    //   dateVaccination: '2024-08-20',
    //   centreVaccination: 'Centre de Santé de Plateau',
    //   lotVaccin: 'FIEVRE-2024-567',
    //   professionnelSante: 'Dr. Khadija Sarr',
    //   reactions: 'Aucune réaction',
    //   prochainRappel: null,
    //   vaccin: {
    //     id: '8',
    //     nom: 'VAA (Fièvre Jaune)',
    //     description: 'Vaccin à 9 mois',
    //     maladiesCiblees: ['Fièvre Jaune'],
    //     ageMinimumMois: 9,
    //     ageMaximumMois: 24,
    //     intervalleDoses: 0,
    //     nombreDoses: 1,
    //     type: 'OBLIGATOIRE',
    //     obligatoire: true,
    //     active: true
    //   }
    // }
  ];

  // Vaccinations de la maman (pré et post accouchement)
  const vaccinationsMaman: VaccinationDTO[] = [
    {
      id: '10',
      enfantId: '2',
      vaccinId: '10',
      dateVaccination: '2023-01-15',
      centreVaccination: 'Centre de Santé de Plateau',
      lotVaccin: 'VAT1-2023-445',
      professionnelSante: 'Sage-femme Marième Diop',
      reactions: 'Légère douleur au point d\'injection',
      prochainRappel: '2023-02-15',
      vaccin: {
        id: '10',
        nom: 'VAT 1 (Tétanos)',
        description: 'Première dose de vaccin antitétanique prénatal',
        maladiesCiblees: ['Tétanos néonatal', 'Tétanos maternel'],
        ageMinimumMois: 0,
        ageMaximumMois: null,
        intervalleDoses: 1,
        nombreDoses: 5,
        type: 'OBLIGATOIRE',
        obligatoire: true,
        active: true
      }
    },
    {
      id: '11',
      enfantId: '2',
      vaccinId: '11',
      dateVaccination: '2023-02-20',
      centreVaccination: 'Centre de Santé de Plateau',
      lotVaccin: 'VAT2-2023-446',
      professionnelSante: 'Sage-femme Marième Diop',
      reactions: 'Aucune réaction',
      prochainRappel: '2023-08-20',
      vaccin: {
        id: '11',
        nom: 'VAT 2 (Tétanos)',
        description: 'Deuxième dose de vaccin antitétanique prénatal',
        maladiesCiblees: ['Tétanos néonatal', 'Tétanos maternel'],
        ageMinimumMois: 0,
        ageMaximumMois: null,
        intervalleDoses: 1,
        nombreDoses: 5,
        type: 'OBLIGATOIRE',
        obligatoire: true,
        active: true
      }
    },
    {
      id: '12',
      enfantId: '2',
      vaccinId: '12',
      dateVaccination: '2023-05-10',
      centreVaccination: 'Hôpital Principal de Dakar',
      lotVaccin: 'TDAP-2023-789',
      professionnelSante: 'Dr. Khadija Sarr',
      reactions: 'Légère fatigue',
      prochainRappel: null,
      vaccin: {
        id: '12',
        nom: 'dTpa (Coqueluche)',
        description: 'Vaccin contre la coqueluche pendant la grossesse',
        maladiesCiblees: ['Coqueluche', 'Diphtérie', 'Tétanos'],
        ageMinimumMois: 0,
        ageMaximumMois: null,
        intervalleDoses: 0,
        nombreDoses: 1,
        type: 'RECOMMANDE',
        obligatoire: true,
        active: true
      }
    },
    {
      id: '13',
      enfantId: '2',
      vaccinId: '13',
      dateVaccination: '2023-09-25',
      centreVaccination: 'Centre de Santé de Plateau',
      lotVaccin: 'VIT-A-2023-234',
      professionnelSante: 'Sage-femme Marième Diop',
      reactions: 'Aucune réaction',
      prochainRappel: null,
      vaccin: {
        id: '13',
        nom: 'Vitamine A (Post-partum)',
        description: 'Supplémentation en vitamine A après accouchement',
        maladiesCiblees: ['Carence en vitamine A'],
        ageMinimumMois: 0,
        ageMaximumMois: null,
        intervalleDoses: 0,
        nombreDoses: 1,
        type: 'RECOMMANDE',
        obligatoire: false,
        active: true
      }
    },
    // {
    //   id: '14',
    //   enfantId: '2',
    //   vaccinId: '14',
    //   dateVaccination: '2024-01-20',
    //   centreVaccination: 'Hôpital Principal de Dakar',
    //   lotVaccin: 'HPV-2024-567',
    //   professionnelSante: 'Dr. Aminata Fall',
    //   reactions: 'Légère douleur musculaire',
    //   prochainRappel: '2024-07-20',
    //   vaccin: {
    //     id: '14',
    //     nom: 'VPH (Papillomavirus)',
    //     description: 'Vaccin contre le cancer du col de l\'utérus',
    //     maladiesCiblees: ['Cancer du col de l\'utérus', 'Papillomavirus'],
    //     ageMinimumMois: 0,
    //     ageMaximumMois: null,
    //     intervalleDoses: 6,
    //     nombreDoses: 2,
    //     type: 'RECOMMANDE',
    //     obligatoire: false,
    //     active: true
    //   }
    // }
  ];

  // Déterminer si c'est un enfant (a un parent) ou un adulte
  const isEnfant = 'parentId' in enfant && enfant.parentId !== null;
  const user = enfant as any; // Utiliser l'enfant comme utilisateur principal
  const vaccinations = vaccinationsEnfant;

  // État de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // État d'erreur ou token invalide
  if (error || !token) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Erreur d'accès</CardTitle>
            </div>
            <CardDescription>
              {!token 
                ? "Le token d'accès est manquant dans l'URL." 
                : "Impossible de récupérer les informations de l'utilisateur. Vérifiez que le token est valide."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // État sans utilisateur trouvé
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Utilisateur non trouvé</CardTitle>
            </div>
            <CardDescription>
              Aucun utilisateur ne correspond à ce token d'accès.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* En-tête */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-chart-4" />
          Carnet de Vaccination
        </h1>
        <p className="text-muted-foreground">
          Informations personnelles et historique des vaccinations
        </p>
      </div>

      {/* Cartes d'informations personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-chart-4" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-medium">{user.prenom} {user.nom}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date de naissance
              </p>
              <p className="font-medium">
                {user.dateNaissance 
                  ? new Date(user.dateNaissance).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Non renseignée'}
              </p>
            </div>
            {user.sexe && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sexe</p>
                <Badge variant="outline">{user.sexe}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-chart-1" />
              {isEnfant ? 'Contact du Parent' : 'Contact'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isEnfant && enfant.parent ? (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Parent
                  </p>
                  <p className="font-medium">{enfant.parent.prenom} {enfant.parent.nom}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="font-medium break-all">{enfant.parent.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </p>
                  <p className="font-medium">{enfant.parent.telephone}</p>
                </div>
              </>
            ) : (
              <>
                {user.email && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-medium break-all">{user.email}</p>
                  </div>
                )}
                {user.telephone && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </p>
                    <p className="font-medium">{user.telephone}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Informations médicales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplet className="h-5 w-5 text-chart-5" />
              Informations Médicales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.groupeSanguin && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Droplet className="h-4 w-4" />
                  Groupe sanguin
                </p>
                <Badge className="bg-chart-5 text-white hover:bg-chart-5/90">
                  {user.groupeSanguin}
                </Badge>
              </div>
            )}
            {user.allergies && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Allergies</p>
                <p className="text-sm">{user.allergies}</p>
              </div>
            )}
            {user.antecedentsMedicaux && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Antécédents</p>
                <p className="text-sm">{user.antecedentsMedicaux}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Localisation */}
      {(user.region || user.departement || user.commune) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-chart-2" />
              Localisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.region?.name && (
                <Badge variant="outline" className="bg-chart-2/10">
                  {user.region.name}
                </Badge>
              )}
              {user.departement?.name && (
                <Badge variant="outline" className="bg-chart-2/10">
                  {user.departement.name}
                </Badge>
              )}
              {user.commune?.name && (
                <Badge variant="outline" className="bg-chart-2/10">
                  {user.commune.name}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historique des vaccinations - Affichage différent pour enfant vs adulte */}
      {isEnfant ? (
        /* Pour un enfant: 2 colonnes - Enfant à gauche, Maman à droite */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historique de l'enfant */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Syringe className="h-6 w-6 text-chart-2" />
                    Vaccinations de {user.prenom}
                  </CardTitle>
                  <CardDescription>
                    Carnet de vaccination de l'enfant
                  </CardDescription>
                </div>
                {vaccinations && vaccinations.length > 0 && (
                  <Badge className="bg-chart-2 text-white hover:bg-chart-2/90">
                    {vaccinations.length}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {vaccinationsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
              ) : !vaccinations || vaccinations.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucune vaccination enregistrée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vaccinations.map((vaccination, index) => (
                    <Card key={vaccination.id || index} className="border-l-4 border-l-chart-2">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div>
                            <p className="font-semibold text-base flex items-center gap-2">
                              <Syringe className="h-4 w-4 text-chart-2" />
                              {vaccination.vaccin?.nom || 'Non spécifié'}
                            </p>
                            {vaccination.vaccin?.maladiesCiblees && vaccination.vaccin.maladiesCiblees.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Contre: {vaccination.vaccin.maladiesCiblees.join(', ')}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-sm">
                            <p className="text-muted-foreground flex items-center gap-1">
                              <CalendarCheck className="h-3 w-3" />
                              {new Date(vaccination.dateVaccination).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>

                          {vaccination.centreVaccination && (
                            <div className="text-sm">
                              <p className="text-muted-foreground flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {vaccination.centreVaccination}
                              </p>
                            </div>
                          )}

                          {vaccination.prochainRappel && (
                            <Badge variant="outline" className="bg-chart-3/10 text-xs">
                              Rappel: {new Date(vaccination.prochainRappel).toLocaleDateString('fr-FR')}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historique de la maman */}
          {enfant.parent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Syringe className="h-6 w-6 text-chart-4" />
                      Vaccinations de {enfant.parent.prenom} (Maman)
                    </CardTitle>
                    <CardDescription>
                      Carnet de vaccination du parent
                    </CardDescription>
                  </div>
                  {vaccinationsMaman && vaccinationsMaman.length > 0 && (
                    <Badge className="bg-chart-4 text-white hover:bg-chart-4/90">
                      {vaccinationsMaman.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!vaccinationsMaman || vaccinationsMaman.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Aucune vaccination enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vaccinationsMaman.map((vaccination, index) => (
                      <Card key={vaccination.id || index} className="border-l-4 border-l-chart-4">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div>
                              <p className="font-semibold text-base flex items-center gap-2">
                                <Syringe className="h-4 w-4 text-chart-4" />
                                {vaccination.vaccin?.nom || 'Non spécifié'}
                              </p>
                              {vaccination.vaccin?.maladiesCiblees && vaccination.vaccin.maladiesCiblees.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Contre: {vaccination.vaccin.maladiesCiblees.join(', ')}
                                </p>
                              )}
                            </div>
                            
                            <div className="text-sm">
                              <p className="text-muted-foreground flex items-center gap-1">
                                <CalendarCheck className="h-3 w-3" />
                                {new Date(vaccination.dateVaccination).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>

                            {vaccination.centreVaccination && (
                              <div className="text-sm">
                                <p className="text-muted-foreground flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {vaccination.centreVaccination}
                                </p>
                              </div>
                            )}

                            {vaccination.prochainRappel && (
                              <Badge variant="outline" className="bg-chart-3/10 text-xs">
                                Rappel: {new Date(vaccination.prochainRappel).toLocaleDateString('fr-FR')}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Pour un adulte: Une seule colonne comme avant */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Syringe className="h-6 w-6 text-chart-2" />
                  Historique des Vaccinations
                </CardTitle>
                <CardDescription>
                  Carnet de vaccination et historique complet
                </CardDescription>
              </div>
              {vaccinations && vaccinations.length > 0 && (
                <Badge className="bg-chart-2 text-white hover:bg-chart-2/90">
                  {vaccinations.length} vaccination{vaccinations.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {vaccinationsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            ) : !vaccinations || vaccinations.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Aucune vaccination enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vaccinations.map((vaccination, index) => (
                  <Card key={vaccination.id || index} className="border-l-4 border-l-chart-2">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Colonne gauche */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Vaccin</p>
                            <p className="font-semibold text-lg flex items-center gap-2">
                              <Syringe className="h-5 w-5 text-chart-2" />
                              {vaccination.vaccin?.nom || 'Non spécifié'}
                            </p>
                            {vaccination.vaccin?.maladiesCiblees && vaccination.vaccin.maladiesCiblees.length > 0 && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Contre: {vaccination.vaccin.maladiesCiblees.join(', ')}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <CalendarCheck className="h-4 w-4" />
                              Date de vaccination
                            </p>
                            <p className="font-medium">
                              {new Date(vaccination.dateVaccination).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>

                          {vaccination.prochainRappel && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Prochain rappel
                              </p>
                              <Badge variant="outline" className="bg-chart-3/10">
                                {new Date(vaccination.prochainRappel).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Colonne droite */}
                        <div className="space-y-3">
                          {vaccination.centreVaccination && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                Centre de vaccination
                              </p>
                              <p className="font-medium">{vaccination.centreVaccination}</p>
                            </div>
                          )}

                          {vaccination.professionnelSante && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Professionnel de santé</p>
                              <p className="font-medium">{vaccination.professionnelSante}</p>
                            </div>
                          )}

                          {vaccination.lotVaccin && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Lot du vaccin</p>
                              <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
                                {vaccination.lotVaccin}
                              </p>
                            </div>
                          )}

                          {vaccination.reactions && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Réactions</p>
                              <p className="text-sm">{vaccination.reactions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
