import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Home,
  Phone,
  MapPin,
  Search,
  Eye
} from 'lucide-react';

interface Poste {
  id: number;
  name: string;
  type: 'POSTE_DE_SANTE';
  phone: string;
  quartier: string | null;
  localityId: number;
  parentId?: number;
}

interface PostesListProps {
  centreName: string;
  postes: Poste[];
  onBack: () => void;
  onViewDetail: (posteId: number) => void;
}

export default function PostesList({ centreName, postes, onBack, onViewDetail }: PostesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les postes
  const filteredPostes = postes.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.quartier && p.quartier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Centre
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Home className="h-8 w-8 text-chart-3" />
            Postes de Santé
          </h1>
          <p className="text-muted-foreground mt-2">Centre : {centreName}</p>
        </div>
        <Badge className="bg-chart-3 text-white text-lg px-4 py-2">{filteredPostes.length} Poste{filteredPostes.length > 1 ? 's' : ''}</Badge>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un poste de santé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des postes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPostes.map((poste) => (
          <Card key={poste.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Home className="h-6 w-6 text-chart-3" />
                  <div>
                    <CardTitle className="text-base">{poste.name}</CardTitle>
                    {poste.quartier && (
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {poste.quartier}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations */}
              <div className="space-y-2">
                {poste.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{poste.phone}</span>
                  </div>
                )}
                <Badge variant="outline" className="bg-chart-3/20 text-chart-3 border-chart-3/30">
                  Poste de Santé
                </Badge>
              </div>

              {/* Actions */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onViewDetail(poste.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir Détails
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message vide */}
      {filteredPostes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun poste de santé trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
