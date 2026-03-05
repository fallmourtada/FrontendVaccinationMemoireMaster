import { useState } from 'react';
import PageContainer from "@/components/shared/page-container";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Building2,
  Hospital,
  Search,
  Plus,
  ChevronRight,
  Map as MapIcon,
  ArrowLeft,
  Eye,
  List
} from 'lucide-react';
import DistrictDetail from './localite/district-detail';
import CentresList from './localite/centres-list';
import PostesList from './localite/postes-list';
import CentreDetail from './localite/centre-detail';
import PosteDetail from './localite/poste-detail';

// Types
type ViewType = 'regions' | 'departments' | 'districts' | 'district-detail' | 'centres-list' | 'postes-list' | 'centre-detail' | 'poste-detail';

interface NavigationState {
  view: ViewType;
  regionId?: number;
  regionName?: string;
  departmentId?: number;
  departmentName?: string;
  districtId?: number;
  districtName?: string;
  centreId?: number;
  centreName?: string;
  posteId?: number;
  posteName?: string;
}

// Données - 14 régions du Sénégal
const regionsData = [
  { id: 1, name: "Dakar", code: "100" },
  { id: 2, name: "Thiès", code: "200" },
  { id: 3, name: "Saint-Louis", code: "300" },
  { id: 4, name: "Diourbel", code: "400" },
  { id: 5, name: "Louga", code: "500" },
  { id: 6, name: "Fatick", code: "600" },
  { id: 7, name: "Kaolack", code: "700" },
  { id: 8, name: "Kolda", code: "800" },
  { id: 9, name: "Matam", code: "900" },
  { id: 10, name: "Tambacounda", code: "1000" },
  { id: 11, name: "Ziguinchor", code: "1100" },
  { id: 12, name: "Kaffrine", code: "1200" },
  { id: 13, name: "Kédougou", code: "1300" },
  { id: 14, name: "Sédhiou", code: "1400" },
];

// Départements - Dakar a 4
const departmentsData = [
  { id: 15, name: "Dakar", code: "101", regionId: 1 },
  { id: 16, name: "Pikine", code: "102", regionId: 1 },
  { id: 17, name: "Guédiawaye", code: "103", regionId: 1 },
  { id: 18, name: "Rufisque", code: "104", regionId: 1 },
  { id: 19, name: "Thiès", code: "201", regionId: 2 },
  { id: 20, name: "Mbour", code: "202", regionId: 2 },
];

// Districts
const districtsData = [
  { id: 7, name: "District Sanitaire de Dakar Centre", phone: "33 821 23 45", departmentId: 15, centresCount: 4, postesCount: 12 },
  { id: 8, name: "District Sanitaire de Pikine", phone: "33 834 56 78", departmentId: 16, centresCount: 3, postesCount: 8 },
  { id: 9, name: "District Sanitaire de Guédiawaye", phone: "33 835 12 34", departmentId: 17, centresCount: 2, postesCount: 6 },
  { id: 10, name: "District Sanitaire de Rufisque", phone: "33 836 45 67", departmentId: 18, centresCount: 3, postesCount: 9 },
];

// Centres de santé (dans les communes, rattachés aux districts)
const centresData = [
  { id: 12, name: "Centre de Santé Gaspard Kamara", phone: "33 821 00 00", quartier: "Plateau", districtId: 7, postesCount: 3, type: 'CENTRE_DE_SANTE' as const, localityId: 0, parentId: 7 },
  { id: 13, name: "Centre de Santé Roi Baudouin", phone: "33 821 11 11", quartier: "Fass", districtId: 7, postesCount: 4, type: 'CENTRE_DE_SANTE' as const, localityId: 0, parentId: 7 },
  { id: 14, name: "Centre de Santé Philippe Senghor", phone: "33 822 22 22", quartier: "Grand Dakar", districtId: 7, postesCount: 3, type: 'CENTRE_DE_SANTE' as const, localityId: 0, parentId: 7 },
  { id: 15, name: "Centre de Santé Nabil Choucair", phone: "33 823 33 33", quartier: "Ouakam", districtId: 7, postesCount: 2, type: 'CENTRE_DE_SANTE' as const, localityId: 0, parentId: 7 },
  { id: 16, name: "Centre de Santé de Pikine", phone: "33 834 11 11", quartier: "Pikine Centre", districtId: 8, postesCount: 3, type: 'CENTRE_DE_SANTE' as const, localityId: 0, parentId: 8 },
];

