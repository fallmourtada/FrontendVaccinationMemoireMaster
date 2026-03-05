import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QRCode from 'react-qr-code';

import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  User,
  FileText,
  Heart,
  AlertTriangle,
  Syringe,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Printer
} from 'lucide-react';
import PageContainer from "@/components/shared/page-container";

// Types
interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  age: number;
  sexe: 'M' | 'F';
  telephone: string;
  email: string;
  adresse: string;
  numeroCarnet: string;
  typePatient: 'adulte' | 'enfant';
  parentId?: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  allergie: string[];
  antecedentsMedicaux: string[];
  contactUrgence: {
    nom: string;
    telephone: string;
    relation: string;
  };
  assuranceMaladie: string;
  medeccinTraitant: string;
  groupeSanguin: string;
  poids: number;
  taille: number;
  dateCreation: string;
  derniereModification: string;
  notes?: string;
  statutMatrimonial?: string;
  nomTuteur1?: string;
  nomTuteur2?: string;
  prenomTuteur1?: string;
  prenomTuteur2?: string;
  numeroTuteur1?: string;
  numeroTuteur2?: string;
}

interface Vaccination {
  id: string;
  vaccin: string;
  dateAdministration: string;
  lotNumero: string;
  site: string;
  administrePar: string;
  prochainRappel?: string;
  reactions?: string;
  statut: 'complete' | 'partielle' | 'reportee';
}

interface RendezVous {
  id: string;
  date: string;
  heure: string;
  motif: string;
  statut: 'planifie' | 'complete' | 'annule' | 'reporte';
  notes?: string;
}

// Données de démonstration
const patientsData: Patient[] = [
  {
    id: '1',
    nom: 'Diop',
    prenom: 'Aïssatou',
    dateNaissance: '1985-03-15',
    age: 40,
    sexe: 'F',
    telephone: '77 123 45 67',
    email: 'aissatou.diop@email.sn',
    adresse: '123 Rue Médicale, Dakar',
    numeroCarnet: 'VAC001234',
    typePatient: 'adulte',
    statut: 'actif',
    allergie: ['Pénicilline', 'Arachides'],
    antecedentsMedicaux: ['Asthme', 'Hypertension'],
    contactUrgence: {
      nom: 'Mamadou Diop',
      telephone: '77 987 65 43',
      relation: 'Époux'
    },
    assuranceMaladie: 'SN123456789',
    medeccinTraitant: 'Dr. Cheikh Ba',
    groupeSanguin: 'A+',
    poids: 65,
    taille: 165,
    dateCreation: '2020-01-15',
    derniereModification: '2024-01-15',
    nomTuteur1: 'Fall',
    prenomTuteur1: 'Amadou',
    numeroTuteur1: '77 555 11 22',
    nomTuteur2: 'Seck',
    prenomTuteur2: 'Fatou',
    numeroTuteur2: '77 666 33 44'
  },
  {
    id: '3',
    nom: 'Diop',
    prenom: 'Mamadou',
    dateNaissance: '2020-03-20',
    age: 5,
    sexe: 'M',
    telephone: '77 123 45 67',
    email: '',
    adresse: '123 Rue Médicale, Dakar',
    numeroCarnet: 'VAC001235',
    typePatient: 'enfant',
    parentId: '1',
    statut: 'actif',
    allergie: [],
    antecedentsMedicaux: [],
    contactUrgence: {
      nom: 'Aïssatou Diop',
      telephone: '77 123 45 67',
      relation: 'Mère'
    },
    assuranceMaladie: '',
    medeccinTraitant: 'Dr. Fatou Ndiaye',
    groupeSanguin: 'A+',
    poids: 18,
    taille: 110,
    dateCreation: '2020-03-25',
    derniereModification: '2024-01-20',
    notes: 'Enfant en bonne santé, vaccinations à jour'
  }
];

  const vaccinationsData: Vaccination[] = [
    {
      id: '1',
      vaccin: 'Grippe saisonnière 2024',
      dateAdministration: '2024-01-15',
      lotNumero: 'FLU2024-001',
      site: 'Bras gauche',
      administrePar: 'Dr. Aïssatou Ndiaye',
      prochainRappel: '2025-01-15',
      statut: 'complete'
    },
    {
      id: '2',
      vaccin: 'Rappel DTP',
      dateAdministration: '2023-06-10',
      lotNumero: 'DTP2023-045',
      site: 'Bras droit',
      administrePar: 'Inf. Mamadou Fall',
      prochainRappel: '2033-06-10',
      statut: 'complete'
    },
    {
      id: '3',
      vaccin: 'COVID-19 (Rappel)',
      dateAdministration: '2023-09-20',
      lotNumero: 'COV2023-789',
      site: 'Bras gauche',
      administrePar: 'Dr. Cheikh Ba',
      reactions: 'Légère douleur au site d\'injection',
      statut: 'complete'
    }
  ];


