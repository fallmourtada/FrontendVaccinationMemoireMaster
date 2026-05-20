import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  CalendarDays, 
  Plus, 
  Syringe,
  Baby,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import PageContainer from "@/components/shared/page-container";
import { ModalProvider, useModal } from '@/components/shared/modal-provider';
import {
  CreateVaccinModal,
  UpdateVaccinModal,
  DetailVaccinModal,
  DetailRendezVousModal,
  UpdateRendezVousModal,
  CreateRendezVousModal,
  DeleteModal
} from '@/components/modals';

// Types pour les vaccins
interface Vaccin {
  id: string;
  nom: string;
  description: string;
  ageMin: string;
  ageMax: string;
  obligatoire: boolean;
  rappels?: string[];
  cible: 'enfant' | 'femme_enceinte' | 'femme_post_accouchement' | 'adulte' | 'senior';
}

// Types pour les rendez-vous
interface RendezVous {
  id: string;
  patientNom: string;
  patientPrenom: string;
  patientAge: number;
  telephone: string;
  email: string;
  date: string;
  heure: string;
  vaccin: string;
  type: 'vaccination' | 'consultation' | 'rappel';
  statut: 'confirme' | 'en_attente' | 'reporte' | 'annule';
  notes?: string;
}

// Données de vaccins par âge
  const vaccinsEnfants: Vaccin[] = [
    {
      id: '1',
      nom: 'BCG',
      description: 'Vaccin contre la tuberculose',
      ageMin: 'Naissance',
      ageMax: '6 mois',
      obligatoire: true,
      cible: 'enfant'
    },
    {
      id: '2',
      nom: 'Hépatite B',
      description: 'Vaccin contre l\'hépatite B',
      ageMin: 'Naissance',
      ageMax: '2 mois',
      obligatoire: true,
      rappels: ['1 mois', '6 mois'],
      cible: 'enfant'
    },
    {
      id: '3',
      nom: 'DTC-Polio-Hib',
      description: 'Diphtérie, Tétanos, Coqueluche, Poliomyélite, Haemophilus',
      ageMin: '2 mois',
      ageMax: '4 mois',
      obligatoire: true,
      rappels: ['3 mois', '4 mois', '18 mois', '6 ans'],
      cible: 'enfant'
    },
    {
      id: '4',
      nom: 'Pneumocoque',
      description: 'Vaccin contre le pneumocoque',
      ageMin: '2 mois',
      ageMax: '4 mois',
      obligatoire: true,
      rappels: ['3 mois', '12 mois'],
      cible: 'enfant'
    },
    {
      id: '5',
      nom: 'Rotavirus',
      description: 'Vaccin contre le rotavirus',
      ageMin: '6 semaines',
      ageMax: '6 mois',
      obligatoire: false,
      rappels: ['2 mois', '4 mois'],
      cible: 'enfant'
    },
    {
      id: '6',
      nom: 'ROR',
      description: 'Rougeole, Oreillons, Rubéole',
      ageMin: '12 mois',
      ageMax: '18 mois',
      obligatoire: true,
      rappels: ['16-18 mois'],
      cible: 'enfant'
    },
    {
      id: '7',
      nom: 'Méningocoque C',
      description: 'Vaccin contre le méningocoque C',
      ageMin: '5 mois',
      ageMax: '12 mois',
      obligatoire: true,
      cible: 'enfant'
    },
    {
      id: '8',
      nom: 'HPV',
      description: 'Papillomavirus humain',
      ageMin: '11 ans',
      ageMax: '14 ans',
      obligatoire: false,
      rappels: ['6 mois après la 1ère dose'],
      cible: 'enfant'
    }
  ];

  const vaccinsFemmeEnceinte: Vaccin[] = [
    {
      id: 'f1',
      nom: 'dTcaP',
      description: 'Diphtérie, Tétanos, Coqueluche acellulaire',
      ageMin: '20 semaines',
      ageMax: '32 semaines',
      obligatoire: true,
      cible: 'femme_enceinte'
    },
    {
      id: 'f2',
      nom: 'Grippe saisonnière',
      description: 'Vaccin contre la grippe',
      ageMin: 'Tout trimestre',
      ageMax: 'Accouchement',
      obligatoire: false,
      cible: 'femme_enceinte'
    },
    {
      id: 'f3',
      nom: 'COVID-19',
      description: 'Vaccin contre le COVID-19',
      ageMin: 'Tout trimestre',
      ageMax: 'Accouchement',
      obligatoire: false,
      cible: 'femme_enceinte'
    }
  ];

  const vaccinsFemmePostAccouchement: Vaccin[] = [
    {
      id: 'p1',
      nom: 'ROR',
      description: 'Rougeole, Oreillons, Rubéole (si non immunisée)',
      ageMin: 'Post-partum immédiat',
      ageMax: '6 mois post-partum',
      obligatoire: false,
      cible: 'femme_post_accouchement'
    },
    {
      id: 'p2',
      nom: 'Varicelle',
      description: 'Vaccin contre la varicelle (si non immunisée)',
      ageMin: 'Post-partum immédiat',
      ageMax: '6 mois post-partum',
      obligatoire: false,
      cible: 'femme_post_accouchement'
    },
    {
      id: 'p3',
      nom: 'dTcaP',
      description: 'Rappel Diphtérie, Tétanos, Coqueluche',
      ageMin: '2 semaines post-partum',
      ageMax: '3 mois post-partum',
      obligatoire: true,
      cible: 'femme_post_accouchement'
    },
    {
      id: 'p4',
      nom: 'Grippe saisonnière',
      description: 'Vaccin contre la grippe',
      ageMin: 'Post-partum immédiat',
      ageMax: '12 mois post-partum',
      obligatoire: false,
      cible: 'femme_post_accouchement'
    }
  ];

  // Données de rendez-vous
  const rendezVousData: RendezVous[] = [
    {
      id: '1',
      patientNom: 'Mbaye',
      patientPrenom: 'Abdoulaye',
      patientAge: 3,
      telephone: '771234567',
      email: 'mbaye.abdoulaye@email.com',
      date: '2025-09-13',
      heure: '08:30',
      vaccin: 'DTC-Polio',
      type: 'vaccination',
      statut: 'confirme'
    },
    {
      id: '2',
      patientNom: 'Saliou',
      patientPrenom: 'Ndiaye',
      patientAge: 0,
      telephone: '781234567',
      email: 'ndiaye.saliou@email.com',
      date: '2025-09-13',
      heure: '10:15',
      vaccin: 'BCG',
      type: 'vaccination',
      statut: 'en_attente'
    },
    {
      id: '3',
      patientNom: 'Diallo',
      patientPrenom: 'Fatou',
      patientAge: 2,
      telephone: '771239043',
      email: 'fatou.diallo@email.com',
      date: '2025-09-14',
      heure: '09:00',
      vaccin: 'ROR',
      type: 'vaccination',
      statut: 'confirme'
    },
    {
      id: '4',
      patientNom: 'Ba',
      patientPrenom: 'Moussa',
      patientAge: 1,
      telephone: '763203826',
      email: 'moussa.ba@email.com',
      date: '2025-09-14',
      heure: '11:30',
      vaccin: 'Pneumocoque',
      type: 'vaccination',
      statut: 'en_attente'
    },
    {
      id: '5',
      patientNom: 'Ndiaye',
      patientPrenom: 'Aminata',
      patientAge: 25,
      telephone: '712394028',
      email: 'aminata.ndiaye@email.com',
      date: '2025-09-15',
      heure: '14:00',
      vaccin: 'dTcaP',
      type: 'vaccination',
      statut: 'confirme'
    },
    {
      id: '6',
      patientNom: 'Sow',
      patientPrenom: 'Ibrahima',
      patientAge: 4,
      telephone: '753902846',
      email: 'ibrahima.sow@email.com',
      date: '2025-09-15',
      heure: '15:45',
      vaccin: 'Méningocoque C',
      type: 'vaccination',
      statut: 'reporte'
    },
    {
      id: '7',
      patientNom: 'Fall',
      patientPrenom: 'Khadija',
      patientAge: 0,
      telephone: '768473082',
      email: 'khadija.fall@email.com',
      date: '2025-09-16',
      heure: '08:15',
      vaccin: 'Hépatite B',
      type: 'vaccination',
      statut: 'confirme'
    },
    {
      id: '8',
      patientNom: 'Camara',
      patientPrenom: 'Ousmane',
      patientAge: 5,
      telephone: '783739103',
      email: 'ousmane.camara@email.com',
      date: '2025-09-16',
      heure: '10:00',
      vaccin: 'DTC-Polio-Hib',
      type: 'vaccination',
      statut: 'en_attente'
    },
    {
      id: '9',
      patientNom: 'Kane',
      patientPrenom: 'Awa',
      patientAge: 28,
      telephone: '773940292',
      email: 'awa.kane@email.com',
      date: '2025-09-17',
      heure: '13:30',
      vaccin: 'Grippe saisonnière',
      type: 'vaccination',
      statut: 'confirme'
    },
    {
      id: '10',
      patientNom: 'Traore',
      patientPrenom: 'Sekou',
      patientAge: 3,
      telephone: '750938503',
      email: 'sekou.traore@email.com',
      date: '2025-09-17',
      heure: '16:15',
      vaccin: 'Rotavirus',
      type: 'vaccination',
      statut: 'annule'
    },
    {
      id: '11',
      patientNom: 'Cisse',
      patientPrenom: 'Mariama',
      patientAge: 1,
      telephone: '7194840387',
      email: 'mariama.cisse@email.com',
      date: '2025-09-18',
      heure: '09:45',
      vaccin: 'BCG',
      type: 'vaccination',
      statut: 'confirme'
    },
    {
      id: '12',
      patientNom: 'Sarr',
      patientPrenom: 'Amadou',
      patientAge: 2,
      telephone: '773938463',
      email: 'amadou.sarr@email.com',
      date: '2025-09-18',
      heure: '11:00',
      vaccin: 'Pneumocoque',
      type: 'vaccination',
      statut: 'en_attente'
    }
  ];

