import PageContainer from "@/components/shared/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  Activity,
  Plus, 
  Search, 
  Edit,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { useState } from 'react';
import { ModalProvider, useModal } from '@/components/shared/modal-provider';
import { useNotification } from '@/components/shared/app-notification';

// Types pour les centres
interface Centre {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
  responsable: string;
  statut: 'actif' | 'inactif' | 'maintenance';
  typeService: 'public' | 'prive' | 'mixte';
  capaciteJour: number;
  heuresOuverture: string;
  specialites: string[];
  totalVaccinations: number;
  vaccinationsHebdo: number;
}

// Données simulées
const centresData: Centre[] = [
  {
    id: '1',
    nom: 'Centre de Santé Nabil Choucair',
    adresse: 'Avenue Cheikh Anta Diop',
    ville: 'Dakar',
    codePostal: 'BP 10000',
    telephone: '33 825 67 89',
    email: 'contact@nabilchoucair.sn',
    responsable: 'Dr. Awa Diop',
    statut: 'actif',
    typeService: 'public',
    capaciteJour: 200,
    heuresOuverture: '8h00 - 18h00',
    specialites: ['COVID-19', 'Grippe', 'Hépatite B', 'Paludisme'],
    totalVaccinations: 3250,
    vaccinationsHebdo: 185
  },
  {
    id: '2',
    nom: 'Centre Hospitalier Régional de Thiès',
    adresse: 'Route de Tivaouane',
    ville: 'Thiès',
    codePostal: 'BP 12',
    telephone: '33 951 23 45',
    email: 'info@chr-thies.sn',
    responsable: 'Dr. Mamadou Fall',
    statut: 'actif',
    typeService: 'public',
    capaciteJour: 250,
    heuresOuverture: '7h30 - 19h30',
    specialites: ['COVID-19', 'Grippe', 'ROR', 'Pneumocoque'],
    totalVaccinations: 4120,
    vaccinationsHebdo: 220
  },
  {
    id: '3',
    nom: 'Hôpital Régional de Saint-Louis',
    adresse: 'Quartier Nord, Rue Blaise Diagne',
    ville: 'Saint-Louis',
    codePostal: 'BP 234',
    telephone: '33 961 22 11',
    email: 'contact@hopital-saintlouis.sn',
    responsable: 'Dr. Khady Ndiaye',
    statut: 'actif',
    typeService: 'public',
    capaciteJour: 180,
    heuresOuverture: '8h00 - 17h00',
    specialites: ['COVID-19', 'Vaccins voyage', 'Grippe'],
    totalVaccinations: 2780,
    vaccinationsHebdo: 120
  },
  {
    id: '4',
    nom: 'Centre de Santé de Mbour',
    adresse: 'Boulevard de la Mer',
    ville: 'Mbour',
    codePostal: 'BP 78',
    telephone: '33 957 89 12',
    email: 'mbour-sante@msas.sn',
    responsable: 'Dr. Samba Cissé',
    statut: 'actif',
    typeService: 'public',
    capaciteJour: 160,
    heuresOuverture: '8h00 - 17h00',
    specialites: ['COVID-19', 'Grippe', 'Fièvre jaune'],
    totalVaccinations: 1950,
    vaccinationsHebdo: 85
  },
  {
    id: '5',
    nom: 'Polyclinique du Cap-Vert',
    adresse: 'Route de Ngor Almadies',
    ville: 'Dakar',
    codePostal: 'BP 12000',
    telephone: '33 820 11 22',
    email: 'accueil@polyclinique-capvert.sn',
    responsable: 'Dr. Abdoulaye Diouf',
    statut: 'actif',
    typeService: 'prive',
    capaciteJour: 120,
    heuresOuverture: '8h00 - 18h00',
    specialites: ['Vaccins voyage', 'COVID-19', 'Grippe'],
    totalVaccinations: 2100,
    vaccinationsHebdo: 110
  },
  {
    id: '6',
    nom: 'Centre de Santé de Kaolack',
    adresse: 'Avenue Malick Sy',
    ville: 'Kaolack',
    codePostal: 'BP 15',
    telephone: '33 941 45 67',
    email: 'contact@centre-kaolack.sn',
    responsable: 'Dr. Fatou Sow',
    statut: 'actif',
    typeService: 'public',
    capaciteJour: 190,
    heuresOuverture: '8h00 - 17h00',
    specialites: ['COVID-19', 'Grippe', 'Hépatite A/B'],
    totalVaccinations: 2600,
    vaccinationsHebdo: 130
  },
  {
    id: '7',
    nom: 'Hôpital de Ziguinchor',
    adresse: 'Quartier Lyndiane',
    ville: 'Ziguinchor',
    codePostal: 'BP 77',
    telephone: '33 993 33 44',
    email: 'info@hopital-ziguinchor.sn',
    responsable: 'Dr. Ousmane Camara',
    statut: 'maintenance',
    typeService: 'public',
    capaciteJour: 140,
    heuresOuverture: '8h30 - 16h30',
    specialites: ['COVID-19', 'Vaccins voyage'],
    totalVaccinations: 1850,
    vaccinationsHebdo: 90
  },
  {
    id: '8',
    nom: 'Centre de Santé de Tambacounda',
    adresse: 'Route Nationale 1',
    ville: 'Tambacounda',
    codePostal: 'BP 50',
    telephone: '33 982 22 55',
    email: 'contact@centre-tamba.sn',
    responsable: 'Dr. Mariama Diallo',
    statut: 'inactif',
    typeService: 'public',
    capaciteJour: 80,
    heuresOuverture: 'Fermé',
    specialites: ['COVID-19', 'Grippe'],
    totalVaccinations: 940,
    vaccinationsHebdo: 0
  },
  {
    id: '9',
    nom: 'Centre de Santé Alioune Diop',
    adresse: 'Université Alioune Diop',
    ville: 'Bambey',
    codePostal: 'BP 30',
    telephone: '33 945 55 55',
    email: 'contact@centre-bambey.sn',
    responsable: 'Dr. Cheikh Gueye',
    statut: 'actif',
    typeService: 'mixte',
    capaciteJour: 220,
    heuresOuverture: '7h00 - 20h00',
    specialites: ['COVID-19', 'Grippe', 'ROR', 'Hépatite'],
    totalVaccinations: 3480,
    vaccinationsHebdo: 190
  },
  {
    id: '10',
    nom: 'Clinique Pasteur Dakar',
    adresse: 'Avenue Nelson Mandela',
    ville: 'Dakar',
    codePostal: 'BP 12345',
    telephone: '33 889 45 67',
    email: 'accueil@clinique-pasteur.sn',
    responsable: 'Dr. Ndèye Ndiaye',
    statut: 'actif',
    typeService: 'prive',
    capaciteJour: 100,
    heuresOuverture: '9h00 - 17h00',
    specialites: ['Vaccins voyage', 'COVID-19'],
    totalVaccinations: 1650,
    vaccinationsHebdo: 70
  }
];