// Postes de santé (rattachés aux centres)
const postesData = [
  { id: 17, name: "Poste de Santé Médina", phone: "33 821 33 11", quartier: "Médina", centreId: 12, type: 'POSTE_DE_SANTE' as const, localityId: 0, parentId: 12 },
  { id: 18, name: "Poste de Santé Gueule Tapée", phone: "33 821 44 22", quartier: "Gueule Tapée", centreId: 12, type: 'POSTE_DE_SANTE' as const, localityId: 0, parentId: 12 },
  { id: 19, name: "Poste de Santé Fass", phone: "33 821 55 33", quartier: "Fass", centreId: 13, type: 'POSTE_DE_SANTE' as const, localityId: 0, parentId: 13 },
  { id: 20, name: "Poste de Santé Biscuiterie", phone: "33 822 66 44", quartier: "Biscuiterie", centreId: 14, type: 'POSTE_DE_SANTE' as const, localityId: 0, parentId: 14 },
  { id: 21, name: "Poste de Santé Ngor", phone: "33 823 77 55", quartier: "Ngor", centreId: 15, type: 'POSTE_DE_SANTE' as const, localityId: 0, parentId: 15 },
  { id: 22, name: "Poste de Santé Yoff", phone: "33 823 88 66", quartier: "Yoff", centreId: 15, type: 'POSTE_DE_SANTE' as const, localityId: 0, parentId: 15 },
];