function CalendrierContent() {
  const [activeTab, setActiveTab] = useState('vaccins-enfants');
  const [currentPageRendezVous, setCurrentPageRendezVous] = useState(1);
  const [currentPageEnfants, setCurrentPageEnfants] = useState(1);
  const [currentPageFemmesEnceintes, setCurrentPageFemmesEnceintes] = useState(1);
  const [currentPageFemmesPost, setCurrentPageFemmesPost] = useState(1);
  
  // États pour les filtres
  const [searchTermVaccins, setSearchTermVaccins] = useState('');
  const [statutFilterVaccins, setStatutFilterVaccins] = useState('tous');
  const [searchTermRendezVous, setSearchTermRendezVous] = useState('');
  const [statutFilterRendezVous, setStatutFilterRendezVous] = useState('tous');
  
  const itemsPerPageRendezVous = 5;
  const itemsPerPageVaccins = 5;
  
  const { openModal } = useModal();

  // Filtrage des rendez-vous
  const filteredRendezVous = rendezVousData.filter(rdv => {
    const matchSearch = searchTermRendezVous === '' || 
      rdv.patientNom.toLowerCase().includes(searchTermRendezVous.toLowerCase()) ||
      rdv.patientPrenom.toLowerCase().includes(searchTermRendezVous.toLowerCase()) ||
      rdv.vaccin.toLowerCase().includes(searchTermRendezVous.toLowerCase());
    const matchStatut = statutFilterRendezVous === 'tous' || rdv.statut === statutFilterRendezVous;
    return matchSearch && matchStatut;
  });

  // Filtrage des vaccins par catégorie
  const filterVaccins = (vaccins: Vaccin[]) => {
    return vaccins.filter(vaccin => {
      const matchSearch = searchTermVaccins === '' || 
        vaccin.nom.toLowerCase().includes(searchTermVaccins.toLowerCase()) ||
        vaccin.description.toLowerCase().includes(searchTermVaccins.toLowerCase());
      const matchStatut = statutFilterVaccins === 'tous' || 
        (statutFilterVaccins === 'obligatoire' && vaccin.obligatoire) ||
        (statutFilterVaccins === 'recommande' && !vaccin.obligatoire);
      return matchSearch && matchStatut;
    });
  };

  const filteredVaccinsEnfants = filterVaccins(vaccinsEnfants);
  const filteredVaccinsFemmesEnceintes = filterVaccins(vaccinsFemmeEnceinte);
  const filteredVaccinsFemmesPost = filterVaccins(vaccinsFemmePostAccouchement);

  // Pagination des rendez-vous
  const startIndexRendezVous = (currentPageRendezVous - 1) * itemsPerPageRendezVous;
  const paginatedRendezVous = filteredRendezVous.slice(startIndexRendezVous, startIndexRendezVous + itemsPerPageRendezVous);
  const totalPagesRendezVous = Math.ceil(filteredRendezVous.length / itemsPerPageRendezVous);

  // Pagination des vaccins enfants
  const startIndexEnfants = (currentPageEnfants - 1) * itemsPerPageVaccins;
  const paginatedVaccinsEnfants = filteredVaccinsEnfants.slice(startIndexEnfants, startIndexEnfants + itemsPerPageVaccins);
  const totalPagesEnfants = Math.ceil(filteredVaccinsEnfants.length / itemsPerPageVaccins);

  // Pagination des vaccins femmes enceintes
  const startIndexFemmesEnceintes = (currentPageFemmesEnceintes - 1) * itemsPerPageVaccins;
  const paginatedVaccinsFemmesEnceintes = filteredVaccinsFemmesEnceintes.slice(startIndexFemmesEnceintes, startIndexFemmesEnceintes + itemsPerPageVaccins);
  const totalPagesFemmesEnceintes = Math.ceil(filteredVaccinsFemmesEnceintes.length / itemsPerPageVaccins);

  // Pagination des vaccins femmes post-accouchement
  const startIndexFemmesPost = (currentPageFemmesPost - 1) * itemsPerPageVaccins;
  const paginatedVaccinsFemmesPost = filteredVaccinsFemmesPost.slice(startIndexFemmesPost, startIndexFemmesPost + itemsPerPageVaccins);
  const totalPagesFemmesPost = Math.ceil(filteredVaccinsFemmesPost.length / itemsPerPageVaccins);

  // Remettre à la page 1 quand on change d'onglet ou les filtres
  useEffect(() => {
    setCurrentPageRendezVous(1);
    setCurrentPageEnfants(1);
    setCurrentPageFemmesEnceintes(1);
    setCurrentPageFemmesPost(1);
  }, [activeTab, searchTermVaccins, statutFilterVaccins, searchTermRendezVous, statutFilterRendezVous]);

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'confirme':
        return <Badge className="bg-blue-600 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Confirmé</Badge>;
      case 'en_attente':
        return <Badge className="bg-blue-500 text-white"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'reporte':
        return <Badge className="bg-blue-700 text-white">Reporté</Badge>;
      case 'annule':
        return <Badge className="bg-slate-400 text-white"><XCircle className="w-3 h-3 mr-1" />Annulé</Badge>;
      default:
        return <Badge className="bg-blue-600 text-white">{statut}</Badge>;
    }
  };

  const getVaccinBadge = (obligatoire: boolean) => {
    return obligatoire 
      ? <Badge className="bg-blue-600 text-white">Obligatoire</Badge>
      : <Badge className="bg-blue-500 text-white">Recommandé</Badge>;
  };

  const handleVaccinAction = (action: string, vaccin: Vaccin) => {
    switch (action) {
      case 'detail':
        openModal('detail-vaccin', vaccin);
        break;
      case 'edit':
        openModal('update-vaccin', vaccin);
        break;
      case 'delete':
        openModal('delete-vaccin', vaccin);
        break;
      case 'create':
        openModal('create-vaccin');
        break;
    }
  };

  const handleDeleteRendezVous = (rdv: RendezVous) => {
    openModal('delete-rendez-vous', rdv);
  };

  const handleUpdateRendezVous = (rdv: RendezVous) => {
    openModal('update-rendez-vous', rdv);
  };

  const handleConfirmDeleteVaccin = () => {
    console.log('Suppression du vaccin confirmée');
    // Ici vous ajouterez la logique de suppression du vaccin
  };

  const handleConfirmDeleteRendezVous = () => {
    console.log('Suppression du rendez-vous confirmée');
    // Ici vous ajouterez la logique de suppression du rendez-vous
  };

  const renderVaccinTable = (
    vaccins: Vaccin[], 
    title: string, 
    icon: React.ReactNode, 
    currentPage: number, 
    setCurrentPage: (page: number) => void, 
    totalPages: number
  ) => (
    <Card className="border-0 shadow-md dark:bg-slate-900 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-white">{icon}</div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
          </div>
          <Button size="sm" onClick={() => handleVaccinAction('create', {} as Vaccin)} className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau vaccin
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        {/* Filtres pour les vaccins */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Rechercher un vaccin..."
                value={searchTermVaccins}
                onChange={(e) => setSearchTermVaccins(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-300 dark:border-blue-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
          
          <Select value={statutFilterVaccins} onValueChange={setStatutFilterVaccins}>
            <SelectTrigger className="w-full lg:w-48 border-blue-200 focus:border-blue-500 focus:ring-blue-300 dark:border-blue-800 dark:bg-slate-800 dark:text-white">
              <SelectValue placeholder="Type de vaccin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les vaccins</SelectItem>
              <SelectItem value="obligatoire">Obligatoires</SelectItem>
              <SelectItem value="recommande">Recommandés</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                <TableHead className="h-12 px-6 text-left align-middle font-bold text-blue-700 dark:text-blue-300">Vaccin</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-bold text-blue-700 dark:text-blue-300">Âge recommandé</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-bold text-blue-700 dark:text-blue-300">Statut</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-bold text-blue-700 dark:text-blue-300">Rappels</TableHead>
                <TableHead className="h-12 px-4 text-center align-middle font-bold text-blue-700 dark:text-blue-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vaccins.map((vaccin, index) => (
                <TableRow 
                  key={vaccin.id}
                  className={`
                    border-b border-blue-100 dark:border-blue-800/50 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/10
                    ${index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-blue-50/30 dark:bg-slate-800/20'}
                  `}
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Syringe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{vaccin.nom}</div>
                        <div className="text-sm text-muted-foreground">{vaccin.description}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">{vaccin.ageMin}</div>
                      {vaccin.ageMax && (
                        <div className="text-muted-foreground">jusqu'à {vaccin.ageMax}</div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    {getVaccinBadge(vaccin.obligatoire)}
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    {vaccin.rappels ? (
                      <div className="space-y-1">
                        {vaccin.rappels.map((rappel, idx) => (
                          <div key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {rappel}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Aucun rappel</span>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleVaccinAction('detail', vaccin)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleVaccinAction('edit', vaccin)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleVaccinAction('delete', vaccin)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {vaccins.length === 0 && (
            <div className="text-center py-8">
              <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Aucun vaccin trouvé</h3>
              <p className="text-muted-foreground">
                {searchTermVaccins || statutFilterVaccins !== 'tous' 
                  ? "Aucun vaccin ne correspond à vos critères de recherche."
                  : "Aucun vaccin enregistré pour cette catégorie."
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Pagination pour les vaccins */}
      {totalPages > 1 && (
        <div className="flex justify-center p-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );

  return (
    <PageContainer 
      title="Calendrier vaccinal & Rendez-vous" 
      subtitle="Consultez le calendrier des vaccins et gérez vos créneaux de vaccination"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
          <TabsTrigger value="vaccins-enfants" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">
            <Baby className="w-4 h-4" />
            <span>Enfants</span>
          </TabsTrigger>
          <TabsTrigger value="vaccins-femmes-enceintes" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">
            <Users className="w-4 h-4" />
            <span>Femmes enceintes</span>
          </TabsTrigger>
          <TabsTrigger value="vaccins-femmes-post" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">
            <Users className="w-4 h-4" />
            <span>Post-accouchement</span>
          </TabsTrigger>
          <TabsTrigger value="rendez-vous" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">
            <CalendarDays className="w-4 h-4" />
            <span>Rendez-vous</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Vaccins pour Enfants */}
        <TabsContent value="vaccins-enfants" className="space-y-6">
          {renderVaccinTable(
            paginatedVaccinsEnfants, 
            "Calendrier vaccinal - De la naissance à l'adolescence",
            <Baby className="w-5 h-5 text-white" />,
            currentPageEnfants,
            setCurrentPageEnfants,
            totalPagesEnfants
          )}
        </TabsContent>

        {/* Onglet Vaccins pour Femmes Enceintes */}
        <TabsContent value="vaccins-femmes-enceintes" className="space-y-6">
          {renderVaccinTable(
            paginatedVaccinsFemmesEnceintes, 
            "Vaccins pour femmes enceintes",
            <Users className="w-5 h-5 text-white" />,
            currentPageFemmesEnceintes,
            setCurrentPageFemmesEnceintes,
            totalPagesFemmesEnceintes
          )}
        </TabsContent>

        {/* Onglet Vaccins pour Femmes après Accouchement */}
        <TabsContent value="vaccins-femmes-post" className="space-y-6">
          {renderVaccinTable(
            paginatedVaccinsFemmesPost, 
            "Vaccins pour femmes après accouchement",
            <Users className="w-5 h-5 text-white" />,
            currentPageFemmesPost,
            setCurrentPageFemmesPost,
            totalPagesFemmesPost
          )}
        </TabsContent>

        {/* Onglet Rendez-vous */}
        <TabsContent value="rendez-vous" className="space-y-6">
          <Card className="border-0 shadow-md dark:bg-slate-900 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="w-5 h-5 text-white" />
                  <h3 className="text-white font-bold text-lg">Rendez-vous planifiés</h3>
                </div>
                <Button size="sm" onClick={() => openModal('create-rendez-vous')} className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau RDV
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Liste des rendez-vous de vaccination programmés
              </p>

              {/* Filtres pour les rendez-vous */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                    <Input
                      placeholder="Rechercher par patient ou vaccin..."
                      value={searchTermRendezVous}
                      onChange={(e) => setSearchTermRendezVous(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-300 dark:border-blue-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
                
                <Select value={statutFilterRendezVous} onValueChange={setStatutFilterRendezVous}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="confirme">Confirmé</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="reporte">Reporté</SelectItem>
                    <SelectItem value="annule">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardContent className="p-0 border-t border-blue-100 dark:border-blue-800/50">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                      <TableHead className="h-12 px-6 text-left align-middle font-bold text-blue-700 dark:text-blue-300">Patient</TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-bold text-blue-700 dark:text-blue-300">Contact</TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-bold text-blue-700 dark:text-blue-300">Rendez-vous</TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-bold text-blue-700 dark:text-blue-300">Vaccin</TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-bold text-blue-700 dark:text-blue-300">Statut</TableHead>
                      <TableHead className="h-12 px-4 text-center align-middle font-bold text-blue-700 dark:text-blue-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRendezVous.map((rdv, index) => (
                      <TableRow 
                        key={rdv.id}
                        className={`
                          border-b border-blue-100 dark:border-blue-800/50 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/10
                          ${index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-blue-50/30 dark:bg-slate-800/20'}
                        `}
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10 border-2 border-primary/10">
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                                {rdv.patientPrenom.charAt(0)}{rdv.patientNom.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-foreground">
                                {rdv.patientPrenom} {rdv.patientNom}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {rdv.patientAge} an{rdv.patientAge > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-foreground">{rdv.telephone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{rdv.email}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-foreground">
                              {format(new Date(rdv.date), 'dd/MM/yyyy')}
                            </div>
                            <div className="text-muted-foreground">{rdv.heure}</div>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <div className="inline-flex items-center px-3 py-1 rounded-md bg-primary/5 border border-primary/20">
                            <Syringe className="w-3 h-3 mr-2 text-primary" />
                            <span className="text-sm font-medium text-primary">{rdv.vaccin}</span>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          {getStatutBadge(rdv.statut)}
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <div className="flex items-center justify-center space-x-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => openModal('detail-rendez-vous', rdv)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleUpdateRendezVous(rdv)}
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteRendezVous(rdv)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {paginatedRendezVous.length === 0 && (
                  <div className="text-center py-8">
                    <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Aucun rendez-vous trouvé</h3>
                    <p className="text-muted-foreground">
                      {searchTermRendezVous || statutFilterRendezVous !== 'tous' 
                        ? "Aucun rendez-vous ne correspond à vos critères de recherche."
                        : "Aucun rendez-vous planifié pour le moment."
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pagination pour les rendez-vous */}
          {totalPagesRendezVous > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPageRendezVous > 1) setCurrentPageRendezVous(currentPageRendezVous - 1);
                      }}
                    />
                  </PaginationItem>
                  {[...Array(totalPagesRendezVous)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPageRendezVous === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPageRendezVous(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPageRendezVous < totalPagesRendezVous) setCurrentPageRendezVous(currentPageRendezVous + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <CreateVaccinModal />
      <UpdateVaccinModal />
      <DetailVaccinModal />
      <DetailRendezVousModal />
      <UpdateRendezVousModal />
      <CreateRendezVousModal />
      <DeleteModal modalId="delete-vaccin" onConfirm={handleConfirmDeleteVaccin} />
      <DeleteModal modalId="delete-rendez-vous" onConfirm={handleConfirmDeleteRendezVous} />
    </PageContainer>
  );
}

function Calendrier() {
  return (
    <ModalProvider>
      <CalendrierContent />
    </ModalProvider>
  );
}

export default Calendrier;
