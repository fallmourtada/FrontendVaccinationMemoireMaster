import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Building2,
  Phone,
  MapPin,
  Home,
  Users,
  Activity,
  Calendar,
  Mail,
  Hospital
} from 'lucide-react';

interface CentreDetailProps {
  centre: {
    id: number;
    name: string;
    type: string;
    phone: string;
    quartier: string | null;
    districtName?: string;
  };
  onBack: () => void;
  onViewPostes: () => void;
}

export default function CentreDetail({ centre, onBack, onViewPostes }: CentreDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'activity'>('info');

  return (
    <div className="space-y-6">
      {/* En-tête avec retour */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Badge className="bg-chart-5 text-white">Centre de Santé</Badge>
      </div>

      {/* Titre */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Building2 className="h-8 w-8 text-chart-5" />
          {centre.name}
        </h1>
        <p className="text-muted-foreground mt-2">
          {centre.quartier && `Quartier : ${centre.quartier}`}
          {centre.districtName && ` • District : ${centre.districtName}`}
        </p>
      </div>

      {/* Actions rapides */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={onViewPostes} className="bg-chart-3 hover:bg-chart-3/90 text-white">
          <Home className="h-4 w-4 mr-2" />
          Voir les Postes de Santé
        </Button>
        <Button variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Rapport d'activités
        </Button>
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Personnel
        </Button>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Calendrier
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
              <CardDescription>Coordonnées du centre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{centre.phone || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">centre@sante.sn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Localisation</p>
                  <p className="font-medium">{centre.quartier || 'Non spécifié'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations administratives */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations administratives</CardTitle>
              <CardDescription>Détails et rattachement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Hospital className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{centre.districtName || 'Non spécifié'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">Centre de Santé</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Personnel</p>
                  <p className="font-medium">15 agents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Structures rattachées */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Postes de Santé rattachés</CardTitle>
              <CardDescription>Structures de proximité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-chart-3/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Home className="h-6 w-6 text-chart-3" />
                  <div>
                    <p className="font-medium text-lg">Postes de Santé</p>
                    <p className="text-sm text-muted-foreground">Structures de niveau 1</p>
                  </div>
                </div>
                <Badge className="bg-chart-3 text-white text-lg px-3 py-1">3</Badge>
              </div>
              <Button className="w-full mt-4 bg-chart-3 hover:bg-chart-3/90 text-white" onClick={onViewPostes}>
                Voir tous les postes de santé
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
              <p className="text-3xl font-bold text-chart-2">856</p>
              <p className="text-sm text-muted-foreground mt-1">+15% vs mois dernier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consultations</CardTitle>
              <CardDescription>Ce mois</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-chart-1">2,134</p>
              <p className="text-sm text-muted-foreground mt-1">+10% vs mois dernier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patients</CardTitle>
              <CardDescription>Total enregistrés</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-chart-4">1,245</p>
              <p className="text-sm text-muted-foreground mt-1">Actifs ce mois</p>
            </CardContent>
          </Card>
          
          {/* Graphique d'activité */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Activité mensuelle</CardTitle>
              <CardDescription>Répartition des services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Vaccinations</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-chart-2 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Consultations</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-chart-1 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Soins préventifs</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-chart-4 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activités récentes</CardTitle>
            <CardDescription>Dernières actions du centre</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { action: 'Campagne de vaccination polio', days: 1, status: 'En cours' },
              { action: 'Formation personnel - Gestes de premiers secours', days: 3, status: 'Terminé' },
              { action: 'Consultation prénatale gratuite', days: 5, status: 'Terminé' },
              { action: 'Distribution de moustiquaires', days: 7, status: 'Terminé' }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">Il y a {activity.days} jour{activity.days > 1 ? 's' : ''}</p>
                </div>
                <Badge variant={activity.status === 'En cours' ? 'default' : 'outline'}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
