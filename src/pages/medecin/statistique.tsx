import PageContainer from "@/components/shared/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Syringe, 
  Calendar, 
  Target,
  Download,
  Filter,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';
import { useState } from 'react';
import { useNotification } from '@/components/shared/app-notification';

// Types pour les statistiques
interface StatPeriod {
  label: string;
  value: string;
}

interface VaccinationStats {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
}

interface VaccinTypeStats {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export default function Statistique() {
  const notification = useNotification();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedCentre, setSelectedCentre] = useState<string>('all');

  const periods: StatPeriod[] = [
    { label: 'Cette semaine', value: 'week' },
    { label: 'Ce mois', value: 'month' },
    { label: 'Ce trimestre', value: 'quarter' },
    { label: 'Cette année', value: 'year' }
  ];

  // Données simulées pour les statistiques
  const vaccinationStats: VaccinationStats = {
    total: 15847,
    thisMonth: 2456,
    lastMonth: 2234,
    growth: 9.9
  };

  const vaccinTypes: VaccinTypeStats[] = [
    { name: 'COVID-19', count: 6789, percentage: 42.8, color: 'bg-blue-500' },
    { name: 'Grippe saisonnière', count: 4321, percentage: 27.3, color: 'bg-green-500' },
    { name: 'Hépatite B', count: 2134, percentage: 13.5, color: 'bg-purple-500' },
    { name: 'ROR', count: 1567, percentage: 9.9, color: 'bg-orange-500' },
    { name: 'Autres', count: 1036, percentage: 6.5, color: 'bg-gray-500' }
  ];

  const centreStats = [
    { name: 'Centre Nord', vaccinations: 4567, evolution: 12.5, status: 'up' },
    { name: 'Centre Sud', vaccinations: 3891, evolution: 8.3, status: 'up' },
    { name: 'Centre Est', vaccinations: 3245, evolution: -2.1, status: 'down' },
    { name: 'Centre Ouest', vaccinations: 2789, evolution: 15.7, status: 'up' },
    { name: 'Clinique Privée', vaccinations: 1355, evolution: 5.4, status: 'up' }
  ];

  const monthlyData = [
    { month: 'Jan', vaccinations: 1890, patients: 1654 },
    { month: 'Fév', vaccinations: 2140, patients: 1876 },
    { month: 'Mar', vaccinations: 2789, patients: 2234 },
    { month: 'Avr', vaccinations: 2456, patients: 2098 },
    { month: 'Mai', vaccinations: 3234, patients: 2567 },
    { month: 'Jun', vaccinations: 2987, patients: 2445 },
    { month: 'Jul', vaccinations: 3456, patients: 2789 },
    { month: 'Aoû', vaccinations: 3123, patients: 2654 },
    { month: 'Sep', vaccinations: 2456, patients: 2134 }
  ];