const rendezVousData: RendezVous[] = [
  {
    id: '1',
    date: '2024-02-15',
    heure: '14:30',
    motif: 'Vaccination Hépatite B',
    statut: 'planifie'
  },
  {
    id: '2',
    date: '2024-01-15',
    heure: '10:00',
    motif: 'Vaccination grippe saisonnière',
    statut: 'complete',
    notes: 'Vaccination administrée sans problème'
  },
  {
    id: '3',
    date: '2023-12-20',
    heure: '16:00',
    motif: 'Consultation pré-vaccinale',
    statut: 'complete'
  }
];

export default function PatientDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('informations');
  const [isEditingAllergies, setIsEditingAllergies] = useState(false);
  const [isEditingAntecedents, setIsEditingAntecedents] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Trouver le patient par ID
  const patientData = patientsData.find(p => p.id === id);
  
  // Trouver le parent si c'est un enfant
  const parentData = patientData?.parentId ? patientsData.find(p => p.id === patientData.parentId) : null;

  // Redirection si patient non trouvé
  if (!patientData) {
    return (
      <PageContainer title="Patient non trouvé">
        <div className="text-center py-8">
          <p className="text-gray-500">Le patient demandé n'a pas été trouvé.</p>
          <Button onClick={() => navigate('patients')} className="mt-4">
            Retour à la liste
          </Button>
        </div>
      </PageContainer>
    );
  }

  const calculateAge = (dateNaissance: string) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Actif</Badge>;
      case 'inactif':
        return <Badge variant="secondary">Inactif</Badge>;
      case 'suspendu':
        return <Badge variant="destructive">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getVaccinationStatusBadge = (statut: string) => {
    switch (statut) {
      case 'complete':
        return <Badge className="bg-emerald-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Complète</Badge>;
      case 'partielle':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Partielle</Badge>;
      case 'reportee':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Reportée</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getRendezVousStatusBadge = (statut: string) => {
    switch (statut) {
      case 'planifie':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><Clock className="w-3 h-3 mr-1" />Planifié</Badge>;
      case 'complete':
        return <Badge className="bg-emerald-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Terminé</Badge>;
      case 'annule':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Annulé</Badge>;
      case 'reporte':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Reporté</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  return (
    <PageContainer 
      title={`Dossier - ${patientData.prenom} ${patientData.nom}`}
      subtitle="Informations complètes du patient et suivi médical"
    >
      {/* Navigation et actions */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('../patients')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste</span>
        </Button>
        <div className="flex items-center space-x-2">
          {/* <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button> */}
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* En-tête du patient */}
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            {/* Avatar + Info */}
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary/10">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                    {patientData.prenom.charAt(0)}{patientData.nom.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {patientData.statut === 'actif' && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <h2 className="text-base sm:text-lg font-bold text-foreground truncate">
                    {patientData.prenom} {patientData.nom}
                  </h2>
                  {getStatusBadge(patientData.statut)}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span>{calculateAge(patientData.dateNaissance)} ans</span>
                  <span>{patientData.sexe === 'M' ? 'M' : 'F'}</span>
                  <span className="hidden sm:inline">{patientData.groupeSanguin}</span>
                  <code className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-mono">
                    {patientData.numeroCarnet}
                  </code>
                </div>
                
                <div className="hidden sm:flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span className="truncate">{patientData.telephone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{patientData.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code - Hidden on mobile */}
            <div className="hidden sm:flex flex-col items-center space-y-1 p-2 bg-gradient-to-br from-primary/5 to-primary/10 rounded border border-primary/20 flex-shrink-0">
              <div className="bg-white p-1 rounded shadow-sm" id={`qr-code-${patientData.id}`}>
                <QRCode
                  size={45}
                  value={JSON.stringify({
                    id: patientData.id,
                    nom: patientData.nom,
                    prenom: patientData.prenom,
                    numeroCarnet: patientData.numeroCarnet,
                    type: patientData.typePatient,
                    url: `${window.location.origin}/medecin/patient-details/${patientData.id}`
                  })}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-5 w-5 p-0"
                onClick={() => {
                  const qrElement = document.getElementById(`qr-code-${patientData.id}`);
                  if (qrElement) {
                    const canvas = qrElement.querySelector('canvas');
                    if (canvas) {
                      const link = document.createElement('a');
                      link.download = `qr-code-${patientData.prenom}-${patientData.nom}.png`;
                      link.href = canvas.toDataURL();
                      link.click();
                    }
                  }
                }}
              >
                <Download className="h-2.5 w-2.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="rendez-vous">Rendez-vous</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Onglet Informations */}
        <TabsContent value="informations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Informations personnelles</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingInfo(!isEditingInfo)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditingInfo ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nom</label>
                        <Input defaultValue={patientData.nom} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Prénom</label>
                        <Input defaultValue={patientData.prenom} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date de naissance</label>
                        <Input type="date" defaultValue={patientData.dateNaissance} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sexe</label>
                        <Select defaultValue={patientData.sexe}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Masculin</SelectItem>
                            <SelectItem value="F">Féminin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Groupe sanguin</label>
                        <Select defaultValue={patientData.groupeSanguin}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Poids (kg)</label>
                        <Input type="number" defaultValue={patientData.poids} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Statut matrimonial</label>
                        <Select defaultValue={patientData.statutMatrimonial || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CÉLIBATAIRE">Célibataire</SelectItem>
                            <SelectItem value="MARIÉ">Marié</SelectItem>
                            <SelectItem value="MARIÉE">Mariée</SelectItem>
                            <SelectItem value="DIVORCÉ">Divorcé</SelectItem>
                            <SelectItem value="DIVORCÉE">Divorcée</SelectItem>
                            <SelectItem value="VEUF">Veuf</SelectItem>
                            <SelectItem value="VEUVE">Veuve</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Adresse</label>
                        <Input defaultValue={patientData.adresse} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Assurance maladie</label>
                      <Input defaultValue={patientData.assuranceMaladie} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Médecin traitant</label>
                      <Input defaultValue={patientData.medeccinTraitant} />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setIsEditingInfo(false)}>Sauvegarder</Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingInfo(false)}>Annuler</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Nom</label>
                        <p className="text-sm font-medium">{patientData.nom}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Prénom</label>
                        <p className="text-sm font-medium">{patientData.prenom}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date de naissance</label>
                        <p className="text-sm font-medium">{new Date(patientData.dateNaissance).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Sexe</label>
                        <p className="text-sm font-medium">{patientData.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Groupe sanguin</label>
                        <p className="text-sm font-medium">{patientData.groupeSanguin}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Poids</label>
                        <p className="text-sm font-medium">{patientData.poids} kg</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Statut matrimonial</label>
                        <p className="text-sm font-medium">{patientData.statutMatrimonial || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                        <p className="text-sm font-medium">{patientData.adresse}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Assurance maladie</label>
                      <p className="text-sm font-medium">{patientData.assuranceMaladie}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Médecin traitant</label>
                      <p className="text-sm font-medium">{patientData.medeccinTraitant}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact d'urgence */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Contact d'urgence</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingContact(!isEditingContact)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditingContact ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom</label>
                      <Input defaultValue={patientData.contactUrgence.nom} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Téléphone</label>
                      <Input defaultValue={patientData.contactUrgence.telephone} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Relation</label>
                      <Input defaultValue={patientData.contactUrgence.relation} />
                    </div>

                    {/* Tuteur 1 */}
                    <div className="space-y-3 pt-4 border-t">
                      <h5 className="font-semibold text-sm">Tuteur 1</h5>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nom</label>
                          <Input defaultValue={patientData.nomTuteur1 || ''} placeholder="Nom du tuteur" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Prénom</label>
                          <Input defaultValue={patientData.prenomTuteur1 || ''} placeholder="Prénom du tuteur" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Téléphone</label>
                          <Input defaultValue={patientData.numeroTuteur1 || ''} placeholder="77 123 45 67" />
                        </div>
                      </div>
                    </div>

                    {/* Tuteur 2 */}
                    <div className="space-y-3 pt-4 border-t">
                      <h5 className="font-semibold text-sm">Tuteur 2</h5>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nom</label>
                          <Input defaultValue={patientData.nomTuteur2 || ''} placeholder="Nom du tuteur" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Prénom</label>
                          <Input defaultValue={patientData.prenomTuteur2 || ''} placeholder="Prénom du tuteur" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Téléphone</label>
                          <Input defaultValue={patientData.numeroTuteur2 || ''} placeholder="77 123 45 67" />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setIsEditingContact(false)}>Sauvegarder</Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingContact(false)}>Annuler</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Nom</label>
                        <p className="text-sm font-medium">{patientData.contactUrgence.nom}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                        <p className="text-sm font-medium">{patientData.contactUrgence.telephone}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Relation</label>
                        <p className="text-sm font-medium">{patientData.contactUrgence.relation}</p>
                      </div>
                    </div>

                    {/* Affichage Tuteurs */}
                    {(patientData.nomTuteur1 || patientData.prenomTuteur1 || patientData.numeroTuteur1 || 
                      patientData.nomTuteur2 || patientData.prenomTuteur2 || patientData.numeroTuteur2) && (
                      <div className="space-y-4 pt-4 border-t">
                        <h5 className="font-semibold text-sm">Tuteurs</h5>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Tuteur 1 */}
                          {(patientData.nomTuteur1 || patientData.prenomTuteur1 || patientData.numeroTuteur1) && (
                            <>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Prénom</label>
                                <p className="text-sm font-medium">{patientData.prenomTuteur1 || '-'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Nom</label>
                                <p className="text-sm font-medium">{patientData.nomTuteur1 || '-'}</p>
                              </div>
                              <div className="col-span-2 border-b pb-4">
                                <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                                <p className="text-sm font-medium">{patientData.numeroTuteur1 || '-'}</p>
                              </div>
                            </>
                          )}

                          {/* Tuteur 2 */}
                          {(patientData.nomTuteur2 || patientData.prenomTuteur2 || patientData.numeroTuteur2) && (
                            <>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Prénom</label>
                                <p className="text-sm font-medium">{patientData.prenomTuteur2 || '-'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Nom</label>
                                <p className="text-sm font-medium">{patientData.nomTuteur2 || '-'}</p>
                              </div>
                              <div className="col-span-2">
                                <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                                <p className="text-sm font-medium">{patientData.numeroTuteur2 || '-'}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allergies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Allergies</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingAllergies(!isEditingAllergies)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditingAllergies ? (
                  <div className="space-y-2">
                    <Textarea 
                      defaultValue={patientData.allergie.join(', ')}
                      placeholder="Saisissez les allergies séparées par des virgules"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setIsEditingAllergies(false)}>Sauvegarder</Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingAllergies(false)}>Annuler</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {patientData.allergie.length > 0 ? (
                      patientData.allergie.map((allergie, index) => (
                        <Badge key={index} variant="destructive" className="mr-2">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {allergie}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Aucune allergie connue</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Antécédents médicaux */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-blue-500" />
                    <span>Antécédents médicaux</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingAntecedents(!isEditingAntecedents)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditingAntecedents ? (
                  <div className="space-y-2">
                    <Textarea 
                      defaultValue={patientData.antecedentsMedicaux.join(', ')}
                      placeholder="Saisissez les antécédents séparés par des virgules"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setIsEditingAntecedents(false)}>Sauvegarder</Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingAntecedents(false)}>Annuler</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {patientData.antecedentsMedicaux.length > 0 ? (
                      patientData.antecedentsMedicaux.map((antecedent, index) => (
                        <Badge key={index} variant="outline" className="mr-2 text-blue-600 border-blue-600">
                          {antecedent}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Aucun antécédent médical</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Vaccinations */}
        <TabsContent value="vaccinations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Syringe className="h-5 w-5" />
                    <span>Historique des vaccinations</span>
                  </CardTitle>
                  <CardDescription>
                    Liste complète des vaccinations administrées
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle vaccination
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Enregistrer une nouvelle vaccination</DialogTitle>
                      <DialogDescription>
                        Ajoutez une nouvelle vaccination au dossier du patient
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Vaccin</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un vaccin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grippe">Grippe saisonnière</SelectItem>
                              <SelectItem value="dtp">DTP</SelectItem>
                              <SelectItem value="covid">COVID-19</SelectItem>
                              <SelectItem value="hepatite">Hépatite B</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date d'administration</label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Numéro de lot</label>
                          <Input placeholder="ex: FLU2024-001" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Site d'injection</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bras-gauche">Bras gauche</SelectItem>
                              <SelectItem value="bras-droit">Bras droit</SelectItem>
                              <SelectItem value="cuisse-gauche">Cuisse gauche</SelectItem>
                              <SelectItem value="cuisse-droite">Cuisse droite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Administré par</label>
                        <Input placeholder="Nom du professionnel" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Réactions (optionnel)</label>
                        <Textarea placeholder="Décrire les éventuelles réactions..." />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Annuler</Button>
                        <Button>Enregistrer la vaccination</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaccin</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Lot</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Administré par</TableHead>
                    <TableHead>Prochain rappel</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaccinationsData.map((vaccination) => (
                    <TableRow key={vaccination.id}>
                      <TableCell className="font-medium">{vaccination.vaccin}</TableCell>
                      <TableCell>{new Date(vaccination.dateAdministration).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{vaccination.lotNumero}</code>
                      </TableCell>
                      <TableCell>{vaccination.site}</TableCell>
                      <TableCell>{vaccination.administrePar}</TableCell>
                      <TableCell>
                        {vaccination.prochainRappel ? 
                          new Date(vaccination.prochainRappel).toLocaleDateString('fr-FR') : 
                          '-'
                        }
                      </TableCell>
                      <TableCell>{getVaccinationStatusBadge(vaccination.statut)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Rendez-vous */}
        <TabsContent value="rendez-vous" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Historique des rendez-vous</span>
                  </CardTitle>
                  <CardDescription>
                    Rendez-vous passés et à venir
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Planifier un rendez-vous
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rendezVousData.map((rdv) => (
                    <TableRow key={rdv.id}>
                      <TableCell>{new Date(rdv.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{rdv.heure}</TableCell>
                      <TableCell className="font-medium">{rdv.motif}</TableCell>
                      <TableCell>{getRendezVousStatusBadge(rdv.statut)}</TableCell>
                      <TableCell className="text-muted-foreground">{rdv.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Documents */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Documents et pièces jointes</span>
                  </CardTitle>
                  <CardDescription>
                    Certificats, ordonnances et autres documents
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun document disponible</p>
                <p className="text-sm text-muted-foreground">Les documents ajoutés apparaîtront ici</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Section Informations du Parent - Affichée seulement pour les enfants */}
      {patientData.typePatient === 'enfant' && parentData && (
        <Card className="mt-6 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <User className="h-5 w-5" />
              <span>Informations du Parent/Tuteur</span>
            </CardTitle>
            <CardDescription>
              Informations de contact et détails du parent ou tuteur légal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Identité du parent */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Identité</h4>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-blue-100">
                    <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold">
                      {parentData.prenom.charAt(0)}{parentData.nom.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{parentData.prenom} {parentData.nom}</p>
                    <p className="text-sm text-gray-500">{parentData.age} ans • {parentData.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500 block">Date de naissance</span>
                    <span className="font-medium">{new Date(parentData.dateNaissance).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Statut</span>
                    {getStatusBadge(parentData.statut)}
                  </div>
                </div>
              </div>

              {/* Contact du parent */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Contact</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{parentData.telephone}</span>
                  </div>
                  {parentData.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{parentData.email}</span>
                    </div>
                  )}
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{parentData.adresse}</span>
                  </div>
                </div>
              </div>

              {/* Informations médicales du parent */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Informations médicales</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500 block">Groupe sanguin</span>
                    <span className="font-medium">{parentData.groupeSanguin}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Médecin traitant</span>
                    <span className="font-medium">{parentData.medeccinTraitant}</span>
                  </div>
                  {parentData.assuranceMaladie && (
                    <div>
                      <span className="text-sm text-gray-500 block">Assurance maladie</span>
                      <span className="font-medium font-mono">{parentData.assuranceMaladie}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Allergies et antécédents du parent */}
            {(parentData.allergie.length > 0 || parentData.antecedentsMedicaux.length > 0) && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parentData.allergie.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Allergies du parent</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {parentData.allergie.map((allergie, index) => (
                          <Badge key={index} variant="outline" className="text-red-600 border-red-200">
                            {allergie}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {parentData.antecedentsMedicaux.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-blue-500" />
                        <span>Antécédents du parent</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {parentData.antecedentsMedicaux.map((antecedent, index) => (
                          <Badge key={index} variant="outline" className="text-blue-600 border-blue-200">
                            {antecedent}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes sur le parent */}
            {parentData.notes && (
              <div className="mt-6 pt-6 border-t">
                <h5 className="font-semibold text-gray-900 mb-2">Notes concernant le parent</h5>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{parentData.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
