import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Hospital,
  Phone,
  MapPin,
  Building2,
  Users,
  Activity,
  Calendar,
  Mail
} from 'lucide-react';

interface DistrictDetailProps {
  district: {
    id: number;
    name: string;
    type: string;
    phone: string;
    localityId: number;
    localityName?: string;
  };
  onBack: () => void;
  onViewCentres: () => void;
}

export default function DistrictDetail({ district, onBack, onViewCentres }: DistrictDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'activity'>('info');

  return (
    <div className="space-y-6">
      {/* En-tête avec retour */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Badge className="bg-chart-2 text-white">District Sanitaire</Badge>
      </div>

      {/* Titre */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Hospital className="h-8 w-8 text-chart-2" />
          {district.name}
        </h1>
        <p className="text-muted-foreground mt-2">
          Département : {district.localityName || 'Non spécifié'}
        </p>
      </div>

      {/* Actions rapides */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={onViewCentres}>
          <Building2 className="h-4 w-4 mr-2" />
          Voir les Centres de Santé
        </Button>
        <Button variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Rapport d'activités
        </Button>
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Personnel
        </Button>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'info'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Informations
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'stats'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Statistiques
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'activity'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Activités récentes
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact</CardTitle>
              <CardDescription>Coordonnées du district</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{district.phone || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">district@sante.sn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">Département {district.localityName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Structures rattachées */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Structures rattachées</CardTitle>
              <CardDescription>Centres et postes sous ce district</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-chart-5/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-chart-5" />
                  <div>
                    <p className="font-medium">Centres de Santé</p>
                    <p className="text-sm text-muted-foreground">Structures de niveau 2</p>
                  </div>
                </div>
                <Badge className="bg-chart-5 text-white">4</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-chart-3/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Hospital className="h-5 w-5 text-chart-3" />
                  <div>
                    <p className="font-medium">Postes de Santé</p>
                    <p className="text-sm text-muted-foreground">Structures de niveau 1</p>
                  </div>
                </div>
                <Badge className="bg-chart-3 text-white">12</Badge>
              </div>
              <Button className="w-full" variant="outline" onClick={onViewCentres}>
                Voir toutes les structures
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vaccinations</CardTitle>
              <CardDescription>Ce mois</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-chart-2">1,234</p>
              <p className="text-sm text-muted-foreground mt-1">+12% vs mois dernier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consultations</CardTitle>
              <CardDescription>Ce mois</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-chart-1">3,456</p>
              <p className="text-sm text-muted-foreground mt-1">+8% vs mois dernier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personnel</CardTitle>
              <CardDescription>Total actif</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-chart-4">45</p>
              <p className="text-sm text-muted-foreground mt-1">Médecins et infirmiers</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activités récentes</CardTitle>
            <CardDescription>Dernières actions du district</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Campagne de vaccination COVID-19</p>
                  <p className="text-sm text-muted-foreground">Il y a {i} jour{i > 1 ? 's' : ''}</p>
                </div>
                <Badge variant="outline">Terminé</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