const statutConfig = {
  actif: { label: 'Actif', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', icon: CheckCircle2 },
  inactif: { label: 'Inactif', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', icon: XCircle },
  maintenance: { label: 'Maintenance', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', icon: AlertTriangle }
};

const typeServiceConfig = {
  public: { label: 'Public', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
  prive: { label: 'Privé', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
  mixte: { label: 'Mixte', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300' }
};

function CentreContent() {
  const { openModal } = useModal();
  const notification = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('tous');
  const [typeFilter, setTypeFilter] = useState<string>('tous');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Remettre à la page 1 quand les filtres changent
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, statutFilter, typeFilter]);

  // Filtrage des centres
  const filteredCentres = centresData.filter(centre => {
    const matchSearch = 
      centre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centre.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centre.responsable.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatut = statutFilter === 'tous' || centre.statut === statutFilter;
    const matchType = typeFilter === 'tous' || centre.typeService === typeFilter;
    
    return matchSearch && matchStatut && matchType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCentres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCentres = filteredCentres.slice(startIndex, startIndex + itemsPerPage);

  // Statistiques rapides
  const stats = {
    total: centresData.length,
    actifs: centresData.filter(c => c.statut === 'actif').length,
    capaciteTotal: centresData.reduce((sum, c) => sum + c.capaciteJour, 0),
    vaccinationsTotal: centresData.reduce((sum, c) => sum + c.totalVaccinations, 0)
  };

  const handleCreateCentre = () => {
    openModal('create-centre', {});
    notification.info({
      title: "Nouveau centre",
      description: "Ouverture du formulaire d'ajout de centre"
    });
  };

  const handleEditCentre = (centre: Centre) => {
    openModal('edit-centre', centre);
    notification.info({
      title: "Modification centre",
      description: `Édition du centre ${centre.nom}`
    });
  };

  const handleViewDetails = (centre: Centre) => {
    openModal('detail-centre', centre);
    notification.info({
      title: "Détails centre",
      description: `Consultation des détails du centre ${centre.nom}`
    });
  };

  return (
    <PageContainer 
      title="Centres de Santé" 
      subtitle="Gestion des centres de vaccination et de santé"
    >
      <div className="space-y-6">
        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Centres</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Centres Actifs</p>
                  <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Capacité/Jour</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.capaciteTotal}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vaccinations</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.vaccinationsTotal.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des centres */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Liste des Centres</span>
                </CardTitle>
                <CardDescription>
                  Gérez vos centres de vaccination et consultez leurs informations
                </CardDescription>
              </div>
              <Button onClick={handleCreateCentre} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nouveau Centre</span>
              </Button>
            </div>

            {/* Filtres */}
            <div className="flex flex-col lg:flex-row gap-4 pt-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, ville ou responsable..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les types</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="prive">Privé</SelectItem>
                  <SelectItem value="mixte">Mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Centre</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCentres.map((centre) => {
                    const statutInfo = statutConfig[centre.statut];
                    const typeInfo = typeServiceConfig[centre.typeService];
                    const StatusIcon = statutInfo.icon;
                    
                    return (
                      <TableRow key={centre.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50 text-blue-600">
                                <Building2 className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{centre.nom}</div>
                              <div className="text-sm text-muted-foreground flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{centre.telephone}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                            <div>
                              <div className="font-medium">{centre.ville}</div>
                              <div className="text-sm text-muted-foreground">
                                {centre.adresse}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {centre.codePostal}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{centre.responsable}</div>
                            <div className="text-sm text-muted-foreground">
                              {centre.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statutInfo.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statutInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{centre.capaciteJour}/jour</div>
                            <div className="text-sm text-muted-foreground flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{centre.heuresOuverture}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-green-600">
                              {centre.totalVaccinations.toLocaleString()} total
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {centre.vaccinationsHebdo}/semaine
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-2 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditCentre(centre)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(centre)}
                            >
                              Détails
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredCentres.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Aucun centre trouvé</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statutFilter !== 'tous' || typeFilter !== 'tous' 
                    ? "Aucun centre ne correspond à vos critères de recherche."
                    : "Aucun centre enregistré pour le moment."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
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
      </div>
    </PageContainer>
  );
}

// Export par défaut du composant principal
export default function Centre() {
  return (
    <ModalProvider>
      <CentreContent />
    </ModalProvider>
  );
}