export default function LocalitePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [navigation, setNavigation] = useState<NavigationState>({ view: 'regions' });

  // Rendu conditionnel pour les pages de détails
  
  // Vue Détail District
  if (navigation.view === 'district-detail' && navigation.districtId) {
    const district = districtsData.find(d => d.id === navigation.districtId);
    if (!district) return null;
    
    return (
      <PageContainer title="Détails du District" subtitle="Informations détaillées">
        <DistrictDetail
          district={{
            id: district.id,
            name: district.name,
            type: 'DISTRICT',
            phone: district.phone,
            localityId: district.departmentId,
            localityName: navigation.departmentName
          }}
          onBack={() => setNavigation({
            view: 'districts',
            regionId: navigation.regionId,
            regionName: navigation.regionName,
            departmentId: navigation.departmentId,
            departmentName: navigation.departmentName
          })}
          onViewCentres={() => setNavigation({
            ...navigation,
            view: 'centres-list'
          })}
        />
      </PageContainer>
    );
  }

  // Vue Liste Centres
  if (navigation.view === 'centres-list' && navigation.districtId) {
    const centres = centresData.filter(c => c.districtId === navigation.districtId);
    
    return (
      <PageContainer title="Centres de Santé" subtitle="Liste des centres du district">
        <CentresList
          districtName={navigation.districtName || ''}
          centres={centres}
          onBack={() => setNavigation({
            view: 'district-detail',
            regionId: navigation.regionId,
            regionName: navigation.regionName,
            departmentId: navigation.departmentId,
            departmentName: navigation.departmentName,
            districtId: navigation.districtId,
            districtName: navigation.districtName
          })}
          onViewDetail={(centreId) => {
            const centre = centres.find(c => c.id === centreId);
            if (centre) {
              setNavigation({
                ...navigation,
                view: 'centre-detail',
                centreId: centre.id,
                centreName: centre.name
              });
            }
          }}
          onViewPostes={(centreId) => {
            const centre = centres.find(c => c.id === centreId);
            setNavigation({
              ...navigation,
              view: 'postes-list',
              centreId,
              centreName: centre?.name
            });
          }}
        />
      </PageContainer>
    );
  }

  // Vue Liste Postes
  if (navigation.view === 'postes-list' && navigation.centreId) {
    const postes = postesData.filter(p => p.centreId === navigation.centreId);
    
    return (
      <PageContainer title="Postes de Santé" subtitle="Liste des postes du centre">
        <PostesList
          centreName={navigation.centreName || ''}
          postes={postes}
          onBack={() => setNavigation({
            view: 'centres-list',
            regionId: navigation.regionId,
            regionName: navigation.regionName,
            departmentId: navigation.departmentId,
            departmentName: navigation.departmentName,
            districtId: navigation.districtId,
            districtName: navigation.districtName
          })}
          onViewDetail={(posteId) => {
            const poste = postesData.find(p => p.id === posteId);
            if (poste) {
              setNavigation({
                ...navigation,
                view: 'poste-detail',
                posteId: poste.id,
                posteName: poste.name
              });
            }
          }}
        />
      </PageContainer>
    );
  }

  // Vue Détail Centre
  if (navigation.view === 'centre-detail' && navigation.centreId) {
    const centre = centresData.find(c => c.id === navigation.centreId);
    
    if (!centre) {
      return <div>Centre non trouvé</div>;
    }

    // Trouver le nom du district
    const district = districtsData.find(d => d.id === centre.districtId);

    return (
      <PageContainer title="Détails du Centre" subtitle="Informations complètes">
        <CentreDetail
          centre={{
            ...centre,
            districtName: district?.name
          }}
          onBack={() => setNavigation({
            view: 'centres-list',
            regionId: navigation.regionId,
            regionName: navigation.regionName,
            departmentId: navigation.departmentId,
            departmentName: navigation.departmentName,
            districtId: navigation.districtId,
            districtName: navigation.districtName
          })}
          onViewPostes={() => setNavigation({
            ...navigation,
            view: 'postes-list',
            centreId: centre.id,
            centreName: centre.name
          })}
        />
      </PageContainer>
    );
  }

  // Vue Détail Poste
  if (navigation.view === 'poste-detail' && navigation.posteId) {
    const poste = postesData.find(p => p.id === navigation.posteId);
    
    if (!poste) {
      return <div>Poste non trouvé</div>;
    }

    // Trouver le nom du centre
    const centre = centresData.find(c => c.id === poste.centreId);

    return (
      <PageContainer title="Détails du Poste" subtitle="Informations complètes">
        <PosteDetail
          poste={{
            ...poste,
            centreName: centre?.name
          }}
          onBack={() => setNavigation({
            view: 'postes-list',
            regionId: navigation.regionId,
            regionName: navigation.regionName,
            departmentId: navigation.departmentId,
            departmentName: navigation.departmentName,
            districtId: navigation.districtId,
            districtName: navigation.districtName,
            centreId: navigation.centreId,
            centreName: navigation.centreName
          })}
        />
      </PageContainer>
    );
  }

  // Filtrage des données pour la liste principale
  const getDisplayData = () => {
    if (navigation.view === 'regions') {
      return regionsData.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    } else if (navigation.view === 'departments' && navigation.regionId) {
      return departmentsData.filter(d => 
        d.regionId === navigation.regionId && 
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (navigation.view === 'districts' && navigation.departmentId) {
      return districtsData.filter(d => 
        d.departmentId === navigation.departmentId && 
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return [];
  };

  const displayData = getDisplayData();

  // Statistiques
  const getStats = (type: 'region' | 'department', id: number) => {
    if (type === 'region') {
      const depts = departmentsData.filter(d => d.regionId === id);
      const districts = depts.flatMap(dept => districtsData.filter(dist => dist.departmentId === dept.id));
      const centres = centresData.filter(c => districts.some(d => d.id === c.districtId));
      const postes = postesData.filter(p => centres.some(c => c.id === p.centreId));
      return {
        districts: districts.length,
        centres: centres.length,
        postes: postes.length,
        total: districts.length + centres.length + postes.length
      };
    } else {
      const districts = districtsData.filter(d => d.departmentId === id);
      const centres = centresData.filter(c => districts.some(d => d.id === c.districtId));
      const postes = postesData.filter(p => centres.some(c => c.id === p.centreId));
      return {
        districts: districts.length,
        centres: centres.length,
        postes: postes.length,
        total: districts.length + centres.length + postes.length
      };
    }
  };

  return (
    <PageContainer 
      title="Gestion des Localités" 
      subtitle="Navigation simplifiée : Régions → Départements → Districts"
    >
      {/* Fil d'Ariane */}
      {navigation.view !== 'regions' && (
        <div className="mb-6 flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setNavigation({ view: 'regions' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Accueil
          </Button>
          
          {navigation.regionName && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{navigation.regionName}</span>
            </>
          )}
          {navigation.departmentName && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{navigation.departmentName}</span>
            </>
          )}
        </div>
      )}

      {/* Barre de recherche */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Titre */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          {navigation.view === 'regions' && 'Régions du Sénégal'}
          {navigation.view === 'departments' && `Départements de ${navigation.regionName}`}
          {navigation.view === 'districts' && `Districts de ${navigation.departmentName}`}
        </h2>
        <p className="text-muted-foreground">{displayData.length} élément{displayData.length > 1 ? 's' : ''}</p>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayData.map((item: any) => {
          const stats = navigation.view === 'districts' ? null : 
            navigation.view === 'regions' ? getStats('region', item.id) :
            getStats('department', item.id);

          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  {navigation.view === 'regions' && <MapIcon className="h-5 w-5 text-chart-4" />}
                  {navigation.view === 'departments' && <Building2 className="h-5 w-5 text-chart-1" />}
                  {navigation.view === 'districts' && <Hospital className="h-5 w-5 text-chart-2" />}
                  
                  <Badge variant="outline" className={
                    navigation.view === 'regions' ? 'bg-chart-4/20 text-chart-4' :
                    navigation.view === 'departments' ? 'bg-chart-1/20 text-chart-1' :
                    'bg-chart-2/20 text-chart-2'
                  }>
                    {navigation.view === 'regions' ? 'Région' : 
                     navigation.view === 'departments' ? 'Département' : 'District'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                {item.code && <p className="text-sm text-muted-foreground">Code: {item.code}</p>}
                {item.phone && <p className="text-sm text-muted-foreground">📞 {item.phone}</p>}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Statistiques pour Régions et Départements */}
                  {stats && (
                    <>
                      <div className="flex justify-between p-2 bg-chart-2/10 rounded text-sm">
                        <span>Districts</span>
                        <Badge className="bg-chart-2 text-white">{stats.districts}</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-chart-5/10 rounded text-sm">
                        <span>Centres</span>
                        <Badge className="bg-chart-5 text-white">{stats.centres}</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-chart-3/10 rounded text-sm">
                        <span>Postes</span>
                        <Badge className="bg-chart-3 text-white">{stats.postes}</Badge>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-medium">Total</span>
                        <Badge variant="outline">{stats.total}</Badge>
                      </div>
                    </>
                  )}

                  {/* Statistiques pour Districts */}
                  {navigation.view === 'districts' && (
                    <>
                      <div className="flex justify-between p-2 bg-chart-5/10 rounded text-sm">
                        <span>Centres de Santé</span>
                        <Badge className="bg-chart-5 text-white">{item.centresCount}</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-chart-3/10 rounded text-sm">
                        <span>Postes de Santé</span>
                        <Badge className="bg-chart-3 text-white">{item.postesCount}</Badge>
                      </div>
                    </>
                  )}

                  {/* Boutons d'action */}
                  {navigation.view === 'districts' ? (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setNavigation({
                          ...navigation,
                          view: 'district-detail',
                          districtId: item.id,
                          districtName: item.name
                        })}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => setNavigation({
                          ...navigation,
                          view: 'centres-list',
                          districtId: item.id,
                          districtName: item.name
                        })}
                      >
                        <List className="h-4 w-4 mr-1" />
                        Centres
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        if (navigation.view === 'regions') {
                          setNavigation({ 
                            view: 'departments', 
                            regionId: item.id, 
                            regionName: item.name 
                          });
                        } else if (navigation.view === 'departments') {
                          setNavigation({ 
                            ...navigation,
                            view: 'districts', 
                            departmentId: item.id, 
                            departmentName: item.name 
                          });
                        }
                      }}
                    >
                      Voir détails <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Message vide */}
      {displayData.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun élément trouvé</p>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
