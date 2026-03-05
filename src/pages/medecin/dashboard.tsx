import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Syringe,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import PageContainer from "@/components/shared/page-container";

  // Données de démonstration
  const statsData = [
    {
      title: "Patients Total",
      value: "847",
      change: "+6.5%",
      changeType: "positive" as const,
      icon: Users,
      description: "vs mois dernier"
    },
    {
      title: "Vaccinations ce mois",
      value: "234",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Syringe,
      description: "vs mois dernier"
    },
    {
      title: "Rendez-vous planifiés",
      value: "156",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Calendar,
      description: "cette semaine"
    },
    {
      title: "Taux de couverture",
      value: "94.2%",
      change: "+1.8%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "objectif: 95%"
    }
  ];

  const vaccinationData = [
    { month: 'Jan', vaccinations: 65, rappels: 28 },
    { month: 'Fév', vaccinations: 78, rappels: 35 },
    { month: 'Mar', vaccinations: 90, rappels: 42 },
    { month: 'Avr', vaccinations: 95, rappels: 38 },
    { month: 'Mai', vaccinations: 88, rappels: 45 },
    { month: 'Jun', vaccinations: 110, rappels: 52 }
  ];

  const vaccineTypeData = [
    { name: 'Obligatoires', value: 65, color: '#3b82f6' },
    { name: 'Recommandés', value: 25, color: '#10b981' },
    { name: 'Optionnels', value: 10, color: '#f59e0b' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'vaccination',
      patient: 'Awa Diop',
      action: 'Vaccination ROR administrée',
      time: '10:30',
      avatar: 'AD'
    },
    {
      id: 2,
      type: 'appointment',
      patient: 'Mamadou Ndiaye',
      action: 'Rendez-vous confirmé',
      time: '09:15',
      avatar: 'MN'
    },
    {
      id: 3,
      type: 'reminder',
      patient: 'Fatou Sy',
      action: 'Rappel envoyé - DTP',
      time: '08:45',
      avatar: 'FS'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Cheikh Fall',
      vaccine: 'Hépatite B',
      time: '14:00',
      status: 'confirmed'
    },
    {
      id: 2,
      patient: 'Mame Diarra Sow',
      vaccine: 'Grippe saisonnière',
      time: '14:30',
      status: 'pending'
    },
    {
      id: 3,
      patient: 'Boubacar Ba',
      vaccine: 'Rappel DTP',
      time: '15:15',
      status: 'confirmed'
    }
  ];


export default function Dashboard() {
  return (
    <PageContainer 
      title="Tableau de bord" 
      subtitle="Vue d'ensemble de votre activité de vaccination - Suivi des statistiques et des tendances en temps réel"
    >
      {/* Boutons d'actions principaux */}
      <div className="flex justify-end space-x-2 mb-6">
        <Button variant="outline" size="sm">
          <Activity className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
        <Button size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          Nouveau RDV
        </Button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">{statsData.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Graphique principal */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Activité de vaccination</CardTitle>
                <CardDescription>
                  Vaccinations et rappels des 6 derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={vaccinationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="vaccinations"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="rappels"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activités récentes */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Activités récentes</CardTitle>
                <CardDescription>
                  Dernières actions effectuées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {activity.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.patient}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.action}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rendez-vous à venir */}
          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous à venir</CardTitle>
              <CardDescription>
                Prochains rendez-vous de vaccination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.vaccine}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{appointment.time}</span>
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                        {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par type de vaccin</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vaccineTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {vaccineTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendance mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={vaccinationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="vaccinations" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patients récemment enregistrés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Contenu à développer avec le tableau de données des patients...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyses avancées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Contenu à développer avec des analyses approfondies...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}