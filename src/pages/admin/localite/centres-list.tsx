import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Building2,
  Home,
  Phone,
  MapPin,
  Search,
  Eye
} from 'lucide-react';

interface Centre {
  id: number;
  name: string;
  type: 'CENTRE_DE_SANTE';
  phone: string;
  quartier: string | null;
  localityId: number;
  parentId?: number;
}

interface CentresListProps {
  districtName: string;
  centres: Centre[];
  onBack: () => void;
  onViewDetail: (centreId: number) => void;
  onViewPostes: (centreId: number) => void;
}

export default function CentresList({ districtName, centres, onBack, onViewDetail, onViewPostes }: CentresListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les centres
  const filteredCentres = centres.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.quartier && c.quartier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au District
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-chart-5" />
            Centres de Santé
          </h1>
          <p className="text-muted-foreground mt-2">District : {districtName}</p>
        </div>
        <Badge className="bg-chart-5 text-white text-sm px-4 py-1">{filteredCentres.length} Centre{filteredCentres.length > 1 ? 's' : ''}</Badge>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un centre de santé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des centres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCentres.map((centre) => (
          <Card key={centre.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-chart-5" />
                  <div>
                    <CardTitle className="text-lg">{centre.name}</CardTitle>
                    {centre.quartier && (
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {centre.quartier}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5/30">
                  Centre
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations */}
              <div className="space-y-2">
                {centre.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{centre.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Home className="h-4 w-4 text-chart-3" />
                  <span className="font-medium">Postes de Santé rattachés</span>
                  <Badge className="bg-chart-3 text-white ml-auto">3</Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onViewDetail(centre.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir Détails
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-chart-3 hover:bg-chart-3/90 text-white"
                  onClick={() => onViewPostes(centre.id)}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Voir Postes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message vide */}
      {filteredCentres.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun centre de santé trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
