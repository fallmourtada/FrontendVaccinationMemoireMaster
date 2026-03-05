import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Home,
  Phone,
  MapPin,
  Users,
  Activity,
  Calendar,
  Mail,
  Building2
} from 'lucide-react';

interface PosteDetailProps {
  poste: {
    id: number;
    name: string;
    type: string;
    phone: string;
    quartier: string | null;
    centreName?: string;
  };
  onBack: () => void;
}

export default function PosteDetail({ poste, onBack }: PosteDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'activity'>('info');

  return (
    <div className="space-y-6">
      {/* En-tête avec retour */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Badge className="bg-chart-2 text-white">Poste de Santé</Badge>
      </div>

      {/* Titre */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Home className="h-8 w-8 text-chart-2" />
          {poste.name}
        </h1>
        <p className="text-muted-foreground mt-2">
          {poste.quartier && `Quartier : ${poste.quartier}`}
          {poste.centreName && ` • Centre : ${poste.centreName}`}
        </p>
      </div>

      {/* Actions rapides */}
      <div className="flex gap-3 flex-wrap">
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
              <CardDescription>Coordonnées du poste</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{poste.phone || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">poste@sante.sn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Localisation</p>
                  <p className="font-medium">{poste.quartier || 'Non spécifié'}</p>
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
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Centre de Santé</p>
                  <p className="font-medium">{poste.centreName || 'Non spécifié'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">Poste de Santé</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Personnel</p>
                  <p className="font-medium">5 agents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services offerts */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Services offerts</CardTitle>
              <CardDescription>Prestations disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Badge variant="outline" className="justify-center py-2">Vaccinations</Badge>
                <Badge variant="outline" className="justify-center py-2">Consultations</Badge>
                <Badge variant="outline" className="justify-center py-2">Soins de base</Badge>
                <Badge variant="outline" className="justify-center py-2">Prévention</Badge>
              </div>
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
              <p className="text-3xl font-bold text-chart-2">234</p>
              <p className="text-sm text-muted-foreground mt-1">+12% vs mois dernier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consultations</CardTitle>
              <CardDescription>Ce mois</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-chart-1">567</p>
              <p className="text-sm text-muted-foreground mt-1">+8% vs mois dernier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patients</CardTitle>
              <CardDescription>Total enregistrés</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-chart-4">345</p>
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
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-chart-2 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Consultations</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-chart-1 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Soins préventifs</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-chart-4 h-2 rounded-full" style={{ width: '15%' }}></div>
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
            <CardDescription>Dernières actions du poste</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { action: 'Vaccination enfants - BCG et Polio', days: 1, status: 'En cours' },
              { action: 'Sensibilisation hygiène communautaire', days: 2, status: 'Terminé' },
              { action: 'Consultation prénatale', days: 4, status: 'Terminé' },
              { action: 'Distribution de vitamines', days: 6, status: 'Terminé' }
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