  const handleExportReport = () => {
    notification.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve("Rapport exporté"), 2000);
      }),
      {
        loading: "Génération du rapport en cours...",
        success: "Rapport statistique exporté avec succès",
        error: "Erreur lors de l'export du rapport"
      }
    );
  };

  const handleRefreshStats = () => {
    notification.info({
      title: "Actualisation des statistiques",
      description: "Les données ont été mises à jour avec les dernières informations"
    });
  };

  return (
    <PageContainer 
      title="Statistiques et Tableaux de Bord" 
      subtitle="Analyse des performances et tendances de vaccination"
    >
      <div className="space-y-6">
        
        {/* Filtres et actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col lg:flex-row gap-4">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full lg:w-48">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                  <SelectTrigger className="w-full lg:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Centre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les centres</SelectItem>
                    <SelectItem value="nord">Centre Nord</SelectItem>
                    <SelectItem value="sud">Centre Sud</SelectItem>
                    <SelectItem value="est">Centre Est</SelectItem>
                    <SelectItem value="ouest">Centre Ouest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRefreshStats}>
                  <Activity className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
                <Button onClick={handleExportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vaccinations</p>
                  <p className="text-3xl font-bold">{vaccinationStats.total.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{vaccinationStats.growth}%</span>
                    <span className="text-sm text-muted-foreground ml-1">vs mois dernier</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Syringe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ce Mois</p>
                  <p className="text-3xl font-bold">{vaccinationStats.thisMonth.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Target className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600 font-medium">Objectif: 2500</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patients Uniques</p>
                  <p className="text-3xl font-bold">12,489</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+15.2%</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taux de Couverture</p>
                  <p className="text-3xl font-bold">87.6%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+2.1%</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="vaccines">Types de vaccins</TabsTrigger>
            <TabsTrigger value="centers">Performance centres</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5" />
                    <span>Évolution Mensuelle</span>
                  </CardTitle>
                  <CardDescription>Vaccinations et nouveaux patients par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.slice(-6).map((data) => (
                      <div key={data.month} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 text-center">
                            <span className="text-sm font-medium">{data.month}</span>
                          </div>
                          <div>
                            <div className="font-medium">{data.vaccinations} vaccinations</div>
                            <div className="text-sm text-muted-foreground">{data.patients} patients</div>
                          </div>
                        </div>
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(data.vaccinations / 3500) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Objectifs vs Réalisations</span>
                  </CardTitle>
                  <CardDescription>Suivi des objectifs mensuels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Vaccinations COVID-19</span>
                        <span className="text-sm text-muted-foreground">1,234 / 1,500</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }} />
                      </div>
                      <span className="text-xs text-muted-foreground">82% de l'objectif</span>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Grippe saisonnière</span>
                        <span className="text-sm text-muted-foreground">987 / 800</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                      <span className="text-xs text-green-600">123% - Objectif dépassé !</span>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Hépatite B</span>
                        <span className="text-sm text-muted-foreground">456 / 600</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '76%' }} />
                      </div>
                      <span className="text-xs text-muted-foreground">76% de l'objectif</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Types de vaccins */}
          <TabsContent value="vaccines" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Répartition par Type de Vaccin</span>
                  </CardTitle>
                  <CardDescription>Distribution des vaccinations par type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vaccinTypes.map((vaccin, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${vaccin.color}`} />
                          <span className="font-medium">{vaccin.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{vaccin.count.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{vaccin.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top 5 des Vaccins</CardTitle>
                  <CardDescription>Vaccins les plus administrés ce mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vaccinTypes.slice(0, 5).map((vaccin, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{vaccin.name}</div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                            <div 
                              className={`h-1.5 rounded-full ${vaccin.color}`}
                              style={{ width: `${vaccin.percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{vaccin.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance centres */}
          <TabsContent value="centers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Performance par Centre</span>
                </CardTitle>
                <CardDescription>Comparaison des vaccinations par centre de santé</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {centreStats.map((centre, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{centre.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {centre.vaccinations.toLocaleString()} vaccinations
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(centre.vaccinations / 5000) * 100}%` }}
                          />
                        </div>
                        <div className="flex items-center space-x-1">
                          {centre.status === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${centre.status === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {centre.evolution > 0 ? '+' : ''}{centre.evolution}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tendances */}
          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendances Hebdomadaires</CardTitle>
                  <CardDescription>Évolution des vaccinations par jour de la semaine</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((jour, index) => {
                      const values = [156, 189, 167, 201, 178, 89, 45];
                      const maxValue = Math.max(...values);
                      return (
                        <div key={jour} className="flex items-center justify-between">
                          <span className="w-20 text-sm">{jour}</span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(values[index] / maxValue) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="w-12 text-right text-sm font-medium">{values[index]}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prévisions</CardTitle>
                  <CardDescription>Estimation des vaccinations pour les prochains mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: 'Octobre 2024', predicted: 2789, confidence: 85 },
                      { month: 'Novembre 2024', predicted: 3156, confidence: 78 },
                      { month: 'Décembre 2024', predicted: 2945, confidence: 72 }
                    ].map((forecast, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{forecast.month}</span>
                          <span className="text-muted-foreground">{forecast.predicted} vaccinations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${forecast.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{forecast.confidence}% confiance</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}